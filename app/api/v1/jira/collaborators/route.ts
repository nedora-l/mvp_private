import { type NextRequest, NextResponse } from "next/server"

/**
 * Jira Collaborators API - v1 Architecture
 * Remplacera progressivement /api/mcp/collaborators
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
    'Content-Type': 'application/json; charset=utf-8'
  };
};

// Mapping automatique des rôles basé sur les permissions Jira (copié de MCP pour compatibilité)
const mapUserRole = (userRoles: string[]): string => {
  if (userRoles.includes('Administrators')) return 'Admin';
  if (userRoles.includes('Project Lead')) return 'Project Lead';
  if (userRoles.includes('Developers')) return 'Developer';
  if (userRoles.includes('Users')) return 'User';
  
  return 'Collaborator';
};

// ✅ MAPPING INTELLIGENT DES DÉPARTEMENTS (amélioré)
const mapDepartmentIntelligently = (user: any): string => {
  const email = user.emailAddress?.toLowerCase() || '';
  const name = user.displayName?.toLowerCase() || '';
  
  // Mapping basé sur l'email/nom avec mots-clés étendus
  if (email.includes('ceo') || email.includes('directeur') || email.includes('manager') || 
      name.includes('ceo') || name.includes('directeur') || name.includes('manager')) {
    return 'Management';
  }
  
  if (email.includes('dev') || email.includes('tech') || email.includes('engineer') ||
      name.includes('developer') || name.includes('engineer') || name.includes('programmeur')) {
    return 'Development';
  }
  
  if (email.includes('rh') || email.includes('hr') || email.includes('human') ||
      name.includes('ressources') || name.includes('human')) {
    return 'Ressources Humaines';
  }
  
  if (email.includes('compta') || email.includes('accounting') || email.includes('finance') ||
      name.includes('comptable') || name.includes('finance')) {
    return 'Comptabilité';
  }
  
  if (email.includes('qa') || email.includes('test') || email.includes('quality') ||
      name.includes('testeur') || name.includes('quality')) {
    return 'Quality Assurance';
  }
  
  if (email.includes('design') || email.includes('ui') || email.includes('ux') ||
      name.includes('designer') || name.includes('graphiste')) {
    return 'Design';
  }
  
  if (email.includes('marketing') || email.includes('comm') ||
      name.includes('marketing') || name.includes('communication')) {
    return 'Marketing';
  }
  
  if (email.includes('sales') || email.includes('commercial') ||
      name.includes('sales') || name.includes('commercial')) {
    return 'Sales';
  }
  
  if (email.includes('support') || email.includes('helpdesk') ||
      name.includes('support') || name.includes('assistance')) {
    return 'Support Client';
  }
  
  // Fallback intelligent basé sur le domaine email
  if (email.includes('@dev.') || email.includes('@tech.')) return 'Development';
  if (email.includes('@admin.') || email.includes('@manager.')) return 'Management';
  
  return 'General';
};

// ✅ MAPPING INTELLIGENT DES RÔLES (amélioré)  
const mapRoleIntelligently = (user: any): string => {
  const email = user.emailAddress?.toLowerCase() || '';
  const name = user.displayName?.toLowerCase() || '';
  
  // Détection de rôles spécifiques
  if (email.includes('ceo') || name.includes('ceo') || 
      email.includes('directeur') || name.includes('directeur')) {
    return 'CEO';
  }
  
  if (email.includes('manager') || name.includes('manager') ||
      email.includes('lead') || name.includes('lead')) {
    return 'Project Lead';
  }
  
  if (email.includes('senior') || name.includes('senior') ||
      email.includes('architect') || name.includes('architect')) {
    return 'Senior Developer';
  }
  
  if (email.includes('dev') || name.includes('developer') ||
      email.includes('engineer') || name.includes('engineer')) {
    return 'Developer';
  }
  
  if (email.includes('qa') || name.includes('testeur') ||
      email.includes('test') || name.includes('quality')) {
    return 'QA Engineer';
  }
  
  if (email.includes('design') || name.includes('designer') ||
      email.includes('ui') || name.includes('ux')) {
    return 'Designer';
  }
  
  if (email.includes('rh') || email.includes('hr') ||
      name.includes('ressources') || name.includes('human')) {
    return 'HR Manager';
  }
  
  if (email.includes('compta') || email.includes('accounting') ||
      name.includes('comptable') || name.includes('finance')) {
    return 'Accountant';
  }
  
  return 'Collaborator';
};

// Interface pour la réponse v1
interface JiraCollaboratorResponse {
  status: number;
  message: string;
  data: any;
  type: string;
  source: string;
}

// GET /api/v1/jira/collaborators - Récupère tous les collaborateurs Jira
export async function GET(request: NextRequest) {
  try {
    console.log("🔗 [v1] Récupération des collaborateurs depuis Jira...");
    
    // ✅ VALIDATION COMPLÈTE DES VARIABLES D'ENVIRONNEMENT
    if (!JIRA_CONFIG.domain || !JIRA_CONFIG.email || !JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ [v1] Configuration Jira incomplète:", {
        domain: !!JIRA_CONFIG.domain,
        email: !!JIRA_CONFIG.email,
        token: !!JIRA_CONFIG.token
      });
      return NextResponse.json({ 
        status: 401,
        message: "Configuration Jira incomplète. Veuillez vérifier vos paramètres d'environnement.",
        solution: "Assurez-vous que JIRA_DOMAIN, JIRA_EMAIL et JIRA_API_TOKEN sont définis dans votre fichier .env.",
        error: "Configuration Jira incomplète",
        type: "ERROR",
        source: 'jira-config-error'
      }, { status: 401 });
    }

    console.log(`🔗 [v1] Configuration Jira validée pour ${JIRA_CONFIG.domain}`);

    // ✅ CONNEXION JIRA ROBUSTE : Endpoints avec paramètres requis
    let users = [];
    let usedEndpoint = '';
    
    // 🔄 ENDPOINT 1 : /rest/api/3/user/assignable/search avec projet requis
    try {
      console.log("🔍 [v1] Test endpoint 1: /rest/api/3/user/assignable/search");
      
      const usersResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/api/3/user/assignable/search?projectKeys=SSP&maxResults=50`, {
        method: 'GET',
        headers: getJiraHeaders()
      });

      if (usersResponse.ok) {
        users = await usersResponse.json();
        usedEndpoint = '/rest/api/3/user/assignable/search';
        console.log(`✅ [v1] Endpoint 1 réussi - ${users.length} utilisateurs récupérés`);
      } else {
        const errorText = await usersResponse.text();
        console.warn(`⚠️ [v1] Endpoint 1 échoué: ${usersResponse.status} - ${errorText}`);
        throw new Error(`Endpoint 1 échoué: ${usersResponse.status}`);
      }
    } catch (error1) {
      console.warn("⚠️ [v1] Endpoint 1 échoué, test endpoint 2...", error1);
      
      // 🔄 ENDPOINT 2 : /rest/api/3/user/search avec query 
      try {
        console.log("🔍 [v1] Test endpoint 2: /rest/api/3/user/search");
        
        const usersResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/api/3/user/search?query=@&maxResults=50`, {
          method: 'GET',
          headers: getJiraHeaders()
        });

        if (usersResponse.ok) {
          users = await usersResponse.json();
          usedEndpoint = '/rest/api/3/user/search';
          console.log(`✅ [v1] Endpoint 2 réussi - ${users.length} utilisateurs récupérés`);
        } else {
          const errorText = await usersResponse.text();
          console.warn(`⚠️ [v1] Endpoint 2 échoué: ${usersResponse.status} - ${errorText}`);
          throw new Error(`Endpoint 2 échoué: ${usersResponse.status}`);
        }
      } catch (error2) {
        console.warn("⚠️ [v1] Endpoint 2 échoué, test endpoint 3...", error2);
        
        // 🔄 ENDPOINT 3 : /rest/api/2/user/search (legacy) avec query
        try {
          console.log("🔍 [v1] Test endpoint 3: /rest/api/2/user/search");
          
          const usersResponse = await fetch(`https://${JIRA_CONFIG.domain}/rest/api/2/user/search?query=.&maxResults=50`, {
            method: 'GET',
            headers: getJiraHeaders()
          });

          if (usersResponse.ok) {
            users = await usersResponse.json();
            usedEndpoint = '/rest/api/2/user/search';
            console.log(`✅ [v1] Endpoint 3 réussi - ${users.length} utilisateurs récupérés`);
          } else {
            const errorText = await usersResponse.text();
            console.warn(`⚠️ [v1] Endpoint 3 échoué: ${usersResponse.status} - ${errorText}`);
            throw new Error(`Endpoint 3 échoué: ${usersResponse.status}`);
          }
        } catch (error3) {
          console.error("❌ [v1] Tous les endpoints échoués:", { error1, error2, error3 });
          
          // ✅ FALLBACK INFORMATIF au lieu de crash
          return NextResponse.json({ 
            status: 503,
            message: "Service Jira temporairement indisponible - Impossible de récupérer les collaborateurs",
            solution: "Vérifiez que votre token API Jira a les permissions nécessaires pour accéder aux utilisateurs",
            error: "Tous les endpoints utilisateurs Jira ont échoué",
            data: {
              _embedded: { collaborators: [] },
              _links: { self: { href: "/api/v1/jira/collaborators" } },
              page: { size: 0, totalElements: 0, totalPages: 0, number: 0 }
            },
            type: "ERROR",
            source: 'jira-service-unavailable'
          }, { status: 503 });
        }
      }
    }
    // ✅ FILTRAGE DES VRAIS UTILISATEURS (pas les bots système)
    const isRealUser = (user: any): boolean => {
      // Filtrer les bots/intégrations système Atlassian
      const botKeywords = ['Integration', 'Bot', 'Atlas', 'Assist', 'Service', 'Automation', 'App'];
      const isBot = botKeywords.some(keyword => 
        user.displayName?.includes(keyword) || 
        user.name?.includes(keyword)
      );
      
      // Garder seulement les vrais utilisateurs avec email valide
      return user.accountId && 
             user.displayName && 
             user.emailAddress &&
             user.emailAddress.includes('@') &&
             user.accountType === 'atlassian' &&
             !isBot;
    };

    console.log(`🔍 [v1] Filtrage des ${users.length} utilisateurs récupérés...`);
    
    const realUsers = users.filter(isRealUser);
    console.log(`✅ [v1] ${realUsers.length} vrais utilisateurs identifiés (${users.length - realUsers.length} bots filtrés)`);

    // ✅ TRAITEMENT DES VRAIS UTILISATEURS SEULEMENT
    const allUsers = new Map();

    // Traiter chaque vrai utilisateur
    realUsers.forEach((user: any) => {
      allUsers.set(user.accountId, {
        accountId: user.accountId,
        displayName: user.displayName,
        emailAddress: user.emailAddress,
        roles: ['User'], // Rôle par défaut
        projects: [] // Projets vides pour l'instant
      });
    });

    // ✅ CONVERSION VERS FORMAT D&A WORKSPACE AVEC MAPPING INTELLIGENT
    const collaborators = Array.from(allUsers.values()).map((user: any, index: number) => {
      const role = mapRoleIntelligently(user);
      const department = mapDepartmentIntelligently(user);
      
      return {
        id: index + 100, // ID unique numérique pour éviter les conflits
        name: user.displayName,
        email: user.emailAddress,
        role: role,
        department: department,
        active: true,
        avatar: `https://${JIRA_CONFIG.domain}/secure/useravatar?avatarId=10123`, // Avatar par défaut
        jiraAccountId: user.accountId,
        dateAdded: new Date().toISOString(),
        permissions: user.roles,
        projects: user.projects,
        _links: {
          self: { href: `/api/v1/jira/collaborators/${user.accountId}` }
        }
      };
    });

    console.log(`✅ [v1] ${collaborators.length} collaborateurs récupérés depuis Jira via ${usedEndpoint}`);

    const responseData: JiraCollaboratorResponse = {
      status: 200,
      message: `Collaborateurs Jira récupérés avec succès via ${usedEndpoint}`,
      data: {
        _embedded: { collaborators },
        _links: {
          self: { href: "/api/v1/jira/collaborators" }
        },
        page: {
          size: collaborators.length,
          totalElements: collaborators.length,
          totalPages: 1,
          number: 0
        }
      },
      type: "HATEOAS_RECORD_LIST",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error critique dans l'API collaborators:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur critique dans l'API collaborators",
      data: null,
      type: "ERROR",
      source: 'api-error'
    }, { status: 500 });
  }
}

// POST /api/v1/jira/collaborators - Crée un nouveau collaborateur Jira
export async function POST(request: NextRequest) {
  try {
    console.log("🔄 [v1] Création de collaborateur Jira via v1 API...");
    
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
    if (!body.email || !body.name) {
      return NextResponse.json({ 
        status: 400,
        message: "L'email et le nom d'affichage sont requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    console.log(`🔄 [v1] Tentative de création utilisateur Jira: ${body.email}`);

    // Création de l'utilisateur Jira avec structure corrigée
    const userData = {
      emailAddress: body.email,
      displayName: body.name,
      name: body.email.split('@')[0] // username basé sur la partie avant @
    };

    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/2/user`;
    const response = await fetch(jiraUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const jiraUser = await response.json();
    console.log(`✅ [v1] Collaborateur Jira créé: ${jiraUser.displayName}`);

    // ✅ RÉPONSE AU FORMAT V1 AVEC MAPPING INTELLIGENT
    const createdCollaborator = {
      id: Date.now(),
      name: jiraUser.displayName,
      email: jiraUser.emailAddress,
      role: body.role || mapRoleIntelligently(jiraUser),
      department: body.department || mapDepartmentIntelligently(jiraUser),
      active: true,
      avatar: `https://${JIRA_CONFIG.domain}/secure/useravatar?avatarId=10123`,
      jiraAccountId: jiraUser.accountId,
      dateAdded: new Date().toISOString(),
      permissions: [body.role || 'Collaborator'],
      projects: body.projects || [],
      _links: {
        self: { href: `/api/v1/jira/collaborators/${jiraUser.accountId}` }
      }
    };

    const responseData: JiraCollaboratorResponse = {
      status: 201,
      message: "Collaborateur Jira créé avec succès",
      data: createdCollaborator,
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 201 });
    
  } catch (error) {
    console.error("❌ [v1] Error creating collaborator in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la création du collaborateur Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// PUT /api/v1/jira/collaborators - Met à jour un collaborateur Jira
export async function PUT(request: NextRequest) {
  try {
    console.log("🔄 [v1] Mise à jour de collaborateur Jira via v1 API...");
    
    if (!JIRA_CONFIG.domain || !JIRA_CONFIG.email || !JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      return NextResponse.json({ 
        status: 401,
        message: "Configuration Jira incomplète",
        data: null,
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.jiraAccountId) {
      return NextResponse.json({ 
        status: 400,
        message: "L'ID du compte Jira est requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    console.log(`🔄 [v1] Modification utilisateur Jira: ${body.jiraAccountId}`);

    // ✅ MISE À JOUR UTILISATEUR JIRA AVEC SUPPORT COMPLET
    const updateData: any = {
      accountId: body.jiraAccountId
    };
    
    if (body.name || body.displayName) {
      updateData.displayName = body.name || body.displayName;
    }
    if (body.email || body.emailAddress) {
      updateData.emailAddress = body.email || body.emailAddress;
    }

    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/2/user`;
    const response = await fetch(jiraUrl, {
      method: 'PUT',
      headers: getJiraHeaders(),
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [v1] Erreur Jira PUT: ${response.status} - ${errorText}`);
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const updatedUser = await response.json();
    console.log(`✅ [v1] Collaborateur Jira mis à jour: ${updatedUser.displayName}`);

    // ✅ RÉPONSE COMPLÈTE AVEC MAPPING INTELLIGENT
    const updatedCollaborator = {
      id: body.id || Date.now(),
      name: updatedUser.displayName,
      email: updatedUser.emailAddress,
      role: body.role || mapRoleIntelligently(updatedUser),
      department: body.department || mapDepartmentIntelligently(updatedUser),
      active: updatedUser.active !== false,
      avatar: `https://${JIRA_CONFIG.domain}/secure/useravatar?avatarId=10123`,
      jiraAccountId: updatedUser.accountId,
      dateAdded: body.dateAdded || new Date().toISOString(),
      permissions: [body.role || 'Collaborator'],
      projects: body.projects || [],
      updated: new Date().toISOString(),
      _links: {
        self: { href: `/api/v1/jira/collaborators/${updatedUser.accountId}` }
      }
    };

    const responseData: JiraCollaboratorResponse = {
      status: 200,
      message: "Collaborateur Jira mis à jour avec succès",
      data: updatedCollaborator,
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error updating collaborator in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la mise à jour du collaborateur Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}

// DELETE /api/v1/jira/collaborators - Supprime un collaborateur Jira
export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ [v1] Suppression de collaborateur Jira via v1 API...");
    
    if (!JIRA_CONFIG.domain || !JIRA_CONFIG.email || !JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      return NextResponse.json({ 
        status: 401,
        message: "Configuration Jira incomplète",
        data: null,
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jiraAccountId = searchParams.get("jiraAccountId") || searchParams.get("id");
    
    if (!jiraAccountId) {
      return NextResponse.json({ 
        status: 400,
        message: "L'ID du compte Jira est requis (jiraAccountId ou id)",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    console.log(`🗑️ [v1] Suppression utilisateur Jira: ${jiraAccountId}`);

    // ✅ SUPPRESSION UTILISATEUR JIRA AVEC GESTION D'ERREURS ROBUSTE
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/api/2/user?accountId=${jiraAccountId}`;
    const response = await fetch(jiraUrl, {
      method: 'DELETE',
      headers: getJiraHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // ✅ GESTION INTELLIGENTE DES ERREURS JIRA
      if (response.status === 404) {
        console.warn(`⚠️ [v1] Utilisateur déjà supprimé ou inexistant: ${jiraAccountId}`);
        return NextResponse.json({ 
          status: 200,
          message: "Utilisateur déjà supprimé ou inexistant",
          data: { jiraAccountId, deleted: true, alreadyDeleted: true },
          type: "RECORD_DETAILS",
          source: 'jira'
        }, { status: 200 });
      }
      
      if (response.status === 403) {
        console.error(`❌ [v1] Permissions insuffisantes pour supprimer: ${jiraAccountId}`);
        return NextResponse.json({ 
          status: 403,
          message: "Permissions insuffisantes pour supprimer cet utilisateur",
          data: null,
          type: "ERROR",
          source: 'jira-permissions'
        }, { status: 403 });
      }
      
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ [v1] Collaborateur Jira supprimé: ${jiraAccountId}`);

    const responseData: JiraCollaboratorResponse = {
      status: 200,
      message: "Collaborateur Jira supprimé avec succès",
      data: { 
        jiraAccountId, 
        deleted: true, 
        deletedAt: new Date().toISOString() 
      },
      type: "RECORD_DETAILS",
      source: 'jira'
    };

    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("❌ [v1] Error deleting collaborator in Jira:", error);
    return NextResponse.json({ 
      status: 500,
      message: "Erreur lors de la suppression du collaborateur Jira",
      data: null,
      type: "ERROR",
      source: 'jira-error'
    }, { status: 500 });
  }
}
