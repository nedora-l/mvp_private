import { NextRequest, NextResponse } from 'next/server';

/**
 * API MCP - Sprints Jira
 * CRUD complet pour les sprints Jira avec story points
 */

interface JiraSprint {
  id: number;
  name: string;
  goal: string;
  state: 'future' | 'active' | 'closed';
  startDate: string;
  endDate: string;
  completeDate?: string;
  originBoardId: number;
}

interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string;
    status: {
      name: string;
    };
    priority: {
      name: string;
    };
    assignee?: {
      displayName: string;
    };
    customfield_10016?: number; // Story Points
    sprint?: any;
  };
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

// GET /api/mcp/sprints - Récupère les sprints d'un board
export async function GET(request: NextRequest) {
  try {
    console.log("🔗 Connexion à Jira pour récupérer les sprints...");
    
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('boardId');
    
    if (!boardId) {
      return NextResponse.json({ 
        success: false, 
        error: 'boardId requis' 
      }, { status: 400 });
    }

    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ Token Jira manquant - Configuration requise");
      return NextResponse.json({ 
        success: false, 
        sprints: [],
        source: 'jira-error',
        error: 'Token Jira non configuré'
      }, { status: 401 });
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

    console.log(`✅ ${jiraSprints.length} sprints récupérés depuis Jira`);

    // Transformation vers format D&A Workspace avec story points
    const sprints = await Promise.all(jiraSprints.map(async (sprint: JiraSprint) => {
      // Récupérer les issues du sprint pour calculer les story points
      let storyPoints = 0;
      let completedPoints = 0;
      
      try {
        const issuesUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/sprint/${sprint.id}/issue`;
        const issuesResponse = await fetch(issuesUrl, {
          method: 'GET',
          headers: getJiraHeaders()
        });
        
        if (issuesResponse.ok) {
          const issuesData = await issuesResponse.json();
          const issues = issuesData.issues || [];
          
          issues.forEach((issue: JiraIssue) => {
            const points = issue.fields.customfield_10016 || 0;
            storyPoints += points;
            
            // Si la tâche est terminée
            if (issue.fields.status.name === 'Done' || issue.fields.status.name === 'Terminé') {
              completedPoints += points;
            }
          });
        }
      } catch (error) {
        console.warn(`Erreur récupération issues sprint ${sprint.id}:`, error);
      }

      return {
        id: sprint.id,
        name: sprint.name,
        goal: sprint.goal || '',
        state: sprint.state,
        startDate: sprint.startDate ? sprint.startDate.split('T')[0] : '',
        endDate: sprint.endDate ? sprint.endDate.split('T')[0] : '',
        completeDate: sprint.completeDate ? sprint.completeDate.split('T')[0] : undefined,
        boardId: sprint.originBoardId,
        storyPoints,
        completedPoints,
        velocity: completedPoints > 0 ? Math.round((completedPoints / storyPoints) * 100) : 0
      };
    }));

    return NextResponse.json({
      success: true,
      sprints,
      source: 'jira',
      count: sprints.length
    });

  } catch (error) {
    console.error("❌ Erreur API Jira sprints:", error);
    
    // ✅ PLUS DE FALLBACK LOCAL - Return error directement
    return NextResponse.json({
      success: false,
      sprints: [],
      source: 'jira-error',
      error: error instanceof Error ? error.message : 'Erreur de connexion Jira'
    }, { status: 500 });
  }
}

// POST /api/mcp/sprints - Créer un nouveau sprint
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("🔄 Création sprint Jira via MCP:", data);

    // Validation
    if (!data.name || !data.boardId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nom du sprint et boardId requis' 
      }, { status: 400 });
    }

    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ Token Jira manquant - Configuration requise");
      return NextResponse.json({ 
        success: false, 
        error: 'Token Jira non configuré' 
      }, { status: 401 });
    }

    // Création du sprint sur Jira
    const sprintData = {
      name: data.name,
      goal: data.goal || '',
      originBoardId: parseInt(data.boardId),
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined
    };

    const createUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/sprint`;
    const response = await fetch(createUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(sprintData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} - ${errorText}`);
    }

    const jiraSprint = await response.json();
    console.log("✅ Sprint Jira créé:", jiraSprint);

    const sprint = {
      id: jiraSprint.id,
      name: jiraSprint.name,
      goal: jiraSprint.goal || '',
      state: jiraSprint.state,
      startDate: jiraSprint.startDate ? jiraSprint.startDate.split('T')[0] : '',
      endDate: jiraSprint.endDate ? jiraSprint.endDate.split('T')[0] : '',
      boardId: jiraSprint.originBoardId,
      storyPoints: 0,
      completedPoints: 0
    };

    return NextResponse.json({
      success: true,
      sprint,
      source: 'jira'
    });

  } catch (error) {
    console.error("❌ Erreur création sprint:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de création'
    }, { status: 500 });
  }
}

// PUT /api/mcp/sprints - Modifier un sprint
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("🔄 Modification sprint Jira:", data);

    if (!data.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID du sprint requis' 
      }, { status: 400 });
    }

    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ Token Jira manquant - Configuration requise");
      return NextResponse.json({
        success: false,
        error: 'Token Jira non configuré'
      }, { status: 401 });
    }

    // Modification du sprint sur Jira
    const updateUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/sprint/${data.id}`;
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: getJiraHeaders(),
      body: JSON.stringify({
        name: data.name,
        goal: data.goal,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined
      })
    });

    if (!response.ok) {
      throw new Error(`Jira API Error: ${response.status}`);
    }

    console.log("✅ Sprint Jira modifié");

    return NextResponse.json({
      success: true,
      sprint: data,
      source: 'jira'
    });

  } catch (error) {
    console.error("❌ Erreur modification sprint:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de modification'
    }, { status: 500 });
  }
}

// DELETE /api/mcp/sprints - Supprimer un sprint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sprintId = searchParams.get('id');

    if (!sprintId) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID du sprint requis' 
      }, { status: 400 });
    }

    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ Token Jira manquant - Configuration requise");
      return NextResponse.json({
        success: false,
        error: 'Token Jira non configuré'
      }, { status: 401 });
    }

    // Suppression du sprint sur Jira
    const deleteUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/sprint/${sprintId}`;
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      throw new Error(`Jira API Error: ${response.status}`);
    }

    console.log("✅ Sprint Jira supprimé");

    return NextResponse.json({
      success: true,
      source: 'jira'
    });

  } catch (error) {
    console.error("❌ Erreur suppression sprint:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de suppression'
    }, { status: 500 });
  }
}
