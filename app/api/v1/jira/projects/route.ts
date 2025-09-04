import { type NextRequest, NextResponse } from "next/server"

/**
 * Jira Projects API - v1 Architecture
 * Remplacera progressivement /api/mcp/projects
 * Suit le pattern v1 avec HATEOAS et pagination
 */

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

// Mapping type Jira → boardType D&A
const mapJiraProjectType = (projectTypeKey: string): string => {
  switch (projectTypeKey) {
    case 'software': return 'Scrum';
    case 'business': return 'Kanban';
    case 'service_desk': return 'Support';
    default: return 'Kanban';
  }
};

// Interface pour la réponse v1
interface JiraProjectResponse {
  status: number;
  message: string;
  data: any;
  type: string;
  source: string;
}

// GET /api/v1/jira/projects - Récupère les projets Jira
export async function GET(request: NextRequest) {
  try {
    console.log("🔗 [v1] Connexion à Jira pour récupérer les projets...");
    
    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ [v1] Token Jira manquant - Configuration requise");
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré. Veuillez vérifier vos paramètres d'environnement.",
        solution: "Assurez-vous que JIRA_API_TOKEN est défini dans votre fichier .env.",
        error: "Token Jira non configuré",
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    // Récupération des projets Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/project`;
    
    const response = await fetch(jiraUrl, {
      method: 'GET',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      throw new Error(`Jira API Error: ${response.status} ${response.statusText}`);
    }

    const jiraProjects = await response.json();
    console.log(`✅ [v1] ${jiraProjects.length} projets récupérés depuis Jira`);

    // Conversion vers format D&A Workspace avec structure v1
    const projects = jiraProjects.map((project: any, index: number) => {
      const boardType = mapJiraProjectType(project.projectTypeKey);
      return {
        id: index + 100, // 🔧 FIX: Restaurer les IDs numériques séquentiels pour le mapping des tâches
        title: project.name, // Utilise 'title' comme dans v1
        description: `Projet Jira ${project.projectTypeKey}`,
        startsAt: new Date().toISOString().split('T')[0],
        endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +3 mois
        isActive: true,
        isArchived: false,
        externalSource: "Jira",
        externalId: project.key,
        boardType: boardType,
        jiraKey: project.key,
        jiraId: project.id,
        _links: {
          self: { href: `/api/v1/jira/projects/${project.key}` }
        }
      };
    });

    const responseData: JiraProjectResponse = {
      status: 200,
      message: "Projets Jira récupérés avec succès",
      data: {
        _embedded: { projects },
        _links: {
          self: { href: "/api/v1/jira/projects" }
        },
        page: {
          size: projects.length,
          totalElements: projects.length,
          totalPages: 1,
          number: 0
        }
      },
      type: "HATEOAS_RECORD_LIST",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error fetching projects from Jira:", error);
    
    // Analyser le type d'erreur pour fournir un message approprié
    let errorMessage = "Erreur lors de la récupération des projets Jira";
    let solution = "Vérifiez votre connexion internet et la configuration Jira";
    
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorMessage = "Authentification Jira échouée";
        solution = "Vérifiez votre email et token Jira dans les paramètres d'environnement";
      } else if (error.message.includes('403')) {
        errorMessage = "Accès refusé aux projets Jira";
        solution = "Vérifiez que votre compte Jira a les permissions nécessaires";
      } else if (error.message.includes('404')) {
        errorMessage = "Instance Jira non trouvée";
        solution = "Vérifiez que l'URL Jira est correcte dans vos paramètres";
      } else if (error.message.includes('timeout')) {
        errorMessage = "Connexion à Jira trop lente";
        solution = "Vérifiez votre connexion internet et réessayez";
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

// POST /api/v1/jira/projects - Crée un nouveau projet Jira
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 [v1] Création de projet Jira via v1 API...");
    
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
    
    // Validation des champs requis
    if (!body.title) {
      return NextResponse.json({ 
        status: 400,
        message: "Le titre du projet est requis pour la création",
        solution: "Veuillez fournir un titre de projet valide",
        error: "Titre de projet manquant",
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // 🔧 FIX: Récupérer l'AccountId dynamiquement
    const userResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/api/3/myself`, {
      method: 'GET',
      headers: getJiraHeaders()
    });
    
    if (!userResponse.ok) {
      throw new Error(`Impossible de récupérer l'utilisateur Jira: ${userResponse.status}`);
    }
    
    const currentUser = await userResponse.json();
    console.log(`👤 [v1] Utilisateur Jira: ${currentUser.displayName} (${currentUser.accountId})`);

    // Préparation des données Jira avec AccountId dynamique (VERSION SIMPLIFIÉE)
    const projectKey = body.jiraKey || body.title.replace(/[^A-Z0-9]/gi, '').substring(0, 10).toUpperCase() || 'PROJ' + Date.now().toString().slice(-4);
    
    // 🔧 FIX: Utiliser le bon type de projet selon boardType
    const projectTypeKey = body.boardType === 'Scrum' ? 'software' : 'business';
    const projectTemplateKey = body.boardType === 'Scrum'
      ? 'com.pyxis.greenhopper.jira:gh-simplified-agility-scrum'
      : 'com.atlassian.jira-core-project-templates:jira-core-project-management'; // 🔧 FIX: Template business correct
    
    const projectData = {
      key: projectKey,
      name: body.title,
      projectTypeKey: projectTypeKey, // 🔧 FIX: software pour Scrum, business pour Kanban
      projectTemplateKey: projectTemplateKey, // 🔧 FIX: Template approprié
      leadAccountId: currentUser.accountId, // 🔧 FIX: AccountId dynamique
      description: body.description || `Projet créé via D&A Workspace`
    };
    
    console.log(`🛠️ [v1] Données projet:`, JSON.stringify(projectData, null, 2));

    // Création du projet Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/project`;
    const response = await fetch(jiraUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const jiraProject = await response.json();
    console.log(`✅ [v1] Projet Jira créé: ${jiraProject.key}`);

    // 🔧 FIX: Créer automatiquement le board selon le boardType
    try {
      console.log(`🎯 [v1] Création automatique du board pour le projet ${jiraProject.key}...`);
      
      // 1. Créer le board selon le type choisi
      const boardType = body.boardType === 'Scrum' ? 'scrum' : 'kanban';
      const boardName = `${jiraProject.name} - Board ${body.boardType}`;
      
      const boardData = {
        name: boardName,
        type: boardType,
        projectKeyOrId: jiraProject.key
      };
      
      console.log(`🛠️ [v1] Données board:`, JSON.stringify(boardData, null, 2));
      
      const boardUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/board`;
      const boardResponse = await fetch(boardUrl, {
        method: 'POST',
        headers: getJiraHeaders(),
        body: JSON.stringify(boardData)
      });
      
      if (boardResponse.ok) {
        const createdBoard = await boardResponse.json();
        console.log(`✅ [v1] Board ${boardType} créé: ${createdBoard.name} (ID: ${createdBoard.id})`);
        
        // 2. Créer un sprint si c'est un projet Scrum
        if (body.boardType === 'Scrum') {
          try {
            const sprintData = {
              name: `Sprint ${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +2 semaines
              goal: "Sprint créé automatiquement via D&A Workspace"
            };
            
            const sprintUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/board/${createdBoard.id}/sprint`;
            const sprintResponse = await fetch(sprintUrl, {
              method: 'POST',
              headers: getJiraHeaders(),
              body: JSON.stringify(sprintData)
            });
            
            if (sprintResponse.ok) {
              const newSprint = await sprintResponse.json();
              console.log(`✅ [v1] Sprint créé: ${newSprint.name} (ID: ${newSprint.id})`);
            } else {
              console.log(`⚠️ [v1] Impossible de créer le sprint: ${sprintResponse.status}`);
            }
          } catch (sprintError) {
            console.log(`⚠️ [v1] Erreur lors de la création du sprint:`, sprintError);
          }
        }
      } else {
        console.log(`⚠️ [v1] Impossible de créer le board: ${boardResponse.status}`);
      }
    } catch (boardError) {
      console.log(`⚠️ [v1] Erreur lors de la création du board:`, boardError);
      // Ne pas faire échouer la création du projet
    }

    // Réponse au format v1
    const createdProject = {
      id: Date.now().toString(),
      title: jiraProject.name,
      description: body.description || `Projet Jira ${jiraProject.key}`,
      startsAt: body.startsAt || new Date().toISOString().split('T')[0], // 🔧 FIX: Utiliser la vraie date de début
      endsAt: body.endsAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 🔧 FIX: Utiliser la vraie date de fin
      isActive: true,
      isArchived: false,
      externalSource: "Jira",
      externalId: jiraProject.key,
      boardType: body.boardType || 'Kanban',
      jiraKey: jiraProject.key,
      jiraId: jiraProject.id,
      _links: {
        self: { href: `/api/v1/jira/projects/${jiraProject.key}` }
      }
    };

    const responseData: JiraProjectResponse = {
      status: 201,
      message: "Projet Jira créé avec succès",
      data: createdProject,
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 201 });
    
  } catch (error) {
    console.error("❌ [v1] Error creating project in Jira:", error);
    
    // Analyser le type d'erreur pour fournir un message approprié
    let errorMessage = "Erreur lors de la création du projet Jira";
    let solution = "Vérifiez que tous les champs requis sont remplis et que votre compte Jira a les permissions nécessaires";
    
    if (error instanceof Error) {
      if (error.message.includes('400')) {
        errorMessage = "Données de projet invalides";
        solution = "Vérifiez que le titre du projet est unique et que la clé Jira n'existe pas déjà";
      } else if (error.message.includes('401')) {
        errorMessage = "Authentification Jira échouée";
        solution = "Vérifiez votre email et token Jira dans les paramètres d'environnement";
      } else if (error.message.includes('403')) {
        errorMessage = "Permissions insuffisantes pour créer des projets";
        solution = "Contactez votre administrateur Jira pour obtenir les droits de création de projet";
      } else if (error.message.includes('409')) {
        errorMessage = "Conflit - La clé de projet existe déjà";
        solution = "Choisissez une clé de projet différente ou utilisez un autre nom";
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

// PUT /api/v1/jira/projects - Met à jour un projet Jira existant
export async function PUT(request: NextRequest) {
  try {
    console.log("🔄 [v1] Mise à jour de projet Jira via v1 API...");
    
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré",
        data: null,
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Validation des champs requis
    if (!body.jiraKey || !body.title) {
      return NextResponse.json({ 
        status: 400,
        message: "La clé Jira et le titre sont requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // 🔧 FIX: Récupérer l'AccountId dynamiquement
    const userResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/api/3/myself`, {
      method: 'GET',
      headers: getJiraHeaders()
    });
    
    if (!userResponse.ok) {
      throw new Error(`Impossible de récupérer l'utilisateur Jira: ${userResponse.status}`);
    }
    
    const currentUser = await userResponse.json();
    console.log(`👤 [v1] Utilisateur Jira: ${currentUser.displayName} (${currentUser.accountId})`);

    // Mise à jour du projet Jira
    const updateData = {
      name: body.title,
      description: body.description || `Projet mis à jour via D&A Workspace`,
      leadAccountId: currentUser.accountId
    };

    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/project/${body.jiraKey}`;
    const response = await fetch(jiraUrl, {
      method: 'PUT',
      headers: getJiraHeaders(),
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ [v1] Projet Jira mis à jour: ${body.jiraKey}`);

    // Réponse au format v1
    const updatedProject = {
      id: body.id || Date.now().toString(),
      title: body.title,
      description: body.description || `Projet Jira ${body.jiraKey}`,
      startsAt: body.startsAt || new Date().toISOString().split('T')[0],
      endsAt: body.endsAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      isArchived: false,
      externalSource: "Jira",
      externalId: body.jiraKey,
      boardType: body.boardType || 'Kanban',
      jiraKey: body.jiraKey,
      jiraId: body.jiraId,
      _links: {
        self: { href: `/api/v1/jira/projects/${body.jiraKey}` }
      }
    };

    const responseData: JiraProjectResponse = {
      status: 200,
      message: "Projet Jira mis à jour avec succès",
      data: updatedProject,
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error updating project in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la mise à jour du projet Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// DELETE /api/v1/jira/projects - Supprime un projet Jira
export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ [v1] Suppression de projet Jira via v1 API...");
    
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré",
        data: null,
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    // Extraction de la clé Jira depuis les paramètres de requête
    const { searchParams } = new URL(request.url);
    const jiraKey = searchParams.get('jiraKey');
    
    if (!jiraKey) {
      return NextResponse.json({ 
        status: 400,
        message: "La clé Jira est requise",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // Suppression du projet Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/project/${jiraKey}`;
    const response = await fetch(jiraUrl, {
      method: 'DELETE',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ [v1] Projet Jira supprimé: ${jiraKey}`);

    const responseData: JiraProjectResponse = {
      status: 200,
      message: "Projet Jira supprimé avec succès",
      data: { jiraKey, deleted: true },
      type: "DELETE_CONFIRMATION",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error deleting project in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la suppression du projet Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// OPTIONS /api/v1/jira/projects - Test de connexion
export async function OPTIONS() {
  try {
    console.log("🔍 [v1] Test de connexion Jira...");
    
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré",
        data: null,
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    // Test de connexion simple
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/myself`;
    const response = await fetch(jiraUrl, {
      method: 'GET',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      throw new Error(`Jira API Error: ${response.status} ${response.statusText}`);
    }

    const userInfo = await response.json();
    
    const responseData: JiraProjectResponse = {
      status: 200,
      message: "Connexion Jira réussie",
      data: {
        domain: JIRA_CONFIG.domain,
        user: userInfo.displayName,
        email: userInfo.emailAddress,
        connected: true
      },
      type: "CONNECTION_TEST",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error testing Jira connection:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur de connexion Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

