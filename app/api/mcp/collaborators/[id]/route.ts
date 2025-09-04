import { NextRequest, NextResponse } from 'next/server';

/**
 * API MCP - Gestion individuelle des collaborateurs Jira
 * PUT: Assigner rôles/projets à un utilisateur existant
 * DELETE: Retirer un utilisateur des projets/organisation
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
    'Content-Type': 'application/json; charset=utf-8'
  };
};

// PUT /api/mcp/collaborators/[id] - Modifier rôles/assignations d'un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { role, projectKey, department } = await request.json();
    const accountId = params.id;
    
    console.log("🔄 Modification collaborateur:", { accountId, role, projectKey, department });
    
    // ✅ Token Jira requis
    if (!JIRA_CONFIG.token) {
      return NextResponse.json({
        success: false,
        error: 'Configuration Jira requise'
      }, { status: 401 });
    }

    // Vérifier que l'utilisateur existe
    const userResponse = await fetch(
      `https://${JIRA_CONFIG.domain}/rest/api/3/user?accountId=${accountId}`,
      { headers: getJiraHeaders() }
    );

    if (!userResponse.ok) {
      return NextResponse.json({
        success: false,
        error: `Utilisateur introuvable: ${accountId}`
      }, { status: 404 });
    }

    const user = await userResponse.json();
    console.log(`✅ Utilisateur trouvé: ${user.displayName}`);

    // Si un projet est spécifié, assigner le rôle
    if (projectKey && role) {
      try {
        // Mapping des rôles vers les rôles Jira
        const roleMapping = {
          'Admin': 'Administrators',
          'Project Lead': 'Project Lead', 
          'Developer': 'Developers',
          'User': 'Users',
          'Collaborator': 'Users'
        };

        const jiraRole = roleMapping[role as keyof typeof roleMapping] || 'Users';
        
        // Récupérer les rôles du projet
        const rolesResponse = await fetch(
          `https://${JIRA_CONFIG.domain}/rest/api/3/project/${projectKey}/role`,
          { headers: getJiraHeaders() }
        );

        if (!rolesResponse.ok) {
          throw new Error(`Projet introuvable: ${projectKey}`);
        }

        const roles = await rolesResponse.json();
        const targetRoleUrl = roles[jiraRole];

        if (!targetRoleUrl) {
          throw new Error(`Rôle '${jiraRole}' introuvable dans le projet ${projectKey}`);
        }

        const roleId = targetRoleUrl.split('/').pop();

        // Assigner l'utilisateur au rôle
        const assignResponse = await fetch(
          `https://${JIRA_CONFIG.domain}/rest/api/3/project/${projectKey}/role/${roleId}`,
          {
            method: 'POST',
            headers: getJiraHeaders(),
            body: JSON.stringify({
              user: [accountId]
            })
          }
        );

        if (!assignResponse.ok) {
          const errorText = await assignResponse.text();
          console.warn(`⚠️ Erreur assignation rôle: ${errorText}`);
        } else {
          console.log(`✅ Utilisateur ${user.displayName} assigné au rôle ${jiraRole} dans ${projectKey}`);
        }

      } catch (roleError) {
        console.error("❌ Erreur assignation rôle:", roleError);
        return NextResponse.json({
          success: false,
          error: `Erreur assignation: ${roleError instanceof Error ? roleError.message : 'Erreur inconnue'}`
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Collaborateur ${user.displayName} mis à jour avec succès`,
      collaborator: {
        id: user.accountId,
        name: user.displayName,
        email: user.emailAddress,
        role: role || 'User',
        department: department || 'General',
        active: user.active,
        jiraAccountId: user.accountId
      }
    });

  } catch (error) {
    console.error("❌ Erreur modification collaborateur:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de modification'
    }, { status: 500 });
  }
}

// DELETE /api/mcp/collaborators/[id] - Retirer utilisateur des projets
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = params.id;
    console.log("🗑️ Suppression collaborateur:", accountId);
    
    // ✅ Token Jira requis
    if (!JIRA_CONFIG.token) {
      return NextResponse.json({
        success: false,
        error: 'Configuration Jira requise'
      }, { status: 401 });
    }

    // Vérifier que l'utilisateur existe
    const userResponse = await fetch(
      `https://${JIRA_CONFIG.domain}/rest/api/3/user?accountId=${accountId}`,
      { headers: getJiraHeaders() }
    );

    if (!userResponse.ok) {
      return NextResponse.json({
        success: false,
        error: `Utilisateur introuvable: ${accountId}`
      }, { status: 404 });
    }

    const user = await userResponse.json();
    console.log(`✅ Utilisateur trouvé: ${user.displayName}`);

    // Récupérer tous les projets pour retirer l'utilisateur
    const projectsResponse = await fetch(
      `https://${JIRA_CONFIG.domain}/rest/api/3/project`,
      { headers: getJiraHeaders() }
    );

    if (!projectsResponse.ok) {
      throw new Error('Erreur récupération projets');
    }

    const projects = await projectsResponse.json();
    let removedCount = 0;

    // Retirer l'utilisateur de tous les rôles de tous les projets
    for (const project of projects) {
      try {
        const rolesResponse = await fetch(
          `https://${JIRA_CONFIG.domain}/rest/api/3/project/${project.key}/role`,
          { headers: getJiraHeaders() }
        );

        if (rolesResponse.ok) {
          const roles = await rolesResponse.json();
          
          // Pour chaque rôle, vérifier si l'utilisateur est assigné et le retirer
          for (const [roleName, roleUrl] of Object.entries(roles)) {
            try {
              const roleId = String(roleUrl).split('/').pop();
              
              // Récupérer les acteurs du rôle
              const actorsResponse = await fetch(
                `https://${JIRA_CONFIG.domain}/rest/api/3/project/${project.key}/role/${roleId}`,
                { headers: getJiraHeaders() }
              );

              if (actorsResponse.ok) {
                const roleData = await actorsResponse.json();
                
                // Vérifier si l'utilisateur est dans ce rôle
                const isUserInRole = roleData.actors?.some((actor: any) => 
                  actor.type === 'atlassian-user-role-actor' && 
                  actor.actorUser?.accountId === accountId
                );

                if (isUserInRole) {
                  // Retirer l'utilisateur du rôle
                  const removeResponse = await fetch(
                    `https://${JIRA_CONFIG.domain}/rest/api/3/project/${project.key}/role/${roleId}?user=${accountId}`,
                    { 
                      method: 'DELETE',
                      headers: getJiraHeaders()
                    }
                  );

                  if (removeResponse.ok) {
                    console.log(`✅ Utilisateur retiré du rôle ${roleName} dans ${project.key}`);
                    removedCount++;
                  }
                }
              }
            } catch (roleError) {
              console.warn(`⚠️ Erreur vérification rôle ${roleName}:`, roleError);
            }
          }
        }
      } catch (projectError) {
        console.warn(`⚠️ Erreur projet ${project.key}:`, projectError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Utilisateur ${user.displayName} retiré de ${removedCount} rôle(s)`,
      removedFromRoles: removedCount,
      note: 'L\'utilisateur reste dans l\'organisation Atlassian. Pour le supprimer complètement, utilisez l\'interface d\'administration.'
    });

  } catch (error) {
    console.error("❌ Erreur suppression collaborateur:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de suppression'
    }, { status: 500 });
  }
}
