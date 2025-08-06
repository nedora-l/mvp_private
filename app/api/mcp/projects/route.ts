import { NextRequest, NextResponse } from 'next/server';

/**
 * API MCP - Projets Jira réels
 * Récupère les projets depuis l'API Jira
 */

interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  style: string;
  lead: {
    displayName: string;
    emailAddress: string;
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

// Mapping type Jira → boardType D&A
const mapJiraProjectType = (projectTypeKey: string): string => {
  switch (projectTypeKey) {
    case 'software': return 'Scrum';
    case 'business': return 'Kanban';
    case 'service_desk': return 'Support';
    default: return 'Kanban';
  }
};

// GET /api/mcp/projects - Récupère les projets Jira
export async function GET(request: NextRequest) {
  try {
    console.log("🔗 Connexion à Jira pour récupérer les projets...");
    
    // Si pas de token, fallback vers data locale
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.log("⚠️ Token Jira manquant, utilisation des données locales");
      const fs = await import('fs/promises');
      const localData = await fs.readFile('./data/projects.json', 'utf-8');
      return NextResponse.json({ 
        success: true, 
        projects: JSON.parse(localData),
        source: 'local' 
      });
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

    const jiraProjects: JiraProject[] = await response.json();
    console.log(`✅ ${jiraProjects.length} projets récupérés depuis Jira`);

    // Conversion vers format D&A Workspace
    const projects = jiraProjects.map((project, index) => {
      const boardType = mapJiraProjectType(project.projectTypeKey);
      return {
        id: String(index + 100), // ID unique pour éviter les conflits
        name: project.name,
        type: "Jira",
        boardType: boardType,
        description: `Projet Jira ${project.projectTypeKey}`,
        status: "en-cours",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +3 mois
        members: project.lead ? `${project.lead.displayName} (Manager)` : "Équipe Jira",
        jiraKey: project.key,
        jiraId: project.id
      };
    });

    return NextResponse.json({
      success: true,
      projects,
      source: 'jira',
      count: projects.length,
      domain: JIRA_CONFIG.domain
    });

  } catch (error) {
    console.error("❌ Erreur API Jira projets:", error);
    
    // Fallback vers données locales en cas d'erreur
    try {
      const fs = await import('fs/promises');
      const localData = await fs.readFile('./data/projects.json', 'utf-8');
      return NextResponse.json({ 
        success: true, 
        projects: JSON.parse(localData),
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

// POST /api/mcp/projects - Crée un nouveau projet Jira
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("🔄 Création projet Jira via MCP:", data);

    // Validation des données
    if (!data.name || !data.type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nom et type de projet requis' 
      }, { status: 400 });
    }

    // Si ce n'est pas un projet Jira, rediriger vers l'API locale
    if (data.type !== 'Jira') {
      console.log("📍 Projet non-Jira, redirection vers API locale");
      const localResponse = await fetch(`http://localhost:3000/api/v0/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (localResponse.ok) {
        const result = await localResponse.json();
        return NextResponse.json({ success: true, project: result, source: 'local' });
      } else {
        throw new Error('Erreur API locale');
      }
    }

    // Si pas de token Jira, utiliser l'API locale comme fallback
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.log("⚠️ Token Jira manquant, fallback vers API locale");
      const localResponse = await fetch(`http://localhost:3000/api/v0/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (localResponse.ok) {
        const result = await localResponse.json();
        return NextResponse.json({ success: true, project: result, source: 'local-fallback' });
      } else {
        throw new Error('Erreur fallback API locale');
      }
    }

    // Préparation des données pour Jira
    const jiraProjectData = {
      key: data.name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10) || 'PROJ',
      name: data.name,
      projectTypeKey: data.boardType === 'Scrum' ? 'software' : 'business',
      description: data.description || `Projet ${data.name}`,
      leadAccountId: null, // L'utilisateur courant sera le lead
      assigneeType: 'PROJECT_LEAD'
    };

    // Création du projet sur Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/project`;
    const response = await fetch(jiraUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(jiraProjectData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur création Jira:", response.status, errorText);
      
      // Fallback vers API locale si Jira refuse
      console.log("🔄 Fallback création locale après échec Jira");
      const localResponse = await fetch(`http://localhost:3000/api/v0/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data, type: 'Local'}) // Marquer comme Local
      });
      
      if (localResponse.ok) {
        const result = await localResponse.json();
        return NextResponse.json({ 
          success: true, 
          project: result, 
          source: 'local-fallback',
          warning: `Jira indisponible (${response.status}), projet créé localement`
        });
      }
      
      throw new Error(`Jira API Error: ${response.status}`);
    }

    const jiraProject = await response.json();
    console.log("✅ Projet Jira créé:", jiraProject);

    // Formatage pour compatibilité avec notre app
    const project = {
      id: String(Date.now()), // ID unique temporaire
      name: jiraProject.name,
      type: "Jira",
      boardType: data.boardType || "Kanban",
      description: data.description || '',
      status: data.status || 'en-cours',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || '',
      members: data.members || '',
      jiraKey: jiraProject.key,
      jiraId: jiraProject.id
    };

    return NextResponse.json({
      success: true,
      project,
      source: 'jira',
      jiraKey: jiraProject.key
    });

  } catch (error) {
    console.error("❌ Erreur création projet MCP:", error);
    
    // Dernier fallback vers API locale
    try {
      const data = await request.json();
      const localResponse = await fetch(`http://localhost:3000/api/v0/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...data, type: 'Local'})
      });
      
      if (localResponse.ok) {
        const result = await localResponse.json();
        return NextResponse.json({ 
          success: true, 
          project: result, 
          source: 'local-emergency',
          warning: 'Erreur Jira, projet créé localement'
        });
      }
    } catch (fallbackError) {
      console.error("❌ Fallback local failed:", fallbackError);
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de création'
    }, { status: 500 });
  }
}

// OPTIONS - Test de connexion
export async function OPTIONS() {
  try {
    const testUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/myself`;
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: getJiraHeaders()
    });

    if (response.ok) {
      const user = await response.json();
      
      // Test également l'accès aux projets
      const projectsUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/project`;
      const projectsResponse = await fetch(projectsUrl, {
        method: 'GET',
        headers: getJiraHeaders()
      });
      
      const projects = projectsResponse.ok ? await projectsResponse.json() : [];
      
      return NextResponse.json({
        success: true,
        jiraConnected: true,
        domain: JIRA_CONFIG.domain,
        user: user.displayName,
        email: user.emailAddress,
        projectsCount: projects.length,
        availableProjects: projects.slice(0, 3).map((p: any) => ({
          key: p.key,
          name: p.name,
          type: p.projectTypeKey
        }))
      });
    } else {
      return NextResponse.json({
        success: false,
        jiraConnected: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        domain: JIRA_CONFIG.domain
      });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      jiraConnected: false,
      error: error instanceof Error ? error.message : 'Erreur de connexion',
      domain: JIRA_CONFIG.domain
    });
  }
}
