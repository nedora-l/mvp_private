# 🚀 Guide Technique Jira API - DA Workspace MVP

## 📋 TABLE DES MATIÈRES

1. [Configuration](#configuration)
2. [APIs Projects](#apis-projects)
3. [APIs Issues/Tasks](#apis-issuestasks)
4. [APIs Project Roles](#apis-project-roles) 
5. [APIs Boards](#apis-boards)
6. [APIs Sprints](#apis-sprints)
7. [Exemples complets](#exemples-complets)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 CONFIGURATION

### Variables d'environnement (.env.local)
```bash
# Jira Configuration
JIRA_DOMAIN=votredomaine.atlassian.net
JIRA_EMAIL=votre-email@domain.com
JIRA_API_TOKEN=votre-token-api-jira

# Local fallback
NODE_ENV=development
```

### Authentification Jira
```typescript
const getJiraHeaders = () => {
  const auth = Buffer.from(`${email}:${token}`).toString('base64');
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};
```

---

## 🏗️ APIs PROJECTS

### GET - Récupérer tous les projets
```typescript
// ✅ Implémenté dans /api/mcp/projects/route.ts
const jiraUrl = `https://${domain}/rest/api/3/project`;

const response = await fetch(jiraUrl, {
  method: 'GET',
  headers: getJiraHeaders()
});

const projects = await response.json();
```

### POST - Créer un nouveau projet
```typescript
// ✅ Implémenté dans /api/mcp/projects/route.ts
const projectData = {
  key: "PROJ123",
  name: "Mon Projet", 
  projectTypeKey: "software", // ou "business"
  projectTemplateKey: "com.pyxis.greenhopper.jira:gh-simplified-agility-scrum",
  leadAccountId: "accountId-du-lead",
  description: "Description du projet"
};

const response = await fetch(`https://${domain}/rest/api/3/project`, {
  method: 'POST',
  headers: getJiraHeaders(),
  body: JSON.stringify(projectData)
});
```

**Templates disponibles :**
- **Scrum** : `com.pyxis.greenhopper.jira:gh-simplified-agility-scrum`
- **Kanban** : `com.pyxis.greenhopper.jira:gh-simplified-agility-kanban`  
- **Business** : `com.atlassian.jira-core-project-templates:jira-core-simplified-project-management`

---

## 📝 APIs ISSUES/TASKS

### GET - Récupérer les tâches (JQL Search)
```typescript
// ✅ Implémenté dans /api/mcp/tasks/route.ts
const searchUrl = `https://${domain}/rest/api/3/search`;

const jqlQuery = `project = "PROJ123" ORDER BY created DESC`;

const response = await fetch(searchUrl, {
  method: 'POST',
  headers: getJiraHeaders(),
  body: JSON.stringify({
    jql: jqlQuery,
    maxResults: 100,
    fields: ['summary', 'description', 'status', 'priority', 'assignee']
  })
});
```

### POST - Créer une nouvelle tâche
```typescript
// ✅ Implémenté dans /api/mcp/tasks/route.ts
const issueData = {
  fields: {
    project: { key: "PROJ123" },
    summary: "Titre de la tâche",
    description: {
      type: "doc",
      version: 1,
      content: [{
        type: "paragraph",
        content: [{ type: "text", text: "Description de la tâche" }]
      }]
    },
    issuetype: { name: "Task" }, // ou "Story", "Bug", "Epic"
    priority: { name: "Medium" },
    assignee: { accountId: "accountId-assignee" }
  }
};

const response = await fetch(`https://${domain}/rest/api/3/issue`, {
  method: 'POST',
  headers: getJiraHeaders(),
  body: JSON.stringify(issueData)
});
```

### PUT - Mettre à jour une tâche
```typescript
// ✅ Implémenté dans /api/mcp/tasks/route.ts
const updateData = {
  fields: {
    summary: "Nouveau titre",
    priority: { name: "High" }
  }
};

const response = await fetch(`https://${domain}/rest/api/3/issue/${issueKey}`, {
  method: 'PUT',
  headers: getJiraHeaders(),
  body: JSON.stringify(updateData)
});
```

### POST - Transition de statut
```typescript
// ✅ Implémenté dans /api/mcp/tasks/route.ts (PATCH)
const transitionData = {
  transition: { id: "31" } // ID de la transition (To Do → In Progress)
};

const response = await fetch(`https://${domain}/rest/api/3/issue/${issueKey}/transitions`, {
  method: 'POST',
  headers: getJiraHeaders(),
  body: JSON.stringify(transitionData)
});
```

---

## 👥 APIs PROJECT ROLES

### GET - Récupérer les rôles d'un projet
```typescript
// ❌ À implémenter
const response = await fetch(`https://${domain}/rest/api/3/project/${projectKey}/role`, {
  headers: getJiraHeaders()
});

// Response:
// {
//   "Administrators": "https://domain.atlassian.net/rest/api/3/project/PROJ/role/10002",
//   "Developers": "https://domain.atlassian.net/rest/api/3/project/PROJ/role/10000"
// }
```

### GET - Détails d'un rôle spécifique
```typescript
// ❌ À implémenter  
const response = await fetch(`https://${domain}/rest/api/3/project/${projectKey}/role/${roleId}`, {
  headers: getJiraHeaders()
});
```

### POST - Ajouter un utilisateur à un rôle
```typescript
// ❌ À implémenter - CRITIQUE pour assignment automatique
const addActorData = {
  user: ["accountId-utilisateur"]
};

const response = await fetch(`https://${domain}/rest/api/3/project/${projectKey}/role/${roleId}`, {
  method: 'POST', 
  headers: getJiraHeaders(),
  body: JSON.stringify(addActorData)
});
```

---

## 📋 APIs BOARDS

### GET - Récupérer tous les boards
```typescript
// ❌ À implémenter
const response = await fetch(`https://${domain}/rest/agile/1.0/board`, {
  headers: getJiraHeaders()
});
```

### POST - Créer un board après création projet
```typescript
// ❌ À implémenter - CRITIQUE pour workflow complet
const boardData = {
  name: "Board pour Mon Projet",
  type: "scrum", // ou "kanban" 
  filterId: 12345 // ID du filtre JQL associé
};

const response = await fetch(`https://${domain}/rest/agile/1.0/board`, {
  method: 'POST',
  headers: getJiraHeaders(),
  body: JSON.stringify(boardData)
});
```

---

## 🏃 APIs SPRINTS

### GET - Récupérer les sprints d'un board
```typescript
// ⚠️ Lecture OK, mais création manquante
const response = await fetch(`https://${domain}/rest/agile/1.0/board/${boardId}/sprint`, {
  headers: getJiraHeaders()
});
```

### POST - Créer un nouveau sprint
```typescript
// ❌ À implémenter
const sprintData = {
  name: "Sprint 1",
  startDate: "2025-08-07T10:00:00.000Z",
  endDate: "2025-08-21T10:00:00.000Z",
  originBoardId: boardId
};

const response = await fetch(`https://${domain}/rest/agile/1.0/sprint`, {
  method: 'POST',
  headers: getJiraHeaders(),
  body: JSON.stringify(sprintData)
});
```

### PUT - Démarrer/terminer un sprint
```typescript
// ❌ À implémenter
const sprintUpdate = {
  state: "active", // ou "closed"
  startDate: "2025-08-07T10:00:00.000Z"
};

const response = await fetch(`https://${domain}/rest/agile/1.0/sprint/${sprintId}`, {
  method: 'PUT',
  headers: getJiraHeaders(),
  body: JSON.stringify(sprintUpdate)
});
```

---

## 🔧 EXEMPLES COMPLETS

### Workflow complet : Créer projet + rôles + board
```typescript
async function createCompleteProject(projectData: any) {
  try {
    // 1. Créer le projet ✅ 
    const project = await createJiraProject(projectData);
    
    // 2. Assigner les rôles ❌ À implémenter
    await assignProjectRoles(project.key, projectData.leadAccountId);
    
    // 3. Créer le board automatiquement ❌ À implémenter  
    const board = await createProjectBoard(project.key, projectData.boardType);
    
    // 4. Créer le premier sprint ❌ À implémenter
    const sprint = await createInitialSprint(board.id);
    
    return { project, board, sprint };
  } catch (error) {
    console.error('Erreur workflow complet:', error);
    throw error;
  }
}
```

### Migration de données locales → Jira
```typescript
async function migrateLocalToJira() {
  // 1. Lire projets locaux
  const localProjects = await readLocalProjects();
  
  // 2. Créer sur Jira avec mapping ID
  for (const project of localProjects) {
    if (project.type === 'Local') {
      const jiraProject = await createJiraProject({
        ...project,
        type: 'Jira'
      });
      
      // 3. Migrer les tâches associées
      await migrateProjectTasks(project.id, jiraProject.key);
    }
  }
}
```

---

## 🛠️ TROUBLESHOOTING

### Erreurs communes

#### 1. **401 Unauthorized**
```bash
# Vérifier les credentials
JIRA_EMAIL=correct-email@domain.com
JIRA_API_TOKEN=valid-token

# Tester la connexion
curl -u email:token https://domain.atlassian.net/rest/api/3/myself
```

#### 2. **400 Bad Request - Projet**
```typescript
// Vérifier les champs obligatoires
const requiredFields = {
  key: "PROJ123",           // 2-10 chars, MAJUSCULES
  name: "Nom du projet",    // Non vide
  projectTypeKey: "software", // 'software' ou 'business'
  leadAccountId: "valid-account-id" // ID Jira valide
};
```

#### 3. **404 Not Found - Issue**
```typescript
// Utiliser la clé complète, pas l'ID
const issueKey = "PROJ-123"; // ✅
const issueId = "10001";     // ❌ Moins fiable
```

#### 4. **Rate Limiting (429)**
```typescript
// Ajouter retry avec backoff
async function callJiraWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status !== 429) return response;
      
      // Wait 2^i seconds before retry
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

---

## ✅ CHECKLIST DE VALIDATION

### Avant déploiement :
- [ ] Token Jira valide et testé
- [ ] Domain Jira accessible  
- [ ] Permissions utilisateur suffisantes (Administer Projects)
- [ ] Templates de projet configurés
- [ ] Mapping ID projets cohérent
- [ ] Fallback local fonctionnel
- [ ] Tests end-to-end passés

### APIs à compléter :
- [ ] Project Roles assignment automatique
- [ ] Board creation après projet  
- [ ] Sprint CRUD complet
- [ ] Webhooks pour sync temps réel (optionnel)

---

## 📚 RÉFÉRENCES

- [Jira REST API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Jira Agile API](https://developer.atlassian.com/cloud/jira/software/rest/)
- [Project Templates](https://confluence.atlassian.com/jirakb/how-to-get-project-template-key-976829950.html)
- [JQL Reference](https://support.atlassian.com/jira-software-cloud/docs/advanced-search-reference-jql-fields/)

**Date de mise à jour :** 7 août 2025  
**Version :** GDP_v1  
**Statut :** ✅ Prêt pour production avec compléments
