import { useState, useEffect, useCallback } from 'react';

export interface ProjectConfiguration {
  projectId: number;
  projectKey: string;
  projectName: string;
  issueTypes: IssueType[];
  fields: Field[];
  statuses: Status[];
  priorities: Priority[];
  components: Component[];
  labels: string[];
  epics: Epic[];
  sprints: Sprint[];
  workflow: Workflow;
}

export interface IssueType {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  subtask: boolean;
  fields: string[];
}

export interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
  allowedValues?: any[];
  defaultValue?: any;
}

export interface Status {
  id: string;
  name: string;
  description?: string;
  category: 'TODO' | 'IN_PROGRESS' | 'DONE';
  colorName?: string;
}

export interface Priority {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface Component {
  id: string;
  name: string;
  description?: string;
}

export interface Epic {
  id: string;
  key: string;
  name: string;
  summary: string;
}

export interface Sprint {
  id: number;
  name: string;
  state: 'future' | 'active' | 'closed';
  startDate?: string;
  endDate?: string;
}

export interface Workflow {
  id: string;
  name: string;
  transitions: Transition[];
}

export interface Transition {
  id: string;
  name: string;
  from: string[];
  to: string;
  type: string;
}

export function useProjectConfiguration(projectId: number | null) {
  const [configuration, setConfiguration] = useState<ProjectConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfiguration = useCallback(async (id: number) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`🔧 [HOOK] Récupération configuration projet ${id}...`);

      // Récupérer la configuration depuis l'API v1
      const response = await fetch(`/api/v1/jira/projects/${id}/configuration`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 200) {
          setConfiguration(data.data);
          console.log(`✅ [HOOK] Configuration récupérée pour le projet ${id}:`, data.data);
        } else {
          throw new Error(data.message || 'Erreur récupération configuration');
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error(`❌ [HOOK] Erreur récupération configuration projet ${id}:`, err);
      setError(errorMessage);
      
      // Fallback : configuration par défaut
      setConfiguration(createDefaultConfiguration(id));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchConfiguration(projectId);
    } else {
      setConfiguration(null);
    }
  }, [projectId, fetchConfiguration]);

  const refreshConfiguration = useCallback(() => {
    if (projectId) {
      fetchConfiguration(projectId);
    }
  }, [projectId, fetchConfiguration]);

  return {
    configuration,
    loading,
    error,
    refreshConfiguration,
    // Helpers pour faciliter l'utilisation
    issueTypes: configuration?.issueTypes || [],
    fields: configuration?.fields || [],
    statuses: configuration?.statuses || [],
    priorities: configuration?.priorities || [],
    components: configuration?.components || [],
    labels: configuration?.labels || [],
    epics: configuration?.epics || [],
    sprints: configuration?.sprints || [],
    workflow: configuration?.workflow || null,
  };
}

// Configuration par défaut en cas d'erreur
function createDefaultConfiguration(projectId: number): ProjectConfiguration {
  return {
    projectId,
    projectKey: `PROJ-${projectId}`,
    projectName: `Projet ${projectId}`,
    issueTypes: [
      { id: '1', name: 'Story', description: 'Fonctionnalité utilisateur', subtask: false, fields: ['summary', 'description', 'assignee', 'priority'] },
      { id: '2', name: 'Bug', description: 'Défaut à corriger', subtask: false, fields: ['summary', 'description', 'assignee', 'priority'] },
      { id: '3', name: 'Task', description: 'Tâche générale', subtask: false, fields: ['summary', 'description', 'assignee', 'priority'] },
    ],
    fields: [
      { id: 'summary', name: 'Résumé', type: 'string', required: true },
      { id: 'description', name: 'Description', type: 'text', required: false },
      { id: 'assignee', name: 'Assigné à', type: 'user', required: false },
      { id: 'priority', name: 'Priorité', type: 'priority', required: false },
    ],
    statuses: [
      { id: '1', name: 'To Do', description: 'À faire', category: 'TODO' },
      { id: '2', name: 'In Progress', description: 'En cours', category: 'IN_PROGRESS' },
      { id: '3', name: 'Done', description: 'Terminé', category: 'DONE' },
    ],
    priorities: [
      { id: '1', name: 'Lowest', description: 'Très basse' },
      { id: '2', name: 'Low', description: 'Basse' },
      { id: '3', name: 'Medium', description: 'Moyenne' },
      { id: '4', name: 'High', description: 'Haute' },
      { id: '5', name: 'Highest', description: 'Très haute' },
    ],
    components: [],
    labels: [],
    epics: [],
    sprints: [],
    workflow: {
      id: 'default',
      name: 'Workflow par défaut',
      transitions: [
        { id: '1', name: 'Start Progress', from: ['To Do'], to: 'In Progress', type: 'global' },
        { id: '2', name: 'Done', from: ['In Progress'], to: 'Done', type: 'global' },
      ],
    },
  };
}



