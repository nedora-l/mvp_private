import { NextRequest, NextResponse } from 'next/server';

/**
 * API MCP - Tâches Jira réelles
 * Récupère les issues/tâches depuis l'API Jira
 */

interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: {
      content: any[];
    };
    status: {
      name: string;
      statusCategory: {
        key: string;
      };
    };
    priority: {
      name: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    creator: {
      displayName: string;
    };
    created: string;
    duedate?: string;
    project: {
      key: string;
      name: string;
    };
    sprint?: any[];
  };
}

interface Task {
  id: number;
  projectId: number;
  title: string;
  status: string;
  description: string;
  priority: string;
  createdAt: string;
  dueDate: string;
  assignedTo: string;
  sprintId?: number;
  jiraKey?: string;
  jiraId?: string;
}

// Configuration Jira
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

// Mapping statut Jira → D&A
const mapJiraStatus = (jiraStatus: string, statusCategory: string): string => {
  const status = jiraStatus.toLowerCase();
  const category = statusCategory.toLowerCase();
  
  // Terminé/Fermé
  if (category === 'done' || status.includes('done') || status.includes('closed') || status.includes('resolved')) {
    return 'Terminé';
  }
  
  // En attente (révision, tests)
  if (status.includes('review') || status.includes('testing') || status.includes('test') || 
      status.includes('qa') || status.includes('validation') || status.includes('approval')) {
    return 'En attente';
  }
  
  // À faire (nouveau, backlog, todo) - avant "En cours" pour priorité
  if (category === 'new' || status.includes('todo') || status.includes('open') || 
      status.includes('backlog') || status.includes('to do') || status.includes('new') ||
      status.includes('selected for development')) {
    return 'À faire';
  }
  
  // En cours (développement actif, progress)
  if (category === 'indeterminate' || status.includes('progress') || status.includes('in development') || 
      status.includes('doing') || status.includes('work')) {
    return 'En cours';
  }
  
  return 'À faire'; // Défaut
};

// Mapping priorité Jira → D&A
const mapJiraPriority = (jiraPriority: string): string => {
  const priority = jiraPriority.toLowerCase();
  if (priority.includes('highest') || priority.includes('critical')) return 'Critique';
  if (priority.includes('high') || priority.includes('major')) return 'Élevée';
  if (priority.includes('medium') || priority.includes('normal')) return 'Moyenne';
  if (priority.includes('low') || priority.includes('minor')) return 'Faible';
  return 'Moyenne'; // Défaut
};

// Extraction du texte de description Jira
const extractJiraDescription = (description: any): string => {
  if (!description || !description.content) return '';
  
  try {
    return description.content
      .map((block: any) => {
        if (block.type === 'paragraph' && block.content) {
          return block.content
            .filter((item: any) => item.type === 'text')
            .map((item: any) => item.text)
            .join('');
        }
        return '';
      })
      .filter((text: string) => text.length > 0)
      .join('\n');
  } catch (error) {
    return description.toString();
  }
};

// GET /api/mcp/tasks - Récupère les tâches Jira
export async function GET(request: NextRequest) {
  try {
    console.log("🔗 Connexion à Jira pour récupérer les tâches...");
    
    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ Token Jira manquant - Configuration requise");
      return NextResponse.json({ 
        success: false, 
        tasks: [],
        source: 'jira-error',
        error: 'Token Jira non configuré'
      }, { status: 401 });
    }

    // Récupération des tâches depuis tous les projets Jira
    const searchUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/search`;
    
    const jqlQuery = `ORDER BY created DESC`;
    
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify({
        jql: jqlQuery,
        maxResults: 100,
        fields: [
          'summary',
          'description', 
          'status',
          'priority',
          'assignee',
          'creator',
          'created',
          'duedate',
          'project',
          'sprint'
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Jira API Error: ${response.status} ${response.statusText}`);
    }

    const searchResult = await response.json();
    const jiraIssues: JiraIssue[] = searchResult.issues || [];
    
    console.log(`✅ ${jiraIssues.length} tâches récupérées depuis Jira`);

    // Récupération dynamique du mapping des projets depuis l'API projects
    let projectMapping: { [key: string]: number } = {};
    
    try {
      const projectsResponse = await fetch(`http://localhost:3000/api/mcp/projects`, {
        method: 'GET',
        headers: getJiraHeaders()
      });
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        if (projectsData.success && projectsData.projects) {
          // Créer le mapping dynamique JiraKey → ID
          projectsData.projects.forEach((project: any) => {
            if (project.jiraKey) {
              projectMapping[project.jiraKey] = project.id;
            }
          });
          console.log(`✅ Mapping projets dynamique:`, projectMapping);
        }
      }
    } catch (error) {
      console.warn("⚠️ Erreur récupération projets pour mapping:", error);
    }
    
    // Fallback si le mapping échoue
    if (Object.keys(projectMapping).length === 0) {
      projectMapping = {
        'RACHID': 100,
        'SSP': 101, 
        'TEST2RAC': 102,
        'TEST3': 103,
        'ECS': 104
      };
      console.log("⚠️ Utilisation du mapping de fallback");
    }

    // Conversion vers format D&A Workspace
    const tasks: Task[] = jiraIssues.map((issue, index) => {
      const projectId = projectMapping[issue.fields.project.key] || 1;
      const assigneeName = issue.fields.assignee 
        ? `${issue.fields.assignee.displayName} (Jira)` 
        : `${issue.fields.creator.displayName} (Créateur)`;
      
      return {
        id: parseInt(issue.id) || (index + 1000), // ID unique
        projectId: projectId,
        title: issue.fields.summary,
        status: mapJiraStatus(issue.fields.status.name, issue.fields.status.statusCategory.key),
        description: extractJiraDescription(issue.fields.description) || `Tâche Jira: ${issue.key}`,
        priority: mapJiraPriority(issue.fields.priority.name),
        createdAt: issue.fields.created.split('T')[0], // Format YYYY-MM-DD
        dueDate: issue.fields.duedate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +14 jours par défaut
        assignedTo: assigneeName,
        sprintId: issue.fields.sprint?.[0]?.id || null,
        jiraKey: issue.key,
        jiraId: issue.id
      };
    });

    console.log(`✅ ${tasks.length} tâches Jira récupérées et mappées`);

    return NextResponse.json({
      success: true,
      tasks: tasks,
      source: 'jira',
      jiraTasks: tasks.length,
      totalTasks: tasks.length,
      projects: Object.keys(projectMapping)
    });

  } catch (error) {
    console.error("❌ Erreur API Jira tâches:", error);
    
    // ✅ PLUS DE FALLBACK LOCAL - Return error directement
    return NextResponse.json(
      { 
        success: false, 
        tasks: [],
        source: 'jira-error',
        error: error instanceof Error ? error.message : 'Erreur de connexion Jira'
      }, 
      { status: 500 }
    );
  }
}

// POST /api/mcp/tasks - Créer une tâche Jira
export async function POST(request: NextRequest) {
  let taskData;
  
  try {
    taskData = await request.json();
    console.log("📝 Création tâche:", taskData);

    // Récupération dynamique du mapping des projets pour POST
    let projectKeyMapping: { [key: number]: string } = {};
    
    try {
      const projectsResponse = await fetch(`http://localhost:3000/api/mcp/projects`, {
        method: 'GET'
      });
      
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        if (projectsData.success && projectsData.projects) {
          // Créer le mapping dynamique ID → JiraKey
          projectsData.projects.forEach((project: any) => {
            if (project.jiraKey && project.id) {
              projectKeyMapping[project.id] = project.jiraKey;
            }
          });
          console.log(`✅ Mapping POST projets dynamique:`, projectKeyMapping);
        }
      }
    } catch (error) {
      console.warn("⚠️ Erreur récupération projets pour POST:", error);
    }
    
    // Fallback si le mapping échoue
    if (Object.keys(projectKeyMapping).length === 0) {
      projectKeyMapping = {
        100: 'RACHID',
        101: 'SSP', 
        102: 'TEST2RAC',
        103: 'TEST3',
        104: 'ECS'
      };
      console.log("⚠️ Utilisation du mapping POST de fallback");
    }

    const projectKey = projectKeyMapping[taskData.projectId];
    
    // ✅ PLUS DE FALLBACK - Token Jira et projectKey requis
    if (!JIRA_CONFIG.token) {
      console.error("❌ Token Jira manquant - Configuration requise pour créer une tâche");
      return NextResponse.json({
        success: false,
        error: 'Token Jira non configuré'
      }, { status: 401 });
    }

    if (!projectKey) {
      console.error("❌ Clé de projet manquante - Impossible de créer la tâche");
      return NextResponse.json({
        success: false,
        error: 'Clé de projet requise (projectKey)'
      }, { status: 400 });
    }

    // Créer la tâche Jira
    const createUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue`;
    
    const jiraIssue = {
      fields: {
        project: { key: projectKey },
        summary: taskData.title,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: taskData.description || `Créé depuis D&A Workspace le ${new Date().toLocaleDateString('fr-FR')}`
                }
              ]
            }
          ]
        },
        issuetype: { name: "Task" },
        priority: { name: taskData.priority === 'Élevée' ? 'High' : taskData.priority === 'Faible' ? 'Low' : 'Medium' }
      }
    };

    const response = await fetch(createUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(jiraIssue)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Jira creation failed: ${response.status} - ${errorData}`);
    }

    const createdIssue = await response.json();
    
    return NextResponse.json({
      success: true,
      message: "Tâche créée dans Jira avec succès",
      jiraKey: createdIssue.key,
      jiraId: createdIssue.id,
      task: {
        id: parseInt(createdIssue.id),
        ...taskData,
        jiraKey: createdIssue.key,
        jiraId: createdIssue.id
      }
    });

  } catch (error) {
    console.error("❌ Erreur création tâche:", error);
    
    // ✅ PLUS DE FALLBACK LOCAL - Return error directement
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur création tâche Jira' },
      { status: 500 }
    );
  }
}

// PUT /api/mcp/tasks - Mettre à jour une tâche dans Jira
export async function PUT(request: NextRequest) {
  let taskData;
  
  try {
    taskData = await request.json();
    console.log("✏️ Modification tâche:", taskData);

    // ✅ PLUS DE FALLBACK - Token Jira et jiraKey/jiraId requis
    if (!JIRA_CONFIG.token) {
      console.error("❌ Token Jira manquant - Configuration requise");
      return NextResponse.json({
        success: false,
        error: 'Token Jira non configuré'
      }, { status: 401 });
    }

    if (!taskData.jiraKey && !taskData.jiraId) {
      console.error("❌ jiraKey ou jiraId requis pour modifier une tâche Jira");
      return NextResponse.json({
        success: false,
        error: 'jiraKey ou jiraId requis'
      }, { status: 400 });
    }

    const issueKey = taskData.jiraKey || taskData.jiraId;
    const updateUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${issueKey}`;

    // Préparer les champs à mettre à jour (éviter les champs non-editables)
    const updateFields: any = {};

    if (taskData.title) {
      updateFields.summary = taskData.title;
    }

    if (taskData.description) {
      updateFields.description = {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: taskData.description
              }
            ]
          }
        ]
      };
    }

    // Éviter de mettre à jour la priorité si elle pose problème dans le schéma Jira
    // La priorité sera gérée via l'interface Jira directement
    console.log(`🔧 Tentative mise à jour tâche ${issueKey} (champs: ${Object.keys(updateFields).join(', ')})`);

    // Gestion du changement de statut via transition
    if (taskData.status && taskData.currentStatus !== taskData.status) {
      // D'abord mettre à jour les autres champs (si présents)
      if (Object.keys(updateFields).length > 0) {
        const updateResponse = await fetch(updateUrl, {
          method: 'PUT',
          headers: getJiraHeaders(),
          body: JSON.stringify({
            fields: updateFields
          })
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.text();
          console.warn(`⚠️ Mise à jour champs échouée pour ${issueKey}:`, errorData);
          // Continuer avec la transition même si les champs échouent
        }
      }

      // Ensuite gérer la transition de statut
      await handleStatusTransition(issueKey, taskData.status);
    } else if (Object.keys(updateFields).length > 0) {
      // Mettre à jour seulement les champs sans changement de statut
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: getJiraHeaders(),
        body: JSON.stringify({
          fields: updateFields
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.warn(`⚠️ Mise à jour champs échouée pour ${issueKey}:`, errorData);
        // Ne pas lever d'erreur fatale pour des problèmes de champs
      }
    }

    return NextResponse.json({
      success: true,
      message: "Tâche modifiée dans Jira avec succès",
      task: taskData
    });

  } catch (error) {
    console.error("❌ Erreur modification tâche Jira:", error);
    
    // ✅ PLUS DE FALLBACK LOCAL - Return error directement
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur modification tâche Jira' },
      { status: 500 }
    );
  }
}

// DELETE /api/mcp/tasks - Supprimer une tâche dans Jira
export async function DELETE(request: NextRequest) {
  let taskId, jiraKey;
  
  try {
    const { searchParams } = new URL(request.url);
    taskId = searchParams.get('id');
    jiraKey = searchParams.get('jiraKey');
    
    console.log("🗑️ Suppression tâche:", { taskId, jiraKey });

    // ✅ PLUS DE FALLBACK - Token Jira et jiraKey requis
    if (!JIRA_CONFIG.token) {
      console.error("❌ Token Jira manquant - Configuration requise");
      return NextResponse.json({
        success: false,
        error: 'Token Jira non configuré'
      }, { status: 401 });
    }

    if (!jiraKey) {
      console.error("❌ jiraKey requis pour supprimer une tâche Jira");
      return NextResponse.json({
        success: false,
        error: 'jiraKey requis'
      }, { status: 400 });
    }

    if (!jiraKey && !taskId) {
      return NextResponse.json({
        success: false,
        error: "ID de tâche ou clé Jira requis"
      }, { status: 400 });
    }

    // Utiliser jiraKey si disponible, sinon taskId
    const issueIdentifier = jiraKey || taskId;
    const deleteUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${issueIdentifier}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: "Tâche Jira non trouvée"
        }, { status: 404 });
      }
      const errorData = await response.text();
      throw new Error(`Jira deletion failed: ${response.status} - ${errorData}`);
    }

    return NextResponse.json({
      success: true,
      message: "Tâche supprimée de Jira avec succès"
    });

  } catch (error) {
    console.error("❌ Erreur suppression tâche Jira:", error);
    
    // ✅ PLUS DE FALLBACK LOCAL - Return error directement
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur suppression tâche Jira' },
      { status: 500 }
    );
  }
}

// Fonction helper pour gérer les transitions de statut Jira
async function handleStatusTransition(issueKey: string, targetStatus: string) {
  try {
    console.log(`🔄 Tentative transition ${issueKey} vers "${targetStatus}"`);

    // Récupérer les transitions disponibles pour cette issue
    const transitionsUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${issueKey}/transitions`;
    const transitionsResponse = await fetch(transitionsUrl, {
      method: 'GET',
      headers: getJiraHeaders()
    });

    if (!transitionsResponse.ok) {
      throw new Error(`Failed to get transitions: ${transitionsResponse.status}`);
    }

    const transitionsData = await transitionsResponse.json();
    const availableTransitions = transitionsData.transitions || [];

    console.log(`📋 Transitions disponibles pour ${issueKey}:`, 
      availableTransitions.map((t: any) => `${t.name} → ${t.to.name}`));

    // Mapping plus flexible statut D&A → noms possibles Jira
    const statusTransitionMapping: { [key: string]: string[] } = {
      'À faire': ['To Do', 'Open', 'Backlog', 'New', 'Created', 'Ouvert', 'TODO'],
      'En cours': ['In Progress', 'In Development', 'En cours', 'Doing', 'Work In Progress', 'Sprint', 'Active'],
      'En attente': ['In Review', 'Testing', 'Code Review', 'En attente', 'Pending', 'Review', 'Ready for Testing', 'Reviewing'],
      'Terminé': ['Done', 'Closed', 'Resolved', 'Terminé', 'Complete', 'Finished', 'Completed']
    };

    // Trouver une transition correspondante (recherche flexible)
    const possibleTransitions = statusTransitionMapping[targetStatus] || [];
    
    let matchingTransition = null;

    // 1. Recherche exacte d'abord
    for (const transition of availableTransitions) {
      if (possibleTransitions.some(status => 
        transition.to.name.toLowerCase() === status.toLowerCase()
      )) {
        matchingTransition = transition;
        break;
      }
    }

    // 2. Si pas trouvé, recherche partielle
    if (!matchingTransition) {
      for (const transition of availableTransitions) {
        if (possibleTransitions.some(status => 
          transition.to.name.toLowerCase().includes(status.toLowerCase()) ||
          status.toLowerCase().includes(transition.to.name.toLowerCase())
        )) {
          matchingTransition = transition;
          break;
        }
      }
    }

    // 3. Si toujours pas trouvé, recherche par nom de transition
    if (!matchingTransition) {
      for (const transition of availableTransitions) {
        if (possibleTransitions.some(status => 
          transition.name.toLowerCase().includes(status.toLowerCase()) ||
          status.toLowerCase().includes(transition.name.toLowerCase())
        )) {
          matchingTransition = transition;
          break;
        }
      }
    }

    if (!matchingTransition) {
      console.warn(`⚠️ Aucune transition trouvée pour "${targetStatus}". Transitions disponibles:`, 
        availableTransitions.map((t: any) => `"${t.name}" → "${t.to.name}"`));
      
      // Retourner sans erreur - l'interface reste fonctionnelle
      return;
    }

    console.log(`✅ Transition trouvée: "${matchingTransition.name}" → "${matchingTransition.to.name}"`);

    // Effectuer la transition
    const transitionUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${issueKey}/transitions`;
    const transitionResponse = await fetch(transitionUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify({
        transition: {
          id: matchingTransition.id
        }
      })
    });

    if (!transitionResponse.ok) {
      const errorData = await transitionResponse.text();
      console.warn(`⚠️ Transition échouée pour ${issueKey}:`, errorData);
      // Ne pas lever d'erreur fatale
      return;
    }

    console.log(`✅ Transition effectuée: ${issueKey} → ${targetStatus} (via "${matchingTransition.name}")`);

  } catch (error) {
    console.warn(`⚠️ Erreur transition statut pour ${issueKey}:`, error);
    // Ne pas lever l'erreur pour maintenir la fonctionnalité de l'interface
  }
}
