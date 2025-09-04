import { NextRequest, NextResponse } from 'next/server';

/**
 * API MCP - Recherche avancée de collaborateurs/utilisateurs Jira
 * Endpoint: GET /api/mcp/collaborators/search
 * Fonctionnalités:
 * - Recherche par nom, email, rôle
 * - Filtrage par projet, statut (actif/inactif)
 * - Pagination et tri
 * - Recherche dans groupes Jira
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

interface CollaboratorSearchResult {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  active: boolean;
  avatar: string;
  jiraAccountId: string;
  projects: string[];
  permissions: string[];
  lastActivity?: string;
}

interface SearchFilters {
  query?: string;
  projectKey?: string;
  role?: string;
  department?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'email' | 'role' | 'lastActivity';
  sortOrder?: 'asc' | 'desc';
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

// Mapping automatique des rôles
const mapUserRole = (userRoles: string[]): string => {
  if (userRoles.includes('Administrators')) return 'Admin';
  if (userRoles.includes('Project Lead')) return 'Project Lead';
  if (userRoles.includes('Developers')) return 'Developer';
  if (userRoles.includes('Users')) return 'User';
  return 'Collaborator';
};

// Mapping département
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

// GET /api/mcp/collaborators/search - Recherche avancée d'utilisateurs Jira
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const filters: SearchFilters = {
      query: url.searchParams.get('query') || '',
      projectKey: url.searchParams.get('projectKey') || undefined,
      role: url.searchParams.get('role') || undefined,
      department: url.searchParams.get('department') || undefined,
      active: url.searchParams.get('active') === 'true' ? true : url.searchParams.get('active') === 'false' ? false : undefined,
      limit: parseInt(url.searchParams.get('limit') || '50'),
      offset: parseInt(url.searchParams.get('offset') || '0'),
      sortBy: (url.searchParams.get('sortBy') as any) || 'name',
      sortOrder: (url.searchParams.get('sortOrder') as any) || 'asc'
    };

    console.log("🔍 Recherche collaborateurs avec filtres:", filters);
    
    // ✅ Token Jira requis
    if (!JIRA_CONFIG.token) {
      return NextResponse.json({ 
        success: false, 
        collaborators: [],
        total: 0,
        error: 'Token Jira non configuré'
      }, { status: 401 });
    }

    let searchResults = new Map<string, JiraUser>();
    let userProjects = new Map<string, string[]>();
    let userRoles = new Map<string, string[]>();

    // Si recherche par projet spécifique
    if (filters.projectKey) {
      console.log(`🎯 Recherche dans le projet: ${filters.projectKey}`);
      
      // Utilisateurs assignables du projet
      const usersResponse = await fetch(
        `https://${JIRA_CONFIG.domain}/rest/api/3/user/assignable/search?project=${filters.projectKey}&maxResults=${filters.limit}&startAt=${filters.offset}${filters.query ? `&query=${encodeURIComponent(filters.query)}` : ''}`,
        { headers: getJiraHeaders() }
      );

      if (!usersResponse.ok) {
        throw new Error(`Erreur recherche projet ${filters.projectKey}: ${usersResponse.status}`);
      }

      const users: JiraUser[] = await usersResponse.json();
      users.forEach(user => {
        searchResults.set(user.accountId, user);
        userProjects.set(user.accountId, [filters.projectKey!]);
      });

      // Récupérer les rôles du projet pour ces utilisateurs
      const rolesResponse = await fetch(
        `https://${JIRA_CONFIG.domain}/rest/api/3/project/${filters.projectKey}/role`,
        { headers: getJiraHeaders() }
      );

      if (rolesResponse.ok) {
        const roles = await rolesResponse.json();
        
        for (const [roleName, roleUrl] of Object.entries(roles)) {
          try {
            const roleId = String(roleUrl).split('/').pop();
            const actorsResponse = await fetch(
              `https://${JIRA_CONFIG.domain}/rest/api/3/project/${filters.projectKey}/role/${roleId}`,
              { headers: getJiraHeaders() }
            );

            if (actorsResponse.ok) {
              const roleData = await actorsResponse.json();
              roleData.actors?.forEach((actor: any) => {
                if (actor.type === 'atlassian-user-role-actor' && actor.actorUser) {
                  const accountId = actor.actorUser.accountId;
                  if (searchResults.has(accountId)) {
                    if (!userRoles.has(accountId)) {
                      userRoles.set(accountId, []);
                    }
                    userRoles.get(accountId)?.push(roleName);
                  }
                }
              });
            }
          } catch (roleError) {
            console.warn(`⚠️ Erreur rôle ${roleName}:`, roleError);
          }
        }
      }
    } else {
      // Recherche globale dans tous les projets
      console.log("🌐 Recherche globale dans tous les projets");
      
      // Si query spécifiée, utiliser l'API de recherche générale
      if (filters.query) {
        const searchResponse = await fetch(
          `https://${JIRA_CONFIG.domain}/rest/api/3/user/search?query=${encodeURIComponent(filters.query)}&maxResults=${filters.limit}&startAt=${filters.offset}`,
          { headers: getJiraHeaders() }
        );

        if (searchResponse.ok) {
          const users: JiraUser[] = await searchResponse.json();
          users.forEach(user => searchResults.set(user.accountId, user));
        }
      }

      // Récupérer tous les projets
      const projectsResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/api/3/project`, {
        headers: getJiraHeaders()
      });

      if (projectsResponse.ok) {
        const projects = await projectsResponse.json();
        
        // Pour chaque projet, récupérer les utilisateurs
        for (const project of projects.slice(0, 10)) { // Limiter à 10 projets pour performance
          try {
            const usersResponse = await fetch(
              `https://${JIRA_CONFIG.domain}/rest/api/3/user/assignable/search?project=${project.key}&maxResults=20`,
              { headers: getJiraHeaders() }
            );

            if (usersResponse.ok) {
              const users: JiraUser[] = await usersResponse.json();
              users.forEach(user => {
                searchResults.set(user.accountId, user);
                
                if (!userProjects.has(user.accountId)) {
                  userProjects.set(user.accountId, []);
                }
                userProjects.get(user.accountId)?.push(project.key);
              });
            }
          } catch (projectError) {
            console.warn(`⚠️ Erreur projet ${project.key}:`, projectError);
          }
        }
      }
    }

    // Conversion et application des filtres
    let collaborators: CollaboratorSearchResult[] = Array.from(searchResults.values()).map(user => {
      const userRolesList = userRoles.get(user.accountId) || [];
      const userProjectsList = userProjects.get(user.accountId) || [];
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
        projects: userProjectsList,
        permissions: userRolesList
      };
    });

    // Application des filtres
    if (filters.active !== undefined) {
      collaborators = collaborators.filter(c => c.active === filters.active);
    }

    if (filters.role) {
      collaborators = collaborators.filter(c => c.role.toLowerCase().includes(filters.role!.toLowerCase()));
    }

    if (filters.department) {
      collaborators = collaborators.filter(c => c.department.toLowerCase().includes(filters.department!.toLowerCase()));
    }

    if (filters.query && !filters.projectKey) {
      const queryLower = filters.query.toLowerCase();
      collaborators = collaborators.filter(c => 
        c.name.toLowerCase().includes(queryLower) ||
        c.email.toLowerCase().includes(queryLower) ||
        c.role.toLowerCase().includes(queryLower) ||
        c.department.toLowerCase().includes(queryLower)
      );
    }

    // Tri
    collaborators.sort((a, b) => {
      const aValue = a[filters.sortBy!];
      const bValue = b[filters.sortBy!];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      }
      
      return 0;
    });

    const total = collaborators.length;
    
    // Pagination
    const paginatedResults = collaborators.slice(filters.offset, filters.offset! + filters.limit!);

    console.log(`✅ ${paginatedResults.length}/${total} collaborateurs trouvés`);

    return NextResponse.json({
      success: true,
      collaborators: paginatedResults,
      total,
      offset: filters.offset,
      limit: filters.limit,
      source: 'jira-search',
      filters: filters,
      domain: JIRA_CONFIG.domain
    }, { 
      headers: { 
        'Content-Type': 'application/json; charset=utf-8' 
      } 
    });

  } catch (error) {
    console.error("❌ Erreur recherche collaborateurs:", error);
    
    return NextResponse.json({ 
      success: false, 
      collaborators: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Erreur de recherche'
    }, { status: 500 });
  }
}

// POST /api/mcp/collaborators/search - Recherche complexe avec body
export async function POST(request: NextRequest) {
  try {
    const searchCriteria = await request.json();
    console.log("🔍 Recherche avancée collaborateurs:", searchCriteria);

    // ✅ Token Jira requis  
    if (!JIRA_CONFIG.token) {
      return NextResponse.json({
        success: false,
        collaborators: [],
        error: 'Configuration Jira requise'
      }, { status: 401 });
    }

    // Pour l'instant, rediriger vers GET avec query params
    const queryParams = new URLSearchParams();
    
    if (searchCriteria.query) queryParams.set('query', searchCriteria.query);
    if (searchCriteria.projectKey) queryParams.set('projectKey', searchCriteria.projectKey);
    if (searchCriteria.role) queryParams.set('role', searchCriteria.role);
    if (searchCriteria.department) queryParams.set('department', searchCriteria.department);
    if (searchCriteria.active !== undefined) queryParams.set('active', searchCriteria.active.toString());
    if (searchCriteria.limit) queryParams.set('limit', searchCriteria.limit.toString());
    if (searchCriteria.offset) queryParams.set('offset', searchCriteria.offset.toString());

    const searchUrl = new URL(`${request.nextUrl.origin}/api/mcp/collaborators/search?${queryParams.toString()}`);
    
    return Response.redirect(searchUrl.toString(), 302);

  } catch (error) {
    console.error("❌ Erreur recherche POST:", error);
    
    return NextResponse.json({
      success: false,
      collaborators: [],
      error: error instanceof Error ? error.message : 'Erreur de recherche'
    }, { status: 500 });
  }
}
