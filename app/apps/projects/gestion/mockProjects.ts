// Mock data centralisée pour tous les modules de gestion de projets
export interface Project {
  id: number;
  name: string;
  type: 'Jira' | 'Slack' | 'Trello' | 'Autre';
  description?: string;
}

export const mockProjects: Project[] = [
  { id: 1, name: 'Jira - Marketing', type: 'Jira', description: 'Projet marketing sur Jira' },
  { id: 2, name: 'Slack - Dev Team', type: 'Slack', description: 'Développement sur Slack' },
  { id: 3, name: 'Jira - RH', type: 'Jira', description: 'Gestion RH sur Jira' },
  { id: 4, name: 'Trello - Design', type: 'Trello', description: 'Design sur Trello' },
];
