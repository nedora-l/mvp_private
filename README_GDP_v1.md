# DA Workspace MVP - Gestion de Projets v1 (GDP_v1)

## 🎯 Vue d'ensemble

Cette branche **GDP_v1** contient une version complètement fonctionnelle et robuste du système de gestion de projets DA Workspace MVP. Le système supporte à la fois l'intégration Jira et un mode mock local pour le développement.

## 🚀 Fonctionnalités principales

### ✅ Gestion de Projets
- **CRUD complet** : Création, lecture, mise à jour, suppression des projets
- **Intégration Jira** : Synchronisation bidirectionnelle avec Jira
- **Mode Mock** : Fonctionnement local sans Jira pour le développement
- **Interface intuitive** : Tableau de bord avec filtres et recherche
- **Auto-refresh** : Mise à jour automatique des données (configurable)
- **Refresh manuel** : Bouton de synchronisation instantanée

### ✅ Gestion des Sprints
- **Vue d'ensemble** : Liste des sprints avec leur statut
- **Intégration Jira** : Synchronisation des sprints depuis Jira
- **Gestion des tâches** : Affichage des tâches par sprint
- **Métriques** : Statistiques sur l'avancement des sprints

### ✅ Kanban Board
- **Tableau interactif** : Colonnes To Do, In Progress, In Review, Done
- **Drag & Drop** : Déplacement des tâches entre colonnes
- **Feedback visuel** : Animations et confirmations lors des actions
- **Synchronisation** : Mise à jour automatique après chaque action
- **Filtres** : Par projet, assigné, priorité

### ✅ Gestion Budgétaire Multi-Devises
- **Support multi-devises** : MAD, EUR, USD
- **Estimations automatiques** : Calcul basé sur les tâches et Story Points
- **Configuration dynamique** : Taux de change et coûts par devise
- **Tableaux de bord** : Vue d'ensemble des budgets par projet

### ✅ Gestion des Collaborateurs
- **Base de données complète** : Profils avec rôles et départements
- **Attribution flexible** : Assignation aux projets et tâches
- **Interface dédiée** : Modal de gestion des collaborateurs
- **Rôles multiples** : Manager, Dev Team, AI Team, RH, Sécurité

## 🛠️ Configuration

### Prérequis
```bash
Node.js >= 18.0.0
npm ou pnpm
```

### Installation
```bash
# Cloner et installer les dépendances
git clone <repository-url>
cd DA_WORKSPACE_MVP
git checkout GDP_v1
npm install
```

### Configuration des variables d'environnement

Copiez le fichier `.env.example` vers `.env.local` :
```bash
cp .env.example .env.local
```

#### Variables essentielles :

```env
# Configuration générale
NODE_ENV=development
NEXT_PUBLIC_APP_URL=https://localhost:3000

# Base de données (optionnel pour mock)
DATABASE_URL="your-database-url"

# Intégration Jira (optionnel - le système fonctionne en mode mock sans)
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@domain.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT_KEY=YOUR-PROJECT-KEY

# Configuration OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Sécurité
NEXTAUTH_URL=https://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Configuration multi-devises
NEXT_PUBLIC_DEFAULT_CURRENCY=MAD
NEXT_PUBLIC_SUPPORTED_CURRENCIES=MAD,EUR,USD

# Configuration API MCP
NEXT_PUBLIC_MCP_SERVER_URL=https://workspace.africacyberinsur.com
MCP_SERVER_URL=https://workspace.africacyberinsur.com
```

### 🔧 Modes de fonctionnement

#### Mode Mock (Développement local)
Le système fonctionne parfaitement sans configuration Jira :
- Données stockées dans `data/projects.json`, `data/tasks.json`, `data/collaborators.json`
- Toutes les fonctionnalités disponibles
- Idéal pour le développement et les tests

#### Mode Jira (Production)
Avec la configuration Jira :
- Synchronisation automatique des projets, sprints et tâches
- Mise à jour bidirectionnelle
- Données en temps réel depuis Jira

## 🚦 Lancement

### Développement
```bash
npm run dev
```
Accédez à `https://localhost:3000`

### Production
```bash
npm run build
npm start
```

## 📁 Structure des nouveaux composants

### Pages principales
```
app/[locale]/apps/projects/gestion/
├── board/page.tsx          # Tableau Kanban
├── sprint/page.tsx         # Gestion des sprints
└── budget/page.tsx         # Gestion budgétaire
```

### Contextes
```
contexts/
├── projects-context.tsx     # Gestion des projets
├── tasks-context.tsx       # Gestion des tâches
├── sprints-context.tsx     # Gestion des sprints
└── collaborators-context.tsx # Gestion des collaborateurs
```

### API Routes
```
app/api/
├── mcp/
│   ├── projects/route.ts   # API projets
│   └── sprints/route.ts    # API sprints
├── budget-estimations/route.ts # API budget
└── v0/
    ├── tasks/route.ts      # API tâches
    └── collaborators/route.ts # API collaborateurs
```

### Composants
```
components/
├── tasks/                  # Composants de gestion des tâches
├── projects/              # Composants de gestion des projets
└── jira-indicator.tsx     # Indicateur de statut Jira
```

## 🔄 Intégration Jira

### Configuration automatique
Le système détecte automatiquement la présence de la configuration Jira et bascule entre les modes :

1. **Avec Jira** : Synchronisation automatique des données
2. **Sans Jira** : Mode mock avec données locales

### Mapping des statuts
```javascript
// Jira → Application
"To Do" → "todo"
"In Progress" → "in-progress"  
"In Review" → "in-review"
"Done" → "done"
```

### Synchronisation
- **Auto-refresh** : Toutes les 10 minutes (configurable)
- **Manuel** : Bouton de refresh dans l'interface
- **Temps réel** : Après chaque action utilisateur

## 🎨 Interface utilisateur

### Thème
- **Design moderne** : Interface cohérente avec Tailwind CSS
- **Mode sombre/clair** : Thème adaptatif
- **Responsive** : Compatible mobile et desktop
- **Composants réutilisables** : Architecture modulaire

### Notifications
- **Toast notifications** : Retours utilisateur via Sonner
- **États de chargement** : Spinners et placeholders
- **Gestion d'erreurs** : Messages d'erreur informatifs

## 🐛 Corrections apportées

### Bugs corrigés
- ✅ Erreur "The default export is not a React Component"
- ✅ Boucles infinies dans les contextes React
- ✅ Conflits d'imbrication HTML (`<html>` dans `<body>`)
- ✅ Problèmes d'imports de hooks (`use-toast` → `sonner`)
- ✅ Doublons de pages (sprints/sprint)
- ✅ Erreurs de build Next.js

### Améliorations
- ✅ Migration complète vers Sonner pour les toasts
- ✅ Contextes optimisés avec `useCallback`
- ✅ Auto-refresh intelligent (10min au lieu de 10s)
- ✅ Feedback utilisateur amélioré
- ✅ Structure de layout clarifiée
- ✅ Configuration .env consolidée

## 📋 Tests

### Vérification de fonctionnement
1. **Lancement** : `npm run dev`
2. **Navigation** : Accès à toutes les pages sans erreur
3. **CRUD Projets** : Création, modification, suppression
4. **Kanban** : Drag & drop des tâches
5. **Sprints** : Affichage et navigation
6. **Budget** : Calculs multi-devises
7. **Collaborateurs** : Gestion complète

### Build de production
```bash
npm run build
```
Doit compiler sans erreurs ni warnings critiques.

## 🔜 Roadmap

### Prochaines étapes
- [ ] Tests automatisés (Jest/Cypress)
- [ ] Documentation API complète
- [ ] Optimisations de performance
- [ ] Fonctionnalités avancées Jira
- [ ] Export/Import de données
- [ ] Rapports et analytics avancés

## 🤝 Contribution

### Structure de développement
1. **Branche principale** : `GDP_v1`
2. **Nouvelles fonctionnalités** : Créer une branche depuis `GDP_v1`
3. **Pull Requests** : Merger vers `GDP_v1`

### Guidelines
- Respecter la structure existante
- Tester en mode mock ET Jira
- Documenter les nouvelles fonctionnalités
- Maintenir la compatibilité multi-devises

## 📞 Support

Pour toute question ou problème :
1. Vérifier la configuration `.env.local`
2. Consulter les logs de la console navigateur
3. Tester en mode mock si problème Jira
4. Vérifier l'état des contextes React

---

## 🏆 État de la branche GDP_v1

**✅ STABLE ET FONCTIONNELLE**

Cette branche contient un système complet et robuste de gestion de projets, prêt pour la production avec ou sans intégration Jira.

**Dernière mise à jour** : 6 août 2025
**Version** : 1.0.0
**Statut** : Production-ready
