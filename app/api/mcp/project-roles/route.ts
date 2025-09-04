import { NextRequest, NextResponse } from 'next/server';

/**
 * API MCP - Project Roles Jira
 * Gestion des rôles dans les projets Jira
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

// GET /api/mcp/project-roles - Récupère les rôles d'un projet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('projectKey');
    
    if (!projectKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'projectKey parameter required' 
      }, { status: 400 });
    }

    console.log(`🔍 Récupération des rôles pour le projet ${projectKey}`);
    
    // Si pas de token, retourner des rôles par défaut
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      return NextResponse.json({ 
        success: true, 
        roles: {
          "Administrators": `https://${JIRA_CONFIG.domain}/rest/api/3/project/${projectKey}/role/10002`,
          "Developers": `https://${JIRA_CONFIG.domain}/rest/api/3/project/${projectKey}/role/10000`,
          "Users": `https://${JIRA_CONFIG.domain}/rest/api/3/project/${projectKey}/role/10001`
        },
        source: 'default' 
      });
    }

    // Récupération des rôles Jira
    const rolesUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/project/${projectKey}/role`;
    
    const response = await fetch(rolesUrl, {
      method: 'GET',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      throw new Error(`Jira API Error: ${response.status} ${response.statusText}`);
    }

    const roles = await response.json();
    console.log(`✅ Rôles récupérés pour ${projectKey}:`, Object.keys(roles));

    return NextResponse.json({
      success: true,
      roles,
      projectKey,
      source: 'jira'
    });

  } catch (error) {
    console.error("❌ Erreur récupération rôles projet:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// POST /api/mcp/project-roles - Assigne un utilisateur à un rôle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("🔄 Assignment de rôle:", data);

    if (!data.projectKey || !data.roleId || !data.accountId) {
      return NextResponse.json({ 
        success: false, 
        error: 'projectKey, roleId et accountId requis' 
      }, { status: 400 });
    }

    // Si pas de token, simulation
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      return NextResponse.json({ 
        success: true, 
        message: `Utilisateur ${data.accountId} assigné au rôle ${data.roleId} (simulation)`,
        source: 'simulated' 
      });
    }

    // Assignment du rôle sur Jira
    const assignUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/project/${data.projectKey}/role/${data.roleId}`;
    
    const assignData = {
      user: [data.accountId]
    };

    const response = await fetch(assignUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(assignData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira Role Assignment Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Rôle assigné avec succès:", result);

    return NextResponse.json({
      success: true,
      result,
      message: `Utilisateur ${data.accountId} assigné au rôle ${data.roleId}`,
      source: 'jira'
    });

  } catch (error) {
    console.error("❌ Erreur assignment rôle:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur assignment rôle'
    }, { status: 500 });
  }
}

// Helper function pour assigner automatiquement le lead à admin
export async function assignProjectLead(projectKey: string, leadAccountId: string) {
  try {
    // Récupérer les rôles disponibles
    const rolesResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/api/3/project/${projectKey}/role`, {
      headers: getJiraHeaders()
    });

    if (!rolesResponse.ok) return false;

    const roles = await rolesResponse.json();
    
    // Chercher le rôle Administrator ou Project Lead
    let adminRoleId = null;
    for (const [roleName, roleUrl] of Object.entries(roles)) {
      if (roleName.toLowerCase().includes('admin') || roleName.toLowerCase().includes('lead')) {
        adminRoleId = String(roleUrl).split('/').pop();
        break;
      }
    }

    if (!adminRoleId) return false;

    // Assigner le lead au rôle admin
    const assignResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/api/3/project/${projectKey}/role/${adminRoleId}`, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify({ user: [leadAccountId] })
    });

    return assignResponse.ok;
  } catch (error) {
    console.error("Erreur assignment lead automatique:", error);
    return false;
  }
}
