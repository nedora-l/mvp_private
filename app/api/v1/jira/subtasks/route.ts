import { NextRequest, NextResponse } from 'next/server';

/**
 * Jira Subtasks API - v1 Architecture
 * Suit le pattern v1 établi avec config locale
 * ✅ NOUVEAU : API DYNAMIQUE avec vraies données Jira
 */

// ✅ NOUVEAU : Définition du type pour globalThis
declare global {
  var __TEST_SUBTASKS_DATA__: Record<string, any[]> | undefined;
}

// Configuration Jira - Pattern établi dans l'architecture v1
const JIRA_CONFIG = {
  domain: process.env.JIRA_DOMAIN || "abarouzabarouz.atlassian.net",
  email: process.env.JIRA_EMAIL || "abarouzabarouz@gmail.com",
  token: process.env.JIRA_API_TOKEN || "",
};

// ✅ NOUVEAU : Stockage en mémoire PERSISTANT pour le mode TEST
const TEST_SUBTASKS_STORAGE = new Map<string, any[]>();

// ✅ NOUVEAU : Fonction pour initialiser les données de test avec persistance
const initializeTestData = () => {
  // Vérifier si des données existent déjà en localStorage (simulation)
  const existingData = global.__TEST_SUBTASKS_DATA__;
  
  if (existingData) {
    // Restaurer les données existantes
    Object.entries(existingData).forEach(([key, value]) => {
      TEST_SUBTASKS_STORAGE.set(key, value as any[]);
    });
    console.log("✅ [v1] Données de test restaurées depuis la persistance");
    return;
  }

  // Données initiales par défaut
  // SSP-10
  TEST_SUBTASKS_STORAGE.set('SSP-10', [
    {
      id: 1,
      key: "SSP-11",
      summary: "Implémenter la logique métier",
      description: "Développer les algorithmes de calcul",
      status: {
        id: "10000",
        name: "To Do",
        category: "To Do"
      },
      assignee: {
        id: "user1",
        name: "Développeur 1",
        email: "dev1@example.com"
      },
      priority: {
        id: "3",
        name: "Medium",
        iconUrl: ""
      },
      issueType: {
        id: "10003",
        name: "Subtask",
        iconUrl: ""
      },
      parentIssueKey: "SSP-10",
      created: "2025-01-19T10:00:00.000Z",
      updated: "2025-01-19T10:00:00.000Z",
      dueDate: "2025-01-25T18:00:00.000Z",
      labels: ["backend", "logique"],
      components: ["API"],
      storyPoints: 3
    },
    {
      id: 2,
      key: "SSP-12",
      summary: "Tests unitaires",
      description: "Créer la suite de tests",
      status: {
        id: "10001",
        name: "In Progress",
        category: "In Progress"
      },
      assignee: {
        id: "user2",
        name: "Développeur 2",
        email: "dev2@example.com"
      },
      priority: {
        id: "2",
        name: "High",
        iconUrl: ""
      },
      issueType: {
        id: "10003",
        name: "Subtask",
        iconUrl: ""
      },
      parentIssueKey: "SSP-10",
      created: "2025-01-19T11:00:00.000Z",
      updated: "2025-01-19T11:00:00.000Z",
      dueDate: "2025-01-23T18:00:00.000Z",
      labels: ["tests", "qualité"],
      components: ["Tests"],
      storyPoints: 2
    }
  ]);

  // SSP-6
  TEST_SUBTASKS_STORAGE.set('SSP-6', [
    {
      id: 3,
      key: "SSP-13",
      summary: "Configuration de l'environnement",
      description: "Mise en place de l'environnement de développement",
      status: {
        id: "10000",
        name: "To Do",
        category: "To Do"
      },
      assignee: {
        id: "user3",
        name: "DevOps",
        email: "devops@example.com"
      },
      priority: {
        id: "3",
        name: "Medium",
        iconUrl: ""
      },
      issueType: {
        id: "10003",
        name: "Subtask",
        iconUrl: ""
      },
      parentIssueKey: "SSP-6",
      created: "2025-01-19T12:00:00.000Z",
      updated: "2025-01-19T12:00:00.000Z",
      dueDate: "2025-01-26T18:00:00.000Z",
      labels: ["devops", "configuration"],
      components: ["Infrastructure"],
      storyPoints: 1
    }
  ]);

  // ECS-1
  TEST_SUBTASKS_STORAGE.set('ECS-1', [
    {
      id: 4,
      key: "ECS-11",
      summary: "Analyse des besoins",
      description: "Étude des exigences fonctionnelles",
      status: {
        id: "10000",
        name: "To Do",
        category: "To Do"
      },
      assignee: {
        id: "user4",
        name: "Analyste",
        email: "analyste@example.com"
      },
      priority: {
        id: "2",
        name: "High",
        iconUrl: ""
      },
      issueType: {
        id: "10003",
        name: "Subtask",
        iconUrl: ""
      },
      parentIssueKey: "ECS-1",
      created: "2025-01-19T13:00:00.000Z",
      updated: "2025-01-19T13:00:00.000Z",
      dueDate: "2025-01-24T18:00:00.000Z",
      labels: ["analyse", "besoins"],
      components: ["Analyse"],
      storyPoints: 5
    },
    {
      id: 5,
      key: "ECS-12",
      summary: "Maquettes UI/UX",
      description: "Création des wireframes et prototypes",
      status: {
        id: "10001",
        name: "In Progress",
        category: "In Progress"
      },
      assignee: {
        id: "user5",
        name: "Designer",
        email: "designer@example.com"
      },
      priority: {
        id: "3",
        name: "Medium",
        iconUrl: ""
      },
      issueType: {
        id: "10003",
        name: "Subtask",
        iconUrl: ""
      },
      parentIssueKey: "ECS-1",
      created: "2025-01-19T14:00:00.000Z",
      updated: "2025-01-19T14:00:00.000Z",
      dueDate: "2025-01-27T18:00:00.000Z",
      labels: ["design", "ui-ux"],
      components: ["Interface"],
      storyPoints: 3
    }
  ]);

  // ECS-2
  TEST_SUBTASKS_STORAGE.set('ECS-2', [
    {
      id: 6,
      key: "ECS-21",
      summary: "Architecture technique",
      description: "Conception de l'architecture système",
      status: {
        id: "10000",
        name: "To Do",
        category: "To Do"
      },
      assignee: {
        id: "user6",
        name: "Architecte",
        email: "architecte@example.com"
      },
      priority: {
        id: "1",
        name: "Highest",
        iconUrl: ""
      },
      issueType: {
        id: "10003",
        name: "Subtask",
        iconUrl: ""
      },
      parentIssueKey: "ECS-2",
      created: "2025-01-19T15:00:00.000Z",
      updated: "2025-01-19T15:00:00.000Z",
      dueDate: "2025-01-22T18:00:00.000Z",
      labels: ["architecture", "technique"],
      components: ["Architecture"],
      storyPoints: 8
    },
    {
      id: 7,
      key: "ECS-22",
      summary: "Documentation technique",
      description: "Rédaction de la documentation technique",
      status: {
        id: "10001",
        name: "In Progress",
        category: "In Progress"
      },
      assignee: {
        id: "user7",
        name: "Documentaliste",
        email: "documentaliste@example.com"
      },
      priority: {
        id: "4",
        name: "Low",
        iconUrl: ""
      },
      issueType: {
        id: "10003",
        name: "Subtask",
        iconUrl: ""
      },
      parentIssueKey: "ECS-2",
      created: "2025-01-19T16:00:00.000Z",
      updated: "2025-01-19T16:00:00.000Z",
      dueDate: "2025-01-28T18:00:00.000Z",
      labels: ["documentation", "technique"],
      components: ["Documentation"],
      storyPoints: 2
    }
  ]);

  // ✅ NOUVEAU : Ajouter des données pour CAP (Capital Social)
  TEST_SUBTASKS_STORAGE.set('CAP-4', [
    {
      id: 8,
      key: "CAP-5",
      summary: "Sub 1",
      description: "Première subtask pour Capital Social",
      status: {
        id: "10000",
        name: "To Do",
        category: "To Do"
      },
      assignee: {
        id: "user8",
        name: "Utilisateur CAP",
        email: "cap@example.com"
      },
      priority: {
        id: "3",
        name: "Medium",
        iconUrl: ""
      },
      issueType: {
        id: "10003",
        name: "Subtask",
        iconUrl: ""
      },
      parentIssueKey: "CAP-4",
      created: "2025-01-19T17:00:00.000Z",
      updated: "2025-01-19T17:00:00.000Z",
      dueDate: "2025-01-29T18:00:00.000Z",
      labels: ["capital", "social"],
      components: ["Gestion"],
      storyPoints: 2
    },
    {
      id: 9,
      key: "CAP-6",
      summary: "Sub 2 test",
      description: "Deuxième subtask de test pour Capital Social",
      status: {
        id: "10001",
        name: "In Progress",
        category: "In Progress"
      },
      assignee: {
        id: "user9",
        name: "Testeur CAP",
        email: "test@example.com"
      },
      priority: {
        id: "2",
        name: "High",
        iconUrl: ""
      },
      issueType: {
        id: "10003",
        name: "Subtask",
        iconUrl: ""
      },
      parentIssueKey: "CAP-4",
      created: "2025-01-19T18:00:00.000Z",
      updated: "2025-01-19T18:00:00.000Z",
      dueDate: "2025-01-30T18:00:00.000Z",
      labels: ["test", "validation"],
      components: ["Tests"],
      storyPoints: 1
    }
  ]);

  console.log("✅ [v1] Données de test initialisées pour les subtasks");
};

// ✅ NOUVEAU : Fonction pour persister les données
const persistTestData = () => {
  try {
    const dataToPersist: Record<string, any[]> = {};
    TEST_SUBTASKS_STORAGE.forEach((value, key) => {
      dataToPersist[key] = value;
    });
    
    // Simuler la persistance (en production, ce serait une base de données)
    global.__TEST_SUBTASKS_DATA__ = dataToPersist;
    console.log("💾 [v1] Données de test persistées");
  } catch (error) {
    console.warn("⚠️ [v1] Impossible de persister les données de test:", error);
  }
};

// Initialiser les données de test au démarrage
initializeTestData();

// Headers pour authentification Jira
const getJiraHeaders = () => {
  const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.token}`).toString('base64');
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

/**
 * API v1 - Gestion des Subtasks Jira
 * ✅ NOUVEAU : API DYNAMIQUE avec vraies données Jira
 * GET    /api/v1/jira/subtasks          // Liste des subtasks d'une tâche parent
 * POST   /api/v1/jira/subtasks          // Création d'une subtask
 * PATCH  /api/v1/jira/subtasks/{id}     // Modification d'une subtask
 * DELETE /api/v1/jira/subtasks/{id}     // Suppression d'une subtask
 */

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 [v1] Récupération des subtasks...");
    console.log("🔍 [v1] URL:", request.url);
    
    const { searchParams } = new URL(request.url);
    const parentIssueKey = searchParams.get('parentIssueKey');
    
    console.log("🔍 [v1] Paramètres:", { parentIssueKey });

    if (!parentIssueKey) {
      console.error("❌ [v1] Clé de la tâche parent manquante");
      return NextResponse.json({ 
        status: 400,
        message: "Clé de la tâche parent requise",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // ✅ NOUVEAU : Vérifier d'abord si on a un token Jira valide
    if (JIRA_CONFIG.token && JIRA_CONFIG.token !== "") {
      console.log("🔍 [v1] Tentative de récupération depuis l'API Jira...");
      
      try {
        // Récupération des subtasks via l'API Jira
        const subtasksUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/search`;
        const jql = `parent = ${parentIssueKey} ORDER BY created DESC`;
        
        console.log("🔍 [v1] URL Jira:", subtasksUrl);
        console.log("🔍 [v1] JQL:", jql);

        const response = await fetch(subtasksUrl, {
          method: 'POST',
          headers: {
            ...getJiraHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            jql,
            startAt: 0,
            maxResults: 50,
            fields: [
              'summary', 'description', 'status', 'assignee', 'priority',
              'issuetype', 'created', 'updated', 'duedate', 'labels',
              'components', 'customfield_10016' // Story points
            ],
            expand: 'names,schema'
          })
        });

        console.log("🔍 [v1] Réponse Jira:", {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (response.ok) {
          const data = await response.json();
          console.log("🔍 [v1] Données Jira reçues:", {
            total: data.total,
            issuesCount: data.issues?.length || 0
          });
          
          // Mapping des données Jira vers le format DA Workspace
          const subtasks = data.issues.map((issue: any) => ({
            id: issue.id,
            key: issue.key,
            summary: issue.fields.summary,
            description: issue.fields.description,
            status: {
              id: issue.fields.status.id,
              name: issue.fields.status.name,
              category: issue.fields.status.statusCategory?.name
            },
            assignee: issue.fields.assignee ? {
              id: issue.fields.assignee.accountId,
              name: issue.fields.assignee.displayName,
              email: issue.fields.assignee.emailAddress
            } : null,
            priority: issue.fields.priority ? {
              id: issue.fields.priority.id,
              name: issue.fields.priority.name,
              iconUrl: issue.fields.priority.iconUrl
            } : null,
            issueType: {
              id: issue.fields.issuetype.id,
              name: issue.fields.issuetype.name,
              iconUrl: issue.fields.issuetype.iconUrl
            },
            parentIssueKey,
            created: issue.fields.created,
            updated: issue.fields.updated,
            dueDate: issue.fields.duedate,
            labels: issue.fields.labels || [],
            components: issue.fields.components || [],
            storyPoints: issue.fields.customfield_10016
          }));

          console.log(`✅ [v1] ${subtasks.length} subtasks récupérées depuis Jira pour ${parentIssueKey}`);

          // ✅ NOUVEAU : Synchroniser avec le stockage local pour la cohérence
          TEST_SUBTASKS_STORAGE.set(parentIssueKey, subtasks);
          persistTestData();

          return NextResponse.json({
            status: 200,
            message: `${subtasks.length} subtasks récupérées avec succès depuis Jira`,
            data: {
              _embedded: {
                subtasks
              },
              _links: {
                self: { href: `/api/v1/jira/subtasks?parentIssueKey=${parentIssueKey}` },
                parent: { href: `/api/v1/jira/tasks/${parentIssueKey}` }
              },
              page: {
                size: 50,
                totalElements: data.total,
                totalPages: Math.ceil(data.total / 50),
                number: 0
              }
            },
            type: "SUBTASKS_RETRIEVED",
            source: 'subtasks-jira'
          });
        } else {
          console.warn("⚠️ [v1] API Jira non disponible, fallback vers le mode TEST");
        }
      } catch (jiraError) {
        console.warn("⚠️ [v1] Erreur API Jira, fallback vers le mode TEST:", jiraError);
      }
    }

    // ✅ NOUVEAU : Mode TEST amélioré avec persistance
    console.log("🔍 [v1] Mode TEST - Données depuis le stockage en mémoire");
    
    const mockSubtasks = TEST_SUBTASKS_STORAGE.get(parentIssueKey) || [];

    console.log(`✅ [v1] Mode TEST - ${mockSubtasks.length} subtasks récupérées pour ${parentIssueKey}`);

    return NextResponse.json({
      status: 200,
      message: `${mockSubtasks.length} subtasks récupérées avec succès (MODE TEST)`,
      data: {
        _embedded: {
          subtasks: mockSubtasks
        },
        _links: {
          self: { href: `/api/v1/jira/subtasks?parentIssueKey=${parentIssueKey}` },
          parent: { href: `/api/v1/jira/tasks/${parentIssueKey}` }
        },
        page: {
          size: 50,
          totalElements: mockSubtasks.length,
          totalPages: 1,
          number: 0
        }
      },
      type: "SUBTASKS_RETRIEVED",
      source: 'subtasks-test'
    });

  } catch (error) {
    console.error("❌ [v1] Erreur lors de la récupération des subtasks:", error);
    console.error("❌ [v1] Stack trace:", error instanceof Error ? error.stack : 'Pas de stack trace');
    
    return NextResponse.json({
      status: 500,
      message: "Erreur lors de la récupération des subtasks",
      data: null,
      type: "ERROR",
      source: 'subtasks-error',
      error: error instanceof Error ? error.message : "Erreur inconnue",
      details: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("➕ [v1] Création d'une subtask...");
    
    const body = await request.json();
    const { 
      parentIssueKey, 
      summary, 
      description, 
      assignee, 
      priority, 
      labels, 
      components,
      storyPoints,
      dueDate 
    } = body;

    // Validation des données
    if (!parentIssueKey || !summary) {
      return NextResponse.json({ 
        status: 400,
        message: "Clé de la tâche parent et résumé requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // ✅ NOUVEAU : Vérifier d'abord si on a un token Jira valide
    if (JIRA_CONFIG.token && JIRA_CONFIG.token !== "") {
      console.log("🔍 [v1] Tentative de création via l'API Jira...");
      
      try {
        // Vérification que la tâche parent existe
        const parentIssueUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${parentIssueKey}`;
        const parentResponse = await fetch(parentIssueUrl, {
          method: 'GET',
          headers: getJiraHeaders()
        });

        if (!parentResponse.ok) {
          return NextResponse.json({ 
            status: 404,
            message: "Tâche parent introuvable",
            data: null,
            type: "ERROR",
            source: 'validation-error'
          }, { status: 404 });
        }

        // Création de la subtask
        const createUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue`;
        
        const subtaskData: any = {
          project: { key: parentIssueKey.split('-')[0] }, // Extraire la clé du projet
          summary,
          issuetype: { id: '10007' }, // ✅ CORRIGÉ : Utiliser l'ID correct pour "Sub-task"
          parent: { key: parentIssueKey }
        };

        // Ajout des champs optionnels
        if (description) {
          subtaskData.description = {
            version: 1,
            type: "doc",
            content: [{
              type: "paragraph",
              content: [{
                type: "text",
                text: description
              }]
            }]
          };
        }

        if (assignee) {
          subtaskData.assignee = { accountId: assignee };
        }

        if (priority) {
          subtaskData.priority = { id: priority };
        }

        if (labels && labels.length > 0) {
          subtaskData.labels = labels;
        }

        // ✅ CORRIGÉ : Ne pas envoyer components s'il est vide ou undefined
        if (components && Array.isArray(components) && components.length > 0) {
          // Vérifier que chaque composant a un ID valide
          const validComponents = components.filter((comp: any) => comp && comp.id);
          if (validComponents.length > 0) {
            subtaskData.components = validComponents.map((comp: any) => ({ id: comp.id }));
          }
        }

        if (storyPoints) {
          subtaskData.customfield_10016 = storyPoints;
        }

        if (dueDate) {
          subtaskData.duedate = dueDate;
        }

        // 🔧 DEBUG : Logs détaillés pour diagnostiquer l'erreur 400
        console.log("🔍 [v1] URL de création Jira:", createUrl);
        console.log("🔍 [v1] Headers envoyés:", getJiraHeaders());
        console.log("🔍 [v1] Données envoyées à Jira:", JSON.stringify({ fields: subtaskData }, null, 2));
        
        const createResponse = await fetch(createUrl, {
          method: 'POST',
          headers: {
            ...getJiraHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fields: subtaskData })
        });

        if (createResponse.ok) {
          const newSubtask = await createResponse.json();
          
          console.log(`✅ [v1] Subtask ${newSubtask.key} créée avec succès via Jira`);
          
          // ✅ NOUVEAU : Synchroniser avec le stockage local
          const currentSubtasks = TEST_SUBTASKS_STORAGE.get(parentIssueKey) || [];
          const jiraSubtask = {
            id: newSubtask.id,
            key: newSubtask.key,
            summary,
            description: description || "",
            status: {
              id: "10000",
              name: "To Do",
              category: "To Do"
            },
            assignee: assignee ? {
              id: assignee,
              name: `Utilisateur ${assignee}`,
              email: `user${assignee}@example.com`
            } : null,
            priority: priority ? {
              id: priority,
              name: priority === "1" ? "Highest" : priority === "2" ? "High" : priority === "3" ? "Medium" : priority === "4" ? "Low" : "Lowest",
              iconUrl: ""
            } : null,
            issueType: {
              id: "10003",
              name: "Subtask",
              iconUrl: ""
            },
            parentIssueKey,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            dueDate: dueDate || null,
            labels: labels || [],
            components: components || [],
            storyPoints: storyPoints || null
          };
          
          currentSubtasks.push(jiraSubtask);
          TEST_SUBTASKS_STORAGE.set(parentIssueKey, currentSubtasks);
          persistTestData();

          return NextResponse.json({
            status: 201,
            message: "Subtask créée avec succès via Jira",
            data: {
              id: jiraSubtask.id,
              key: jiraSubtask.key,
              summary: jiraSubtask.summary,
              parentIssueKey: jiraSubtask.parentIssueKey,
              created: jiraSubtask.created
            },
            type: "SUBTASK_CREATED",
            source: 'subtasks-jira'
          }, { status: 201 });
        } else {
          const errorText = await createResponse.text();
          console.error(`❌ [v1] Erreur création subtask Jira: ${createResponse.status} - ${errorText}`);
          console.error(`🔍 [v1] Headers de réponse:`, createResponse.headers);
          console.error(`🔍 [v1] URL qui a échoué:`, createUrl);
          throw new Error(`Erreur création subtask Jira: ${createResponse.status}`);
        }
      } catch (jiraError) {
        console.warn("⚠️ [v1] Erreur API Jira, fallback vers le mode TEST:", jiraError);
      }
    }

    // ✅ NOUVEAU : Mode TEST amélioré avec persistance
    console.log("🔍 [v1] Mode TEST - Création de subtask mockée");
    
    // Générer une clé unique pour la subtask
    const timestamp = Date.now();
    const newSubtaskKey = `${parentIssueKey.split('-')[0]}-${timestamp}`;
    
    const mockSubtask = {
      id: timestamp,
      key: newSubtaskKey,
      summary,
      description: description || "Description de test",
      status: {
        id: "10000",
        name: "To Do",
        category: "To Do"
      },
      assignee: assignee ? {
        id: assignee,
        name: `Utilisateur ${assignee}`,
        email: `user${assignee}@example.com`
      } : null,
      priority: priority ? {
        id: priority,
        name: priority === "1" ? "Highest" : priority === "2" ? "High" : priority === "3" ? "Medium" : priority === "4" ? "Low" : "Lowest",
        iconUrl: ""
      } : null,
      issueType: {
        id: "10003",
        name: "Subtask",
        iconUrl: ""
      },
      parentIssueKey,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      dueDate: dueDate || null,
      labels: labels || [],
      components: components || [],
      storyPoints: storyPoints || null
    };

    // Ajouter la subtask au stockage en mémoire avec persistance
    const currentSubtasks = TEST_SUBTASKS_STORAGE.get(parentIssueKey) || [];
    currentSubtasks.push(mockSubtask);
    TEST_SUBTASKS_STORAGE.set(parentIssueKey, currentSubtasks);
    
    // ✅ NOUVEAU : Persister les données
    persistTestData();

    console.log(`✅ [v1] Mode TEST - Subtask ${newSubtaskKey} créée avec succès`);

    return NextResponse.json({
      status: 201,
      message: "Subtask créée avec succès (MODE TEST)",
      data: {
        id: mockSubtask.id,
        key: mockSubtask.key,
        summary: mockSubtask.summary,
        parentIssueKey: mockSubtask.parentIssueKey,
        created: mockSubtask.created
      },
      type: "SUBTASK_CREATED",
      source: 'subtasks-test'
    }, { status: 201 });

  } catch (error) {
    console.error("❌ [v1] Erreur lors de la création de la subtask:", error);
    
    return NextResponse.json({
      status: 500,
      message: "Erreur lors de la création de la subtask",
      data: null,
      type: "ERROR",
      source: 'subtasks-error',
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log("✏️ [v1] Modification d'une subtask...");
    
    const body = await request.json();
    const { 
      issueKey, 
      summary, 
      description, 
      assignee, 
      priority, 
      labels, 
      components,
      storyPoints,
      dueDate 
    } = body;

    if (!issueKey) {
      return NextResponse.json({ 
        status: 400,
        message: "Clé de la subtask requise",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // ✅ NOUVEAU : Vérifier d'abord si on a un token Jira valide
    if (JIRA_CONFIG.token && JIRA_CONFIG.token !== "") {
      console.log("🔍 [v1] Tentative de modification via l'API Jira...");
      
      try {
        // Préparation des champs à mettre à jour
        const fields: any = {};
        
        if (summary !== undefined) fields.summary = summary;
        if (description !== undefined) {
          fields.description = {
            version: 1,
            type: "doc",
            content: [{
              type: "paragraph",
              content: [{
                type: "text",
                text: description
              }]
            }]
          };
        }
        if (assignee !== undefined) fields.assignee = assignee ? { accountId: assignee } : null;
        if (priority !== undefined) fields.priority = { id: priority };
        if (labels !== undefined) fields.labels = labels;
        if (components !== undefined) fields.components = components.map((comp: any) => ({ id: comp.id }));
        if (storyPoints !== undefined) fields.customfield_10016 = storyPoints;
        if (dueDate !== undefined) fields.duedate = dueDate;

        // Mise à jour de la subtask
        const updateUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${issueKey}`;
        
        const updateResponse = await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            ...getJiraHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fields })
        });

        if (updateResponse.ok) {
          console.log(`✅ [v1] Subtask ${issueKey} modifiée avec succès via Jira`);
          
          // ✅ NOUVEAU : Synchroniser avec le stockage local
          const parentIssueKey = issueKey.split('-')[0]; // Extrait la clé du projet
          const currentSubtasks = TEST_SUBTASKS_STORAGE.get(parentIssueKey) || [];
          const index = currentSubtasks.findIndex((subtask: any) => subtask.key === issueKey);

          if (index !== -1) {
            const updatedSubtask = {
              ...currentSubtasks[index],
              summary: summary || currentSubtasks[index].summary,
              description: description || currentSubtasks[index].description,
              assignee: assignee ? {
                id: assignee,
                name: `Utilisateur ${assignee}`,
                email: `user${assignee}@example.com`
              } : currentSubtasks[index].assignee,
              priority: priority ? {
                id: priority,
                name: priority === "1" ? "Highest" : priority === "2" ? "High" : priority === "3" ? "Medium" : priority === "4" ? "Low" : "Lowest",
                iconUrl: ""
              } : currentSubtasks[index].priority,
              labels: labels || currentSubtasks[index].labels,
              components: components || currentSubtasks[index].components,
              storyPoints: storyPoints || currentSubtasks[index].storyPoints,
              dueDate: dueDate || currentSubtasks[index].dueDate,
              updated: new Date().toISOString()
            };
            
            currentSubtasks[index] = updatedSubtask;
            TEST_SUBTASKS_STORAGE.set(parentIssueKey, currentSubtasks);
            persistTestData();
          }

          return NextResponse.json({
            status: 200,
            message: "Subtask modifiée avec succès via Jira",
            data: {
              key: issueKey,
              updated: new Date().toISOString()
            },
            type: "SUBTASK_UPDATED",
            source: 'subtasks-jira'
          });
        } else {
          const errorText = await updateResponse.text();
          console.error(`❌ [v1] Erreur modification subtask Jira: ${updateResponse.status} - ${errorText}`);
          throw new Error(`Erreur modification subtask Jira: ${updateResponse.status}`);
        }
      } catch (jiraError) {
        console.warn("⚠️ [v1] Erreur API Jira, fallback vers le mode TEST:", jiraError);
      }
    }

    // ✅ NOUVEAU : Mode TEST amélioré avec persistance
    console.log("🔍 [v1] Mode TEST - Modification de subtask mockée");
    
    const mockUpdatedSubtask = {
      key: issueKey,
      summary: summary || "Résumé mis à jour",
      description: description || "Description mise à jour",
      assignee: assignee ? {
        id: assignee,
        name: `Utilisateur ${assignee}`,
        email: `user${assignee}@example.com`
      } : null,
      priority: priority ? {
        id: priority,
        name: priority === "1" ? "Highest" : priority === "2" ? "High" : priority === "3" ? "Medium" : priority === "4" ? "Low" : "Lowest",
        iconUrl: ""
      } : null,
      labels: labels || [],
      components: components || [],
      storyPoints: storyPoints || null,
      dueDate: dueDate || null,
      updated: new Date().toISOString()
    };

    // Mettre à jour la subtask dans le stockage en mémoire avec persistance
    const parentIssueKey = issueKey.split('-')[0]; // Extrait la clé du projet
    const currentSubtasks = TEST_SUBTASKS_STORAGE.get(parentIssueKey) || [];
    const index = currentSubtasks.findIndex((subtask: any) => subtask.key === issueKey);

    if (index !== -1) {
      currentSubtasks[index] = { ...currentSubtasks[index], ...mockUpdatedSubtask };
      TEST_SUBTASKS_STORAGE.set(parentIssueKey, currentSubtasks);
      
      // ✅ NOUVEAU : Persister les données
      persistTestData();
    }

    console.log(`✅ [v1] Mode TEST - Subtask ${issueKey} modifiée avec succès`);

    return NextResponse.json({
      status: 200,
      message: "Subtask modifiée avec succès (MODE TEST)",
      data: {
        key: mockUpdatedSubtask.key,
        updated: mockUpdatedSubtask.updated
      },
      type: "SUBTASK_UPDATED",
      source: 'subtasks-test'
    });

  } catch (error) {
    console.error("❌ [v1] Erreur lors de la modification de la subtask:", error);
    
    return NextResponse.json({
      status: 500,
      message: "Erreur lors de la modification de la subtask",
      data: null,
      type: "ERROR",
      source: 'subtasks-error',
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ [v1] Suppression d'une subtask...");
    
    const { searchParams } = new URL(request.url);
    const issueKey = searchParams.get('issueKey');

    if (!issueKey) {
      return NextResponse.json({ 
        status: 400,
        message: "Clé de la subtask requise",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // ✅ NOUVEAU : Vérifier d'abord si on a un token Jira valide
    if (JIRA_CONFIG.token && JIRA_CONFIG.token !== "") {
      console.log("🔍 [v1] Tentative de suppression via l'API Jira...");
      
      try {
        // Suppression de la subtask via transitions Jira (plus sûr que DELETE direct)
        const transitionsUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${issueKey}/transitions`;
        const transitionsResponse = await fetch(transitionsUrl, {
          method: 'GET',
          headers: getJiraHeaders()
        });

        if (transitionsResponse.ok) {
          const transitions = await transitionsResponse.json();
          
          // Recherche d'une transition de fermeture
          const closeTransition = transitions.transitions?.find((t: any) => 
            t.name.toLowerCase().includes('close') || 
            t.name.toLowerCase().includes('resolve') || 
            t.name.toLowerCase().includes('done') ||
            t.name.toLowerCase().includes('complete')
          );

          if (closeTransition) {
            // Exécution de la transition de fermeture
            const transitionResponse = await fetch(transitionsUrl, {
              method: 'POST',
              headers: {
                ...getJiraHeaders(),
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                transition: { id: closeTransition.id }
              })
            });

            if (transitionResponse.ok) {
              console.log(`✅ [v1] Subtask ${issueKey} fermée via transition avec succès`);
              
              // ✅ NOUVEAU : Synchroniser avec le stockage local
              const parentIssueKey = issueKey.split('-')[0]; // Extrait la clé du projet
              const currentSubtasks = TEST_SUBTASKS_STORAGE.get(parentIssueKey) || [];
              const updatedSubtasks = currentSubtasks.filter((subtask: any) => subtask.key !== issueKey);
              TEST_SUBTASKS_STORAGE.set(parentIssueKey, updatedSubtasks);
              persistTestData();
              
              return NextResponse.json({
                status: 200,
                message: "Subtask fermée avec succès via Jira",
                data: {
                  key: issueKey,
                  closed: new Date().toISOString(),
                  method: 'transition'
                },
                type: "SUBTASK_CLOSED",
                source: 'subtasks-jira'
              });
            }
          }
        }

        // Fallback : suppression directe si aucune transition n'est disponible
        const deleteUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/issue/${issueKey}`;
        const deleteResponse = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: getJiraHeaders()
        });

        if (deleteResponse.ok) {
          console.log(`✅ [v1] Subtask ${issueKey} supprimée directement avec succès`);
          
          // ✅ NOUVEAU : Synchroniser avec le stockage local
          const parentIssueKey = issueKey.split('-')[0]; // Extrait la clé du projet
          const currentSubtasks = TEST_SUBTASKS_STORAGE.get(parentIssueKey) || [];
          const updatedSubtasks = currentSubtasks.filter((subtask: any) => subtask.key !== issueKey);
          TEST_SUBTASKS_STORAGE.set(parentIssueKey, updatedSubtasks);
          persistTestData();
          
          return NextResponse.json({
            status: 200,
            message: "Subtask supprimée avec succès via Jira",
            data: {
              key: issueKey,
              deleted: new Date().toISOString(),
              method: 'direct'
            },
            type: "SUBTASK_DELETED",
            source: 'subtasks-jira'
          });
        }

        const errorText = await deleteResponse.text();
        throw new Error(`Erreur suppression subtask Jira: ${deleteResponse.status} - ${errorText}`);
      } catch (jiraError) {
        console.warn("⚠️ [v1] Erreur API Jira, fallback vers le mode TEST:", jiraError);
      }
    }

    // ✅ NOUVEAU : Mode TEST amélioré avec persistance
    console.log("🔍 [v1] Mode TEST - Suppression de subtask mockée");
    
    const parentIssueKey = issueKey.split('-')[0]; // Extrait la clé du projet
    const currentSubtasks = TEST_SUBTASKS_STORAGE.get(parentIssueKey) || [];
    const initialLength = currentSubtasks.length;

    TEST_SUBTASKS_STORAGE.set(parentIssueKey, currentSubtasks.filter((subtask: any) => subtask.key !== issueKey));

    if (currentSubtasks.length < initialLength) {
      // ✅ NOUVEAU : Persister les données
      persistTestData();
      
      console.log(`✅ [v1] Mode TEST - Subtask ${issueKey} supprimée avec succès`);
      return NextResponse.json({
        status: 200,
        message: "Subtask supprimée avec succès (MODE TEST)",
        data: {
          key: issueKey,
          deleted: new Date().toISOString(),
          method: 'test-mode'
        },
        type: "SUBTASK_DELETED",
        source: 'subtasks-test'
      });
    } else {
      console.warn(`❌ [v1] Mode TEST - Subtask ${issueKey} non trouvée pour suppression`);
      return NextResponse.json({
        status: 404,
        message: "Subtask introuvable pour suppression (MODE TEST)",
        data: null,
        type: "ERROR",
        source: 'subtasks-test'
      }, { status: 404 });
    }

  } catch (error) {
    console.error("❌ [v1] Erreur lors de la suppression de la subtask:", error);
    
    return NextResponse.json({
      status: 500,
      message: "Erreur lors de la suppression de la subtask",
      data: null,
      type: "ERROR",
      source: 'subtasks-error',
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
