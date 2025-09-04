# Jira Project Roles API - Documentation de référence

## Vue d'ensemble
Les rôles de projet sont un moyen flexible d'associer des utilisateurs et des groupes à des projets. Dans Jira Cloud, la liste des rôles de projet est partagée globalement avec tous les projets, mais chaque projet peut avoir un ensemble différent d'acteurs associés.

## APIs essentielles pour DA Workspace

### 1. GET - Récupérer tous les rôles de projet
```
GET /rest/api/3/role
```
**Usage:** Obtenir la liste complète des rôles disponibles
**Permissions:** Administer Jira global permission
**Réponse:** Array de ProjectRole avec acteurs par défaut

### 2. GET - Rôles d'un projet spécifique
```
GET /rest/api/3/project/{projectIdOrKey}/role
```
**Usage:** Lister les rôles assignés à un projet
**Permissions:** Administer Projects ou Administer Jira
**Réponse:** Object avec noms des rôles et URLs

### 3. GET - Détails d'un rôle sur un projet
```
GET /rest/api/3/project/{projectIdOrKey}/role/{id}
```
**Usage:** Voir les utilisateurs/groupes assignés à un rôle sur un projet
**Permissions:** Administer Projects ou Administer Jira
**Réponse:** ProjectRole avec actors détaillés

### 4. POST - Créer un nouveau rôle (global)
```
POST /rest/api/3/role
Body: {
  "name": "string",
  "description": "string"
}
```
**Usage:** Créer un nouveau rôle disponible pour tous les projets
**Permissions:** Administer Jira global permission

## Structure des données

### ProjectRole
```typescript
interface ProjectRole {
  id: number;
  name: string;
  description: string;
  actors: Actor[];
  scope?: {
    project: {
      id: string;
      key: string;
      name: string;
    };
    type: "PROJECT";
  };
  self: string;
}

interface Actor {
  id: number;
  displayName: string;
  type: "atlassian-user-role-actor" | "atlassian-group-role-actor";
  actorUser?: {
    accountId: string;
  };
  actorGroup?: {
    displayName: string;
    groupId: string;
    name: string;
  };
}
```

## Intégration avec DA Workspace

### Rôles standards à utiliser
1. **Administrators** - Gestionnaires de projet
2. **Developers** - Équipe de développement
3. **Users** - Utilisateurs standard

### Cas d'usage dans notre app
1. **Création de projet:** Assigner automatiquement le créateur comme Administrator
2. **Gestion d'équipe:** Permettre l'ajout/suppression d'utilisateurs aux rôles
3. **Permissions:** Utiliser les rôles pour contrôler l'accès aux fonctionnalités
4. **Notifications:** Cibler les notifications selon les rôles

### APIs prioritaires pour l'implémentation
1. `GET /rest/api/3/project/{key}/role` - Lors de l'affichage d'un projet
2. `GET /rest/api/3/project/{key}/role/{roleId}` - Pour voir l'équipe
3. Futures APIs pour assigner/retirer des utilisateurs (actors)

### Headers d'authentification (même que projets)
```typescript
const getJiraHeaders = () => {
  const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.token}`).toString('base64');
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};
```

## Exemple d'implémentation Next.js
```typescript
// GET /api/projects/[id]/roles
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const projectKey = params.id;
  
  const response = await fetch(
    `https://${JIRA_CONFIG.domain}/rest/api/3/project/${projectKey}/role`,
    {
      method: 'GET',
      headers: getJiraHeaders()
    }
  );
  
  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: response.status });
  }
  
  const roles = await response.json();
  return NextResponse.json({ roles });
}
```
