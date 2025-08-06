// Mock data centralisée pour tous les modules de gestion de projets
export interface Project {
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

export const mockProjects: Project[] = [
  { 
    id: '1', 
    name: 'Jira - Marketing', 
    type: 'Jira', 
    customType: '',
    description: 'Projet marketing sur Jira',
    status: 'En cours',
    startDate: '',
    endDate: '',
    members: ''
  },
  { 
    id: '2', 
    name: 'Slack - Dev Team', 
    type: 'Slack', 
    customType: '',
    description: 'Développement sur Slack',
    status: 'En cours',
    startDate: '',
    endDate: '',
    members: ''
  },
  { 
    id: '3', 
    name: 'Jira - RH', 
    type: 'Jira', 
    customType: '',
    description: 'Gestion RH sur Jira',
    status: 'En cours',
    startDate: '',
    endDate: '',
    members: ''
  },
  { 
    id: '4', 
    name: 'Trello - Design', 
    type: 'Trello', 
    customType: '',
    description: 'Design sur Trello',
    status: 'En cours',
    startDate: '',
    endDate: '',
    members: ''
  },
];
