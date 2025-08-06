# Roadmap D&A Workspace – Gestion de Projet & MCP

# 🗺️ Roadmap Globale D&A Workspace

## 1. Initialisation

- Créer un dossier pour chaque module principal (Projets, Tâches, Tableaux, etc.).
- Ajouter un composant principal pour chaque module, accessible directement depuis la sidebar.

## 2. Structure des pages

- Pour chaque module :
  - `page.tsx` pour la vue principale (liste, dashboard, etc.)
  - `[id]/page.tsx` pour la vue détail
  - `create.tsx` ou modal pour la création
  - `edit.tsx` ou modal pour l’édition

## 3. Logique v0

- Utiliser le state local pour le CRUD (prototypage rapide).
- Valider les champs obligatoires et afficher un feedback visuel.
- Utiliser des icônes claires pour les actions (édition, suppression).

## 4. Connexion API MCP

- Migrer la logique locale vers l’API MCP pour chaque opération.
- Mettre à jour dynamiquement la liste après chaque action.

## 5. UI/UX

- Design épuré, responsive, feedback visuel.
- Composants uniformes pour chaque module.
- Navigation claire et directe via la sidebar.

## 6. Tests & Documentation

- Ajouter des tests automatisés pour chaque endpoint et composant critique.
- Mettre à jour la documentation vivante à chaque étape.

## 7. Checkpoints d’audit

- Audit rapide avant chaque étape : structure, unicité, liens, imports, navigation.
- Vérification du fonctionnement dans le navigateur.
- Documentation des évolutions.

---

---

# 📚 Project Bible Globale

## Bonnes pratiques fondamentales

- Toujours auditer la structure avant toute suppression ou modification (fichiers, composants, routes).
- Ne jamais supprimer un fichier ou composant sans vérifier son usage réel (routing, imports, UI).
- Sauvegarder ou archiver avant toute suppression majeure.
- Tester systématiquement chaque route et chaque composant après modification.
- Uniformiser la structure des modules : chaque module (Projets, Tâches, Tableaux, etc.) doit être un composant principal, accessible directement depuis la sidebar (pas de sous-menu caché).
- Documenter chaque évolution, suppression ou ajout dans le roadmap.
- Vérifier la cohérence entre la navigation UI (sidebar, boutons) et le routing Next.js.
- Utiliser des composants réutilisables pour les vues principales (liste, détail, création, édition).
- Préférer la logique v0 locale pour le prototypage, puis migrer vers l’API MCP.
- Mettre à jour la documentation vivante à chaque étape.

## Erreurs à ne pas refaire

- Supprimer des fichiers ou composants sans audit complet.
- Oublier la page d’entrée d’un module ou la rendre inaccessible.
- Gérer la navigation via sous-menus au lieu de composants principaux.
- Ne pas uniformiser la structure des modules.
- Ne pas tester après modification.
- Ne pas documenter les suppressions/modifications.

---

## ⚠️ Règle d'audit systématique

- Avant chaque étape ou ajout de fonctionnalité, effectuer un audit rapide de la structure du projet :
  - Vérifier l’unicité des fichiers par route/module
  - Supprimer ou archiver les doublons et legacy
  - S’assurer qu’aucune création inutile n’a été faite
  - Mettre à jour la documentation si besoin

## 🗂️ Modules MCP intégrés

- ✅ Directory : gestion des employés, équipes, départements
- ✅ Files : gestion avancée des fichiers, dossiers, catégories, types, commentaires, partage, upload
- ✅ Organization : infos orga, valeurs, documents épinglés, localisations, leaders
- ✅ Projects : gestion complète des projets (CRUD, types, membres, rôles, attachements, intégration Atimeus)

---

## 🚦 Avancement des étapes

| Étape                                 | Statut      |
| ------------------------------------- | ----------- |
| Intégration des modules MCP           | ✅ Terminé  |
| Documentation des méthodes MCP        | 🟡 En cours |
| Préparation de l’intégration AI       | 🟡 En cours |
| Amélioration UI/UX (design, feedback) | 🔴 À faire  |
| Automatisation des tests              | 🔴 À faire  |
| Intégration de Jira/Atimeus/mini-apps | 🔴 À faire  |
| Ajout de nouveaux endpoints si besoin | 🔴 À faire  |

---

## 🎨 UI/UX – Principes à suivre
## 🎨 UI/UX – Principes à suivre

### UX Exceptionnelle – Gestion de Projet
- Design épuré, moderne et accessible à tous (débutants, non-développeurs).
- Navigation ultra-intuitive : sidebar claire, actions directes, pas de complexité cachée.
- Feedback visuel immédiat (animations, notifications, couleurs cohérentes).
- Icônes explicites et tooltips pour chaque action.
- Onboarding rapide : guides, aides contextuelles, explications simples.
- Responsive et accessible (navigation clavier, ARIA, contrastes).
- Actions en un clic : création, édition, suppression, sans friction.
- Messages d’erreur et de confirmation clairs et bienveillants.
- Tests UX réguliers avec des utilisateurs non techniques.

Revenir à cette section à chaque étape pour garantir une expérience utilisateur exceptionnelle.
---

## 📝 Création et gestion des projets – Champs et fonctionnalités

- Titre du projet
- Description détaillée
- Type de projet (Dév, Bug, Sécurité, Scrum, Kanban, Custom…)
- Statut (En cours, Terminé, Urgent, En attente…)
- Dates de début et de fin
- Priorité
- Responsable (manager)
- Équipe/collaborateurs (sélection multiple)
- Budget (optionnel)
- Estimation de coût (optionnel)
- Tags ou catégories
- Avatar/logo du projet
- Source externe (Jira, Trello, Atimeus…)
- Documents ou fichiers associés
- Custom fields (pour besoins spécifiques)
- Type de workflow (Scrum, Kanban, etc.)

---

## 🔗 Intégration UI/UX et API

- Formulaire de création en modal ou page dédiée, épuré et responsive
- Validation stricte des champs
- Icônes stylisées pour les actions (crayon pour éditer, corbeille cute pour supprimer)
- Feedback visuel et notifications
- Connexion à l’API MCP pour toutes les opérations (CRUD)
- Mise à jour dynamique de la liste et des modules liés

---

## 📚 Bonnes pratiques & logique MCP

- Architecture API driven : chaque action passe par un service MCP
- Modularité : chaque module est indépendant et réutilisable
- Extensibilité : facile d’ajouter de nouveaux outils ou endpoints
- Sécurité : gestion des tokens, rôles, permissions
- Documentation vivante et mise à jour
- Tests automatisés pour chaque endpoint

---

## 📋 TODO & Points d’attention

- [ ] Compléter la documentation des méthodes MCP
- [ ] Designer et implémenter l’UI/UX finale
- [ ] Préparer l’intégration AI (scénarios, endpoints)
- [ ] Ajouter les modules manquants si besoin
- [ ] Mettre à jour ce fichier à chaque étape

---

Ce fichier sert de référence vivante pour suivre l’avancement, la logique, et les bonnes pratiques du projet. Mets à jour les statuts et les TODO à chaque évolution.

---

> Si tu veux ajouter des composants ou modules manquants, indique-les ici ou partage leur code pour intégration !
