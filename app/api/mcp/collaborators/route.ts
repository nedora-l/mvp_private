import { NextRequest, NextResponse } from 'next/server';

/**
 * API MCP - Collaborateurs/Utilisateurs Jira réels
 * Utilise uniquement les APIs Jira officielles pour la gestion des utilisateurs
 */

interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress: string;
  accountType: string;
  active: boolean;
  avatarUrls: {
    "16x16": string;
    "24x24": string;
    "32x32": string;
    "48x48": string;
  };
  locale?: string;
  timeZone?: string;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  active: boolean;
  avatar: string;
  jiraAccountId: string;
  dateAdded: string;
  permissions: string[];
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
    'Content-Type': 'application/json; charset=utf-8'
  };
};

// Mapping automatique des rôles basé sur les permissions Jira
const mapUserRole = (userRoles: string[]): string => {
  if (userRoles.includes('Administrators')) return 'Admin';
  if (userRoles.includes('Project Lead')) return 'Project Lead';
  if (userRoles.includes('Developers')) return 'Developer';
  if (userRoles.includes('Users')) return 'User';
  
  return 'Collaborator';
};

// Mapping département basé sur le rôle
const mapDepartment = (role: string, email: string): string => {
  const emailLower = email.toLowerCase();
  
  if (['Admin', 'Project Lead'].includes(role)) return 'Management';
  if (emailLower.includes('dev') || emailLower.includes('tech')) return 'Development';
  if (emailLower.includes('qa') || emailLower.includes('test')) return 'Quality Assurance';
  if (emailLower.includes('design') || emailLower.includes('ui')) return 'Design';
  if (emailLower.includes('marketing')) return 'Marketing';
  if (emailLower.includes('sales')) return 'Sales';
  
  return 'General';
};

// GET /api/mcp/collaborators - Récupérer tous les utilisateurs Jira
export async function GET(request: NextRequest) {
  try {
    console.log("🔗 Récupération des collaborateurs depuis Jira...");
    
    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ Token Jira manquant - Configuration requise");
      return NextResponse.json({ 
        success: false, 
        collaborators: [],
        source: 'jira-error',
        error: 'Token Jira non configuré'
      }, { status: 401 });
    }

    // Récupérer tous les projets pour obtenir les utilisateurs
    const projectsResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/api/3/project`, {
      headers: getJiraHeaders()
    });

    if (!projectsResponse.ok) {
      throw new Error(`Erreur récupération projets: ${projectsResponse.status}`);
    }

    const projects = await projectsResponse.json();
    const allUsers = new Map<string, JiraUser>();
    const userRoles = new Map<string, string[]>();

    // Récupérer les utilisateurs de tous les projets
    for (const project of projects) {
      try {
        // Utilisateurs assignables du projet
        const usersResponse = await fetch(
          `https://${JIRA_CONFIG.domain}/rest/api/3/user/assignable/search?project=${project.key}&maxResults=50`,
          { headers: getJiraHeaders() }
        );

        if (usersResponse.ok) {
          const users: JiraUser[] = await usersResponse.json();
          users.forEach(user => {
            allUsers.set(user.accountId, user);
            if (!userRoles.has(user.accountId)) {
              userRoles.set(user.accountId, []);
            }
          });
        }

        // Récupérer les rôles du projet
        const rolesResponse = await fetch(
          `https://${JIRA_CONFIG.domain}/rest/api/3/project/${project.key}/role`,
          { headers: getJiraHeaders() }
        );

        if (rolesResponse.ok) {
          const roles = await rolesResponse.json();
          
          // Pour chaque rôle, récupérer les acteurs
          for (const [roleName, roleUrl] of Object.entries(roles)) {
            try {
              const roleId = String(roleUrl).split('/').pop();
              const actorsResponse = await fetch(
                `https://${JIRA_CONFIG.domain}/rest/api/3/project/${project.key}/role/${roleId}`,
                { headers: getJiraHeaders() }
              );

              if (actorsResponse.ok) {
                const roleData = await actorsResponse.json();
                if (roleData.actors) {
                  roleData.actors.forEach((actor: any) => {
                    if (actor.type === 'atlassian-user-role-actor' && actor.actorUser) {
                      const accountId = actor.actorUser.accountId;
                      if (!userRoles.has(accountId)) {
                        userRoles.set(accountId, []);
                      }
                      userRoles.get(accountId)?.push(roleName);
                    }
                  });
                }
              }
            } catch (roleError) {
              console.warn(`⚠️ Erreur récupération rôle ${roleName}:`, roleError);
            }
          }
        }
      } catch (projectError) {
        console.warn(`⚠️ Erreur projet ${project.key}:`, projectError);
      }
    }

    console.log(`✅ ${allUsers.size} utilisateurs uniques récupérés depuis Jira`);

    // Conversion vers format D&A Workspace
    const collaborators: Collaborator[] = Array.from(allUsers.values()).map(user => {
      const userRolesList = userRoles.get(user.accountId) || [];
      const primaryRole = mapUserRole(userRolesList);

      return {
        id: user.accountId,
        name: user.displayName,
        email: user.emailAddress,
        role: primaryRole,
        department: mapDepartment(primaryRole, user.emailAddress),
        active: user.active,
        avatar: user.avatarUrls["48x48"] || user.avatarUrls["32x32"] || '',
        jiraAccountId: user.accountId,
        dateAdded: new Date().toISOString().split('T')[0],
        permissions: userRolesList
      };
    }).filter(user => user.active); // Seulement les utilisateurs actifs

    return NextResponse.json({
      success: true,
      collaborators,
      source: 'jira',
      count: collaborators.length,
      domain: JIRA_CONFIG.domain
    }, { 
      headers: { 
        'Content-Type': 'application/json; charset=utf-8' 
      } 
    });

  } catch (error) {
    console.error("❌ Erreur API Jira collaborateurs:", error);
    
    // ✅ PLUS DE FALLBACK LOCAL - Return error directement
    return NextResponse.json({ 
      success: false, 
      collaborators: [],
      source: 'jira-error',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// POST /api/mcp/collaborators - Inviter un nouvel utilisateur (via email)
export async function POST(request: NextRequest) {
  try {
    const { email, name, projectKeys = [] } = await request.json();
    console.log("👤 Invitation collaborateur:", { email, name, projectKeys });

    // ✅ PLUS DE FALLBACK - Token Jira requis
    if (!JIRA_CONFIG.token) {
      return NextResponse.json({
        success: false,
        error: 'Configuration Jira requise pour inviter des utilisateurs'
      }, { status: 401 });
    }

    // Note: Jira Cloud ne permet pas de créer des utilisateurs via API
    // Il faut les inviter via l'interface admin ou utiliser l'API de gestion d'organisation
    // Pour l'instant, on retourne une réponse informative

    return NextResponse.json({
      success: false,
      error: 'La création d\'utilisateurs Jira doit être effectuée via l\'interface d\'administration Atlassian',
      jiraLimitation: true,
      instructions: {
        steps: [
          'Allez sur https://admin.atlassian.com',
          'Sélectionnez votre organisation',
          'Allez dans "Directory" → "Users"',
          'Cliquez "Add users" et entrez l\'email',
          'Assignez les projets appropriés'
        ],
        adminUrl: 'https://admin.atlassian.com',
        alternativeAction: 'Rechercher un utilisateur existant à ajouter aux projets'
      }
    }, { status: 422 }); // 422 = Unprocessable Entity (plus approprié que 400)

  } catch (error) {
    console.error("❌ Erreur invitation collaborateur:", error);
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur invitation' },
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
