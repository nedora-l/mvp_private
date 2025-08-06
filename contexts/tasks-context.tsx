"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Interfaces TypeScript
export interface Task {
  id: number;
  projectId: number;
  title: string;
  status: string;
  description: string;
  priority: string;
  createdAt: string;
  dueDate: string | null;
  assignedTo: string;
  sprintId: number | null;
  jiraKey?: string;
  jiraId?: string;
}

export interface TaskForm {
  projectId: number;
  title: string;
  status: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  assignedTo?: string;
  sprintId?: number | null;
}

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: TaskForm) => Promise<Task | null>;
  editTask: (id: number, task: Partial<TaskForm>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  fetchTasks: () => Promise<void>;
  getTasksByProject: (projectId: number) => Task[];
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les tâches (MCP Jira + fallback)
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Tentative chargement tâches depuis Jira...");
      
      // 🚀 Essai MCP Jira avec fallback sécurisé
      let response;
      let dataSource = 'v0';
      
      try {
        response = await fetch('/api/mcp/tasks');
        if (response.ok) {
          const mcpData = await response.json();
          if (mcpData.success && mcpData.source === 'jira') {
            setTasks(mcpData.tasks || []);
            console.log(`✅ ${mcpData.totalTasks} tâches chargées depuis JIRA !`);
            console.log(`📊 Jira: ${mcpData.jiraTasks}, Mock: ${mcpData.mockTasks}`);
            return;
          }
        }
      } catch (mcpError) {
        console.log("⚠️ Jira tâches indisponible, fallback vers v0");
      }
      
      // Fallback v0
      response = await fetch('/api/v0/tasks');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des tâches');
      }
      
      const data = await response.json();
      setTasks(data.tasks || []);
      console.log('✅ Tâches chargées depuis v0:', data.tasks?.length || 0);
    } catch (error) {
      console.error('❌ Erreur fetchTasks:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []); // useCallback avec tableau de dépendances vide

  // Ajouter une tâche (MCP Jira si projet Jira, sinon v0)
  const addTask = async (taskData: TaskForm): Promise<Task | null> => {
    try {
      setError(null);
      
      // Détecter si c'est un projet Jira (100=SSP, 101=ECS)
      const isJiraProject = taskData.projectId === 100 || taskData.projectId === 101;
      
      let response;
      if (isJiraProject) {
        console.log("📝 Création tâche dans Jira...");
        // Essayer de créer dans Jira d'abord
        try {
          response = await fetch('/api/mcp/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
          });
          
          if (response.ok) {
            const jiraTask = await response.json();
            if (jiraTask.success) {
              setTasks(prev => [...prev, jiraTask.task]);
              console.log('✅ Tâche créée dans Jira:', jiraTask.jiraKey);
              return jiraTask.task;
            }
          }
        } catch (jiraError) {
          console.log("⚠️ Création Jira échouée, fallback vers v0");
        }
      }
      
      // Fallback vers v0 pour projets non-Jira ou si Jira échoue
      response = await fetch('/api/v0/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la tâche');
      }

      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      console.log('✅ Tâche ajoutée (v0):', newTask);
      return newTask;
    } catch (error) {
      console.error('❌ Erreur addTask:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      return null;
    }
  };

  // Modifier une tâche (MCP Jira si tâche Jira, sinon v0)
  const editTask = async (id: number, taskData: Partial<TaskForm>) => {
    try {
      setError(null);
      
      // Trouver la tâche pour déterminer si c'est une tâche Jira
      const taskToEdit = tasks.find(task => task.id === id);
      const isJiraTask = taskToEdit?.jiraKey || taskToEdit?.jiraId;
      
      let response;
      if (isJiraTask) {
        console.log("✏️ Modification tâche dans Jira...");
        // Essayer de modifier dans Jira d'abord
        try {
          response = await fetch('/api/mcp/tasks', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              id, 
              ...taskData,
              jiraKey: taskToEdit?.jiraKey,
              jiraId: taskToEdit?.jiraId,
              currentStatus: taskToEdit?.status // Pour détecter les changements de statut
            }),
          });
          
          if (response.ok) {
            const jiraResult = await response.json();
            if (jiraResult.success) {
              // Actualiser les tâches après modification Jira
              await fetchTasks();
              console.log('✅ Tâche modifiée dans Jira:', taskToEdit?.jiraKey);
              return;
            }
          }
        } catch (jiraError) {
          console.log("⚠️ Modification Jira échouée, fallback vers v0");
        }
      }
      
      // Fallback vers v0 pour tâches non-Jira ou si Jira échoue
      response = await fetch('/api/v0/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...taskData }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de la tâche');
      }

      const updatedTask = await response.json();
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      console.log('✅ Tâche modifiée (v0):', updatedTask);
    } catch (error) {
      console.error('❌ Erreur editTask:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    }
  };

  // Supprimer une tâche (MCP Jira si tâche Jira, sinon v0)
  const deleteTask = async (id: number) => {
    try {
      setError(null);
      
      // Trouver la tâche pour déterminer si c'est une tâche Jira
      const taskToDelete = tasks.find(task => task.id === id);
      const isJiraTask = taskToDelete?.jiraKey || taskToDelete?.jiraId;
      
      let response;
      if (isJiraTask) {
        console.log("🗑️ Suppression tâche dans Jira...");
        // Essayer de supprimer dans Jira d'abord
        try {
          const params = new URLSearchParams({
            id: id.toString(),
            ...(taskToDelete?.jiraKey && { jiraKey: taskToDelete.jiraKey })
          });
          
          response = await fetch(`/api/mcp/tasks?${params}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            const jiraResult = await response.json();
            if (jiraResult.success) {
              setTasks(prev => prev.filter(task => task.id !== id));
              console.log('✅ Tâche supprimée de Jira:', taskToDelete?.jiraKey);
              return;
            }
          }
        } catch (jiraError) {
          console.log("⚠️ Suppression Jira échouée, fallback vers v0");
        }
      }
      
      // Fallback vers v0 pour tâches non-Jira ou si Jira échoue
      response = await fetch(`/api/v0/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la tâche');
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      console.log('✅ Tâche supprimée (v0):', id);
    } catch (error) {
      console.error('❌ Erreur deleteTask:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    }
  };

  // Récupérer les tâches d'un projet
  const getTasksByProject = (projectId: number): Task[] => {
    return tasks.filter(task => task.projectId === projectId);
  };

  // Charger les tâches au montage
  useEffect(() => {
    fetchTasks();
  }, []);

  const value = {
    tasks,
    loading,
    error,
    addTask,
    editTask,
    deleteTask,
    fetchTasks,
    getTasksByProject,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
