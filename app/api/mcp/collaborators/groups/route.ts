import { NextRequest, NextResponse } from 'next/server';

/**
 * API MCP - Gestion des groupes Jira
 * Endpoint: GET/POST/PUT/DELETE /api/mcp/collaborators/groups
 * Fonctionnalités:
 * - Lister tous les groupes disponibles
 * - Ajouter/retirer utilisateurs des groupes
 * - Créer/supprimer des groupes (si permissions suffisantes)
 * - Rechercher dans les groupes
 */

interface JiraGroup {
  name: string;
  groupId?: string;
  self: string;
}

interface GroupMember {
  accountId: string;
  displayName: string;
  emailAddress: string;
  active: boolean;
}

interface GroupDetails extends JiraGroup {
  members: GroupMember[];
  memberCount: number;
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

// GET /api/mcp/collaborators/groups - Lister tous les groupes Jira
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const groupName = url.searchParams.get('name');
    const includeMembers = url.searchParams.get('includeMembers') === 'true';
    const maxResults = parseInt(url.searchParams.get('maxResults') || '50');
    
    console.log("👥 Récupération groupes Jira:", { groupName, includeMembers, maxResults });
    
    // ✅ Token Jira requis
    if (!JIRA_CONFIG.token) {
      return NextResponse.json({ 
        success: false, 
        groups: [],
        error: 'Token Jira non configuré'
      }, { status: 401 });
    }

    let groups: GroupDetails[] = [];

    if (groupName) {
      // Récupérer un groupe spécifique
      console.log(`🎯 Récupération du groupe: ${groupName}`);
      
      const groupResponse = await fetch(
        `https://${JIRA_CONFIG.domain}/rest/api/3/group?groupname=${encodeURIComponent(groupName)}&expand=users`,
        { headers: getJiraHeaders() }
      );

      if (!groupResponse.ok) {
        if (groupResponse.status === 404) {
          return NextResponse.json({
            success: false,
            error: `Groupe '${groupName}' introuvable`
          }, { status: 404 });
        }
        throw new Error(`Erreur récupération groupe: ${groupResponse.status}`);
      }

      const groupData = await groupResponse.json();
      
      const groupDetails: GroupDetails = {
        name: groupData.name,
        groupId: groupData.groupId,
        self: groupData.self,
        members: includeMembers ? (groupData.users?.items || []).map((user: any) => ({
          accountId: user.accountId,
          displayName: user.displayName,
          emailAddress: user.emailAddress,
          active: user.active
        })) : [],
        memberCount: groupData.users?.size || 0,
        permissions: [] // À implémenter si nécessaire
      };

      groups = [groupDetails];

    } else {
      // Récupérer tous les groupes
      console.log("🌐 Récupération de tous les groupes");
      
      const groupsResponse = await fetch(
        `https://${JIRA_CONFIG.domain}/rest/api/3/group/bulk?maxResults=${maxResults}`,
        { headers: getJiraHeaders() }
      );

      if (!groupsResponse.ok) {
        throw new Error(`Erreur récupération groupes: ${groupsResponse.status}`);
      }

      const groupsData = await groupsResponse.json();
      
      // Pour chaque groupe, récupérer les détails si demandé
      for (const group of groupsData.values || []) {
        const groupDetails: GroupDetails = {
          name: group.name,
          groupId: group.groupId,
          self: group.self,
          members: [],
          memberCount: 0,
          permissions: []
        };

        if (includeMembers) {
          try {
            const detailResponse = await fetch(
              `https://${JIRA_CONFIG.domain}/rest/api/3/group?groupname=${encodeURIComponent(group.name)}&expand=users`,
              { headers: getJiraHeaders() }
            );

            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              groupDetails.members = (detailData.users?.items || []).map((user: any) => ({
                accountId: user.accountId,
                displayName: user.displayName,
                emailAddress: user.emailAddress,
                active: user.active
              }));
              groupDetails.memberCount = detailData.users?.size || 0;
            }
          } catch (memberError) {
            console.warn(`⚠️ Erreur récupération membres ${group.name}:`, memberError);
          }
        }

        groups.push(groupDetails);
      }
    }

    console.log(`✅ ${groups.length} groupe(s) récupéré(s)`);

    return NextResponse.json({
      success: true,
      groups,
      total: groups.length,
      source: 'jira-groups',
      domain: JIRA_CONFIG.domain
    }, { 
      headers: { 
        'Content-Type': 'application/json; charset=utf-8' 
      } 
    });

  } catch (error) {
    console.error("❌ Erreur récupération groupes:", error);
    
    return NextResponse.json({ 
      success: false, 
      groups: [],
      error: error instanceof Error ? error.message : 'Erreur récupération groupes'
    }, { status: 500 });
  }
}

// POST /api/mcp/collaborators/groups - Ajouter utilisateur à un groupe
export async function POST(request: NextRequest) {
  try {
    const { groupName, userAccountId, action = 'addMember' } = await request.json();
    
    console.log("➕ Ajout utilisateur au groupe:", { groupName, userAccountId, action });
    
    // ✅ Token Jira requis
    if (!JIRA_CONFIG.token) {
      return NextResponse.json({
        success: false,
        error: 'Configuration Jira requise'
      }, { status: 401 });
    }

    if (action === 'addMember') {
      // Ajouter un utilisateur au groupe
      const addResponse = await fetch(
        `https://${JIRA_CONFIG.domain}/rest/api/3/group/user?groupname=${encodeURIComponent(groupName)}`,
        {
          method: 'POST',
          headers: getJiraHeaders(),
          body: JSON.stringify({
            accountId: userAccountId
          })
        }
      );

      if (!addResponse.ok) {
        const errorText = await addResponse.text();
        console.error("❌ Erreur ajout au groupe:", errorText);
        
        return NextResponse.json({
          success: false,
          error: `Erreur ajout au groupe: ${addResponse.status} ${errorText}`
        }, { status: addResponse.status });
      }

      console.log(`✅ Utilisateur ${userAccountId} ajouté au groupe ${groupName}`);

      return NextResponse.json({
        success: true,
        message: `Utilisateur ajouté au groupe ${groupName} avec succès`,
        groupName,
        userAccountId
      });

    } else if (action === 'createGroup') {
      // Créer un nouveau groupe (nécessite permissions admin)
      const createResponse = await fetch(
        `https://${JIRA_CONFIG.domain}/rest/api/3/group`,
        {
          method: 'POST',
          headers: getJiraHeaders(),
          body: JSON.stringify({
            name: groupName
          })
        }
      );

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error("❌ Erreur création groupe:", errorText);
        
        return NextResponse.json({
          success: false,
          error: `Erreur création groupe: ${createResponse.status} ${errorText}`
        }, { status: createResponse.status });
      }

      const newGroup = await createResponse.json();
      console.log(`✅ Groupe ${groupName} créé avec succès`);

      return NextResponse.json({
        success: true,
        message: `Groupe ${groupName} créé avec succès`,
        group: newGroup
      });
    }

    return NextResponse.json({
      success: false,
      error: `Action '${action}' non supportée`
    }, { status: 400 });

  } catch (error) {
    console.error("❌ Erreur opération groupe POST:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur opération groupe'
    }, { status: 500 });
  }
}

// DELETE /api/mcp/collaborators/groups - Retirer utilisateur d'un groupe
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const groupName = url.searchParams.get('groupName');
    const userAccountId = url.searchParams.get('userAccountId');
    const deleteGroup = url.searchParams.get('deleteGroup') === 'true';
    
    console.log("➖ Opération suppression groupe:", { groupName, userAccountId, deleteGroup });
    
    // ✅ Token Jira requis
    if (!JIRA_CONFIG.token) {
      return NextResponse.json({
        success: false,
        error: 'Configuration Jira requise'
      }, { status: 401 });
    }

    if (deleteGroup && groupName) {
      // Supprimer le groupe entier (nécessite permissions admin)
      const deleteResponse = await fetch(
        `https://${JIRA_CONFIG.domain}/rest/api/3/group?groupname=${encodeURIComponent(groupName)}`,
        {
          method: 'DELETE',
          headers: getJiraHeaders()
        }
      );

      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.error("❌ Erreur suppression groupe:", errorText);
        
        return NextResponse.json({
          success: false,
          error: `Erreur suppression groupe: ${deleteResponse.status} ${errorText}`
        }, { status: deleteResponse.status });
      }

      console.log(`✅ Groupe ${groupName} supprimé avec succès`);

      return NextResponse.json({
        success: true,
        message: `Groupe ${groupName} supprimé avec succès`
      });

    } else if (groupName && userAccountId) {
      // Retirer un utilisateur du groupe
      const removeResponse = await fetch(
        `https://${JIRA_CONFIG.domain}/rest/api/3/group/user?groupname=${encodeURIComponent(groupName)}&accountId=${userAccountId}`,
        {
          method: 'DELETE',
          headers: getJiraHeaders()
        }
      );

      if (!removeResponse.ok) {
        const errorText = await removeResponse.text();
        console.error("❌ Erreur retrait du groupe:", errorText);
        
        return NextResponse.json({
          success: false,
          error: `Erreur retrait du groupe: ${removeResponse.status} ${errorText}`
        }, { status: removeResponse.status });
      }

      console.log(`✅ Utilisateur ${userAccountId} retiré du groupe ${groupName}`);

      return NextResponse.json({
        success: true,
        message: `Utilisateur retiré du groupe ${groupName} avec succès`,
        groupName,
        userAccountId
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Paramètres manquants: groupName et/ou userAccountId requis'
    }, { status: 400 });

  } catch (error) {
    console.error("❌ Erreur opération groupe DELETE:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur opération groupe'
    }, { status: 500 });
  }
}
