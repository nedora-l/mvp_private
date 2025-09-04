import { type NextRequest, NextResponse } from "next/server"

/**
 * Jira Sprints API - v1 Architecture
 * Remplacera progressivement /api/mcp/sprints
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

// Interface pour la réponse v1
interface JiraSprintResponse {
  status: number;
  message: string;
  data: any;
  type: string;
  source: string;
}

// GET /api/v1/jira/sprints - Récupère les sprints Jira
export async function GET(request: NextRequest) {
  try {
    console.log("🔗 [v1] Connexion à Jira pour récupérer les sprints...");
    
    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ [v1] Token Jira manquant - Configuration requise");
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré",
        data: null,
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    // Extraction des paramètres de requête
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');
    const state = searchParams.get('state'); // future, active, closed
    const maxResults = searchParams.get("maxResults") || "100";

    if (!boardId) {
      return NextResponse.json({ 
        status: 400,
        message: "boardId requis pour récupérer les sprints",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // Récupération des sprints Jira
    const sprintsUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/board/${boardId}/sprint`;
    
    const response = await fetch(sprintsUrl, {
      method: 'GET',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      throw new Error(`Jira API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const jiraSprints = data.values || [];

    console.log(`✅ [v1] ${jiraSprints.length} sprints récupérés depuis Jira`);

    // Filtrage par état si spécifié
    let filteredSprints = jiraSprints;
    if (state) {
      filteredSprints = jiraSprints.filter((sprint: any) => sprint.state === state);
    }

    // Transformation vers format D&A Workspace avec structure v1
    const sprints = filteredSprints.map((sprint: any, index: number) => {
      return {
        id: index + 100, // ID unique numérique pour éviter les conflits
        name: sprint.name,
        goal: sprint.goal || "Aucun objectif défini",
        state: sprint.state,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        completeDate: sprint.completeDate || null,
        boardId: sprint.originBoardId,
        jiraId: sprint.id,
        _links: {
          self: { href: `/api/v1/jira/sprints/${sprint.id}` }
        }
      };
    });

    const responseData: JiraSprintResponse = {
      status: 200,
      message: "Sprints Jira récupérés avec succès",
      data: {
        _embedded: { sprints },
        _links: {
          self: { href: "/api/v1/jira/sprints" }
        },
        page: {
          size: sprints.length,
          totalElements: sprints.length,
          totalPages: 1,
          number: 0
        }
      },
      type: "HATEOAS_RECORD_LIST",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error fetching sprints from Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la récupération des sprints Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// POST /api/v1/jira/sprints - Crée un nouveau sprint Jira
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 [v1] Création de sprint Jira via v1 API...");
    
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
    if (!body.name || !body.boardId) {
      return NextResponse.json({ 
        status: 400,
        message: "Le nom et l'ID du board sont requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // Préparation des données Jira
    const sprintData = {
      name: body.name,
      goal: body.goal || "Sprint créé via D&A Workspace",
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      endDate: body.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +14 jours par défaut
      state: body.state || "future"
    };

    // Création du sprint Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/sprint`;
    const response = await fetch(jiraUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(sprintData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const jiraSprint = await response.json();
    console.log(`✅ [v1] Sprint Jira créé: ${jiraSprint.name}`);

    // Réponse au format v1
    const createdSprint = {
      id: Date.now().toString(),
      name: jiraSprint.name,
      goal: jiraSprint.goal || "Sprint créé via D&A Workspace",
      state: jiraSprint.state || "future",
      startDate: jiraSprint.startDate,
      endDate: jiraSprint.endDate,
      completeDate: null,
      boardId: body.boardId,
      jiraId: jiraSprint.id,
      _links: {
        self: { href: `/api/v1/jira/sprints/${jiraSprint.id}` }
      }
    };

    const responseData: JiraSprintResponse = {
      status: 201,
      message: "Sprint Jira créé avec succès",
      data: createdSprint,
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 201 });
    
  } catch (error) {
    console.error("❌ [v1] Error creating sprint in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la création du sprint Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// PUT /api/v1/jira/sprints - Met à jour un sprint Jira
export async function PUT(request: NextRequest) {
  try {
    console.log("🔄 [v1] Mise à jour de sprint Jira via v1 API...");
    
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
    
    if (!body.jiraId) {
      return NextResponse.json({ 
        status: 400,
        message: "L'ID Jira du sprint est requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // Préparation des données de mise à jour
    const updateData: any = {};
    
    if (body.name) updateData.name = body.name;
    if (body.goal) updateData.goal = body.goal;
    if (body.startDate) updateData.startDate = body.startDate;
    if (body.endDate) updateData.endDate = body.endDate;
    if (body.state) updateData.state = body.state;

    // Mise à jour du sprint Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/sprint/${body.jiraId}`;
    const response = await fetch(jiraUrl, {
      method: 'PUT',
      headers: getJiraHeaders(),
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ [v1] Sprint Jira mis à jour: ${body.jiraId}`);

    const responseData: JiraSprintResponse = {
      status: 200,
      message: "Sprint Jira mis à jour avec succès",
      data: { jiraId: body.jiraId, updated: true },
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error updating sprint in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la mise à jour du sprint Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// DELETE /api/v1/jira/sprints - Supprime un sprint Jira
export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ [v1] Suppression de sprint Jira via v1 API...");
    
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré",
        data: null,
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jiraId = searchParams.get("jiraId");
    
    if (!jiraId) {
      return NextResponse.json({ 
        status: 400,
        message: "L'ID Jira du sprint est requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // Suppression du sprint Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/sprint/${jiraId}`;
    const response = await fetch(jiraUrl, {
      method: 'DELETE',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ [v1] Sprint Jira supprimé: ${jiraId}`);

    const responseData: JiraSprintResponse = {
      status: 200,
      message: "Sprint Jira supprimé avec succès",
      data: { jiraId, deleted: true },
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error deleting sprint in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la suppression du sprint Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

