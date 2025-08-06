# Cahier des Charges pour l'Application Workspace de Gestion de la Sécurité de l'Information

## 1. Introduction

### 1.1 Objectif du document

Ce Cahier des Charges définit les exigences complètes pour le développement de l'application Workspace, conçue pour centraliser les informÉcrans clés :
Tableau de bord basé sur le rôle.
Interface de gestion des documents.
Formulaire de signalement d'incidents.
Interface de planification des audits.
**Tableau de bord de gestion de projets** : Vue consolidée des projets de sécurité en cours.
**Interface de saisie des temps** : Formulaire simple et rapide pour l'enregistrement des activités.
**Dashboard de planification** : Visualisation des disponibilités et de la charge de travail de l'équipe.
**Écrans de reporting** : Interfaces de génération et consultation des rapports d'activité et financiers.s, processus, et registres liés à la sécurité de l'information. Il sert de guide pour les développeurs, les parties prenantes, et les utilisateurs finaux dans la mise en œuvre d'un Système de Management de la Sécurité de l'Information (SMSI) conforme aux standards internationaux.

### 1.2 Contexte

Dans un environnement où la sécurité de l'information est cruciale, l'application Workspace répond au besoin de gérer efficacement les documents, les risques, les incidents, et les audits, tout en respectant des normes comme ISO 27001 et ISO 27005. Cette application s'intègre dans l'écosystème DAWS (D&A Workspace) existant et doit assurer une continuité avec les fonctionnalités déjà déployées.

### 1.3 Portée

L'application couvre :

- Un espace restreint pour les rôles spécifiques (RSSI, IT, RH, Achats, Direction)
- Un espace accessible à tous les utilisateurs pour la sensibilisation et le signalement
- Des fonctionnalités transversales comme la gestion des rôles et la recherche plein texte
- L'intégration avec l'infrastructure existante (authentification, base de données, notifications)

### 1.4 Parties prenantes

| Partie prenante | Rôle | Responsabilités |
|-----------------|------|-----------------|
| **RSSI (Responsable de la Sécurité du SI)** | Propriétaire métier | Validation des processus sécurité, définition des politiques |
| **Direction IT** | Sponsor technique | Validation de l'architecture, allocation des ressources |
| **Équipe de développement** | Réalisateur | Implémentation des fonctionnalités |
| **Utilisateurs finaux** | Utilisateurs | Tests d'acceptation, feedback utilisateur |
| **Équipe Conformité** | Validateur | Vérification de la conformité réglementaire |
| **Direction Générale** | Décideur** | Approbation du budget et du planning |

 harges pour l’Application Workspace de Gestion de la Sécurité de l’Information

1. Introduction

### 1.1 Objectif du document into

Ce Cahier des Charges définit les exigences pour le développement de l’application Workspace, conçue pour centraliser les informations, processus, et registres liés à la sécurité de l’information. Il sert de guide pour les développeurs, les parties prenantes, et les utilisateurs finaux.

### 1.2 Contexte into

Dans un environnement où la sécurité de l’information est cruciale, l’application Workspace répond au besoin de gérer efficacement les documents, les risques, les incidents, et les audits, tout en respectant des normes comme ISO 27001 et ISO 27005.
L'application s'intègre dans l'écosystème DAWS (D&A Workspace) existant et doit assurer une continuité avec les fonctionnalités déjà déployées.

### 1.3 Portée into

L’application couvre :

Un espace restreint pour les rôles spécifiques (RSSI, IT, RH, Achats, Direction).
Un espace accessible à tous les utilisateurs pour la sensibilisation et le signalement.
Des fonctionnalités transversales comme la gestion des rôles et la recherche plein texte.

## 2. Objectifs

### 2.1 Objectif principal

Centraliser la gestion de la sécurité de l’information pour améliorer la conformité, la réactivité, et la sensibilisation.

### 2.2 Objectifs secondaires

Assurer un accès sécurisé basé sur les rôles.
Faciliter la conformité aux normes de sécurité.
Améliorer la gestion des incidents et des risques.
Promouvoir la sensibilisation des utilisateurs.
**Optimiser la gestion opérationnelle de la sécurité** : Améliorer l'efficacité des équipes de sécurité grâce à une gestion structurée des projets, du temps, et des ressources.
**Assurer la transparence financière** : Fournir une visibilité sur les coûts et le retour sur investissement des initiatives de sécurité.
**Développer les compétences** : Faciliter la montée en compétences et la gestion des certifications de l'équipe de sécurité.

## 3. Exigences fonctionnelles

3.1 Espace restreint (Accès selon rôle : RSSI, IT, RH, Achats, Direction)
3.1.1 Gestion documentaire du SMSI

Fonctionnalités :
Gestion des documents : politique de sécurité, charte informatique, procédures.
Versioning et validation des documents.
Registre de contrôles documentaires.

Explication : Permet de stocker, organiser, et suivre les versions des documents critiques, avec un processus d’approbation.

3.1.2 Analyse de risques & traitements

Fonctionnalités :
Identification et inventaire des actifs (PC, équipements réseau, solutions cloud).
Registre et matrice des risques.
Plan de traitement des risques.

Explication : Conforme à ISO 27005, cette section permet d’identifier les actifs, d’évaluer les risques, et de planifier les mesures correctives.

3.1.3 Gestion des incidents de sécurité

Fonctionnalités :
Registre des incidents (signalements, analyses, impacts, mesures correctives).
Workflow de gestion des incidents (détection → résolution → leçons tirées).
Notifications automatiques aux responsables.

Explication : Offre un suivi structuré des incidents pour une réponse rapide et efficace.

3.1.4 Contrôle d’accès et gestion des identités

Fonctionnalités :
Registre des droits d’accès par application/système.
Workflow d’habilitation et de désactivation.
Suivi des revues périodiques d’accès.
Historique des demandes d’accès.

Explication : Garantit que seuls les utilisateurs autorisés accèdent aux ressources, avec un suivi rigoureux.

3.1.5 Audit interne & conformité

Fonctionnalités :
Planning des audits internes.
Rapports d’audit.
Actions correctives et préventives.
Tableau de bord de conformité avec indicateurs de sécurité.

Explication : Facilite la planification et le suivi des audits pour assurer la conformité.

3.1.6 Gestion des fournisseurs

Fonctionnalités :
Registre des fournisseurs critiques.
Évaluation des fournisseurs (sécurité, SLA).

Explication : Permet de gérer les relations avec les fournisseurs critiques pour la sécurité.

3.2 Espace accessible à tous les utilisateurs
3.2.1 Sensibilisation & formation à la sécurité

Fonctionnalités :
Espace e-learning ou liens vers modules de sensibilisation.
Quizz et auto-évaluations.
Calendrier des campagnes de sensibilisation.
Affichage des bonnes pratiques (mot de passe, phishing, etc.).

Explication : Encourage la sensibilisation des employés à travers des ressources éducatives interactives.

3.2.2 Portail de signalement

Fonctionnalités :
Formulaire de signalement simple et rapide.
Suivi anonyme ou nominatif du traitement.
FAQ pour guider en cas d’incident.

Explication : Permet aux utilisateurs de signaler des anomalies ou incidents de manière sécurisée.

3.3 Fonctionnalités transversales

Gestion des rôles et permissions : Permissions granulaires basées sur les rôles.
Workflow de validation/approbation : Processus d’approbation pour les accès, incidents, et documents.
Notifications automatiques et rappels : Alertes pour les actions requises.
Journalisation des actions/logs d’audit : Suivi des activités pour la traçabilité.
Archivage automatique et horodatage : Conservation des versions des documents.
Classification des documents : Catégories comme Public, Interne, Confidentiel, Secret.
Recherche plein texte : Recherche rapide dans les documents et registres.

### 3.4 Gestion des opérations de sécurité (Inspiré d'Atimeüs ERP)

Cette section introduit des fonctionnalités avancées de gestion opérationnelle pour optimiser l'efficacité et le suivi des activités de sécurité.

#### 3.4.1 Gestion de projets de sécurité

**Fonctionnalités :**

- **Gestion par affaire de sécurité** : Suivi centralisé de tous types de projets de sécurité (audits, évaluations de risques, mise en conformité, implémentation de contrôles).
- **Planification et suivi** : Gestion des échéances, des livrables, et de l'avancement des projets.
- **Allocation des ressources** : Affectation des membres de l'équipe sécurité aux différents projets.
- **Suivi budgétaire** : Estimation des coûts et suivi des dépenses par projet.
- **Tableau de bord projet** : Vue d'ensemble des projets en cours, retards, et indicateurs de performance.

**Explication :** Permet une gestion structurée des initiatives de sécurité avec un suivi précis des ressources et des résultats.

#### 3.4.2 Suivi des temps et activités de sécurité

**Fonctionnalités :**

- **Saisie des temps** : Enregistrement du temps passé sur les différentes activités de sécurité (incidents, audits, formation, veille).
- **Catégorisation des activités** : Classification par type (réactif/proactif, opérationnel/stratégique).
- **Validation hiérarchique** : Processus d'approbation des temps saisis.
- **Reporting d'activité** : Génération de rapports sur la répartition du temps et la productivité.
- **Intégration avec la gestion d'incidents** : Lien automatique avec les incidents traités.

**Explication :** Offre une visibilité précise sur l'utilisation des ressources de sécurité et facilite l'optimisation des processus.

#### 3.4.3 Gestion de l'équipe de sécurité

**Fonctionnalités :**

- **Cartographie des compétences** : Inventaire des compétences techniques et certifications de chaque membre.
- **Suivi des certifications** : Alertes pour les renouvellements et planification des formations.
- **Évaluation des performances** : Feedbacks périodiques et évaluation de l'engagement.
- **Matrice de compétences vs projets** : Aide à l'affectation optimale des ressources.
- **Plan de développement** : Suivi des formations et évolutions de carrière.

**Explication :** Permet une gestion RH spécialisée pour l'équipe sécurité avec un focus sur le développement des compétences.

#### 3.4.4 Planification et gestion des disponibilités

**Fonctionnalités :**

- **Planning prévisionnel** : Visualisation de la charge de travail et des disponibilités.
- **Gestion des congés et absences** : Intégration avec le système RH existant.
- **Anticiper les pics de charge** : Identification des périodes critiques (audits annuels, mises à jour majeures).
- **Optimisation des ressources** : Redistribution des tâches en fonction des disponibilités.
- **Alertes de surcharge** : Notifications automatiques en cas de dépassement de capacité.

**Explication :** Assure une répartition équilibrée de la charge de travail et anticipe les besoins en ressources.

#### 3.4.5 Gestion des coûts et facturation interne

**Fonctionnalités :**

- **Suivi des coûts par département** : Répartition des coûts de sécurité par entité métier.
- **Facturation interne** : Mécanisme de refacturation des services de sécurité aux départements bénéficiaires.
- **Budgets et contrôle** : Suivi des budgets alloués et des dépassements.
- **ROI des investissements sécurité** : Calcul du retour sur investissement des mesures de sécurité.
- **Reporting financier** : Tableaux de bord financiers pour la direction.

**Explication :** Permet une gestion financière transparente des activités de sécurité et justifie les investissements.

#### 3.4.6 Gestion avancée des temps et activités de sécurité (Inspiré d'Atimeüs CRA)

**Vue d'ensemble :**
Système complet de compte-rendu d'activité (CRA) adapté aux spécificités des équipes de sécurité, permettant un suivi précis et une optimisation des ressources.

**Fonctionnalités principales :**

**Saisie des temps sécurisée :**

- **Interface double** : Vue calendaire et vue tabulaire pour la saisie des temps
- **Catégorisation des activités de sécurité** :
  - Projets de sécurité clients facturables (audits, évaluations, conseils)
  - Activités internes non facturables (veille sécurité, formation, administration)
  - Gestion d'incidents de sécurité (temps de réponse, investigation, résolution)
  - Projets de conformité (ISO 27001, RGPD, audits internes)
  - Activités de recherche et développement sécurité
- **Saisie rapide** : Templates prédéfinis pour les activités récurrentes
- **Validation en temps réel** : Contrôles de cohérence automatiques

**Workflow de validation à deux niveaux :**

- **Niveau 1 - RSSI/Manager sécurité** : Validation technique et pertinence des activités
- **Niveau 2 - Contrôleur de gestion/RH** : Validation administrative et budgétaire
- **Notifications automatiques** : Alertes pour les approbations en attente
- **Relances automatiques** : Système de rappels pour les retardataires

**Gestion des absences et congés :**

- **Workflow de demandes** : Interface simplifiée pour les demandes de congés
- **Validation hiérarchique** : Approbation selon les règles définies
- **Synchronisation automatique** : Intégration avec les systèmes RH existants
- **Compteurs dynamiques** : Suivi des soldes de congés en temps réel
- **Alimentation automatique du CRA** : Les absences validées apparaissent automatiquement

**Analytics et reporting avancés :**

- **Calcul du TACE sécurité** : Taux d'Activité Congés Exclus spécifique aux équipes de sécurité
- **Analyse des temps par type d'activité** : Répartition incident/préventif/stratégique
- **Tableaux de bord temps réel** : Suivi de l'avancement des projets de sécurité
- **Rapports de productivité** : Mesure de l'efficacité des équipes sécurité
- **Analyse des coûts par incident** : Calcul du TCO des incidents de sécurité

**Intégrations et exports :**

- **Export vers la paie** : Absences, heures supplémentaires, astreintes sécurité
- **Connecteurs RH** : Intégration avec les principaux systèmes (Silae, Cegid, PayFit)
- **Export PDF client** : CRA formaté pour partage avec les clients
- **APIs ouvertes** : Intégration avec d'autres outils de l'écosystème sécurité

**Fonctionnalités spécifiques sécurité :**

- **Traçabilité des activités critiques** : Logging spécial pour les activités sensibles
- **Classification des temps** : Marquage confidentiel/secret selon les projets
- **Gestion des astreintes** : Suivi spécifique des temps d'astreinte sécurité
- **Indicateurs de charge critique** : Alertes sur la surcharge des équipes

**Explication :** Cette fonctionnalité transforme la gestion des temps d'une simple saisie administrative en un véritable outil de pilotage opérationnel des équipes de sécurité, permettant d'optimiser les ressources, de justifier les investissements et d'améliorer la réactivité face aux incidents.

### 3.5 Intégrations et synergies

Les nouvelles fonctionnalités de gestion opérationnelle s'intègrent parfaitement avec les modules existants :

- **Intégration avec la gestion d'incidents** : Les temps passés sur les incidents sont automatiquement comptabilisés dans le suivi d'activité.
- **Liaison avec les audits** : Les projets d'audit sont planifiés et suivis dans le module de gestion de projets.
- **Connexion avec la gestion des risques** : Les projets de traitement des risques sont intégrés dans la planification globale.
- **Synergie avec la formation** : Les besoins de formation identifiés alimentent automatiquement les plans de développement.

## 4. Exigences non fonctionnelles

Exigence
Description

Performance
Gérer un grand volume d’utilisateurs et de données sans dégradation.

Évolutivité
Supporter la croissance des utilisateurs et des données.

Sécurité
Respecter ISO 27001, incluant chiffrement et contrôle d’accès.

Utilisabilité
Interface intuitive pour tous les rôles.

Disponibilité
Haute disponibilité avec un temps d’arrêt minimal.

Maintenabilité
Facile à mettre à jour avec une documentation claire.

5. Spécifications techniques

Architecture : Application web, potentiellement hébergée dans le cloud.
Technologies suggérées :
Frontend : React (React).
Backend : Node.js ou Spring Boot.
Base de données : PostgreSQL pour la gestion des données.

Intégrations :
Active Directory pour l’authentification.
Systèmes de messagerie pour les notifications.

Mesures de sécurité :
Authentification multi-facteurs.
Contrôle d’accès basé sur les rôles (RBAC).
Chiffrement des données au repos et en transit.

6. Interface utilisateur et expérience

Principes de conception : Interface intuitive, accessible, et adaptée à tous les rôles.
Écrans clés :
Tableau de bord basé sur le rôle.
Interface de gestion des documents.
Formulaire de signalement d’incidents.
Interface de planification des audits.

Illustrations : Maquettes d’interface et schémas de flux (voir section 8).

7. Gestion des données

Types de données : Documents, rapports d’incidents, registres de risques, logs d’accès.
Stockage : Base de données sécurisée avec sauvegardes régulières.
Classification : Documents classés selon leur confidentialité.
Recherche : Fonctionnalité de recherche plein texte.

8. Modélisation et illustrations
8.1 Diagrammes UML

Type de diagramme
Description

Cas d’utilisation
Illustre les interactions entre utilisateurs (RSSI, IT, etc.) et fonctionnalités (gestion des incidents, audits, etc.). Inclut des cas d’utilisation malveillants pour identifier les menaces.

Classes
Modélise les entités (Utilisateur, Document, Incident, Risque) et leurs relations.

Séquences
Décrit les interactions pour des scénarios comme le signalement d’un incident ou la demande d’accès.

Activités
Représente les workflows (gestion des incidents, approbation des documents).

Composants
Montre l’architecture (interface web, base de données, système de notifications).

Déploiement
Illustre le déploiement (cloud ou sur site).

8.2 Illustrations

Maquettes d’interface : Pour le tableau de bord, la gestion des documents, et le formulaire de signalement.
Schémas de flux : Pour les processus comme la gestion des incidents ou les demandes d’accès.
Diagrammes de flux de données : Pour montrer le mouvement des données dans le système.

9. Structure de l'application et Sitemap

Cette section décrit l'architecture proposée pour l'application Workspace, en définissant une sitemap qui organise les fonctionnalités décrites dans ce cahier des charges. La structure est conçue pour être intuitive et évolutive.

### 9.1 Pages principales et authentification

- `/login`: Page de connexion pour l'authentification des utilisateurs.
- `/dashboard`: Tableau de bord principal, affichant des informations pertinentes en fonction du rôle de l'utilisateur connecté.
- `/profile`: Page de profil où l'utilisateur peut gérer ses informations personnelles.
- `/settings`: Page pour les paramètres du compte utilisateur.

### 9.2 Espace restreint (Sécurité)

Cet espace est accessible uniquement aux rôles autorisés (RSSI, IT, etc.) et pourrait être préfixé par `/security`.

- **/security/dashboard**: Tableau de bord centralisé pour la sécurité, affichant les indicateurs de performance clés (KPIs), les alertes et les tâches en attente.
- **/security/documents**: Module de gestion documentaire.
  - `/:` Vue d'ensemble des documents, politiques et procédures.
  - `/versions`: Suivi des versions.
  - `/approvals`: Workflow de validation.
- **/security/risks**: Module d'analyse et de traitement des risques.
  - `/assets`: Inventaire des actifs.
  - `/matrix`: Registre et matrice des risques.
  - `/treatment-plan`: Plan de traitement des risques.
- **/security/incidents**: Module de gestion des incidents.
  - `/register`: Registre des incidents de sécurité.
  - `/workflow`: Suivi du workflow de résolution.
- **/security/access-control**: Module de gestion des identités et des accès.
  - `/register`: Registre des droits d'accès.
  - `/requests`: Gestion des demandes d'habilitation.
  - `/reviews`: Planification et suivi des revues d'accès.
- **/security/audits**: Module d'audit et de conformité.
  - `/planning`: Calendrier des audits.
  - `/reports`: Gestion des rapports d'audit.
  - `/actions`: Suivi des actions correctives.
- **/security/vendors**: Module de gestion des fournisseurs.
  - `/register`: Registre des fournisseurs critiques.
  - `/evaluations`: Suivi des évaluations de sécurité.
- **/security/projects**: Module de gestion des projets de sécurité.
  - `/dashboard`: Vue d'ensemble des projets en cours.
  - `/planning`: Planification et calendrier des projets.
  - `/resources`: Allocation et suivi des ressources.
  - `/budget`: Suivi budgétaire et coûts.
- **/security/team**: Module de gestion de l'équipe de sécurité.
  - `/skills`: Cartographie des compétences et certifications.
  - `/planning`: Planification des disponibilités et congés.
  - `/performance`: Évaluations et feedbacks.
  - `/training`: Suivi des formations et développement.
- **/security/time-tracking**: Module de suivi des temps et activités.
  - `/entry`: Saisie des temps par activité.
  - `/validation`: Validation hiérarchique des temps.
  - `/reports`: Rapports d'activité et productivité.
  - `/cra`: Gestion des comptes-rendus d'activité mensuels.
  - `/absences`: Gestion des demandes de congés et absences.
  - `/analytics`: Analyses avancées et calcul du TACE.
- **/security/calendar**: Module de planification et gestion des événements.
  - `/schedule`: Planification des activités de sécurité.
  - `/events`: Gestion des événements et réunions.
  - `/availability`: Vue d'ensemble des disponibilités équipe.
  - `/reminders`: Système de rappels et notifications.
- **/security/finance**: Module de gestion financière.
  - `/costs`: Suivi des coûts par département.
  - `/billing`: Facturation interne des services.
  - `/budget`: Gestion budgétaire et contrôle.
  - `/roi`: Analyse du retour sur investissement.

### 9.3 Espace public

Cet espace est accessible à tous les employés de l'organisation.

- **/awareness**: Portail de sensibilisation à la sécurité.
  - `/elearning`: Modules de formation interactifs.
  - `/best-practices`: Bibliothèque de bonnes pratiques et de politiques.
  - `/campaigns`: Calendrier des campagnes de sensibilisation.
- **/report**: Formulaire de signalement d'incidents ou d'anomalies, accessible à tous.

### 9.4 Fonctionnalités transversales

- **Recherche**: Une barre de recherche globale sera présente dans l'en-tête de l'application pour permettre une recherche plein texte sur l'ensemble des modules.
- **Notifications**: Un centre de notifications informera les utilisateurs des tâches, des approbations requises et des alertes de sécurité.
- **Administration**:
  - `/admin/users`: Gestion des utilisateurs et de leurs rôles.
  - `/admin/logs`: Journal d'audit des actions effectuées dans l'application.

10. Sécurité et confidentialité

Conformité : Respect des normes ISO 27001 et RGPD.
Contrôle d’accès : Permissions granulaires basées sur les rôles.
Protection des données : Chiffrement, anonymisation, et stockage sécurisé.
Réponse aux incidents : Procédures claires pour gérer les incidents de sécurité.

11. Tests et validation

Tests fonctionnels : Vérifier que toutes les fonctionnalités fonctionnent comme prévu.
Tests de performance : Assurer la gestion des charges attendues.
Tests de sécurité : Tests de pénétration et évaluations des vulnérabilités.
Tests d’acceptation utilisateur : Validation par les utilisateurs finaux.

12. Maintenance et support

Canaux de support : Helpdesk, documentation, et formation.
Mises à jour : Correctifs de sécurité et améliorations des fonctionnalités.
Sauvegarde et récupération : Sauvegardes régulières et plans de reprise après sinistre.

13. Annexes

Glossaire : Définitions des termes techniques.
Acronymes : Liste des abréviations (SMSI, RSSI, etc.).
Références : Normes ISO 27001, ISO 27005, RGPD.

---

## Résumé des Améliorations Inspirées d'Atimeüs ERP

Cette version enrichie du cahier des charges intègre des fonctionnalités avancées de gestion opérationnelle inspirées de la solution ERP Atimeüs, spécialement adaptées au contexte de la sécurité de l'information :

### Nouvelles Capacités Ajoutées

1. **Gestion de Projets de Sécurité** : Suivi centralisé des initiatives de sécurité avec planification, allocation des ressources, et suivi budgétaire.

2. **Suivi des Temps et Activités** : Enregistrement précis du temps consacré aux différentes activités de sécurité avec validation hiérarchique et reporting.

3. **Gestion d'Équipe Avancée** : Cartographie des compétences, suivi des certifications, et planification des développements professionnels.

4. **Planification des Ressources** : Optimisation de la charge de travail avec anticipa tion des pics d'activité et gestion des disponibilités.

5. **Contrôle Financier** : Suivi des coûts, facturation interne, et calcul du ROI des investissements en sécurité.

### Valeur Ajoutée

- **Efficacité Opérationnelle** : Optimisation de l'utilisation des ressources de sécurité
- **Visibilité Managériale** : Tableaux de bord détaillés pour le pilotage de l'activité sécurité
- **Justification des Investissements** : Outils de mesure et de démonstration de la valeur des initiatives de sécurité
- **Développement des Compétences** : Suivi structuré de la montée en compétences de l'équipe
- **Conformité Renforcée** : Meilleur suivi et traçabilité des activités de conformité

Ces améliorations transforment l'application Workspace d'un simple système de gestion documentaire en une véritable plateforme de pilotage opérationnel de la sécurité de l'information.

---
## 1.5 Synthèse v0 — Gestion locale et UI persistante

- La partie "Liste de projets" a été créée et mise à jour selon la logique v0 : tout le CRUD est géré en local/context React, aucune API réelle, aucune persistance serveur.
- Les projets et tickets restent accessibles et synchronisés sur l’UI tant que l’application reste ouverte (stockage en mémoire ou localStorage).
- L’UI/UX est moderne, harmonisée, et offre un feedback utilisateur optimal.
- La structure est extensible pour évoluer vers une API réelle (Jira/MCP/Trello) sans casser la logique locale.
- Toutes les modifications sont documentées dans le README.projects.todo.md et la bible pour garantir la cohérence et la traçabilité.

### Audit v0 — Gestion locale des projets

- Le contexte `ProjectsProvider` centralise le CRUD local (add, edit, delete) et utilise `localStorage` pour la persistance des projets.
- Le composant `ProjectsTable` affiche dynamiquement la liste des projets avec actions CRUD et feedback utilisateur.
- Les données sont synchronisées et accessibles sur toutes les parties du projet via le Provider.
- Après actualisation de la page, les projets restent affichés grâce à la persistance locale (clé `projects-v0` dans localStorage).
- La logique v0 est identique à celle des modules "receivables" et "payables" : tout est local, extensible, et documenté.
- Toute anomalie de persistance doit être testée (rebuild, refresh) et documentée pour correction.
