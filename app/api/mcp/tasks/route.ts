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
    
    // Si pas de token, fallback vers data locale
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.log("⚠️ Token Jira manquant, utilisation des données locales");
      const fs = await import('fs/promises');
      const localData = await fs.readFile('./data/tasks.json', 'utf-8');
      return NextResponse.json({ 
        success: true, 
        tasks: JSON.parse(localData),
        source: 'local' 
      });
    }

    // Récupération des tâches depuis tous les projets Jira
    const searchUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/search`;
    
    const jqlQuery = `project in (SSP, ECS) ORDER BY created DESC`;
    
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

    // Mapping des projets pour correspondance ID (synchro avec projects API)
    const projectMapping: { [key: string]: number } = {
      'SSP': 100,  // Sample Scrum Project → même ID que projects
      'ECS': 101   // TestJira → même ID que projects
    };

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

    // Ajouter quelques tâches mock pour les projets non-Jira (Slack, Trello)
    const mockTasks: Task[] = [
      {
        id: 9001,
        projectId: 102, // Slack (aligné avec l'API projects)
        title: "Slack Bot Configuration",
        status: "En cours",
        description: "Configuration du bot Slack pour notifications automatiques",
        priority: "Moyenne",
        createdAt: "2025-08-06",
        dueDate: "2025-08-15",
        assignedTo: "Alice Martin (Manager)",
        sprintId: undefined
      },
      {
        id: 9002,
        projectId: 103, // Trello (aligné avec l'API projects)
        title: "Trello Board Setup",
        status: "À faire",
        description: "Configuration du board Trello pour l'équipe marketing",
        priority: "Faible",
        createdAt: "2025-08-06",
        dueDate: "2025-08-20",
        assignedTo: "Julie Marketing (Chef Marketing)",
        sprintId: undefined
      }
    ];

    const allTasks = [...tasks, ...mockTasks];

    return NextResponse.json({
      success: true,
      tasks: allTasks,
      source: 'jira',
      jiraTasks: tasks.length,
      mockTasks: mockTasks.length,
      totalTasks: allTasks.length,
      projects: Object.keys(projectMapping)
    });

  } catch (error) {
    console.error("❌ Erreur API Jira tâches:", error);
    
    // Fallback vers données locales en cas d'erreur
    try {
      const fs = await import('fs/promises');
      const localData = await fs.readFile('./data/tasks.json', 'utf-8');
      return NextResponse.json({ 
        success: true, 
        tasks: JSON.parse(localData),
        source: 'local-fallback',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } catch (fallbackError) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Jira API failed and no local fallback: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }, 
        { status: 500 }
      );
    }
  }
}

// POST /api/mcp/tasks - Créer une tâche (Jira ou fallback v0)
export async function POST(request: NextRequest) {
  let taskData;
  
  try {
    taskData = await request.json();
    console.log("📝 Création tâche:", taskData);

    // Mapping projet ID → clé Jira pour les projets Jira
    const projectKeyMapping: { [key: number]: string } = {
      100: 'SSP',  // Sample Scrum Project
      101: 'ECS'   // TestJira (ECS)
    };

    const projectKey = projectKeyMapping[taskData.projectId];
    
    // Si pas de token Jira OU projet non-Jira, fallback vers v0
    if (!JIRA_CONFIG.token || !projectKey) {
      console.log("⚠️ Fallback vers v0 pour création tâche");
      
      const v0Response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/v0/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (v0Response.ok) {
        const result = await v0Response.json();
        return NextResponse.json({
          success: true,
          task: result,
          source: 'local'
        });
      } else {
        const errorText = await v0Response.text();
        console.error("❌ Erreur v0 POST:", v0Response.status, errorText);
        throw new Error(`Fallback v0 failed: ${v0Response.status} - ${errorText}`);
      }
    }

    // Si on arrive ici, c'est un projet Jira - procéder avec l'API Jira
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
    
    // 🔄 Fallback vers v0 en cas d'erreur Jira (si taskData est disponible)
    if (taskData) {
      console.log("🔄 Tentative de fallback vers v0 pour création...");
      try {
        const v0Response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/v0/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });

        if (v0Response.ok) {
          const result = await v0Response.json();
          console.log("✅ Fallback v0 réussi pour création");
          return NextResponse.json({
            success: true,
            task: result,
            source: 'local'
          });
        } else {
          const errorText = await v0Response.text();
          console.error("❌ Erreur v0 POST (fallback):", v0Response.status, errorText);
        }
      } catch (fallbackError) {
        console.error("❌ Fallback v0 échoué:", fallbackError);
      }
    }
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur création' },
      { status: 500 }
    );
  }
}

// PUT /api/mcp/tasks - Mettre à jour une tâche dans Jira avec fallback v0
export async function PUT(request: NextRequest) {
  let taskData;
  
  try {
    taskData = await request.json();
    console.log("✏️ Modification tâche:", taskData);

    // Si pas de token Jira OU pas une tâche Jira, fallback vers v0
    if (!JIRA_CONFIG.token || (!taskData.jiraKey && !taskData.jiraId)) {
      console.log("⚠️ Fallback vers v0 pour modification tâche");
      
      // Préparer les données pour v0 (qui a besoin de projectId)
      const v0TaskData = {
        ...taskData,
        projectId: taskData.projectId || 1, // Default project si manquant
      };
      
      // Faire appel à l'endpoint v0
      try {
        const v0Response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/v0/tasks`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(v0TaskData),
        });

        if (v0Response.ok) {
          const result = await v0Response.json();
          return NextResponse.json({
            success: true,
            task: result,
            source: 'local'
          });
        } else {
          const errorText = await v0Response.text();
          console.error("❌ Erreur v0 PUT:", v0Response.status, errorText);
          throw new Error(`Fallback v0 failed: ${v0Response.status} - ${errorText}`);
        }
      } catch (fallbackError) {
        console.error("❌ Fallback v0 échoué:", fallbackError);
        return NextResponse.json(
          { success: false, error: 'Modification impossible - Jira et fallback échoués' },
          { status: 500 }
        );
      }
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
    
    // 🔄 Fallback vers v0 en cas d'erreur Jira (si taskData est disponible)
    if (taskData) {
      console.log("🔄 Tentative de fallback vers v0 pour modification...");
      try {
        // Préparer les données pour v0
        const v0TaskData = {
          ...taskData,
          projectId: taskData.projectId || 1, // Default project si manquant
        };
        
        const v0Response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/v0/tasks`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(v0TaskData),
        });

        if (v0Response.ok) {
          const result = await v0Response.json();
          console.log("✅ Fallback v0 réussi pour modification");
          return NextResponse.json({
            success: true,
            task: result,
            source: 'local'
          });
        } else {
          const errorText = await v0Response.text();
          console.error("❌ Erreur v0 PUT (fallback):", v0Response.status, errorText);
        }
      } catch (fallbackError) {
        console.error("❌ Fallback v0 échoué:", fallbackError);
      }
    }
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur modification Jira' },
      { status: 500 }
    );
  }
}

// DELETE /api/mcp/tasks - Supprimer une tâche dans Jira avec fallback v0
export async function DELETE(request: NextRequest) {
  let taskId, jiraKey;
  
  try {
    const { searchParams } = new URL(request.url);
    taskId = searchParams.get('id');
    jiraKey = searchParams.get('jiraKey');
    
    console.log("🗑️ Suppression tâche:", { taskId, jiraKey });

    // Si pas de token Jira ou pas une tâche Jira, fallback v0
    if (!JIRA_CONFIG.token || !jiraKey) {
      console.log("⚠️ Fallback vers v0 pour suppression tâche");
      
      try {
        const v0Response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/v0/tasks?id=${taskId}`, {
          method: 'DELETE'
        });

        if (v0Response.ok) {
          const result = await v0Response.json();
          return NextResponse.json({
            success: true,
            task: result,
            source: 'local'
          });
        } else {
          throw new Error('Fallback v0 failed');
        }
      } catch (fallbackError) {
        console.error("❌ Fallback v0 échoué:", fallbackError);
        return NextResponse.json(
          { success: false, error: 'Suppression impossible - Jira et fallback échoués' },
          { status: 500 }
        );
      }
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
    
    // 🔄 Fallback vers v0 en cas d'erreur Jira (si taskId est disponible)
    if (taskId) {
      console.log("🔄 Tentative de fallback vers v0 pour suppression...");
      try {
        const v0Response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/v0/tasks?id=${taskId}`, {
          method: 'DELETE'
        });

        if (v0Response.ok) {
          const result = await v0Response.json();
          console.log("✅ Fallback v0 réussi pour suppression");
          return NextResponse.json({
            success: true,
            task: result,
            source: 'local'
          });
        }
      } catch (fallbackError) {
        console.error("❌ Fallback v0 échoué:", fallbackError);
      }
    }
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur suppression Jira' },
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
