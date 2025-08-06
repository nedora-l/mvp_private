import { NextRequest, NextResponse } from 'next/server';

/**
 * API MCP - Collaborateurs Jira réels
 * Récupère les utilisateurs depuis l'API Jira
 */

interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress: string;
  accountType: string;
  active: boolean;
  avatarUrls: {
    "48x48": string;
  };
}

interface Collaborator {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  active: boolean;
  dateAdded: string;
  avatar?: string;
  jiraAccountId?: string;
}

// Configuration Jira
const JIRA_CONFIG = {
  domain: process.env.JIRA_DOMAIN || "yourcompany.atlassian.net",
  email: process.env.JIRA_EMAIL || "admin@company.com",
  token: process.env.JIRA_API_TOKEN || "",
  projectKey: process.env.JIRA_PROJECT_KEY || "PROJ"
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

// Mapping rôle Jira → Rôle D&A
const mapJiraRole = (jiraUser: JiraUser): string => {
  // Logic basée sur le displayName ou email
  const name = jiraUser.displayName.toLowerCase();
  const email = jiraUser.emailAddress.toLowerCase();
  
  if (email.includes('ceo') || name.includes('ceo')) return 'CEO';
  if (email.includes('cto') || name.includes('cto')) return 'CTO';
  if (email.includes('cfo') || name.includes('cfo')) return 'CFO';
  if (email.includes('manager') || name.includes('manager')) return 'Manager';
  if (email.includes('dev') || name.includes('developer')) return 'Dev Team';
  if (email.includes('qa') || name.includes('test')) return 'QA Tester';
  if (email.includes('design') || name.includes('designer')) return 'UX/UI Designer';
  if (email.includes('hr') || name.includes('rh')) return 'RH';
  if (email.includes('marketing')) return 'Chef Marketing';
  if (email.includes('sales') || email.includes('commercial')) return 'Commercial';
  
  return 'Dev Team'; // Défaut
};

// Mapping département
const mapDepartment = (role: string): string => {
  if (['CEO', 'CTO', 'CFO', 'Manager'].includes(role)) return 'Direction';
  if (['Dev Team', 'QA Tester', 'UX/UI Designer', 'DevOps'].includes(role)) return 'IT';
  if (role === 'RH') return 'RH';
  if (['Chef Marketing'].includes(role)) return 'Marketing';
  if (['Commercial'].includes(role)) return 'Commercial';
  return 'IT';
};

// GET /api/mcp/collaborators - Récupère les utilisateurs Jira
export async function GET(request: NextRequest) {
  try {
    console.log("🔗 Connexion à Jira pour récupérer les utilisateurs...");
    
    // Si pas de token, fallback vers data locale
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.log("⚠️ Token Jira manquant, utilisation des données locales");
      const fs = await import('fs/promises');
      const localData = await fs.readFile('./data/collaborators.json', 'utf-8');
      return NextResponse.json({ 
        success: true, 
        collaborators: JSON.parse(localData),
        source: 'local' 
      });
    }

    // Récupération des utilisateurs du projet Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/user/assignable/search?project=${JIRA_CONFIG.projectKey}&maxResults=100`;
    
    const response = await fetch(jiraUrl, {
      method: 'GET',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      throw new Error(`Jira API Error: ${response.status} ${response.statusText}`);
    }

    const jiraUsers: JiraUser[] = await response.json();
    console.log(`✅ ${jiraUsers.length} utilisateurs récupérés depuis Jira`);

    // Conversion vers format D&A Workspace
    const collaborators: Collaborator[] = jiraUsers.map((user, index) => {
      const role = mapJiraRole(user);
      return {
        id: String(index + 1),
        name: user.displayName,
        role: role,
        email: user.emailAddress,
        department: mapDepartment(role),
        active: user.active,
        dateAdded: new Date().toISOString().split('T')[0],
        avatar: user.avatarUrls["48x48"],
        jiraAccountId: user.accountId
      };
    });

    return NextResponse.json({
      success: true,
      collaborators,
      source: 'jira',
      count: collaborators.length,
      jiraProject: JIRA_CONFIG.projectKey
    });

  } catch (error) {
    console.error("❌ Erreur API Jira collaborateurs:", error);
    
    // Fallback vers données locales en cas d'erreur
    try {
      const fs = await import('fs/promises');
      const localData = await fs.readFile('./data/collaborators.json', 'utf-8');
      return NextResponse.json({ 
        success: true, 
        collaborators: JSON.parse(localData),
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

// POST /api/mcp/collaborators - Ajouter un utilisateur (sync vers Jira si possible)
export async function POST(request: NextRequest) {
  try {
    const collaboratorData = await request.json();
    console.log("👤 Ajout collaborateur:", collaboratorData);

    // Pour l'instant, ajout local uniquement
    // TODO: Implémenter l'ajout via Jira API si nécessaire
    
    return NextResponse.json({
      success: true,
      message: "Collaborateur ajouté localement. Synchronisation Jira à implémenter.",
      collaborator: {
        id: Date.now().toString(),
        ...collaboratorData,
        dateAdded: new Date().toISOString().split('T')[0],
        active: true
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    );
  }
}

// Test de connexion Jira
export async function OPTIONS() {
  try {
    const testUrl = `https://${JIRA_CONFIG.domain}/rest/api/3/myself`;
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: getJiraHeaders()
    });

    const user = await response.json();
    
    return NextResponse.json({
      success: response.ok,
      jiraConnected: response.ok,
      domain: JIRA_CONFIG.domain,
      user: response.ok ? user.displayName : null,
      status: response.status
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      jiraConnected: false,
      error: error instanceof Error ? error.message : 'Erreur de connexion'
    });
  }
}
