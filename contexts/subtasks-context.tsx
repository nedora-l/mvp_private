"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useIntelligentNotifications } from '@/hooks/use-intelligent-notifications';

// Types pour les subtasks
export interface Subtask {
  id: number;
  key: string;
  summary: string;
  description?: string;
  status: {
    id: string;
    name: string;
    category?: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
  priority?: {
    id: string;
    name: string;
    iconUrl?: string;
  } | null;
  issueType: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  parentIssueKey: string;
  created: string;
  updated: string;
  dueDate?: string;
  labels: string[];
  components: any[];
  storyPoints?: number;
}

export interface SubtaskForm {
  parentIssueKey: string;
  summary: string;
  description?: string;
  assignee?: string;
  priority?: string;
  labels?: string[];
  components?: any[];
  storyPoints?: number;
  dueDate?: string;
}

export interface SubtaskUpdateForm {
  issueKey: string;
  summary?: string;
  description?: string;
  assignee?: string;
  priority?: string;
  labels?: string[];
  components?: any[];
  storyPoints?: number;
  dueDate?: string;
}

// Interface du context
interface SubtasksContextType {
  subtasks: Subtask[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSubtasks: (parentIssueKey: string) => Promise<void>;
  createSubtask: (subtaskData: SubtaskForm) => Promise<Subtask | null>;
  updateSubtask: (subtaskData: SubtaskUpdateForm) => Promise<Subtask | null>;
  deleteSubtask: (issueKey: string) => Promise<boolean>;
  
  // Utilitaires
  getSubtasksByParent: (parentIssueKey: string) => Subtask[];
  clearSubtasks: () => void;
  clearError: () => void;
}

// Context par défaut
const SubtasksContext = createContext<SubtasksContextType | undefined>(undefined);

// Provider du context
export const SubtasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { showJiraError, showJiraSuccess, showInfo } = useIntelligentNotifications();

  // Récupération des subtasks d'une tâche parent
  const fetchSubtasks = useCallback(async (parentIssueKey: string) => {
    if (!parentIssueKey) {
      setError("Clé de la tâche parent requise");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 [v1] Récupération des subtasks pour ${parentIssueKey}...`);
      
      const response = await fetch(`/api/v1/jira/subtasks?parentIssueKey=${parentIssueKey}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 200 && result.data?._embedded?.subtasks) {
        const newSubtasks = result.data._embedded.subtasks;
        setSubtasks(prevSubtasks => {
          // Fusionner avec les subtasks existantes, en évitant les doublons
          const existingKeys = new Set(prevSubtasks.map(st => st.key));
          const uniqueNewSubtasks = newSubtasks.filter((st: Subtask) => !existingKeys.has(st.key));
          return [...prevSubtasks, ...uniqueNewSubtasks];
        });
        
        console.log(`✅ [v1] ${newSubtasks.length} subtasks récupérées pour ${parentIssueKey}`);
        
        if (newSubtasks.length === 0) {
          showInfo({
            title: "📋 Subtasks",
            message: "Aucune subtask trouvée pour cette tâche",
            type: "info"
          });
        }
      } else {
        throw new Error(result.message || "Erreur lors de la récupération des subtasks");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error(`❌ [v1] Erreur récupération subtasks:`, error);
      setError(errorMessage);
      
      showJiraError({
        message: "Erreur lors de la récupération des subtasks",
        solution: "Vérifiez que la tâche parent existe et réessayez",
        error: errorMessage,
        source: 'subtasks-fetch-error'
      });
    } finally {
      setLoading(false);
    }
  }, [showJiraError, showInfo]);

  // Création d'une nouvelle subtask
  const createSubtask = useCallback(async (subtaskData: SubtaskForm): Promise<Subtask | null> => {
    if (!subtaskData.parentIssueKey || !subtaskData.summary) {
      setError("Clé de la tâche parent et résumé requis");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`➕ [v1] Création de la subtask pour ${subtaskData.parentIssueKey}...`);
      
      const response = await fetch('/api/v1/jira/subtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subtaskData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 201 && result.data) {
        // Créer l'objet subtask complet
        const newSubtask: Subtask = {
          id: result.data.id,
          key: result.data.key,
          summary: result.data.summary,
          parentIssueKey: result.data.parentIssueKey,
          created: result.data.created,
          updated: result.data.created,
          status: {
            id: '10000', // Statut par défaut "To Do"
            name: 'To Do',
            category: 'TO_DO'
          },
          issueType: {
            id: '10003', // Type "Subtask"
            name: 'Subtask'
          },
          labels: subtaskData.labels || [],
          components: subtaskData.components || [],
          description: subtaskData.description,
          assignee: subtaskData.assignee ? {
            id: subtaskData.assignee,
            name: '', // Sera rempli lors du prochain fetch
            email: ''
          } : null,
          priority: subtaskData.priority ? {
            id: subtaskData.priority,
            name: '',
            iconUrl: ''
          } : null,
          storyPoints: subtaskData.storyPoints,
          dueDate: subtaskData.dueDate
        };

        // Ajouter la nouvelle subtask à la liste
        setSubtasks(prevSubtasks => [...prevSubtasks, newSubtask]);
        
        console.log(`✅ [v1] Subtask ${newSubtask.key} créée avec succès`);
        
        showJiraSuccess({
          message: `Subtask "${newSubtask.summary}" créée avec succès`
        });

        return newSubtask;
      } else {
        throw new Error(result.message || "Erreur lors de la création de la subtask");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error(`❌ [v1] Erreur création subtask:`, error);
      setError(errorMessage);
      
      showJiraError({
        message: "Erreur lors de la création de la subtask",
        solution: "Vérifiez les données saisies et réessayez",
        error: errorMessage,
        source: 'subtasks-create-error'
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [showJiraError, showJiraSuccess]);

  // Mise à jour d'une subtask existante
  const updateSubtask = useCallback(async (subtaskData: SubtaskUpdateForm): Promise<Subtask | null> => {
    if (!subtaskData.issueKey) {
      setError("Clé de la subtask requise");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`✏️ [v1] Modification de la subtask ${subtaskData.issueKey}...`);
      
      const response = await fetch('/api/v1/jira/subtasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subtaskData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        // Mettre à jour la subtask dans la liste
        setSubtasks(prevSubtasks =>
          prevSubtasks.map(subtask =>
            subtask.key === subtaskData.issueKey
              ? {
                  ...subtask,
                  ...(subtaskData.summary !== undefined && { summary: subtaskData.summary }),
                  ...(subtaskData.description !== undefined && { description: subtaskData.description }),
                  ...(subtaskData.assignee !== undefined && { 
                    assignee: subtaskData.assignee ? {
                      id: subtaskData.assignee,
                      name: '', // Sera rempli lors du prochain fetch
                      email: ''
                    } : null
                  }),
                  ...(subtaskData.priority !== undefined && { 
                    priority: subtaskData.priority ? {
                      id: subtaskData.priority,
                      name: '',
                      iconUrl: ''
                    } : null
                  }),
                  ...(subtaskData.labels !== undefined && { labels: subtaskData.labels || [] }),
                  ...(subtaskData.components !== undefined && { components: subtaskData.components || [] }),
                  ...(subtaskData.storyPoints !== undefined && { storyPoints: subtaskData.storyPoints }),
                  ...(subtaskData.dueDate !== undefined && { dueDate: subtaskData.dueDate }),
                  updated: result.data.updated
                }
              : subtask
          )
        );
        
        console.log(`✅ [v1] Subtask ${subtaskData.issueKey} modifiée avec succès`);
        
        showJiraSuccess({
          message: "Subtask modifiée avec succès"
        });

        // Retourner la subtask mise à jour
        const updatedSubtask = subtasks.find(st => st.key === subtaskData.issueKey);
        return updatedSubtask || null;
      } else {
        throw new Error(result.message || "Erreur lors de la modification de la subtask");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error(`❌ [v1] Erreur modification subtask:`, error);
      setError(errorMessage);
      
      showJiraError({
        message: "Erreur lors de la modification de la subtask",
        solution: "Vérifiez les données saisies et réessayez",
        error: errorMessage,
        source: 'subtasks-update-error'
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [showJiraError, showJiraSuccess, subtasks]);

  // Suppression d'une subtask
  const deleteSubtask = useCallback(async (issueKey: string): Promise<boolean> => {
    if (!issueKey) {
      setError("Clé de la subtask requise");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🗑️ [v1] Suppression de la subtask ${issueKey}...`);
      
      const response = await fetch(`/api/v1/jira/subtasks?issueKey=${issueKey}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 200 && result.data) {
        // Supprimer la subtask de la liste
        setSubtasks(prevSubtasks =>
          prevSubtasks.filter(subtask => subtask.key !== issueKey)
        );
        
        console.log(`✅ [v1] Subtask ${issueKey} supprimée avec succès`);
        
        showJiraSuccess({
          message: "Subtask supprimée avec succès"
        });

        return true;
      } else {
        throw new Error(result.message || "Erreur lors de la suppression de la subtask");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error(`❌ [v1] Erreur suppression subtask:`, error);
      setError(errorMessage);
      
      showJiraError({
        message: "Erreur lors de la suppression de la subtask",
        solution: "Vérifiez les permissions et réessayez",
        error: errorMessage,
        source: 'subtasks-delete-error'
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [showJiraError, showJiraSuccess]);

  // Récupérer les subtasks d'une tâche parent spécifique
  const getSubtasksByParent = useCallback((parentIssueKey: string): Subtask[] => {
    return subtasks.filter(subtask => subtask.parentIssueKey === parentIssueKey);
  }, [subtasks]);

  // Effacer toutes les subtasks
  const clearSubtasks = useCallback(() => {
    setSubtasks([]);
    setError(null);
  }, []);

  // Effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: SubtasksContextType = {
    subtasks,
    loading,
    error,
    fetchSubtasks,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    getSubtasksByParent,
    clearSubtasks,
    clearError
  };

  return (
    <SubtasksContext.Provider value={value}>
      {children}
    </SubtasksContext.Provider>
  );
};

// Hook personnalisé pour utiliser le context
export const useSubtasks = (): SubtasksContextType => {
  const context = useContext(SubtasksContext);
  if (context === undefined) {
    throw new Error('useSubtasks doit être utilisé dans un SubtasksProvider');
  }
  return context;
};




