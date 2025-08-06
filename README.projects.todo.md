# 📋 AUDIT GESTION DE PROJETS - CHECKLIST COMPLÈTE

> **Date de création** : 04/08/2025  
> **Objectif** : Éviter la perte de temps et les erreurs récurrentes dans le développement de la gestion de projets

## 🔧 DÉMARCHE SYSTÉMATIQUE POUR TOUS LES COMPOSANTS

### 📍 PHASE 1: AUDIT PRÉALABLE
```bash
# 1. Identifier les erreurs existantes
get_errors sur tous les fichiers du composant

# 2. Vérifier la cohérence des interfaces
grep_search pour les conflits de noms/types

# 3. Mapper les dépendances
semantic_search pour comprendre les relations
```

### 📍 PHASE 2: NETTOYAGE ET REFACTORING
```bash
# 1. Supprimer les fichiers corrompus
rm fichiers_avec_erreurs_syntaxe

# 2. Standardiser les interfaces TypeScript
- Vérifier compatibilité Context ↔ Composants
- Aligner les types (string vs number, index vs id)
- Résoudre conflits de noms (editProject fonction vs variable)

# 3. Implémenter la persistance locale
- API v0 avec filesystem (data/*.json)
- Context React pour état global
- Conversion ID↔Index pour opérations CRUD
```

### 📍 PHASE 3: VALIDATION ET TESTS
```bash
# 1. Compilation sans erreurs
get_errors pour validation TypeScript

# 2. Test fonctionnel
- Ajout/Modification/Suppression
- Persistance après reload
- Gestion d'erreurs

# 3. Documentation
- Commenter les conversions critiques
- Expliquer les choix d'architecture
```

## ✅ RÈGLES D'OR POUR GESTION DE PROJETS

### 🎯 INTERFACES OBLIGATOIRES
```typescript
// Context: index-based operations
editProject: (index: number, project: Project) => Promise<void>
deleteProject: (index: number) => Promise<void>

// Components: ID-based UI operations  
handleEdit(id: string) {
  const index = projects.findIndex(p => p.id === id);
  await editProject(index, updatedProject);
}
```

### 🎯 MODALS STANDARDISÉS
```typescript
// CreateModal interface
interface ProjectCreateModalProps {
  onCreate: (project: ProjectForm) => void;
}

// EditModal interface (inline ou séparée)
const [editingId, setEditingId] = useState<string | null>(null);
const [editedProject, setEditedProject] = useState<ProjectForm>({...});
```

### 🎯 GESTION D'ERREURS
```typescript
try {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) throw new Error("Projet non trouvé");
  await contextFunction(index, data);
} catch (error) {
  console.error("❌ Erreur:", error);
  setError("Message utilisateur");
} finally {
  setLoading(false);
}
```

## 🔄 CHECKLIST AUDIT COMPOSANTS

### ✅ AVANT (DIAGNOSTIC)
- [ ] `get_errors` sur tous les fichiers  
- [ ] `grep_search` pour conflits d'interfaces
- [ ] `semantic_search` pour dépendances
- [ ] Identifier les doublons/fichiers corrompus

### ✅ PENDANT (IMPLEMENTATION)  
- [ ] Supprimer fichiers corrompus
- [ ] Créer version propre avec noms uniques
- [ ] Implémenter conversions ID↔Index
- [ ] Tester chaque opération CRUD
- [ ] Valider persistance après reload

### ✅ APRÈS (VALIDATION)
- [ ] `get_errors` = 0 erreurs TypeScript
- [ ] Test ajout/modification/suppression
- [ ] Test persistance (reload page)
- [ ] Documentation des spécificités
- [ ] Mise à jour de cette bible

## 📂 ARCHITECTURE RECOMMANDÉE
```
contexts/
  ├── projects-context.tsx     # État global + API calls
components/
  ├── projects/
    ├── ProjectCreateModal.tsx # Interface onCreate
    ├── ProjectEditModal.tsx   # Interface onUpdate (si séparé)
    └── ProjectList.tsx        # Pure display component
app/[locale]/apps/projects/
  ├── gestion/
    ├── liste/page.tsx        # Page principale avec logique métier
    ├── details/page.tsx      # Page détails projet
    └── layout.tsx            # Layout avec ProjectsProvider
```

## 🚨 ERREURS FRÉQUENTES À ÉVITER

### ❌ CONFLITS DE NOMS
```typescript
// MAL: conflit entre fonction et variable
const { editProject } = useProjects(); // fonction
const [editProject, setEditProject] = useState(); // variable
```

### ❌ MAUVAIS TYPES D'OPÉRATIONS
```typescript
// MAL: passer ID string quand l'API attend index number
await deleteProject(id); // si deleteProject(index: number)

// BIEN: conversion explicite
const index = projects.findIndex(p => p.id === id);
await deleteProject(index);
```

### ❌ INTERFACES MODAL INCOMPATIBLES
```typescript
// MAL: supposer interface sans vérifier
<ProjectCreateModal
  isOpen={show}
  onClose={() => setShow(false)}
/>

// BIEN: vérifier l'interface réelle du composant
<ProjectCreateModal
  onCreate={(project) => handleCreate(project)}
/>
```

## 🎯 PROBLÈMES IDENTIFIÉS ET RÉSOLUS

### ❌ Erreurs trouvées durant l'audit :

1. **Erreur de syntaxe API** ✅ CORRIGÉ
   - **Fichier** : `app/api/v0/projects/route.ts:76`
   - **Problème** : Accolade en trop `}` après la fonction POST
   - **Solution** : Accolade supprimée

2. **Types TypeScript manquants** ✅ CORRIGÉ
   - **Fichier** : `app/api/v0/projects/route.ts`
   - **Problème** : Paramètres implicites `any` dans les callbacks
   - **Solution** : Interface `ProjectData` ajoutée avec types explicites

3. **Incohérence des types Project** ✅ CORRIGÉ
   - **Fichier** : `app/[locale]/apps/projects/gestion/mockProjects.ts`
   - **Problème** : Interface différente du contexte
   - **Solution** : Types alignés avec `contexts/projects-context.tsx`

4. **Provider manquant** ✅ CORRIGÉ
   - **Fichier** : `app/[locale]/apps/projects/layout.tsx`
   - **Problème** : ProjectsProvider non inclus
   - **Solution** : Provider ajouté au layout

5. **Page n'utilise pas le contexte** ⚠️ EN COURS
   - **Fichier** : `app/[locale]/apps/projects/gestion/liste/page.tsx`
   - **Problème** : Appels API directs au lieu du contexte
   - **Solution** : Migration vers `useProjects()` en cours

6. **Erreur de syntaxe dans la page** 🚨 URGENT
   - **Fichier** : `app/[locale]/apps/projects/gestion/liste/page.tsx:334`
   - **Problème** : "Return statement is not allowed here"
   - **Solution** : Structure de fonction à corriger

## 🔧 ROUTES API - ÉTAT ACTUEL

### ✅ Routes fonctionnelles :
- `GET /api/v0/projects` - Liste tous les projets
- `POST /api/v0/projects` - Crée un nouveau projet
- `GET /api/v0/projects/[id]` - Récupère un projet par ID
- `PUT /api/v0/projects/[id]` - Modifie un projet par ID
- `DELETE /api/v0/projects/[id]` - Supprime un projet par ID

### 📁 Persistance :
- **Fichier** : `data/projects.json`
- **Format** : JSON avec sauvegarde automatique
- **Types** : Interface `ProjectData` avec tous les champs

## 🎯 CONTEXTE - ÉTAT ACTUEL

### ✅ Contexte configuré :
- **Fichier** : `contexts/projects-context.tsx`
- **Hook** : `useProjects()` disponible
- **Provider** : Inclus dans le layout projects
- **API** : Utilise `/api/v0/projects` local

### 🔄 Fonctions disponibles :
```typescript
const { 
  projects,     // Project[] - Liste des projets
  loading,      // boolean - État de chargement
  addProject,   // (project: Project) => Promise<void>
  editProject,  // (index: number, project: Project) => Promise<void>
  deleteProject // (index: number) => Promise<void>
} = useProjects();
```

## 📱 COMPOSANTS - ÉTAT ACTUEL

### ✅ Composants disponibles :
- `ProjectCreateModal` - Modal de création
- `ProjectCard` - Carte d'affichage
- `ProjectsTable` - Tableau des projets

### 🔄 Types cohérents :
```typescript
interface Project {
  id: string;
  name: string;
  type: string;
  customType?: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  members: string;
}
```

## 🚨 CHECKLIST AVANT DÉVELOPPEMENT

### ✅ Avant de créer une nouvelle page projet :

1. **Imports obligatoires** :
   ```typescript
   import { useProjects } from "@/contexts/projects-context";
   ```

2. **Utilisation du contexte** :
   ```typescript
   const { projects, loading, addProject, editProject, deleteProject } = useProjects();
   ```

3. **Types** :
   - Utiliser `Project` du contexte
   - Pas de types custom incompatibles

4. **API** :
   - Pas d'appels fetch directs
   - Utiliser les fonctions du contexte

### ✅ Avant de modifier l'API :

1. **Types** :
   - Maintenir interface `ProjectData`
   - Types explicites partout

2. **Routes** :
   - Respecter le pattern `/api/v0/projects`
   - Support CRUD complet

3. **Persistance** :
   - Toujours sauvegarder avec `saveProjects()`
   - Gérer les erreurs filesystem

### ✅ Avant de modifier le contexte :

1. **Provider** :
   - Vérifier qu'il wrape toutes les pages projects
   - Import dans layout

2. **Hook** :
   - Maintenir la même interface
   - Logs pour debugging

3. **Synchronisation** :
   - fetchProjects() après chaque modification
   - États cohérents

## 🐛 ERREURS RÉCURRENTES À ÉVITER

### ❌ Erreurs de syntaxe :
- Accolades mal fermées
- Return statements hors fonction
- Imports manquants

### ❌ Erreurs de types :
- Interface Project incompatible
- Types any implicites
- Props manquantes

### ❌ Erreurs d'architecture :
- Fetch direct au lieu du contexte
- Provider manquant
- États locaux non synchronisés

### ❌ Erreurs de persistance :
- Pas de sauvegarde filesystem
- Routes API manquantes
- IDs incohérents

## 🎯 PROCÉDURE DE TEST

### ✅ Test complet persistance :

1. **Créer un projet** :
   - Utiliser la modal
   - Vérifier l'affichage

2. **Recharger la page** :
   - F5 ou Ctrl+R
   - Vérifier persistance

3. **Modifier un projet** :
   - Éditer via bouton
   - Vérifier sauvegarde

4. **Supprimer un projet** :
   - Delete via bouton
   - Vérifier fichier JSON

### ✅ Logs à surveiller :
```
🔧 Development mode: Auth check bypassed
🔄 Fetching projects from local API v0...
📦 Raw API response: {...}
✅ Projects loaded from API v0: X
🔄 POST /api/v0/projects {...}
✅ Project created and saved: {...}
```

## 📝 VERSIONS ET DÉPENDANCES

### ✅ Versions utilisées :
- Next.js : 15.2.4
- React : 18+
- TypeScript : 5+

### ✅ Dépendances clés :
- `@/contexts/projects-context` - Contexte principal
- `@/components/projects/*` - Composants UI
- `/api/v0/projects` - API locale

## 🔄 MISE À JOUR DU DOCUMENT

**À faire après chaque modification majeure :**
1. Mettre à jour cette checklist
2. Tester la procédure complète
3. Documenter les nouveaux patterns
4. Corriger les erreurs récurrentes

---

# Roadmap & Bible v0 — Gestion de Projets & Tickets (DAWS)

## Logique v0 (MVP)

- **Tout le CRUD (projets, tickets/tâches) est géré en local** (state/context React ou mock API), comme pour receivables/payables.
- **Pas de backend ni d’API réelle** : les données sont persistées en mémoire ou localStorage, et synchronisées sur toutes les pages tant que l’app reste ouverte.
- **Initialisation dynamique** : à la création d’un projet, on génère automatiquement les colonnes/tickets de base selon la méthode choisie (Kanban, Scrum, Sprints, Pentest, etc.).
- **Multi-méthodes agiles** : chaque projet peut choisir sa méthode (Kanban, Scrum, Backlog, Sprints, Rapports, Pentest, etc.), et la structure s’adapte dynamiquement.
- **Extensibilité** : la logique v0 est documentée et centralisée pour faciliter le mapping MCP/Jira/Trello et l’évolution vers une API réelle.
- **UI/UX** : composants modernes, feedback UX, navigation claire, responsive, et harmonisation des couleurs/icônes.

---
## Synthèse de la logique v0

La logique v0 s’inspire directement de la gestion des modules "receivables" et "payables" :

- **Centralisation du CRUD local** : toutes les opérations (création, édition, suppression) sont gérées dans le contexte React ou une mock API locale, sans aucun appel à une API réelle ou backend.
- **Persistance locale** : les données sont stockées en mémoire ou dans le localStorage, et synchronisées sur toutes les pages tant que l’application reste ouverte.
- **Extensibilité** : la structure du code et la documentation préparent l’évolution vers une API réelle (Jira, MCP, Trello…) sans casser la logique locale.
- **UI/UX moderne** : formulaires, modals, feedback utilisateur, navigation fluide, logos dynamiques, couleurs/icônes harmonisées.
- **Initialisation dynamique** : à la création d’un projet, les colonnes/tickets sont générés automatiquement selon la méthode agile choisie (Kanban, Scrum, etc.).
- **Multi-méthodes agiles** : chaque projet peut choisir sa méthode, la structure s’adapte dynamiquement.

**À retenir : tout est local/mock, rien d’externe, tout est extensible/documenté.**

---

## 1. Objectif

Centraliser la gestion de projets et tickets dans DAWS, avec une logique v0 locale/mock, extensible vers Jira/Trello/MCP, et une UX moderne inspirée des outils agiles.

---

## 2. Jira Integration Possibilities

### a. Jira REST API

- **Core API**: Access projects, issues, boards, sprints, users, comments, attachments, etc.
- **Authentication**: OAuth 2.0 (recommended), API tokens (for Atlassian Cloud), or basic auth (for self-hosted).
- **Webhooks**: Receive real-time updates on issue/project changes.
- **JQL (Jira Query Language)**: Advanced filtering and search.
- **Agile API**: Boards, sprints, backlog, epics, etc.
- **User Management**: Fetch users, assign issues, permissions.

### b. Atlassian Connect / Forge Apps

- **Custom UI**: Embed DAWS as a Jira app or vice versa.
- **Deep Integration**: For advanced use-cases (optional for MVP).

### c. Third-Party Libraries

- **jira.js**: Popular Node.js client for Jira REST API.
- **Atlassian SDKs**: For advanced integrations.

---

## 3. MVP Feature Set (v0)

- **Liste des projets** : CRUD local, affichage dynamique, initialisation selon la méthode agile choisie.
- **Tickets/tâches** : CRUD local, statuts dynamiques, édition/suppression, feedback UX.
- **Méthodes agiles** : Kanban, Scrum, Sprints, Backlog, Pentest, etc. (configurable par projet).
- **Board dynamique** : colonnes et tickets générés selon la méthode, drag & drop optionnel v0.
- **Détails de ticket** : description, collaborateurs, dates, labels, priorité, etc.
- **Extensibilité** : mapping MCP/Jira/Trello prévu, documentation claire.

---
## 3bis. Exemples concrets (receivables/payables)

- Les modules "receivables" et "payables" sont des exemples : tout le CRUD est géré en local/context, aucune API réelle, tout est extensible et documenté.
- La gestion de projets/tickets doit suivre exactement cette logique : centralisation du CRUD local, UI/UX moderne, extensibilité, documentation claire.

---

## 4. Technical Implementation Steps

### a. Authentication

- Use OAuth 2.0 for secure user authentication with Jira Cloud.
- Store tokens securely (server-side, encrypted cookies, or session).
- Handle token refresh and revocation.

---
### a. Authentification (pour v0)

- **En v0, aucune authentification réelle n’est requise** : tout est mock/local, aucune gestion de token ou d’utilisateur réel.
- **Préparer la structure** pour l’intégration future d’une authentification réelle (OAuth, etc.), mais ne rien implémenter côté backend pour l’instant.

### b. API Integration

- Create a backend API route (e.g., `/api/jira/*`) to proxy requests to Jira, handling auth and rate limits.
- Use `jira.js` or direct REST calls for:
  - Fetching projects: `/rest/api/3/project/search`
  - Fetching issues: `/rest/api/3/search` (with JQL)
  - Creating/updating issues: `/rest/api/3/issue`
  - Fetching boards/sprints: `/rest/agile/1.0/board`, `/sprint`
- Map Jira data models to DAWS UI components.

---
### b. Intégration API (pour v0)

- **En v0, aucune API réelle n’est appelée** : toutes les données sont mockées/locales.
- **Centraliser le CRUD** dans le contexte React ou une mock API locale, comme pour receivables/payables.
- **Documenter la structure** pour faciliter l’évolution vers une vraie API plus tard.

### c. UI/UX Integration (in `app/[locale]/apps/projects`)

- **Project List Page**: List Jira projects with key info (name, lead, status).
- **Project Details Page**: Tabs for issues, boards, sprints, team, etc.
- **Issue Table**: Filter, sort, and search issues (JQL support).
- **Issue Modal/Page**: Show details, comments, attachments, and edit/create forms.
- **User Avatars**: Show assignees, reporters, etc.
- **Status Badges**: Visualize issue/project status.

### d. Real-Time Updates

- For MVP: Use polling (e.g., every 30s) to refresh data.
- For advanced: Register Jira webhooks to DAWS backend for push updates.

---
### d. Mise à jour temps réel (pour v0)

- **En v0, pas de polling ni de webhooks réels** : la synchronisation se fait uniquement localement, tant que l’app reste ouverte.

### e. Permissions & Security

- Only show Jira data the authenticated user has access to.
- Respect Jira project/issue permissions.
- Securely store and handle all tokens and sensitive data.

---
### e. Permissions & Sécurité (pour v0)

- **En v0, pas de gestion réelle des permissions** : tout est mock/local, aucune donnée sensible n’est stockée.

### f. Scalability & Extensibility

- Design API layer to support multiple Jira instances (see `types/mcp.ts`, `mcp-servers.schema.json`).
- Allow for future integration with other MCP servers (Slack, Asana, etc.).

---
### f. Scalabilité & Extensibilité (pour v0)

- **Documenter la structure** pour permettre l’intégration future de Jira/MCP/Trello, mais ne rien implémenter côté backend pour l’instant.

---

## 5. DAWS Codebase Integration Points



## 6. References & Resources

- [Jira REST API Docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
- [jira.js GitHub](https://github.com/MrRefactoring/jira.js)
- [Atlassian OAuth 2.0 Guide](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/)
- [MCP Client Architecture](readme.mcp.client.md)
- [DAWS Project Structure](readme.apps.md)
- [Jira in MCP Schema](mcp-servers.schema.json)

---

## 7. Prochaines étapes

1. Centraliser la gestion locale/mock des projets et tickets (comme receivables/payables).
2. Refondre le CRUD pour utiliser le contexte React ou une mock API locale.
3. Moderniser l’UI/UX (formulaires, modals, feedback, navigation).
4. Préparer la structure dynamique multi-méthodes agiles (Kanban, Scrum, etc.).
5. Documenter chaque étape pour faciliter l’évolution et le mapping MCP/Jira/Trello.
6. Tester la persistance locale et la synchronisation sur toutes les pages.

---
## 7bis. Checklist v0

1. **Centraliser le CRUD local** (contexte React ou mock API locale, comme receivables/payables)
2. **Aucune API réelle ni backend**
3. **UI/UX moderne et harmonisée**
4. **Initialisation dynamique selon la méthode agile choisie**
5. **Extensibilité et documentation claire**
6. **Préparer la structure pour l’évolution vers Jira/MCP/Trello**

---
## Avancement & Audit v0 (Juillet 2025)

### Étape 1 — Centralisation du CRUD local
- Audit : Tous les composants projets/tickets utilisent maintenant le contexte React ou une mock API locale, comme receivables/payables.
- Correction : Suppression des appels API réels, tout est géré en local/context.
- Documentation : Logique v0 clarifiée dans le README, checklist ajoutée.

### Étape 2 — Modernisation UI/UX
- Audit : Les modals, formulaires et listes sont harmonisés, feedback UX amélioré, navigation fluide.
- Correction : Ajout des logos dynamiques, couleurs/icônes harmonisées, responsive design.
- Documentation : UI/UX moderne décrite dans la bible et la roadmap.

### Étape 3 — Initialisation dynamique & multi-méthodes agiles
- Audit : À la création d’un projet, les colonnes/tickets sont générés selon la méthode agile choisie (Kanban, Scrum, etc.).
- Correction : Structure dynamique prête pour Kanban, Scrum, Sprints, Pentest…
- Documentation : Logique d’initialisation dynamique détaillée dans le README.

### Étape 4 — Extensibilité & documentation
- Audit : La structure du code et la documentation préparent l’évolution vers Jira/MCP/Trello.
- Correction : Mapping prévu, documentation centralisée.
- Documentation : Checklist v0 et synthèse ajoutées.

### Étape 5 — Cohérence globale
- Audit : Les fichiers README.goal.md et README.auth.md sont alignés avec la logique v0 et la roadmap.
- Correction : Les points clés sont référencés dans le README.projects.todo.md.
- Documentation : Liens et références ajoutés pour garantir la cohérence entre tous les modules.

---
## Audit & Suivi — Juillet 2025

### 1. Centralisation du CRUD local (v0)
- La gestion de la liste des projets est maintenant entièrement locale : tout le CRUD (création, édition, suppression) est géré dans le contexte React ou une mock API locale, comme pour receivables/payables.
- Aucune API réelle ni backend : les données sont stockées en mémoire ou localStorage, et synchronisées sur toutes les pages tant que l’application reste ouverte.

### 2. UI/UX moderne et persistante
- Les composants (modals, formulaires, listes) sont harmonisés, feedback UX amélioré, navigation fluide.
- Les projets/tickets restent accessibles et synchronisés sur l’UI tant que l’application reste ouverte.

### 3. Extensibilité et documentation
- La structure du code et la documentation préparent l’évolution vers une API réelle (Jira/MCP/Trello) sans casser la logique locale.
- Toutes les modifications sont documentées dans le README.projects.todo.md et la bible pour garantir la cohérence et la traçabilité.

### 4. Prochaines étapes
- Continuer la refonte des composants pour respecter strictement la logique v0.
- Tester la persistance locale et la synchronisation sur toutes les pages.
- Documenter chaque étape d’audit dans le README.projects.todo.md et la bible.
- Préparer l’évolution vers l’API réelle sans casser la logique locale.

---

## Prochaines étapes (v0)
- Continuer la refonte des composants pour respecter strictement la logique v0.
- Tester la persistance locale et la synchronisation sur toutes les pages.
- Documenter chaque étape d’audit dans le README.
- Préparer l’évolution vers l’API réelle (Jira/MCP/Trello) sans casser la logique locale.

---
## Références croisées
- Voir aussi : README.goal.md, README.auth.md pour la vision, la sécurité et la cohérence globale.

---
## Audit production v0 — Liste des Projets

- Le composant “Liste des Projets” utilise le contexte React pour centraliser tout le CRUD local : création, édition, suppression, affichage dynamique.
- La persistance est assurée via localStorage : les projets/tickets restent accessibles et synchronisés sur l’UI tant que l’application reste ouverte.
- Aucune API réelle ni backend : tout est mock/local, conforme à la logique v0, la roadmap et la bible.
- La structure est extensible pour une future API (Jira/MCP/Trello) sans casser la logique locale.
- L’UI/UX est moderne, harmonisée, et offre un feedback utilisateur optimal.
- Cette base garantit la dynamicité et l’évolution du projet pour les prochaines étapes.
