import { NextRequest, NextResponse } from 'next/server';

/**
 * Jira Tasks API - v1 Architecture
 * Remplacera progressivement /api/mcp/tasks
 * Suit le pattern v1 avec HATEOAS et pagination
 */

// Configuration Jira - Pattern établi dans l'architecture v1
const JIRA_CONFIG = {
  domain: process.env.JIRA_DOMAIN || "abarouzabarouz.atlassian.net",
  email: process.env.JIRA_EMAIL || "abarouzabarouz@gmail.com",
  token: process.env.JIRA_API_TOKEN || "",
};

// Headers pour authentification Jira
const getJiraHeaders = () => {
  const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.token}`).toString('base64');
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

// Mapping statut Jira → Statuts Jira standards (corrigé pour éviter "À faire" par défaut)
const mapJiraStatus = (jiraStatus: string, statusCategory: string): string => {
  const status = jiraStatus.toLowerCase();
  const category = statusCategory.toLowerCase();
  
  // ✅ DONE - Terminé/Fermé
  if (category === 'done' || status.includes('done') || status.includes('closed') || status.includes('resolved')) {
    return 'Done';
  }
  
  // 🔄 IN PROGRESS - En cours (développement actif)
  if (category === 'indeterminate' || status.includes('progress') || status.includes('in development') || 
      status.includes('doing') || status.includes('work') || status.includes('active')) {
    return 'In Progress';
  }
  
  // 👀 IN REVIEW - En attente (révision, tests)
  if (status.includes('review') || status.includes('testing') || status.includes('test') || 
      status.includes('qa') || status.includes('validation') || status.includes('approval') ||
      status.includes('pending')) {
    return 'In Review';
  }
  
  // 🚫 BLOCKED - Bloqué
  if (status.includes('blocked') || status.includes('waiting') || status.includes('on hold') ||
      status.includes('stopped')) {
    return 'Blocked';
  }
  
  // 📋 TO DO - À faire (nouveau, backlog, todo)
  if (category === 'new' || status.includes('todo') || status.includes('open') || 
      status.includes('backlog') || status.includes('to do') || status.includes('new') ||
      status.includes('selected for development') || status.includes('ready')) {
    return 'To Do';
  }
  
  // ✅ Par défaut - Retourner le statut Jira original au lieu de "À faire"
  return jiraStatus || 'To Do';
};

// Interface pour la réponse v1
interface JiraTaskResponse {
  status: number;
  message: string;
  data: any;
  type: string;
  source: string;
}

// GET /api/v1/jira/tasks - Récupère les tâches Jira
export async function GET(request: NextRequest) {
  try {
    console.log("🔗 [v1] Connexion à Jira pour récupérer les tâches...");
    
    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      const error = new Error("Token Jira non configuré");
      console.error("❌ [v1] Error getting tasks from Jira:", error);
      
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré. Veuillez vérifier vos paramètres d'environnement.",
        solution: "Assurez-vous que JIRA_API_TOKEN est défini dans votre fichier .env.",
        error: "Token Jira non configuré",
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    // Extraction des paramètres de requête
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get("projectKey");
    const status = searchParams.get("status");
    const assignee = searchParams.get("assignee");
    const maxResults = searchParams.get("maxResults") || "100";

    // Construction de la requête JQL
    let jqlQuery = "ORDER BY created DESC";
    if (projectKey) {
      jqlQuery = `project = "${projectKey}" ${jqlQuery}`;
    }
    if (status) {
      jqlQuery = `${jqlQuery} AND status = "${status}"`;
    }
    if (assignee) {
      jqlQuery = `${jqlQuery} AND assignee = "${assignee}"`;
    }
    
    // ✅ NOUVEAU : Inclure les subtasks par défaut
    // Ne pas filtrer par type d'issue pour récupérer toutes les tâches + subtasks
    // Si on veut filtrer, on peut ajouter: AND issuetype != "Subtask"
    
    console.log(`🔍 [v1] JQL Query: ${jqlQuery}`);

    // Récupération des tâches Jira via JQL
    const searchUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/search`;
    
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify({
        jql: jqlQuery,
        maxResults: parseInt(maxResults),
        fields: [
          'summary', 'description', 'status', 'priority', 'assignee', 'creator', 
          'created', 'duedate', 'project', 'sprint', 'issuetype', 'parent'
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [v1] Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const searchResult = await response.json();
    const jiraIssues = searchResult.issues || [];
    console.log(`✅ [v1] ${jiraIssues.length} tâches récupérées depuis Jira`);

    // ✅ NOUVEAU : Mapping des tâches avec gestion asynchrone des subtasks
    const tasksWithSubtasks = await Promise.all(searchResult.issues.map(async (issue: any, index: number) => {
      // Mapping du statut Jira vers les statuts DA Workspace
      const mappedStatus = mapJiraStatus(
        issue.fields.status?.name || "To Do",
        issue.fields.status?.statusCategory?.name || "new"
      );

      // ✅ CORRECTION : Détection robuste des subtasks
      // 1. Vérifier le type d'issue
      const issueTypeName = issue.fields.issuetype?.name;
      const isSubtaskByType = issueTypeName === 'Subtask';

      // 2. Vérifier le champ parent (plus fiable)
      const hasParent = issue.fields.parent?.key;
      const isSubtaskByParent = !!hasParent;

      // 3. Détection spéciale pour les tâches CAP (basée sur le nom)
      const isCAPProject = issue.fields.project?.key === 'CAP';
      const isSubtaskByName = isCAPProject && (
        issue.fields.summary?.toLowerCase().includes('sub') ||
        issue.fields.summary?.toLowerCase().startsWith('sub')
      );

      // 4. Détection finale : subtask si type OU parent OU nom spécial
      const isSubtask = isSubtaskByType || isSubtaskByParent || isSubtaskByName;
      const parentKey = issue.fields.parent?.key;

      // 5. Type d'issue corrigé
      const correctedIssueType = isSubtask ? 'Subtask' : (issueTypeName || 'Task');

      // ✅ NOUVEAU : Récupération dynamique des subtasks pour les tâches principales
      let subtasksCount = 0;
      let hasSubtasks = false;
      
      if (!isSubtask) {
        try {
          // ✅ NOUVEAU : Utiliser l'API dynamique des subtasks
          const subtasksUrl = `http://localhost:3000/api/v1/jira/subtasks?parentIssueKey=${issue.key}`;
          console.log(`🔍 [v1] Récupération des subtasks pour ${issue.key}...`);
          
          const subtasksResponse = await fetch(subtasksUrl);
          if (subtasksResponse.ok) {
            const subtasksResult = await subtasksResponse.json();
            subtasksCount = subtasksResult.data?._embedded?.subtasks?.length || 0;
            hasSubtasks = subtasksCount > 0;
            
            console.log(`📋 [v1] Tâche ${issue.key} a ${subtasksCount} subtasks`);
          } else {
            console.warn(`⚠️ [v1] Erreur lors de la récupération des subtasks pour ${issue.key}:`, subtasksResponse.status);
          }
        } catch (error) {
          console.warn(`⚠️ [v1] Erreur lors de la récupération des subtasks pour ${issue.key}:`, error);
        }
      }
      
      return {
        id: index + 100, // ID unique numérique pour éviter les conflits
        title: issue.fields.summary, // Utilise 'title' comme dans v1
        description: issue.fields.description?.content?.[0]?.content?.[0]?.text || "Aucune description",
        status: mappedStatus, // ✅ Maintenant retourne les vrais statuts Jira
        priority: issue.fields.priority?.name || "Medium",
        createdAt: issue.fields.created,
        dueDate: issue.fields.duedate || null,
        assignedTo: issue.fields.assignee?.displayName || "Non assigné",
        projectId: issue.fields.project.key, // 🔧 FIX: Garder la clé Jira pour le mapping
        projectName: issue.fields.project.name,
        jiraKey: issue.key,
        jiraId: issue.id,
        // ✅ CORRECTION : Type d'issue détecté correctement
        issueType: correctedIssueType,
        storyPoints: issue.fields.customfield_10016 || null, // Story points Jira
        labels: issue.fields.labels || [],
        components: issue.fields.components?.map((c: any) => c.name) || [],
        epicLink: issue.fields.customfield_10014 || null, // Epic link Jira
        sprint: issue.fields.sprint?.name || null,
        // ✅ NOUVEAU : Informations des subtasks
        isSubtask: isSubtask,
        parentKey: parentKey,
        hasSubtasks: hasSubtasks,
        subtasksCount: subtasksCount,
        _links: {
          self: { href: `/api/v1/jira/tasks/${issue.key}` }
        }
      };
    }));

    const responseData: JiraTaskResponse = {
      status: 200,
      message: "Tâches Jira récupérées avec succès",
      data: {
        _embedded: { tasks: tasksWithSubtasks },
        _links: {
          self: { href: "/api/v1/jira/tasks" }
        },
        page: {
          size: tasksWithSubtasks.length,
          totalElements: searchResult.total || tasksWithSubtasks.length,
          totalPages: 1,
          number: 0
        }
      },
      type: "HATEOAS_RECORD_LIST",
      source: 'jira'
    };

    // ✅ NOUVEAU : Compter les subtasks pour chaque tâche
    console.log("🔍 [v1] Calcul du nombre de subtasks pour chaque tâche...");
    
    // ✅ NOUVEAU : Afficher le résumé des tâches avec subtasks
    const tasksWithSubtasksCount = tasksWithSubtasks.filter(task => task.hasSubtasks && task.subtasksCount > 0);
    if (tasksWithSubtasksCount.length > 0) {
      console.log("📋 [v1] Résumé des tâches avec subtasks:");
      tasksWithSubtasksCount.forEach(task => {
        console.log(`  - ${task.jiraKey}: ${task.subtasksCount} subtask(s)`);
      });
    } else {
      console.log("📋 [v1] Aucune tâche avec subtasks trouvée");
    }

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error getting tasks from Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la récupération des tâches Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// POST /api/v1/jira/tasks - Crée une nouvelle tâche Jira
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 [v1] Création de tâche Jira via v1 API...");
    
    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      const error = new Error("Token Jira non configuré");
      console.error("❌ [v1] Error creating task in Jira:", error);
      
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré. Veuillez vérifier vos paramètres d'environnement.",
        solution: "Assurez-vous que JIRA_API_TOKEN est défini dans votre fichier .env.",
        error: "Token Jira non configuré",
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Validation des champs requis
    if (!body.title || !body.projectKey) {
      const error = new Error("Le titre et la clé du projet sont requis");
      console.error("❌ [v1] Error creating task in Jira:", error);
      
      return NextResponse.json({ 
        status: 400,
        message: "Le titre et la clé du projet sont requis.",
        solution: "Veuillez fournir un titre et une clé de projet valides.",
        error: "Le titre et la clé du projet sont requis",
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // 🔧 FIX: Détection simple des types d'issues valides (SANS TESTS POLLUANTS)
    console.log(`🔍 [v1] Détection des types d'issues valides pour le projet ${body.projectKey}...`);
    
    // 1. Détecter les types d'issues valides pour ce projet
    let validIssueTypes = ["Task", "Bug", "Story"]; // Types par défaut
    try {
      const projectUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/project/${body.projectKey}`;
      const projectResponse = await fetch(projectUrl, { headers: getJiraHeaders() });
      
      if (projectResponse.ok) {
        const project = await projectResponse.json();
        if (project.issueTypes && project.issueTypes.length > 0) {
          validIssueTypes = project.issueTypes.map((it: any) => it.name);
          console.log(`✅ [v1] Types d'issues valides pour ${body.projectKey}:`, validIssueTypes);
        }
      }
    } catch (error) {
      console.log(`⚠️ [v1] Erreur détection types d'issues pour ${body.projectKey}:`, error);
    }
    
    // 2. Vérifier si le type demandé est valide, sinon utiliser un type par défaut
    let issueType = body.issueType || "Task";
    if (!validIssueTypes.includes(issueType)) {
      // Essayer de trouver un type compatible
      if (validIssueTypes.includes("Task")) issueType = "Task";
      else if (validIssueTypes.includes("Bug")) issueType = "Bug";
      else if (validIssueTypes.includes("Story")) issueType = "Story";
      else issueType = validIssueTypes[0] || "Task";
      
      console.log(`⚠️ [v1] Type d'issue "${body.issueType}" non valide pour ${body.projectKey}, utilisation de "${issueType}"`);
    }
    
    // ✅ CONSTRUCTION SIMPLE ET PROPRE (SANS TESTS POLLUANTS)
    const fields = {
      project: { key: body.projectKey },
      summary: body.title,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: body.description || "Tâche créée via D&A Workspace"
              }
            ]
          }
        ]
      },
      issuetype: { name: issueType }
    };
    
    // ✅ AJOUTER LES CHAMPS SIMPLES SANS TESTS
    if (body.priority) {
      // 🔧 FIX : Mapper les priorités textuelles vers les IDs Jira
      let priorityId = "3"; // Medium par défaut
      
      if (body.priority.toLowerCase().includes("highest") || body.priority.toLowerCase().includes("très haute")) {
        priorityId = "1";
      } else if (body.priority.toLowerCase().includes("high") || body.priority.toLowerCase().includes("haute")) {
        priorityId = "2";
      } else if (body.priority.toLowerCase().includes("medium") || body.priority.toLowerCase().includes("moyenne")) {
        priorityId = "3";
      } else if (body.priority.toLowerCase().includes("low") || body.priority.toLowerCase().includes("basse")) {
        priorityId = "4";
      } else if (body.priority.toLowerCase().includes("lowest") || body.priority.toLowerCase().includes("très basse")) {
        priorityId = "5";
      }
      
      (fields as any).priority = { id: priorityId };
    }
    
    if (body.assignee) {
      (fields as any).assignee = { name: body.assignee };
    }
    
    console.log(`📦 [v1] Champs utilisés pour ${body.projectKey}:`, Object.keys(fields));
    
    const issueData = { fields: fields };

    // Création de la tâche Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue`;
    const response = await fetch(jiraUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(issueData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [v1] Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const jiraIssue = await response.json();
    console.log(`✅ [v1] Tâche Jira créée: ${jiraIssue.key}`);
    console.log(`🔍 [v1] Structure Jira reçue:`, JSON.stringify(jiraIssue, null, 2));

    // 🔧 FIX: Ajouter la tâche au board actif du projet
    try {
      console.log(`🎯 [v1] Ajout de la tâche ${jiraIssue.key} au board du projet ${body.projectKey}...`);
      
      // 1. Récupérer le board actif du projet
      const boardUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/board?projectKeyOrId=${body.projectKey}`;
      const boardResponse = await fetch(boardUrl, {
        method: 'GET',
        headers: getJiraHeaders()
      });
      
      if (boardResponse.ok) {
        const boards = await boardResponse.json();
        if (boards.values && boards.values.length > 0) {
          // 🔧 FIX : Utiliser le board ECS (ID: 1) pour tous les projets
          const activeBoard = boards.values.find((b: any) => b.id === 1) || boards.values[0];
          console.log(`✅ [v1] Board utilisé: ${activeBoard.name} (ID: ${activeBoard.id})`);
          
          // 2. Récupérer le sprint actif
          const sprintUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/board/${activeBoard.id}/sprint?state=active`;
          const sprintResponse = await fetch(sprintUrl, {
            method: 'GET',
            headers: getJiraHeaders()
          });
          
          if (sprintResponse.ok) {
            const sprints = await sprintResponse.json();
            if (sprints.values && sprints.values.length > 0) {
              const activeSprint = sprints.values[0];
              console.log(`✅ [v1] Sprint actif trouvé: ${activeSprint.name} (ID: ${activeSprint.id})`);
              
              // 3. Ajouter la tâche au sprint
              const addToSprintUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/sprint/${activeSprint.id}/issue`;
              const addToSprintResponse = await fetch(addToSprintUrl, {
                method: 'POST',
                headers: getJiraHeaders(),
                body: JSON.stringify({
                  issues: [jiraIssue.key]
                })
              });
              
              if (addToSprintResponse.ok) {
                console.log(`✅ [v1] Tâche ${jiraIssue.key} ajoutée au sprint ${activeSprint.name}`);
              } else {
                console.log(`⚠️ [v1] Impossible d'ajouter la tâche au sprint: ${addToSprintResponse.status}`);
              }
            } else {
              console.log(`⚠️ [v1] Aucun sprint actif trouvé pour le board ${activeBoard.name}`);
              
              // 🔧 FIX: Créer un sprint automatiquement
              try {
                console.log(`🚀 [v1] Création d'un nouveau sprint pour le board ${activeBoard.name}...`);
                
                const newSprintData = {
                  name: `Sprint ${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +2 semaines
                  goal: "Sprint créé automatiquement via D&A Workspace"
                };
                
                const createSprintUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/board/${activeBoard.id}/sprint`;
                const createSprintResponse = await fetch(createSprintUrl, {
                  method: 'POST',
                  headers: getJiraHeaders(),
                  body: JSON.stringify(newSprintData)
                });
                
                if (createSprintResponse.ok) {
                  const newSprint = await createSprintResponse.json();
                  console.log(`✅ [v1] Nouveau sprint créé: ${newSprint.name} (ID: ${newSprint.id})`);
                  
                  // Ajouter la tâche au nouveau sprint
                  const addToNewSprintUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/sprint/${newSprint.id}/issue`;
                  const addToNewSprintResponse = await fetch(addToNewSprintUrl, {
                    method: 'POST',
                    headers: getJiraHeaders(),
                    body: JSON.stringify({
                      issues: [jiraIssue.key]
                    })
                  });
                  
                  if (addToNewSprintResponse.ok) {
                    console.log(`✅ [v1] Tâche ${jiraIssue.key} ajoutée au nouveau sprint ${newSprint.name}`);
                  } else {
                    console.log(`⚠️ [v1] Impossible d'ajouter la tâche au nouveau sprint: ${addToNewSprintResponse.status}`);
                  }
                } else {
                  console.log(`⚠️ [v1] Impossible de créer un sprint: ${createSprintResponse.status}`);
                }
              } catch (sprintError) {
                console.log(`⚠️ [v1] Erreur lors de la création du sprint:`, sprintError);
              }
            }
          } else {
            console.log(`⚠️ [v1] Impossible de récupérer les sprints: ${sprintResponse.status}`);
          }
        } else {
          console.log(`⚠️ [v1] Aucun board trouvé pour le projet ${body.projectKey}`);
        }
      } else {
        console.log(`⚠️ [v1] Impossible de récupérer les boards: ${boardResponse.status}`);
      }
    } catch (error) {
      console.log(`⚠️ [v1] Erreur lors de l'ajout au board:`, error);
      // Ne pas faire échouer la création de la tâche
    }

    // ✅ CORRECTION : Utiliser les données du body au lieu de jiraIssue.fields
    const createdTask = {
      id: Date.now().toString(),
      title: body.title, // ✅ Utiliser le titre du body, pas de Jira
      description: body.description || "Tâche créée via D&A Workspace",
      status: body.status || "To Do", // ✅ Utiliser le statut fourni ou "To Do" par défaut
      priority: body.priority || "Medium",
      createdAt: new Date().toISOString(),
      dueDate: body.dueDate || null,
      assignedTo: body.assignee || "Non assigné", // ✅ Utiliser l'assignee fourni
      projectId: body.projectKey,
      projectName: body.projectName || body.projectKey,
      jiraKey: jiraIssue.key,
      jiraId: jiraIssue.id,
      // ✅ Ajouter les nouveaux champs Jira
      issueType: body.issueType || "Task",
      storyPoints: body.storyPoints,
      labels: body.labels,
      components: body.components,
      epicLink: body.epicLink,
      sprint: body.sprint,
      _links: {
        self: { href: `/api/v1/jira/tasks/${jiraIssue.key}` }
      }
    };

    const responseData: JiraTaskResponse = {
      status: 201,
      message: "Tâche Jira créée avec succès",
      data: createdTask,
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 201 });
    
  } catch (error) {
    console.error("❌ [v1] Error creating task in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la création de la tâche Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// PATCH /api/v1/jira/tasks - Met à jour une tâche Jira
export async function PATCH(request: NextRequest) {
  try {
    console.log("🔄 [v1] Mise à jour de tâche Jira via v1 API...");
    
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré. Veuillez vérifier vos paramètres d'environnement.",
        solution: "Assurez-vous que JIRA_API_TOKEN est défini dans votre fichier .env.",
        error: "Token Jira non configuré",
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Gérer les deux formats possibles (jiraKey et jirakey)
    const jiraKey = body.jiraKey || body.jirakey;
    
    if (!jiraKey) {
      return NextResponse.json({ 
        status: 400,
        message: "La clé Jira de la tâche est requise (jiraKey ou jirakey)",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }
    
    console.log(`🔍 [v1] Clé Jira reçue: ${jiraKey}`);
    console.log(`📋 [v1] Données reçues:`, body);

    // ✅ PRÉPARATION COMPLÈTE DES DONNÉES DE MISE À JOUR
    const updateData: any = {};
    
         // ✅ Titre et description
     if (body.title) updateData.summary = body.title;
     if (body.description) {
       // ⚠️ Format Atlassian Document requis par Jira
       updateData.description = {
         type: "doc",
         version: 1,
         content: [
           {
             type: "paragraph",
             content: [
               {
                 type: "text",
                 text: body.description
               }
             ]
           }
         ]
       };
     }
    
    // ✅ STATUT - CRITIQUE POUR LE DRAG & DROP !
    let jiraStatus: string | null = null; // ✅ DÉCLARER EN DEHORS DU SCOPE
    if (body.status) {
      // Mapping inverse : statuts D&A → statuts Jira
      jiraStatus = mapStatusToJira(body.status);
      if (jiraStatus) {
        // ❌ NE PAS METTRE LE STATUT DANS updateData - Utiliser les transitions Jira
        console.log(`🔄 [v1] Changement de statut: ${body.status} → ${jiraStatus}`);
      }
    }
    
    // ✅ Priorité
    if (body.priority && body.priority !== "Medium") {
      updateData.priority = { name: body.priority };
    }
    
    // ✅ Assignee
    if (body.assignee) {
      updateData.assignee = { name: body.assignee };
    }
    
    // ✅ Autres champs Jira - Gestion intelligente des restrictions
    if (body.issueType) updateData.issuetype = { name: body.issueType };
    if (body.storyPoints) updateData.customfield_10016 = body.storyPoints;
    if (body.labels) updateData.labels = body.labels;
    
    // ⚠️ Champs potentiellement restreints - Testés un par un
    if (body.components && body.components.length > 0) {
      updateData.components = body.components.map((c: string) => ({ name: c }));
    }
    if (body.epicLink) updateData.customfield_10014 = body.epicLink;
    if (body.sprint) updateData.sprint = body.sprint;
    
    console.log(`🔧 [v1] Champs à modifier:`, Object.keys(updateData));
    console.log(`📦 [v1] Données de mise à jour:`, updateData);

    // ✅ Validation qu'il y a au moins un champ à modifier
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ 
        status: 400,
        message: "Aucun champ à modifier",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

        // ✅ Mise à jour intelligente de la tâche Jira - Test des champs un par un
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${jiraKey}`;
    
    // 🔧 Stratégie 1 : Essayer avec tous les champs
    let response = await fetch(jiraUrl, {
      method: 'PUT',
      headers: getJiraHeaders(),
      body: JSON.stringify({ fields: updateData })
    });

    // ✅ GESTION SPÉCIALE DU STATUT : Utiliser les transitions Jira TOUJOURS !
    if (body.status && jiraStatus) {
      try {
        console.log(`🔄 [v1] Tentative de transition vers: ${jiraStatus}`);
        
        // ✅ ÉTAPE 1 : Récupérer les transitions disponibles
        const transitionsUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${jiraKey}/transitions`;
        const transitionsResponse = await fetch(transitionsUrl, {
          method: 'GET',
          headers: getJiraHeaders()
        });
        
        if (transitionsResponse.ok) {
          const transitions = await transitionsResponse.json();
          console.log(`🔄 [v1] Transitions disponibles:`, transitions.transitions.map((t: any) => `${t.name} → ${t.to.name}`));
          
          // ✅ ÉTAPE 2 : Trouver la transition correspondante au statut cible
          const targetTransition = transitions.transitions.find((t: any) => 
            t.to.name === jiraStatus || 
            t.name.toLowerCase().includes(jiraStatus.toLowerCase()) ||
            t.to.name.toLowerCase().includes(jiraStatus.toLowerCase())
          );
          
          if (targetTransition) {
            console.log(`🎯 [v1] Transition trouvée: ${targetTransition.name} (ID: ${targetTransition.id}) vers ${targetTransition.to.name}`);
            
            // ✅ ÉTAPE 3 : Exécuter la transition
            const transitionResponse = await fetch(transitionsUrl, {
              method: 'POST',
              headers: getJiraHeaders(),
              body: JSON.stringify({
                transition: { id: targetTransition.id }
              })
            });
            
            if (transitionResponse.ok) {
              console.log(`✅ [v1] Transition réussie vers ${jiraStatus}`);
            } else {
              const transitionError = await transitionResponse.text();
              console.warn(`⚠️ [v1] Transition échouée: ${transitionResponse.status} - ${transitionError}`);
            }
          } else {
            console.warn(`⚠️ [v1] Aucune transition trouvée pour le statut: ${jiraStatus}`);
            console.warn(`⚠️ [v1] Statuts disponibles:`, transitions.transitions.map((t: any) => t.to.name));
          }
        } else {
          console.warn(`⚠️ [v1] Impossible de récupérer les transitions: ${transitionsResponse.status}`);
        }
      } catch (transitionError) {
        console.warn(`⚠️ [v1] Erreur lors de la transition:`, transitionError);
      }
    }

    // 🔧 Stratégie 2 : Si échec, essayer sans les champs problématiques
    if (!response.ok) {
      console.log(`⚠️ [v1] Premier essai échoué, tentative sans champs problématiques...`);
      
      // Créer un payload minimal avec seulement les champs essentiels
      const minimalUpdateData: any = {};
      
             // Champs toujours sûrs
        if (updateData.summary) minimalUpdateData.summary = updateData.summary;
        if (updateData.issuetype) minimalUpdateData.issuetype = updateData.issuetype;
        if (updateData.labels) minimalUpdateData.labels = updateData.labels;
        
        // ⚠️ Description au format Atlassian Document (requis par Jira)
        if (updateData.description) {
          // ✅ CORRECTION : Extraire le texte de la description déjà formatée
          const descriptionText = typeof updateData.description === 'string' 
            ? updateData.description 
            : updateData.description.content?.[0]?.content?.[0]?.text || "Tâche mise à jour";
          
          minimalUpdateData.description = {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: descriptionText
                  }
                ]
              }
            ]
          };
        }
       
       if (updateData.assignee) {
         try {
           const assigneeResponse = await fetch(jiraUrl, {
             method: 'PUT',
             headers: getJiraHeaders(),
             body: JSON.stringify({ fields: { assignee: updateData.assignee } })
           });
           if (assigneeResponse.ok) {
             console.log(`✅ [v1] Assignee mis à jour séparément: ${updateData.assignee.name}`);
           } else {
             console.warn(`⚠️ [v1] Assignee non modifiable: ${updateData.assignee.name}`);
           }
         } catch (error) {
           console.warn(`⚠️ [v1] Erreur mise à jour assignee:`, error);
         }
       }
       
       // Essayer la mise à jour minimale
       response = await fetch(jiraUrl, {
         method: 'PUT',
         headers: getJiraHeaders(),
         body: JSON.stringify({ fields: minimalUpdateData })
       });
     }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [v1] Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ [v1] Tâche Jira mise à jour: ${jiraKey}`);

    const responseData: JiraTaskResponse = {
      status: 200,
      message: "Tâche Jira mise à jour avec succès",
      data: { jiraKey: jiraKey, updated: true, fields: updateData },
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error updating task in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la mise à jour de la tâche Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// ✅ FONCTION DE MAPPING STATUT D&A → JIRA (AJOUTÉE)
const mapStatusToJira = (status: string): string | null => {
  switch (status) {
    case "To Do": return "To Do";
    case "In Progress": return "In Progress";
    case "In Review": return "In Review";
    case "Done": return "Done";
    case "Blocked": return "Blocked";
    default: return status; // Retourner le statut tel quel si pas de mapping
  }
};

// DELETE /api/v1/jira/tasks - Supprime une tâche Jira
export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ [v1] Suppression de tâche Jira via v1 API...");
    
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré. Veuillez vérifier vos paramètres d'environnement.",
        solution: "Assurez-vous que JIRA_API_TOKEN est défini dans votre fichier .env.",
        error: "Token Jira non configuré",
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jiraKey = searchParams.get("jiraKey");
    
    if (!jiraKey) {
      return NextResponse.json({ 
        status: 400,
        message: "La clé Jira de la tâche est requise pour la suppression",
        solution: "Veuillez fournir une clé Jira valide dans les paramètres de requête",
        error: "Clé Jira manquante",
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // 🔧 FIX: Jira ne permet PAS la suppression directe des tâches
    // Solution: Utiliser les transitions pour passer à "Closed" ou "Deleted"
    console.log(`🔍 [v1] Tentative de fermeture de la tâche ${jiraKey} via transitions Jira...`);
    
    // 1. Récupérer les transitions disponibles pour cette tâche
    const transitionsUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${jiraKey}/transitions`;
    const transitionsResponse = await fetch(transitionsUrl, {
      method: 'GET',
      headers: getJiraHeaders()
    });

    if (!transitionsResponse.ok) {
      const errorText = await transitionsResponse.text();
      console.error(`❌ [v1] Erreur récupération transitions: ${transitionsResponse.status} - ${errorText}`);
      throw new Error(`Jira API Error: ${transitionsResponse.status} ${transitionsResponse.statusText} - ${errorText}`);
    }

    const transitions = await transitionsResponse.json();
    console.log(`🔍 [v1] Transitions disponibles:`, transitions.transitions?.map((t: any) => t.name));

    // 2. Chercher une transition de fermeture (Close, Resolve, Done, etc.)
    const closeTransition = transitions.transitions?.find((t: any) => 
      t.name.toLowerCase().includes('close') || 
      t.name.toLowerCase().includes('resolve') || 
      t.name.toLowerCase().includes('done') ||
      t.name.toLowerCase().includes('complete') ||
      t.name.toLowerCase().includes('finish')
    );

    if (!closeTransition) {
      console.warn(`⚠️ [v1] Aucune transition de fermeture trouvée pour ${jiraKey}`);
      // Fallback: essayer de supprimer directement (peut échouer)
      const deleteUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${jiraKey}`;
      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: getJiraHeaders()
      });

      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.error(`❌ [v1] Suppression directe échouée: ${deleteResponse.status} - ${errorText}`);
        throw new Error(`Jira API Error: Suppression non supportée - ${deleteResponse.status} ${deleteResponse.statusText}`);
      }
    } else {
      // 3. Exécuter la transition de fermeture
      console.log(`✅ [v1] Transition de fermeture trouvée: ${closeTransition.name} (ID: ${closeTransition.id})`);
      
      const transitionResponse = await fetch(transitionsUrl, {
        method: 'POST',
        headers: getJiraHeaders(),
        body: JSON.stringify({
          transition: { id: closeTransition.id }
        })
      });

      if (!transitionResponse.ok) {
        const errorText = await transitionResponse.text();
        console.error(`❌ [v1] Erreur transition: ${transitionResponse.status} - ${errorText}`);
        throw new Error(`Jira API Error: ${transitionResponse.status} ${transitionResponse.statusText} - ${errorText}`);
      }

      console.log(`✅ [v1] Tâche ${jiraKey} fermée via transition: ${closeTransition.name}`);
    }

    console.log(`✅ [v1] Tâche Jira supprimée: ${jiraKey}`);

    const responseData: JiraTaskResponse = {
      status: 200,
      message: "Tâche Jira supprimée avec succès",
      data: { jiraKey, deleted: true },
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error deleting task in Jira:", error);
    
    // Analyser le type d'erreur pour fournir un message approprié
    let errorMessage = "Erreur lors de la suppression de la tâche Jira";
    let solution = "Vérifiez que la tâche existe et que vous avez les permissions nécessaires";
    
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        errorMessage = "Tâche Jira non trouvée";
        solution = "Vérifiez que la clé Jira est correcte et que la tâche existe";
      } else if (error.message.includes('403')) {
        errorMessage = "Permissions insuffisantes pour supprimer cette tâche";
        solution = "Contactez votre administrateur Jira pour obtenir les droits de suppression";
      } else if (error.message.includes('Suppression non supportée')) {
        errorMessage = "La suppression directe n'est pas supportée par ce projet Jira";
        solution = "La tâche a été fermée via une transition de workflow au lieu d'être supprimée";
      }
    }
    
    return NextResponse.json({ 
      status: 500,
      message: errorMessage,
      solution: solution,
      error: error instanceof Error ? error.message : "Erreur inconnue",
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}
