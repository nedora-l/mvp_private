# Audit – Jira Integration & Fixes (DA Workspace MVP)

## 1️⃣ Principales erreurs rencontrées

### 🔴 1. Fallback local/mock data
- **Problème** : Les APIs et contextes utilisaient des données locales (JSON, v0) ou mock en cas d’échec Jira.
- **Impact** : Pollution des données, incohérence, tâches non persistantes, bugs après reload.
- **Fix** : Suppression totale de tout fallback local dans :
  - `app/api/mcp/projects/route.ts`
  - `app/api/mcp/tasks/route.ts`
  - `app/api/mcp/collaborators/route.ts`
  - `contexts/projects-context.tsx`, `contexts/tasks-context.tsx`, `contexts/collaborators-context.tsx`
  - Suppression du dossier `app/api/v0/*` et références associées.

### 🔴 2. Hardcoding des IDs, keys, mapping
- **Problème** : Utilisation d’IDs ou clés Jira fixes (ex: `projectId = 101` ou `jiraKey = "SSP"`).
- **Impact** : Impossible d’ajouter/supprimer des projets dynamiquement, bugs de mapping, board vide.
- **Fix** : Mapping dynamique des projets via l’API Jira, plus aucun hardcoding.
  - Correction dans `app/api/mcp/tasks/route.ts` (mapping JiraKey → projectId dynamique)
  - Correction dans le board UI (filtrage dynamique)

### 🔴 3. Mismatch de types (string vs number)
- **Problème** : Les APIs retournaient des IDs en string, le frontend utilisait des numbers.
- **Impact** : Filtrage impossible, board toujours vide, drag & drop non persistant.
- **Fix** :
  - APIs corrigées pour retourner des IDs en number partout (`app/api/mcp/projects/route.ts`, `app/api/mcp/tasks/route.ts`)
  - Contextes et UI corrigés pour utiliser des numbers (`contexts/projects-context.tsx`, `contexts/tasks-context.tsx`, `app/[locale]/apps/projects/gestion/board/page.tsx`)

### 🔴 4. Drag & Drop non persistant
- **Problème** : Le drag & drop changeait le statut en local, mais ne persistait pas dans Jira.
- **Impact** : Les tâches disparaissaient après reload, board non synchronisé.
- **Fix** :
  - Correction de la fonction `editTask` pour appeler l’API Jira et persister le changement de statut.
  - Ajout de logs et d’un double refresh pour garantir la synchro.

### 🔴 5. Encodage UTF-8
- **Problème** : Certains champs (noms, descriptions) étaient mal encodés (ex: `Ãquipe Jira`).
- **Impact** : Mauvaise lisibilité, bugs d’affichage.
- **Fix** :
  - Vérification et correction de l’encodage dans les APIs et le mapping.

### 🔴 6. Création d’utilisateurs Jira
- **Problème** : Message d’erreur disant que l’API ne permet pas la création d’utilisateurs.
- **Impact** : Confusion, limitation non justifiée.
- **Fix** :
  - Vérification de la doc officielle : l’API existe, mais nécessite des permissions admin et ne marche pas avec Forge/OAuth2/Connect apps.
  - Correction du message d’avertissement dans le modal collaborateur.

### 🔴 7. Code orphelin et duplication
- **Problème** : Beaucoup de code mort, duplication, fallback non utilisé.
- **Impact** : Maintenance difficile, bugs cachés.
- **Fix** :
  - Audit complet et suppression de tout code orphelin/dupliqué dans tous les contextes et APIs.

## 2️⃣ Fichiers et docs créés pour l’audit

- `COMPLETE-JIRA-APIS-REFERENCE.md` : Liste exhaustive des endpoints Jira, mapping, exemples d’usage.
- `jira-api-guide-technique.md` : Guide technique sur l’utilisation des APIs Jira, mapping des champs, best practices.
- `AUDIT_JIRA_INTEGRATION_FIXES.md` (ce fichier) : Synthèse des erreurs, fixes et bonnes pratiques.

## 3️⃣ Bonnes pratiques à suivre

- Toujours lire le fichier entier avant modification.
- Utiliser uniquement les APIs Jira officielles (voir doc).
- Bannir tout hardcoding (IDs, keys, mapping).
- Respecter les types (IDs en number partout).
- Tester après chaque modif (API, UI, board reload, CRUD).
- Documenter tous les endpoints et mappings.
- Auditer pour code orphelin/duplication avant/après chaque modif.
- Respecter les limitations Jira Cloud (user creation, permissions, etc).

## 4️⃣ Résumé des corrections majeures

- APIs MCP corrigées pour ne retourner que des données Jira, plus de fallback local.
- Mapping dynamique des projets et tâches (plus de hardcoding).
- Types corrigés partout (IDs en number).
- Board UI corrigé pour filtrer et afficher les tâches dynamiquement.
- Drag & drop persistant via Jira.
- Encodage vérifié et corrigé.
- Message collaborateur corrigé pour la création d’utilisateurs Jira.
- Audit complet et suppression du code orphelin/dupliqué.

---

**Ce fichier sert de référence pour tout nouveau développeur ou agent AI. Pour toute modification, suivre les best practices ci-dessus et consulter les docs de référence.**
