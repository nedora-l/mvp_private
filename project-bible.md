# 📖 D&A Workspace – Bible du Projet

## 🎯 Bonnes Pratiques & Règles du Projet

- Pour chaque module, privilégier la création dynamique via formulaire et gestion locale du state (comme sur payables/receivables), éviter le hardcoding de la liste, et toujours utiliser des props pour transmettre les données entre composants.

---

## ❌ Bad Practices (à éviter absolument)

- Corriger une erreur sans comprendre la cause ou sans respecter la logique du projet.
- Passer à l’étape suivante sans avoir testé ou validé la précédente.
- Laisser des erreurs ou des warnings non traités dans le terminal.
- Accepter le code généré par l’AI sans relecture ou adaptation.
- Modifier le code sans documentation ou sans prévenir l’équipe.
- Imposer des “quick fixes” qui cassent la structure ou la sécurité.
- Négliger la qualité du code ou l’expérience utilisateur.
- Mélanger la logique métier et la logique d’UI dans le même composant.
- Oublier de gérer les erreurs ou de notifier l’utilisateur.
- Laisser des endpoints ou des actions non sécurisées.
- Ne pas mettre à jour les autres modules/vues après une modification.
- Utiliser des noms de variables ou de champs non explicites.
- Oublier la documentation ou les commentaires dans le code.
- Rendre le code difficile à maintenir ou à étendre.
- Ignorer les tests ou les retours utilisateurs.
- Faire des appels API non optimisés ou non asynchrones.
- Négliger l’accessibilité ou l’expérience utilisateur.
- **RECRÉER DES FICHIERS** au lieu de les modifier - cela pollue le projet avec des doublons et corruptions.

**EXCEPTION** : Si un fichier est totalement corrompu (code mélangé, variables non définies, structure cassée), il est autorisé de le supprimer et le recréer proprement, mais seulement après validation et en respectant :
- La structure et logique existante du projet
- Les contextes et API déjà créés
- La bible et les documents de référence (proj_todo.md, roadmap.md)
- Les types et interfaces déjà définies

**FLEXIBILITÉ MANUELLE** : L'utilisateur peut effectuer des manipulations manuelles de fichiers (suppression, création, déplacement) quand c'est plus simple et plus efficace que les outils automatisés. Dans ce cas :
- L'AI doit simplement confirmer l'action et procéder à la suite
- Respecter la logique et structure du projet
- Documenter les changements effectués

---

## 📚 Règles d’utilisation de la bible

- Toujours relire cette bible avant chaque réponse, chaque ajout ou modification de code.
- S’assurer que chaque étape du projet respecte ces bonnes pratiques.
- Mettre à jour ce document si de nouvelles règles ou pratiques sont identifiées.

## 🆕 NOUVELLES RÈGLES AJOUTÉES (06/08/2025)

### ⚠️ **Clone/Réplication de fonctionnalités**
Lors du clonage d'outils externes (Jira, Trello, etc.) :

- **CRUD complet obligatoire** : Création, lecture, modification, suppression sur toutes les entités
- **Interactions natives** : Drag & drop HTML5 natif, pas de librairies externes sauf nécessaire
- **UX cohérente** : Boutons d'action visibles au hover, feedbacks utilisateur
- **Modals d'édition** : Tous les champs modifiables avec validation
- **États intermédiaires** : Loading, empty states, error states
- **Synchronisation** : Tous les modules utilisent les mêmes données
- **Tests manuels** : Vérifier chaque interaction avant validation
- **Gestion des types** : Interfaces TypeScript cohérentes entre modules

### 🔧 **Checklist Clone Fonctionnel**
- [ ] Création inline (+ boutons, formulaires rapides)
- [ ] Édition par clic/double-clic avec modal complet  
- [ ] Suppression avec confirmation
- [ ] Drag & drop natif entre colonnes/états
- [ ] Assignation collaborateurs avec autocomplete
- [ ] Dates et priorités modifiables
- [ ] Synchronisation temps réel entre vues
- [ ] Responsive design (mobile/desktop)

### 🏢 **Gestion d'équipe complète**
- **Tous les rôles d'entreprise** : CEO, CFO, CTO, DRH, Comptable, Stagiaires, Consultants, etc.
- **Hiérarchie claire** : Direction > Manager > Équipe > Stagiaires/Alternants
- **Départements structurés** : IT, RH, Finance, Marketing, Commercial, Juridique, etc.
- **Emails réels** : Chaque collaborateur a un email valide pour les notifications

### 🔔 **Intégrations et notifications réelles**
- **API externes fonctionnelles** : Slack, Email (SMTP/Services), Teams, Webhooks
- **Notifications intelligentes** : Création, modification, achèvement, retards
- **Tests en temps réel** : Boutons de test dans l'interface pour valider les intégrations
- **Configuration environnement** : Variables d'environnement pour production
- **Fallback développement** : Mode console.log si APIs non configurées

### 🤖 **Automatisations avancées**
- **Règles métier** : Escalade automatique selon priorité, département, échéances
- **Workflows personnalisés** : Selon le type de projet (Jira/Slack/Trello)
- **Analytics en temps réel** : Suivi des notifications, taux de lecture, réactions
- **Synchronisation bidirectionnelle** : D&A Workspace ↔ APIs externes

---

Ce document est la référence absolue pour garantir la qualité, la cohérence et la robustesse du projet D&A Workspace.

D'accord ! Je vais toujours vérifier la bible, proj_todo.md et roadmap.md avant toute action. Commençons par lire ces fichiers pour comprendre les exigences