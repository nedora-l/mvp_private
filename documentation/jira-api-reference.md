# Jira Cloud REST API v3 - Guide de Référence

## 📋 Vue d'ensemble

Cette documentation couvre les APIs Jira Cloud REST v3 essentielles pour notre intégration DA Workspace MVP.

## 🔐 Authentification

```javascript
const getJiraHeaders = () => {
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};
```

## 🏗️ API Projets

### 1. Créer un Projet
```javascript
// POST /rest/api/3/project
const createProject = async (projectData) => {
  const payload = {
    key: "PROJ123",                    // Clé unique (2-10 chars, majuscules)
    name: "Mon Projet",               // Nom du projet
    projectTypeKey: "software",       // "software" | "business" | "service_desk"
    projectTemplateKey: "com.pyxis.greenhopper.jira:gh-simplified-agility-scrum", // Template
    leadAccountId: "5b10a2844c20165700ede21g", // Account ID du lead
    description: "Description du projet",
    assigneeType: "PROJECT_LEAD"      // Qui assigne par défaut
  };
  
  const response = await fetch(`https://${domain}/rest/api/3/project`, {
    method: 'POST',
    headers: getJiraHeaders(),
    body: JSON.stringify(payload)
  });
  
  return await response.json();
};
```

### 2. Templates de Projets Disponibles

| Template | projectTemplateKey | Usage |
|----------|-------------------|-------|
| **Scrum** | `com.pyxis.greenhopper.jira:gh-simplified-agility-scrum` | Méthodologie Scrum |
| **Kanban** | `com.pyxis.greenhopper.jira:gh-simplified-agility-kanban` | Méthodologie Kanban |
| **Business** | `com.atlassian.jira-core-project-templates:jira-core-simplified-project-management` | Gestion générale |

### 3. Récupérer les Projets
```javascript
// GET /rest/api/3/project
const getProjects = async () => {
  const response = await fetch(`https://${domain}/rest/api/3/project`, {
    headers: getJiraHeaders()
  });
  return await response.json();
};
```

### 4. Obtenir les Détails d'un Projet
```javascript
// GET /rest/api/3/project/{projectIdOrKey}
const getProject = async (projectKey) => {
  const response = await fetch(`https://${domain}/rest/api/3/project/${projectKey}`, {
    headers: getJiraHeaders()
  });
  return await response.json();
};
```

## 👥 API Utilisateurs

### 1. Obtenir l'Utilisateur Actuel
```javascript
// GET /rest/api/3/myself
const getCurrentUser = async () => {
  const response = await fetch(`https://${domain}/rest/api/3/myself`, {
    headers: getJiraHeaders()
  });
  return await response.json();
};

// Réponse type :
// {
//   "accountId": "5b10a2844c20165700ede21g",
//   "displayName": "John Doe",
//   "emailAddress": "john@example.com"
// }
```

### 2. Rechercher des Utilisateurs
```javascript
// GET /rest/api/3/user/search
const searchUsers = async (query) => {
  const response = await fetch(
    `https://${domain}/rest/api/3/user/search?query=${encodeURIComponent(query)}`,
    { headers: getJiraHeaders() }
  );
  return await response.json();
};
```

## 🏷️ API Issues (Tâches)

### 1. Créer une Issue
```javascript
// POST /rest/api/3/issue
const createIssue = async (issueData) => {
  const payload = {
    fields: {
      project: { key: "PROJ123" },
      summary: "Titre de la tâche",
      description: "Description de la tâche",
      issuetype: { name: "Task" },      // "Task", "Story", "Bug", etc.
      assignee: { accountId: "5b10a2844c20165700ede21g" },
      priority: { name: "Medium" },     // "High", "Medium", "Low"
      labels: ["frontend", "urgent"]
    }
  };
  
  const response = await fetch(`https://${domain}/rest/api/3/issue`, {
    method: 'POST',
    headers: getJiraHeaders(),
    body: JSON.stringify(payload)
  });
  
  return await response.json();
};
```

### 2. Récupérer les Issues d'un Projet
```javascript
// GET /rest/api/3/search
const getProjectIssues = async (projectKey) => {
  const jql = `project = ${projectKey} ORDER BY created DESC`;
  const response = await fetch(
    `https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}`,
    { headers: getJiraHeaders() }
  );
  return await response.json();
};
```

### 3. Mettre à Jour une Issue
```javascript
// PUT /rest/api/3/issue/{issueIdOrKey}
const updateIssue = async (issueKey, updateData) => {
  const payload = {
    fields: updateData
  };
  
  const response = await fetch(`https://${domain}/rest/api/3/issue/${issueKey}`, {
    method: 'PUT',
    headers: getJiraHeaders(),
    body: JSON.stringify(payload)
  });
  
  return response.ok;
};
```

## 🎯 API Rôles de Projet

### 1. Obtenir les Rôles d'un Projet
```javascript
// GET /rest/api/3/project/{projectIdOrKey}/role
const getProjectRoles = async (projectKey) => {
  const response = await fetch(`https://${domain}/rest/api/3/project/${projectKey}/role`, {
    headers: getJiraHeaders()
  });
  return await response.json();
};

// Réponse type :
// {
//   "Administrators": "https://domain.atlassian.net/rest/api/3/project/MKY/role/10002",
//   "Developers": "https://domain.atlassian.net/rest/api/3/project/MKY/role/10000",
//   "Users": "https://domain.atlassian.net/rest/api/3/project/MKY/role/10001"
// }
```

### 2. Ajouter un Utilisateur à un Rôle
```javascript
// POST /rest/api/3/project/{projectIdOrKey}/role/{roleId}
const addUserToRole = async (projectKey, roleId, accountId) => {
  const payload = {
    user: [accountId]
  };
  
  const response = await fetch(
    `https://${domain}/rest/api/3/project/${projectKey}/role/${roleId}`,
    {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify(payload)
    }
  );
  
  return await response.json();
};
```

## 📊 API Tableaux (Boards)

### 1. Obtenir les Tableaux d'un Projet
```javascript
// GET /rest/agile/1.0/board
const getProjectBoards = async (projectKey) => {
  const response = await fetch(
    `https://${domain}/rest/agile/1.0/board?projectKeyOrId=${projectKey}`,
    { headers: getJiraHeaders() }
  );
  return await response.json();
};
```

### 2. Obtenir les Issues d'un Tableau
```javascript
// GET /rest/agile/1.0/board/{boardId}/issue
const getBoardIssues = async (boardId) => {
  const response = await fetch(
    `https://${domain}/rest/agile/1.0/board/${boardId}/issue`,
    { headers: getJiraHeaders() }
  );
  return await response.json();
};
```

## 🏃‍♂️ API Sprints (Scrum)

### 1. Créer un Sprint
```javascript
// POST /rest/agile/1.0/sprint
const createSprint = async (sprintData) => {
  const payload = {
    name: "Sprint 1",
    startDate: "2025-01-01T10:00:00.000Z",
    endDate: "2025-01-15T10:00:00.000Z",
    originBoardId: 123,
    goal: "Objectif du sprint"
  };
  
  const response = await fetch(`https://${domain}/rest/agile/1.0/sprint`, {
    method: 'POST',
    headers: getJiraHeaders(),
    body: JSON.stringify(payload)
  });
  
  return await response.json();
};
```

### 2. Obtenir les Sprints d'un Tableau
```javascript
// GET /rest/agile/1.0/board/{boardId}/sprint
const getBoardSprints = async (boardId) => {
  const response = await fetch(
    `https://${domain}/rest/agile/1.0/board/${boardId}/sprint`,
    { headers: getJiraHeaders() }
  );
  return await response.json();
};
```

## 🔧 Utilitaires

### 1. Test de Connexion
```javascript
const testJiraConnection = async () => {
  try {
    const user = await getCurrentUser();
    const projects = await getProjects();
    
    return {
      success: true,
      user: user.displayName,
      projectCount: projects.length,
      domain: JIRA_DOMAIN
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
```

### 2. Gestion d'Erreurs
```javascript
const handleJiraError = (response, action) => {
  const errorMessages = {
    400: "Données invalides",
    401: "Token d'authentification invalide",
    403: "Permissions insuffisantes", 
    404: "Ressource introuvable",
    409: "Conflit (ressource existe déjà)"
  };
  
  const message = errorMessages[response.status] || `Erreur ${response.status}`;
  console.error(`❌ ${action}: ${message}`);
  
  return {
    success: false,
    error: message,
    status: response.status
  };
};
```

## 📋 Mapping DA Workspace ↔ Jira

### Types de Projets
```javascript
const mapProjectType = (daType) => {
  const mapping = {
    'Scrum': 'software',
    'Kanban': 'software', 
    'Support': 'service_desk',
    'Business': 'business'
  };
  return mapping[daType] || 'software';
};

const mapJiraToDA = (jiraType) => {
  const mapping = {
    'software': 'Scrum',
    'business': 'Kanban',
    'service_desk': 'Support'
  };
  return mapping[jiraType] || 'Kanban';
};
```

### Statuts des Issues
```javascript
const mapIssueStatus = (jiraStatus) => {
  const statusMap = {
    'To Do': 'todo',
    'In Progress': 'en-cours',
    'Done': 'termine',
    'Backlog': 'todo'
  };
  return statusMap[jiraStatus] || 'todo';
};
```

## 🚀 Intégration Recommandée

### 1. Flux de Création de Projet
1. Créer d'abord localement (affichage immédiat)
2. Obtenir `leadAccountId` via `/rest/api/3/myself`
3. Créer sur Jira avec le bon template
4. Mettre à jour les données locales avec `jiraKey` et `jiraId`
5. Gérer les erreurs avec fallback local

### 2. Synchronisation Bidirectionnelle
- **Local → Jira** : Création, modifications majeures
- **Jira → Local** : Récupération périodique pour sync
- **Stratégie de conflit** : Jira fait autorité

### 3. Variables d'Environnement Requises
```env
JIRA_DOMAIN=votre-domaine.atlassian.net
JIRA_EMAIL=votre-email@domain.com
JIRA_API_TOKEN=votre_token_api
```

---

**🔗 Liens Utiles :**
- [Jira Cloud REST API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Jira Agile REST API](https://developer.atlassian.com/cloud/jira/software/rest/)
- [Jira Project Templates](https://confluence.atlassian.com/jirakb/how-to-create-issues-using-direct-html-links-in-jira-server-159474.html)
