import { type NextRequest, NextResponse } from "next/server"

/**
 * Jira Boards API - v1 Architecture
 * Remplacera progressivement /api/mcp/boards
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
interface JiraBoardResponse {
  status: number;
  message: string;
  data: any;
  type: string;
  source: string;
}

// GET /api/v1/jira/boards - Récupère tous les boards Jira
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 [v1] Récupération des boards Jira...");
    
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
    const projectKey = searchParams.get('projectKey');
    const boardType = searchParams.get('type'); // scrum, kanban
    const maxResults = searchParams.get("maxResults") || "100";

    // Récupération des boards Jira
    let boardsUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/board`;
    if (projectKey) {
      boardsUrl += `?projectKeyOrId=${projectKey}`;
    }
    
    const response = await fetch(boardsUrl, {
      method: 'GET',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      throw new Error(`Jira Agile API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    let boards = result.values || [];

    // Filtrage par type si spécifié
    if (boardType) {
      boards = boards.filter((board: any) => board.type === boardType);
    }

    console.log(`✅ [v1] ${boards.length} boards récupérés depuis Jira`);

    // Transformation vers format D&A Workspace avec structure v1
    const transformedBoards = boards.map((board: any, index: number) => {
      return {
        id: index + 100, // ID unique numérique pour éviter les conflits
        name: board.name,
        type: board.type, // scrum, kanban
        projectKey: board.location?.projectKey || 'Unknown',
        projectName: board.location?.projectName || 'Unknown Project',
        jiraId: board.id,
        _links: {
          self: { href: `/api/v1/jira/boards/${board.id}` }
        }
      };
    });

    const responseData: JiraBoardResponse = {
      status: 200,
      message: "Boards Jira récupérés avec succès",
      data: {
        _embedded: { boards: transformedBoards },
        _links: {
          self: { href: "/api/v1/jira/boards" }
        },
        page: {
          size: transformedBoards.length,
          totalElements: result.total || transformedBoards.length,
          totalPages: 1,
          number: 0
        }
      },
      type: "HATEOAS_RECORD_LIST",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error fetching boards from Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la récupération des boards Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// POST /api/v1/jira/boards - Crée un nouveau board Jira
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 [v1] Création de board Jira via v1 API...");
    
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
    if (!body.name || !body.projectKey || !body.type) {
      return NextResponse.json({ 
        status: 400,
        message: "Le nom, la clé du projet et le type sont requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // Validation du type de board
    if (!['scrum', 'kanban'].includes(body.type)) {
      return NextResponse.json({ 
        status: 400,
        message: "Le type doit être 'scrum' ou 'kanban'",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // Préparation des données Jira
    const boardData = {
      name: body.name,
      type: body.type,
      filterId: body.filterId || 0, // ID du filtre Jira (0 = tous les projets)
      location: {
        projectIdOrKey: body.projectKey
      }
    };

    // Création du board Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/board`;
    const response = await fetch(jiraUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(boardData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const jiraBoard = await response.json();
    console.log(`✅ [v1] Board Jira créé: ${jiraBoard.name}`);

    // Réponse au format v1
    const createdBoard = {
      id: Date.now().toString(),
      name: jiraBoard.name,
      type: jiraBoard.type,
      projectKey: body.projectKey,
      projectName: body.projectName || body.projectKey,
      jiraId: jiraBoard.id,
      _links: {
        self: { href: `/api/v1/jira/boards/${jiraBoard.id}` }
      }
    };

    const responseData: JiraBoardResponse = {
      status: 201,
      message: "Board Jira créé avec succès",
      data: createdBoard,
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 201 });
    
  } catch (error) {
    console.error("❌ [v1] Error creating board in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la création du board Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// PUT /api/v1/jira/boards - Met à jour un board Jira
export async function PUT(request: NextRequest) {
  try {
    console.log("🔄 [v1] Mise à jour de board Jira via v1 API...");
    
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
        message: "L'ID Jira du board est requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // Préparation des données de mise à jour
    const updateData: any = {};
    
    if (body.name) updateData.name = body.name;
    if (body.type && ['scrum', 'kanban'].includes(body.type)) {
      updateData.type = body.type;
    }

    // Mise à jour du board Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/board/${body.jiraId}`;
    const response = await fetch(jiraUrl, {
      method: 'PUT',
      headers: getJiraHeaders(),
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ [v1] Board Jira mis à jour: ${body.jiraId}`);

    const responseData: JiraBoardResponse = {
      status: 200,
      message: "Board Jira mis à jour avec succès",
      data: { jiraId: body.jiraId, updated: true },
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error updating board in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la mise à jour du board Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// DELETE /api/v1/jira/boards - Supprime un board Jira
export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ [v1] Suppression de board Jira via v1 API...");
    
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
        message: "L'ID Jira du board est requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    // Suppression du board Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/board/${jiraId}`;
    const response = await fetch(jiraUrl, {
      method: 'DELETE',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ [v1] Board Jira supprimé: ${jiraId}`);

    const responseData: JiraBoardResponse = {
      status: 200,
      message: "Board Jira supprimé avec succès",
      data: { jiraId, deleted: true },
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error deleting board in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la suppression du board Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

