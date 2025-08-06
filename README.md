# 🚀 DA Workspace MVP - Version GDP_v1

## 📖 Description

DA Workspace est une plateforme moderne de gestion de projets qui se synchronise avec Jira, Trello, Slack et d'autres outils. Cette version inclut une gestion complète des projets, sprints, tâches, estimations budgétaires avec support multi-devises (MAD, EUR, USD).

## ✨ Fonctionnalités Principales

### 🎯 Gestion de Projets
- **Board Kanban** : Visualisation des tâches en colonnes (À faire, En cours, En attente, Terminé)
- **Sprints Agiles** : Création, démarrage et suivi des sprints Jira
- **Budget & Estimations** : Calculs automatiques avec support MAD, EUR, USD
- **Synchronisation Jira** : Import/export bidirectionnel des projets et tâches

### 🔧 Intégrations
- **Jira Cloud** : Synchronisation complète des projets, sprints et issues
- **Fallback Local** : Fonctionnement en mode dégradé sans connexion externe
- **Multi-devises** : Support Dirham Marocain, Euro, Dollar US

### 🎨 Interface
- **Mode sombre/clair** : Theme adaptatif
- **Responsive** : Optimisé mobile/desktop
- **Drag & Drop** : Déplacement intuitif des tâches
- **Temps réel** : Actualisation automatique des données

## 🛠️ Installation

### 1. Cloner le Repository
```bash
git clone https://github.com/cloud-expertise/DA_WORKSPACE_MVP.git
cd DA_WORKSPACE_MVP
git checkout GDP_v1
```

### 2. Installer les Dépendances
```bash
npm install
# ou
pnpm install
# ou 
yarn install
```

### 3. Configuration des Variables d'Environnement

#### Copier le fichier d'exemple
```bash
cp .env.example .env.local
```

#### Configurer Jira (obligatoire pour la synchronisation)

1. **Obtenir votre domaine Jira** :
   - Si vous utilisez Jira Cloud : `votre-equipe.atlassian.net`
   - Si vous utilisez Jira Server : `jira.votre-entreprise.com`

2. **Générer un token API Jira** :
   - Allez sur [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Cliquez sur "Create API token"
   - Copiez le token généré (gardez-le secret !)

3. **Modifier votre `.env.local`** :
```bash
# Remplacez par vos vraies valeurs
JIRA_DOMAIN=votre-equipe.atlassian.net
JIRA_EMAIL=votre-email@example.com  
JIRA_API_TOKEN=votre-token-secret-ici

# Générez une clé secrète pour NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
```

### 4. Lancer le Projet
```bash
npm run dev
# ou
pnpm dev
# ou
yarn dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration Avancée

### Variables d'Environnement Complètes

Consultez le fichier `.env.example` pour toutes les options disponibles :

```bash
# Jira (requis pour la synchronisation)
JIRA_DOMAIN=votre-domaine.atlassian.net
JIRA_EMAIL=votre-email@example.com
JIRA_API_TOKEN=votre-token-api

# NextAuth (authentification)
NEXTAUTH_SECRET=votre-secret-super-securise
NEXTAUTH_URL=http://localhost:3000

# Base de données (optionnel)
DATABASE_URL=postgresql://...

# Mode développement
NODE_ENV=development
```

## 📊 Utilisation

### 1. Premier Lancement
- L'app fonctionne même sans Jira (mode fallback local)
- Pour la synchronisation complète, configurez vos credentials Jira

### 2. Créer un Projet
- Allez dans "Projets > Gestion > Liste des Projets"
- Cliquez "Nouveau Projet"  
- Choisissez le type (Jira, Slack, Trello, Autre)
- Le projet sera créé sur Jira si les credentials sont configurés

### 3. Gestion des Sprints
- Allez dans "Projets > Gestion > Sprints"
- Sélectionnez un projet Jira
- Créez, démarrez et suivez vos sprints

### 4. Board Kanban
- "Projets > Gestion > Tableaux"
- Drag & drop des tâches entre colonnes
- Création/édition directe des tâches

### 5. Estimations Budgétaires
- "Projets > Gestion > Budget"
- Calculs automatiques basés sur les story points
- Support MAD, EUR, USD avec taux de change

## 🐛 Dépannage

### Problème de Connexion Jira
```bash
# Vérifiez vos credentials
curl -u votre-email@example.com:votre-token \
  https://votre-domaine.atlassian.net/rest/api/3/myself
```

### Erreurs de Compilation
```bash
# Nettoyage du cache
npm run build
# ou
rm -rf .next node_modules package-lock.json
npm install
```

### Mode Fallback Local
Si Jira n'est pas configuré, l'application fonctionne avec des données locales stockées dans `data/*.json`.

## 🔄 Synchronisation Jira

### Ce qui est Synchronisé
- ✅ **Projets** : Récupération et création
- ✅ **Tâches/Issues** : Import/export complet  
- ✅ **Sprints** : Gestion complète des sprints Agile
- ✅ **Story Points** : Calculs automatiques
- ✅ **Statuts** : Mapping des colonnes Kanban

### Limitations Actuelles
- ⚠️ **Changement de projet** : Les tâches Jira ne peuvent pas changer de projet facilement
- ⚠️ **Collaborateurs** : Les nouveaux collaborateurs sont stockés localement (pas sur Jira)
- ⚠️ **Temps réel** : Pas de webhooks (actualisation manuelle/périodique)

## 🌍 Multi-Devises

### Devises Supportées
- **MAD** 🇲🇦 Dirham Marocain (devise de base)
- **EUR** 🇪🇺 Euro 
- **USD** 🇺🇸 Dollar Américain

### Taux de Change (approximatifs)
- 1 EUR ≈ 10.8 MAD
- 1 USD ≈ 10.1 MAD

*Note : Les taux sont fixes dans cette version. Une version future pourra intégrer une API de change.*

## 📈 Suggestions d'Améliorations

Nous accueillons vos suggestions ! Voici quelques pistes :

### 🔥 Priorité Haute
- [ ] **Webhooks Jira** : Synchronisation temps réel
- [ ] **API Taux de Change** : Mise à jour automatique des devises
- [ ] **Notifications Push** : Alertes pour les deadlines
- [ ] **Rapports Avancés** : Graphiques de vélocité, burndown charts
- [ ] **Gestion des Permissions** : Rôles et accès par projet

### 🚀 Fonctionnalités Futures
- [ ] **Intégration Slack** : Notifications et commandes
- [ ] **Trello Sync** : Import/export des boards Trello  
- [ ] **Time Tracking** : Suivi du temps passé sur les tâches
- [ ] **Mobile App** : Application React Native
- [ ] **AI Assistant** : Suggestions automatiques, prédictions

### 🎨 UX/UI
- [ ] **Thèmes Personnalisés** : Couleurs d'entreprise
- [ ] **Dashboard Analytics** : Métriques temps réel  
- [ ] **Recherche Avancée** : Filtres par assignee, date, etc.
- [ ] **Commentaires & Mentions** : Collaboration en équipe
- [ ] **Historique des Changes** : Audit trail complet

### 🔧 Technique
- [ ] **Base de Données** : Migration vers PostgreSQL/MongoDB
- [ ] **Cache Redis** : Performance améliorée
- [ ] **Tests E2E** : Couverture Cypress/Playwright
- [ ] **Docker** : Déploiement containerisé
- [ ] **CI/CD** : Pipeline GitHub Actions

## 📝 Comment Contribuer

### 🐛 Reporter un Bug
1. Allez dans [Issues GitHub](https://github.com/cloud-expertise/DA_WORKSPACE_MVP/issues)
2. Cliquez "New Issue" > "Bug Report"  
3. Décrivez le problème avec captures d'écran

### 💡 Suggérer une Fonctionnalité
1. [Nouvelle Issue](https://github.com/cloud-expertise/DA_WORKSPACE_MVP/issues) > "Feature Request"
2. Expliquez le cas d'usage et les bénéfices
3. Proposez une implémentation si possible

### 🔧 Contribuer au Code
1. Fork le repository
2. Créez une branche : `git checkout -b feature/ma-fonctionnalite`
3. Codez et testez vos modifications
4. Commitez : `git commit -m "feat: ajoute ma fonctionnalité"`
5. Push : `git push origin feature/ma-fonctionnalite`  
6. Ouvrez une Pull Request

## 📞 Support

### 📧 Contact
- **Email** : support@da-workspace.com
- **Issues GitHub** : [github.com/cloud-expertise/DA_WORKSPACE_MVP/issues](https://github.com/cloud-expertise/DA_WORKSPACE_MVP/issues)

### 📚 Documentation
- **Wiki** : Documentation complète dans le wiki GitHub
- **API Docs** : Documentation des endpoints dans `/docs`
- **Changelog** : Historique des versions dans `CHANGELOG.md`

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**🎉 Merci d'utiliser DA Workspace ! Vos retours sont précieux pour l'amélioration continue.**

*Version GDP_v1 - Août 2025*
