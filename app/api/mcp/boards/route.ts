import { NextRequest, NextResponse } from 'next/server';

/**
 * API MCP - Boards Jira Agile
 * Gestion des boards Scrum/Kanban
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

// GET /api/mcp/boards - Récupère tous les boards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('projectKey');
    
    console.log("🔍 Récupération des boards Jira" + (projectKey ? ` pour ${projectKey}` : ''));
    
    // Si pas de token, retourner des boards de démo
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      const mockBoards = [
        {
          id: 1,
          name: `${projectKey || 'Demo'} Scrum Board`,
          type: 'scrum',
          location: { projectKey: projectKey || 'DEMO' }
        },
        {
          id: 2,
          name: `${projectKey || 'Demo'} Kanban Board`, 
          type: 'kanban',
          location: { projectKey: projectKey || 'DEMO' }
        }
      ];
      
      return NextResponse.json({ 
        success: true, 
        boards: mockBoards,
        source: 'mock' 
      });
    }

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
    const boards = result.values || [];
    
    console.log(`✅ ${boards.length} boards récupérés`);

    return NextResponse.json({
      success: true,
      boards,
      total: result.total || boards.length,
      source: 'jira'
    });

  } catch (error) {
    console.error("❌ Erreur récupération boards:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur récupération boards'
    }, { status: 500 });
  }
}

// POST /api/mcp/boards - Crée un nouveau board
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("🔄 Création board:", data);

    if (!data.name || !data.projectKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'name et projectKey requis' 
      }, { status: 400 });
    }

    // Si pas de token, simulation
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      const mockBoard = {
        id: Math.floor(Math.random() * 1000),
        name: data.name,
        type: data.type || 'scrum',
        location: { projectKey: data.projectKey }
      };
      
      return NextResponse.json({ 
        success: true, 
        board: mockBoard,
        message: `Board "${data.name}" créé (simulation)`,
        source: 'simulated' 
      });
    }

    // Étape 1: Créer un filtre JQL pour le board
    const filterData = {
      name: `Filter for ${data.name}`,
      description: `Auto-generated filter for board ${data.name}`,
      jql: `project = "${data.projectKey}" ORDER BY Rank ASC`,
      favourite: false
    };

    const filterResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/api/3/filter`, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(filterData)
    });

    if (!filterResponse.ok) {
      const filterError = await filterResponse.text();
      console.warn("⚠️ Impossible de créer le filtre, utilisation du board par défaut:", filterError);
      
      // Fallback: essayer de créer le board sans filtre personnalisé
      // Utiliser un filtre existant ou laisser Jira gérer
    }

    let filterId = null;
    if (filterResponse.ok) {
      const filter = await filterResponse.json();
      filterId = filter.id;
      console.log("✅ Filtre créé:", filterId);
    }

    // Étape 2: Créer le board
    const boardData = {
      name: data.name,
      type: data.type || 'scrum', // 'scrum' ou 'kanban'
      filterId: filterId // Si null, Jira utilisera un filtre par défaut
    };

    const boardResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/agile/1.0/board`, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(boardData)
    });

    if (!boardResponse.ok) {
      const boardError = await boardResponse.text();
      throw new Error(`Board Creation Error: ${boardResponse.status} - ${boardError}`);
    }

    const board = await boardResponse.json();
    console.log("✅ Board créé avec succès:", board.name, board.id);

    return NextResponse.json({
      success: true,
      board,
      filterId,
      message: `Board "${board.name}" créé avec l'ID ${board.id}`,
      source: 'jira'
    });

  } catch (error) {
    console.error("❌ Erreur création board:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur création board'
    }, { status: 500 });
  }
}

// Helper function pour créer automatiquement un board après projet
export async function createProjectBoard(projectKey: string, boardType: string = 'scrum') {
  try {
    const boardName = `${projectKey} ${boardType.charAt(0).toUpperCase() + boardType.slice(1)} Board`;
    
    const boardData = {
      name: boardName,
      projectKey,
      type: boardType.toLowerCase()
    };

    const response = await fetch('/api/mcp/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(boardData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Board automatique créé:", result.board?.name);
      return result.board;
    }

    return null;
  } catch (error) {
    console.error("Erreur création board automatique:", error);
    return null;
  }
}
