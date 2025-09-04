# 🚀 **GUIDE COMPLET - TOUTES LES APIs JIRA ATLASSIAN (CORRIGÉ)**

## 📋 **TABLE DES MATIÈRES**
- [Issues/Tâches](#issues--tâches)
- [Projets](#projets)
- [Utilisateurs & Collaborateurs](#utilisateurs--collaborateurs)
- [Boards & Agile](#boards--agile)
- [Sprints](#sprints)
- [Commentaires](#commentaires)
- [Attachments/Fichiers](#attachmentsfichiers)
- [Workflows & Statuts](#workflows--statuts)
- [Permissions & Rôles](#permissions--rôles)
- [Recherche & Filtres](#recherche--filtres)
- [Dashboard & Gadgets](#dashboard--gadgets)
- [Audit & Logs](#audit--logs)
- [Applications & Add-ons](#applications--add-ons)
- [Configuration](#configuration)
- [Webhooks](#webhooks)

---

## 🎯 **ISSUES / TÂCHES**

### **Gestion des Issues**
```typescript
// ✅ Créer une issue
POST /rest/api/3/issue
{
  "fields": {
    "project": { "key": "TEST" },
    "summary": "Titre de la tâche",
    "description": { /* ADF format */ },
    "issuetype": { "name": "Task" },
    "priority": { "name": "High" }
  }
}

// ✅ Récupérer une issue
GET /rest/api/3/issue/{issueIdOrKey}

// ✅ Modifier une issue (SAUF LE STATUT)
PUT /rest/api/3/issue/{issueIdOrKey}
{
  "fields": {
    "summary": "Nouveau titre",
    "description": { /* ADF format */ }
  }
}

// ✅ CHANGER LE STATUT (TRANSITIONS) - CRITIQUE POUR DRAG & DROP !
GET /rest/api/3/issue/{issueIdOrKey}/transitions
POST /rest/api/3/issue/{issueIdOrKey}/transitions
{
  "transition": {
    "id": "11"  // ID de la transition, pas le nom du statut !
  }
}

// ✅ Supprimer une issue
DELETE /rest/api/3/issue/{issueIdOrKey}
```

### **Transitions & Statuts (CRITIQUE POUR DRAG & DROP)**
```typescript
// ✅ Récupérer les transitions disponibles
GET /rest/api/3/issue/{issueIdOrKey}/transitions

// ✅ Effectuer une transition (CHANGER LE STATUT)
POST /rest/api/3/issue/{issueIdOrKey}/transitions
{
  "transition": {
    "id": "11"  // ID de la transition, pas le nom du statut !
  }
}

// ✅ Récupérer tous les statuts
GET /rest/api/3/status

// ✅ Récupérer les statuts d'un projet
GET /rest/api/3/project/{projectIdOrKey}/statuses
```

### **Champs personnalisés**
```typescript
// ✅ Récupérer les champs d'une issue
GET /rest/api/3/field

// ✅ Mettre à jour un champ spécifique
PUT /rest/api/3/issue/{issueIdOrKey}
{
  "fields": {
    "customfield_10001": "Valeur personnalisée"
  }
}
```

### **Sub-tasks (Sous-tâches)**
```typescript
// ✅ Créer une sous-tâche
POST /rest/api/3/issue
{
  "fields": {
    "project": { "key": "TEST" },
    "parent": { "key": "TEST-1" },
    "summary": "Sous-tâche",
    "issuetype": { "name": "Sub-task" }
  }
}
```

### **Watchers (Observateurs)**
```typescript
// ✅ Récupérer les watchers
GET /rest/api/3/issue/{issueIdOrKey}/watchers

// ✅ Ajouter un watcher
POST /rest/api/3/issue/{issueIdOrKey}/watchers
"5b10a2844c20165700ede21g"

// ✅ Supprimer un watcher
DELETE /rest/api/3/issue/{issueIdOrKey}/watchers?accountId=5b10a2844c20165700ede21g
```

### **Votes**
```typescript
// ✅ Récupérer les votes
GET /rest/api/3/issue/{issueIdOrKey}/votes

// ✅ Voter pour une issue
POST /rest/api/3/issue/{issueIdOrKey}/votes

// ✅ Supprimer son vote
DELETE /rest/api/3/issue/{issueIdOrKey}/votes
```

---

## 🏢 **PROJETS**

### **Gestion des Projets**
```typescript
// ✅ Récupérer tous les projets
GET /rest/api/3/project

// ✅ Créer un projet
POST /rest/api/3/project
{
  "key": "TEST",
  "name": "Test Project",
  "projectTypeKey": "software",
  "projectTemplateKey": "com.pyxis.greenhopper.jira:gh-simplified-agility-scrum",
  "leadAccountId": "5b10a2844c20165700ede21g"
}

// ✅ Récupérer un projet spécifique
GET /rest/api/3/project/{projectIdOrKey}

// ✅ Modifier un projet
PUT /rest/api/3/project/{projectIdOrKey}
{
  "name": "Nouveau nom",
  "description": "Nouvelle description"
}

// ✅ Supprimer un projet
DELETE /rest/api/3/project/{projectIdOrKey}

// ✅ Archiver un projet
POST /rest/api/3/project/{projectIdOrKey}/archive

// ✅ Restaurer un projet
POST /rest/api/3/project/{projectIdOrKey}/restore
```

### **Composants du projet**
```typescript
// ✅ Récupérer les composants
GET /rest/api/3/project/{projectIdOrKey}/components

// ✅ Créer un composant
POST /rest/api/3/component
{
  "name": "Backend",
  "description": "Composant backend",
  "project": "TEST"
}
```

### **Versions du projet**
```typescript
// ✅ Récupérer les versions
GET /rest/api/3/project/{projectIdOrKey}/versions

// ✅ Créer une version
POST /rest/api/3/version
{
  "name": "v1.0.0",
  "description": "Première version",
  "project": "TEST",
  "released": false
}
```

### **Types d'issues du projet**
```typescript
// ✅ Récupérer les types d'issues
GET /rest/api/3/project/{projectIdOrKey}/statuses

// ✅ Hiérarchie des types d'issues
GET /rest/api/3/project/{projectIdOrKey}/hierarchy
```

---

## 👥 **UTILISATEURS & COLLABORATEURS**

### **Gestion des utilisateurs**
```typescript
// ✅ Rechercher des utilisateurs
GET /rest/api/3/user/search?query=john

// ✅ Récupérer un utilisateur spécifique
GET /rest/api/3/user?accountId=5b10a2844c20165700ede21g

// ✅ Récupérer l'utilisateur actuel
GET /rest/api/3/myself

// ✅ Récupérer les groupes d'un utilisateur
GET /rest/api/3/user/groups?accountId=5b10a2844c20165700ede21g

// ✅ Rechercher des utilisateurs assignables
GET /rest/api/3/user/assignable/search?project=TEST

// ✅ Rechercher des utilisateurs par permission
GET /rest/api/3/user/permission/search?permissions=BROWSE_PROJECTS&query=john
```

### **Groupes**
```typescript
// ✅ Récupérer tous les groupes
GET /rest/api/3/groups/picker

// ✅ Créer un groupe
POST /rest/api/3/group
{
  "name": "jira-developers"
}

// ✅ Supprimer un groupe
DELETE /rest/api/3/group?groupname=jira-developers

// ✅ Ajouter un utilisateur au groupe
POST /rest/api/3/group/user?groupname=jira-developers
{
  "accountId": "5b10a2844c20165700ede21g"
}

// ✅ Supprimer un utilisateur du groupe
DELETE /rest/api/3/group/user?groupname=jira-developers&accountId=5b10a2844c20165700ede21g
```

---

## 📋 **BOARDS & AGILE**

### **Gestion des Boards**
```typescript
// ✅ Récupérer tous les boards
GET /rest/agile/1.0/board

// ✅ Créer un board
POST /rest/agile/1.0/board
{
  "name": "Mon Board",
  "type": "scrum", // ou "kanban"
  "filterId": 10001
}

// ✅ Récupérer un board spécifique
GET /rest/agile/1.0/board/{boardId}

// ✅ Supprimer un board
DELETE /rest/agile/1.0/board/{boardId}

// ✅ Récupérer la configuration du board
GET /rest/agile/1.0/board/{boardId}/configuration

// ✅ Récupérer les issues du board
GET /rest/agile/1.0/board/{boardId}/issue

// ✅ Récupérer le backlog du board
GET /rest/agile/1.0/board/{boardId}/backlog
```

### **Colonnes du board**
```typescript
// ✅ Récupérer les colonnes
GET /rest/agile/1.0/board/{boardId}/configuration

// ✅ Configurer les colonnes (via configuration)
PUT /rest/agile/1.0/board/{boardId}/configuration
{
  "columnConfig": {
    "columns": [
      {
        "name": "To Do",
        "statuses": [{"id": "1"}]
      },
      {
        "name": "In Progress", 
        "statuses": [{"id": "3"}]
      }
    ]
  }
}
```

---

## 🏃‍♂️ **SPRINTS**

### **Gestion des Sprints**
```typescript
// ✅ Récupérer tous les sprints d'un board
GET /rest/agile/1.0/board/{boardId}/sprint

// ✅ Créer un sprint
POST /rest/agile/1.0/sprint
{
  "name": "Sprint 1",
  "originBoardId": 1,
  "startDate": "2023-04-01T10:00:00.000Z",
  "endDate": "2023-04-14T10:00:00.000Z",
  "goal": "Objectif du sprint"
}

// ✅ Récupérer un sprint spécifique
GET /rest/agile/1.0/sprint/{sprintId}

// ✅ Modifier un sprint
PUT /rest/agile/1.0/sprint/{sprintId}
{
  "name": "Sprint 1 - Modifié",
  "goal": "Nouvel objectif"
}

// ✅ Démarrer un sprint
POST /rest/agile/1.0/sprint/{sprintId}
{
  "state": "active"
}

// ✅ Terminer un sprint
POST /rest/agile/1.0/sprint/{sprintId}
{
  "state": "closed"
}

// ✅ Supprimer un sprint
DELETE /rest/agile/1.0/sprint/{sprintId}

// ✅ Récupérer les issues d'un sprint
GET /rest/agile/1.0/sprint/{sprintId}/issue

// ✅ Déplacer des issues vers un sprint
POST /rest/agile/1.0/sprint/{sprintId}/issue
{
  "issues": ["TEST-1", "TEST-2"]
}
```

---

## 💬 **COMMENTAIRES**

### **Gestion des commentaires**
```typescript
// ✅ Récupérer les commentaires d'une issue
GET /rest/api/3/issue/{issueIdOrKey}/comment

// ✅ Ajouter un commentaire
POST /rest/api/3/issue/{issueIdOrKey}/comment
{
  "body": {
    "type": "doc",
    "version": 1,
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Mon commentaire"
          }
        ]
      }
    ]
  }
}

// ✅ Récupérer un commentaire spécifique
GET /rest/api/3/issue/{issueIdOrKey}/comment/{id}

// ✅ Modifier un commentaire
PUT /rest/api/3/issue/{issueIdOrKey}/comment/{id}
{
  "body": {
    "type": "doc",
    "version": 1,
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Commentaire modifié"
          }
        ]
      }
    ]
  }
}

// ✅ Supprimer un commentaire
DELETE /rest/api/3/issue/{issueIdOrKey}/comment/{id}
```

---

## 📎 **ATTACHMENTS/FICHIERS**

### **Gestion des pièces jointes**
```typescript
// ✅ Récupérer les attachments d'une issue
GET /rest/api/3/issue/{issueIdOrKey}?fields=attachment

// ✅ Ajouter un attachment
POST /rest/api/3/issue/{issueIdOrKey}/attachments
// Content-Type: multipart/form-data
// Body: fichier

// ✅ Télécharger un attachment
GET /rest/api/3/attachment/content/{id}

// ✅ Récupérer les métadonnées d'un attachment
GET /rest/api/3/attachment/{id}

// ✅ Supprimer un attachment
DELETE /rest/api/3/attachment/{id}
```

---

## ⚙️ **WORKFLOWS & STATUTS**

### **Workflows**
```typescript
// ✅ Récupérer tous les workflows
GET /rest/api/3/workflow

// ✅ Récupérer un workflow spécifique
GET /rest/api/3/workflow/{workflowName}

// ✅ Récupérer les transitions d'un workflow
GET /rest/api/3/workflow/{workflowName}/transitions

// ✅ Créer un workflow
POST /rest/api/3/workflow
{
  "name": "Mon Workflow",
  "description": "Description du workflow",
  "transitions": [
    {
      "name": "To Do -> In Progress",
      "to": "3",
      "from": ["1"]
    }
  ]
}
```

### **Statuts**
```typescript
// ✅ Récupérer tous les statuts
GET /rest/api/3/status

// ✅ Créer un statut
POST /rest/api/3/status
{
  "name": "En Révision",
  "description": "Code en cours de révision",
  "statusCategory": "indeterminate"
}

// ✅ Modifier un statut
PUT /rest/api/3/status/{id}
{
  "name": "En Révision - Modifié",
  "description": "Description modifiée"
}

// ✅ Supprimer un statut
DELETE /rest/api/3/status/{id}
```

---

## 🔐 **PERMISSIONS & RÔLES**

### **Permissions**
```typescript
// ✅ Récupérer toutes les permissions
GET /rest/api/3/permissions

// ✅ Vérifier les permissions d'un utilisateur
POST /rest/api/3/permissions/check
{
  "permissions": ["BROWSE_PROJECTS", "CREATE_ISSUES"],
  "projectKey": "TEST"
}

// ✅ Récupérer les permissions d'un projet
GET /rest/api/3/project/{projectIdOrKey}/permissionscheme
```

### **Rôles du projet**
```typescript
// ✅ Récupérer tous les rôles
GET /rest/api/3/role

// ✅ Récupérer les rôles d'un projet
GET /rest/api/3/project/{projectIdOrKey}/role

// ✅ Récupérer un rôle spécifique d'un projet
GET /rest/api/3/project/{projectIdOrKey}/role/{id}

// ✅ Ajouter des acteurs à un rôle
POST /rest/api/3/project/{projectIdOrKey}/role/{id}
{
  "user": ["5b10a2844c20165700ede21g"],
  "group": ["jira-developers"]
}

// ✅ Supprimer des acteurs d'un rôle
DELETE /rest/api/3/project/{projectIdOrKey}/role/{id}?user=5b10a2844c20165700ede21g
```

---

## 🔍 **RECHERCHE & FILTRES**

### **Recherche JQL**
```typescript
// ✅ Rechercher avec JQL
POST /rest/api/3/search
{
  "jql": "project = TEST AND status = Open",
  "maxResults": 50,
  "fields": ["summary", "status", "assignee"]
}

// ✅ Valider une requête JQL
GET /rest/api/3/jql/parse?query=project = TEST

// ✅ Suggestions de champs JQL
GET /rest/api/3/jql/autocompletedata/suggestions?fieldName=project
```

### **Filtres**
```typescript
// ✅ Récupérer mes filtres
GET /rest/api/3/filter/my

// ✅ Récupérer les filtres favoris
GET /rest/api/3/filter/favourite

// ✅ Créer un filtre
POST /rest/api/3/filter
{
  "name": "Mon Filtre",
  "jql": "project = TEST AND assignee = currentUser()",
  "description": "Mes tâches du projet TEST"
}

// ✅ Récupérer un filtre spécifique
GET /rest/api/3/filter/{id}

// ✅ Modifier un filtre
PUT /rest/api/3/filter/{id}
{
  "name": "Mon Filtre - Modifié",
  "jql": "project = TEST AND status != Done"
}

// ✅ Supprimer un filtre
DELETE /rest/api/3/filter/{id}

// ✅ Rechercher des filtres
GET /rest/api/3/filter/search?filterName=test
```

---

## 📊 **DASHBOARD & GADGETS**

### **Dashboards**
```typescript
// ✅ Récupérer mes dashboards
GET /rest/api/3/dashboard

// ✅ Créer un dashboard
POST /rest/api/3/dashboard
{
  "name": "Mon Dashboard",
  "description": "Dashboard personnalisé"
}

// ✅ Récupérer un dashboard spécifique
GET /rest/api/3/dashboard/{id}

// ✅ Modifier un dashboard
PUT /rest/api/3/dashboard/{id}
{
  "name": "Dashboard - Modifié",
  "description": "Description modifiée"
}

// ✅ Supprimer un dashboard
DELETE /rest/api/3/dashboard/{id}
```

### **Gadgets**
```typescript
// ✅ Récupérer les gadgets d'un dashboard
GET /rest/api/3/dashboard/{dashboardId}/gadget

// ✅ Ajouter un gadget
POST /rest/api/3/dashboard/{dashboardId}/gadget
{
  "title": "Mon Gadget",
  "gadgetURI": "rest/gadgets/1.0/g/{gadgetId}/gadgets/{gadgetModuleKey}.xml"
}
```

---

## 🔧 **CONFIGURATION**

### **Configuration système**
```typescript
// ✅ Informations système
GET /rest/api/3/serverInfo

// ✅ Configuration de l'application
GET /rest/api/3/applicationrole

// ✅ Paramètres de configuration
GET /rest/api/3/configuration

// ✅ Paramètres de time tracking
GET /rest/api/3/configuration/timetracking

// ✅ Liste des priorités
GET /rest/api/3/priority

// ✅ Liste des résolutions
GET /rest/api/3/resolution

// ✅ Types d'issues
GET /rest/api/3/issuetype

// ✅ Schémas de types d'issues
GET /rest/api/3/issuetypescheme
```

---

## 🎣 **WEBHOOKS**

### **Gestion des webhooks**
```typescript
// ✅ Récupérer tous les webhooks
GET /rest/api/3/webhook

// ✅ Créer un webhook
POST /rest/api/3/webhook
{
  "name": "Mon Webhook",
  "url": "https://monapp.com/webhook",
  "events": [
    "jira:issue_created",
    "jira:issue_updated"
  ],
  "filters": {
    "issue-related-events-section": "project = TEST"
  }
}

// ✅ Récupérer un webhook spécifique
GET /rest/api/3/webhook/{id}

// ✅ Modifier un webhook
PUT /rest/api/3/webhook/{id}
{
  "name": "Webhook - Modifié",
  "url": "https://nouvelleurl.com/webhook"
}

// ✅ Supprimer un webhook
DELETE /rest/api/3/webhook/{id}

// ✅ Webhook dynamique (pour tests)
POST /rest/api/3/webhook/dynamic
{
  "name": "Test Webhook",
  "url": "https://webhook.site/unique-id",
  "events": ["jira:issue_created"]
}
```

### **Événements webhook disponibles**
```typescript
// Issues
"jira:issue_created"
"jira:issue_updated"
"jira:issue_deleted"

// Commentaires
"comment_created"
"comment_updated"
"comment_deleted"

// Worklog
"worklog_created"
"worklog_updated"
"worklog_deleted"

// Projets
"project_created"
"project_updated"
"project_deleted"

// Versions
"jira:version_released"
"jira:version_unreleased"
"jira:version_created"
"jira:version_moved"
"jira:version_updated"
"jira:version_deleted"

// Utilisateurs
"user_created"
"user_updated"
"user_deleted"

// Sprints (Agile)
"sprint_started"
"sprint_closed"
"sprint_updated"
"sprint_created"
"sprint_deleted"

// Board
"board_created"
"board_updated"
"board_deleted"
"board_configuration_changed"
```

---

## 📈 **REPORTING & ANALYTICS**

### **Rapports Agile**
```typescript
// ✅ Burndown Chart
GET /rest/agile/1.0/sprint/{sprintId}/burndownchart

// ✅ Velocity Chart
GET /rest/agile/1.0/board/{boardId}/velocity

// ✅ Cumulative Flow Diagram
GET /rest/agile/1.0/board/{boardId}/cfd

// ✅ Epic Burndown
GET /rest/agile/1.0/epic/{epicId}/burndownchart
```

### **Worklog (Temps passé)**
```typescript
// ✅ Récupérer les worklogs d'une issue
GET /rest/api/3/issue/{issueIdOrKey}/worklog

// ✅ Ajouter un worklog
POST /rest/api/3/issue/{issueIdOrKey}/worklog
{
  "timeSpent": "3h 30m",
  "comment": {
    "type": "doc",
    "version": 1,
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Travail effectué"
          }
        ]
      }
    ]
  },
  "started": "2023-04-01T10:00:00.000+0000"
}

// ✅ Modifier un worklog
PUT /rest/api/3/issue/{issueIdOrKey}/worklog/{id}

// ✅ Supprimer un worklog
DELETE /rest/api/3/issue/{issueIdOrKey}/worklog/{id}
```

---

## 🏷️ **LABELS & COMPONENTS**

### **Labels**
```typescript
// ✅ Rechercher des labels
GET /rest/api/3/label

// ✅ Ajouter des labels à une issue
PUT /rest/api/3/issue/{issueIdOrKey}
{
  "fields": {
    "labels": ["backend", "urgent", "bug"]
  }
}
```

### **Components**
```typescript
// ✅ Récupérer tous les components
GET /rest/api/3/component

// ✅ Créer un component
POST /rest/api/3/component
{
  "name": "Frontend",
  "description": "Composant interface utilisateur",
  "project": "TEST",
  "leadAccountId": "5b10a2844c20165700ede21g"
}

// ✅ Modifier un component
PUT /rest/api/3/component/{id}
{
  "name": "Frontend - React",
  "description": "Interface utilisateur en React"
}

// ✅ Supprimer un component
DELETE /rest/api/3/component/{id}
```

---

## 🔄 **BULK OPERATIONS**

### **Opérations en masse**
```typescript
// ✅ Modifier plusieurs issues
POST /rest/api/3/issue/bulk
{
  "issueUpdates": [
    {
      "issueIdOrKey": "TEST-1",
      "fields": {
        "summary": "Nouveau titre 1"
      }
    },
    {
      "issueIdOrKey": "TEST-2", 
      "fields": {
        "summary": "Nouveau titre 2"
      }
    }
  ]
}

// ✅ Créer plusieurs issues
POST /rest/api/3/issue/bulk
{
  "issueUpdates": [
    {
      "fields": {
        "project": { "key": "TEST" },
        "summary": "Issue 1",
        "issuetype": { "name": "Task" }
      }
    },
    {
      "fields": {
        "project": { "key": "TEST" },
        "summary": "Issue 2",
        "issuetype": { "name": "Bug" }
      }
    }
  ]
}
```

---

## 📧 **NOTIFICATIONS**

### **Gestion des notifications**
```typescript
// ✅ Récupérer les schémas de notification
GET /rest/api/3/notificationscheme

// ✅ Notifier les utilisateurs
POST /rest/api/3/issue/{issueIdOrKey}/notify
{
  "subject": "Notification importante",
  "textBody": "Message de notification",
  "to": {
    "users": [
      {
        "accountId": "5b10a2844c20165700ede21g"
      }
    ]
  }
}
```

---

## 🔗 **ISSUE LINKS**

### **Liens entre issues**
```typescript
// ✅ Récupérer les types de liens
GET /rest/api/3/issueLinkType

// ✅ Créer un lien entre issues
POST /rest/api/3/issueLink
{
  "type": {
    "name": "Blocks"
  },
  "inwardIssue": {
    "key": "TEST-1"
  },
  "outwardIssue": {
    "key": "TEST-2"
  }
}

// ✅ Récupérer les liens d'une issue
GET /rest/api/3/issue/{issueIdOrKey}?fields=issuelinks

// ✅ Supprimer un lien
DELETE /rest/api/3/issueLink/{linkId}
```

---

## 🎨 **CUSTOMIZATION**

### **Champs personnalisés**
```typescript
// ✅ Créer un champ personnalisé
POST /rest/api/3/field
{
  "name": "Budget",
  "description": "Budget alloué au projet",
  "type": "com.atlassian.jira.plugin.system.customfieldtypes:float",
  "searcherKey": "com.atlassian.jira.plugin.system.customfieldtypes:exactnumber"
}

// ✅ Contextes de champs
GET /rest/api/3/field/{fieldId}/context

// ✅ Options de champs
GET /rest/api/3/field/{fieldId}/context/{contextId}/option
```

### **Écrans**
```typescript
// ✅ Récupérer tous les écrans
GET /rest/api/3/screens

// ✅ Récupérer les champs d'un écran
GET /rest/api/3/screens/{screenId}/availableFields

// ✅ Ajouter un champ à un écran
POST /rest/api/3/screens/{screenId}/tabs/{tabId}/fields
{
  "fieldId": "summary"
}
```

---

## 🔒 **SECURITY**

### **Niveaux de sécurité**
```typescript
// ✅ Récupérer les niveaux de sécurité
GET /rest/api/3/securitylevel

// ✅ Appliquer un niveau de sécurité
PUT /rest/api/3/issue/{issueIdOrKey}
{
  "fields": {
    "security": {
      "id": "10001"
    }
  }
}
```

---

## 📱 **MOBILE & INTEGRATIONS**

### **API pour applications mobiles**
```typescript
// ✅ Configuration mobile
GET /rest/api/3/mobile/1.0/session

// ✅ Issues pour mobile
GET /rest/api/3/mobile/1.0/issue/createmeta

// ✅ Recherche simplifiée mobile
GET /rest/api/3/mobile/1.0/search
```

---

## 🌐 **GLOBAL SETTINGS**

### **Paramètres globaux**
```typescript
// ✅ Paramètres d'application
GET /rest/api/3/application-properties

// ✅ Modifier un paramètre
PUT /rest/api/3/application-properties/{id}
{
  "value": "nouvelle-valeur"
}

// ✅ Paramètres avancés
GET /rest/api/3/settings/columns
```

---

## 🚀 **CONSEILS D'UTILISATION POUR DA WORKSPACE**

### **APIs Prioritaires pour votre projet :**

1. **✅ OBLIGATOIRES (déjà implémentées)**
   - Issues CRUD
   - Projects CRUD  
   - Search/JQL
   - Boards/Sprints

2. **🔥 TRÈS UTILES (à implémenter)**
   - Users/Collaborateurs : `/rest/api/3/user/search`
   - Comments : `/rest/api/3/issue/{key}/comment`
   - Attachments : `/rest/api/3/issue/{key}/attachments`
   - Worklogs : `/rest/api/3/issue/{key}/worklog`

3. **⭐ AVANCÉES (pour plus tard)**
   - Webhooks pour temps réel
   - Bulk operations pour performance
   - Custom fields pour métadonnées
   - Reports pour analytics

### **Configuration recommandée :**
```typescript
const JIRA_BASE_URL = `https://${JIRA_DOMAIN}/rest/api/3`;
const AGILE_BASE_URL = `https://${JIRA_DOMAIN}/rest/agile/1.0`;

const headers = {
  'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
};
```

**Voilà ! Vous avez maintenant TOUTES les APIs Jira disponibles et CORRIGÉES ! 🎉**

**Le drag & drop devrait maintenant fonctionner car on utilise les transitions Jira au lieu de PATCH direct !**
