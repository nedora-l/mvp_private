"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Interfaces TypeScript
export interface Task {
  id: number;
  projectId: string | number; // ✅ Peut être string (clé Jira) ou number (ID)
  projectName?: string; // ✅ Nom du projet pour l'affichage
  title: string;
  status: string;
  description: string;
  priority: string;
  createdAt: string;
  dueDate: string | null;
  assignedTo: string;
  assignee?: string; // Alias pour Jira
  sprintId: number | null;
  jiraKey?: string;
  jiraId?: string;
  // Nouveaux champs Jira
  issueType?: string; // Story, Bug, Task, Epic, Subtask
  storyPoints?: number; // Points d'estimation Scrum
  labels?: string[]; // Labels Jira
  components?: string[]; // Composants Jira
  epicLink?: string; // Lien vers Epic
  sprint?: string; // Nom du sprint
  // ✅ NOUVEAU : Champs pour les subtasks
  isSubtask?: boolean; // Indique si c'est une subtask
  parentKey?: string; // Clé de la tâche parent (pour les subtasks)
  hasSubtasks?: boolean; // Indique si la tâche a des subtasks
  subtasksCount?: number; // Nombre de subtasks
}

// Interface pour le mapping des projets
interface ProjectMapping {
  [projectKey: string]: number; // projectKey (ex: "ECS") -> projectId (ex: 100)
}

export interface TaskForm {
  projectId: number;
  title: string;
  status: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  assignedTo?: string;
  assignee?: string; // Alias pour Jira
  sprintId?: number | null;
  // Nouveaux champs Jira
  issueType?: string;
  storyPoints?: number;
  labels?: string[];
  components?: string[];
  epicLink?: string;
  sprint?: string;
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
  const [projectMapping, setProjectMapping] = useState<ProjectMapping>({});

  // Fonction pour créer le mapping des projets (projectKey -> projectId)
  const createProjectMapping = useCallback(async (): Promise<ProjectMapping> => {
    try {
      console.log("🔄 [v1] Création du mapping des projets...");
      const response = await fetch('/api/v1/jira/projects');
      if (response.ok) {
        const v1Data = await response.json();
        if (v1Data.status === 200 && v1Data.data?._embedded?.projects) {
          const mapping: ProjectMapping = {};
          v1Data.data._embedded.projects.forEach((project: any) => {
            // 🔧 FIX: Utiliser jiraKey ET key pour le mapping
            if (project.jiraKey && project.id) {
              mapping[project.jiraKey] = project.id;
              console.log(`🔗 [v1] Mapping: ${project.jiraKey} -> ${project.id}`);
            }
            // 🔧 FIX: Ajouter aussi le mapping par 'key' si différent
            if (project.key && project.key !== project.jiraKey && project.id) {
              mapping[project.key] = project.id;
              console.log(`🔗 [v1] Mapping supplémentaire: ${project.key} -> ${project.id}`);
            }
          });
          console.log(`✅ [v1] Mapping créé:`, mapping);
          return mapping;
        }
      }
      console.warn("⚠️ [v1] Impossible de créer le mapping des projets");
      return {};
    } catch (error) {
      console.error('❌ [v1] Erreur création mapping:', error);
      return {};
    }
  }, []);

  // 🔧 NOUVELLE FONCTION : Mapping inverse robuste (projectId -> projectKey)
  const getProjectKeyFromId = useCallback((projectId: number): string | null => {
    // Recherche directe dans le mapping
    const projectKey = Object.keys(projectMapping).find(key => projectMapping[key] === projectId);
    
    if (projectKey) {
      console.log(`🔗 [v1] Mapping inverse trouvé: ID ${projectId} → Key ${projectKey}`);
      return projectKey;
    }
    
    // 🔧 FALLBACK : Si pas de mapping, essayer de le recréer
    console.warn(`⚠️ [v1] Pas de mapping trouvé pour l'ID ${projectId}, tentative de recréation...`);
    return null;
  }, [projectMapping]);

  // 🔧 NOUVELLE FONCTION : Récupération d'urgence du mapping
  const getProjectKeyWithFallback = useCallback(async (projectId: number): Promise<string> => {
    // 1. Essayer le mapping existant
    let projectKey = getProjectKeyFromId(projectId);
    
    if (projectKey) {
      return projectKey;
    }
    
    // 2. 🔧 FALLBACK : Recréer le mapping
    console.log(`🔄 [v1] Recréation du mapping pour l'ID ${projectId}...`);
    const newMapping = await createProjectMapping();
    setProjectMapping(newMapping);
    
    // 3. Essayer avec le nouveau mapping
    const newProjectKey = Object.keys(newMapping).find(key => newMapping[key] === projectId);
    
    if (newProjectKey) {
      console.log(`✅ [v1] Mapping de secours réussi: ID ${projectId} → Key ${newProjectKey}`);
      return newProjectKey;
    }
    
    // 4. 🔧 DERNIER FALLBACK : Recherche directe dans l'API
    console.log(`🆘 [v1] Dernier recours: recherche directe dans l'API pour l'ID ${projectId}...`);
    try {
      const response = await fetch('/api/v1/jira/projects');
      if (response.ok) {
        const v1Data = await response.json();
        if (v1Data.status === 200 && v1Data.data?._embedded?.projects) {
          const project = v1Data.data._embedded.projects.find((p: any) => p.id === projectId);
          if (project && (project.jiraKey || project.key)) {
            const foundKey = project.jiraKey || project.key;
            console.log(`🎯 [v1] Projet trouvé directement: ID ${projectId} → Key ${foundKey}`);
            return foundKey;
          }
        }
      }
    } catch (error) {
      console.error(`❌ [v1] Erreur recherche directe pour l'ID ${projectId}:`, error);
    }
    
    // 5. 🔧 ERREUR FATALE : Impossible de récupérer la clé
    throw new Error(`Impossible de récupérer la clé Jira pour le projet ID ${projectId}. Vérifiez que le projet existe et que l'API Jira est accessible.`);
  }, [projectMapping, getProjectKeyFromId, createProjectMapping]);

  // Récupérer toutes les tâches (v1 Jira uniquement - migré de MCP)
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 [v1] Tentative chargement tâches depuis Jira...");
      
      // 1. Créer le mapping des projets d'abord
      const mapping = await createProjectMapping();
      setProjectMapping(mapping);
      
      console.log(`🔍 [v1] Mapping des projets créé:`, mapping);
      
      // 2. Récupérer les tâches
      const response = await fetch('/api/v1/jira/tasks');
      if (response.ok) {
        const v1Data = await response.json();
        console.log(`🔍 [v1] Réponse API brute:`, v1Data);
        
        if (v1Data.status === 200 && v1Data.data?._embedded?.tasks) {
          // 3. Conversion avec mapping intelligent projectKey -> projectId
          const convertedTasks = v1Data.data._embedded.tasks.map((task: any) => {
            // 🔧 FIX: Le task.projectId est une clé Jira (ex: "SSP"), pas un ID numérique
            const projectKey = task.projectId; // C'est la clé Jira (ex: "SSP")
            const mappedProjectId = mapping[projectKey]; // Récupérer l'ID numérique (ex: 100)
            
            if (!mappedProjectId) {
              console.warn(`⚠️ [v1] Pas de mapping trouvé pour la clé: ${projectKey}`);
            }
            
            console.log(`🔗 [v1] Mapping tâche: ${task.title} - projectKey: ${projectKey} -> projectId: ${mappedProjectId}`);
            
            return {
              id: task.id,
              projectId: mappedProjectId || 0, // ✅ ID numérique mappé pour le board
              projectName: task.projectName, // ✅ Garder le nom pour l'affichage
              title: task.title,
              status: task.status,
              description: task.description,
              priority: task.priority,
              createdAt: task.createdAt,
              dueDate: task.dueDate,
              assignedTo: task.assignedTo || task.assignee,
              assignee: task.assignee || task.assignedTo,
              sprintId: null, // À implémenter plus tard
              jiraKey: task.jiraKey,
              jiraId: task.jiraId,
              // Nouveaux champs Jira
              issueType: task.issueType,
              storyPoints: task.storyPoints,
              labels: task.labels,
              components: task.components,
              epicLink: task.epicLink,
              sprint: task.sprint,
              // ✅ NOUVEAU : Champs pour les subtasks
              isSubtask: task.isSubtask,
              parentKey: task.parentKey,
              hasSubtasks: task.hasSubtasks,
              subtasksCount: task.subtasksCount
            };
          });
          
          setTasks(convertedTasks);
          console.log(`✅ [v1] ${convertedTasks.length} tâches chargées depuis JIRA via v1 API !`);
          console.log(`📊 [v1] Jira: ${v1Data.data.page.totalElements} tâches totales`);
          console.log('📋 [v1] Tâches détaillées:', convertedTasks.map((t: Task) => ({ id: t.id, projectId: t.projectId, title: t.title })));
          return;
        } else {
          console.warn("⚠️ [v1] Réponse v1 non valide:", v1Data);
        }
      }
      
      // Si aucune donnée Jira valide
      console.error("❌ [v1] Impossible de charger les tâches depuis Jira");
      setTasks([]);

    } catch (error) {
      console.error('❌ [v1] Erreur fetchTasks:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [createProjectMapping]);

  // Initialiser le mapping des projets au chargement
  useEffect(() => {
    createProjectMapping().then(setProjectMapping);
  }, [createProjectMapping]);

  // Ajouter une tâche (v1 Jira uniquement - migré de MCP)
  const addTask = async (taskData: TaskForm): Promise<Task | null> => {
    try {
      setError(null);
      
      // ✅ UNIQUEMENT v1 - Plus de fallback MCP
      console.log(`🔄 [v1] Création tâche projet ${taskData.projectId} via v1 API uniquement...`);
      
      // 🔧 AMÉLIORATION : Validation des données avant envoi
      const validation = validateTaskData(taskData);
      if (!validation.valid) {
        const errorMessage = `Données invalides: ${validation.errors.join(', ')}`;
        console.error(`❌ [v1] Validation échouée:`, validation.errors);
        setError(errorMessage);
        return null;
      }
      
      // 🔧 AMÉLIORATION : Utilisation de la fonction robuste avec fallback
      const projectKey = await getProjectKeyWithFallback(taskData.projectId);
      
      console.log(`🔗 [v1] Mapping projet: ID ${taskData.projectId} → Key ${projectKey}`);
      
      // Conversion du format TaskForm vers le format v1
      const v1TaskData = {
        title: taskData.title,
        description: taskData.description || "Aucune description",
        projectKey: projectKey, // ✅ Maintenant la vraie clé Jira
        priority: taskData.priority || "Medium",
        dueDate: taskData.dueDate,
        assignee: taskData.assignee || taskData.assignedTo,
        // Nouveaux champs Jira
        issueType: taskData.issueType || "Story",
        status: taskData.status || "To Do",
        storyPoints: taskData.storyPoints,
        labels: taskData.labels,
        components: taskData.components,
        epicLink: taskData.epicLink,
        sprint: taskData.sprint
      };
      
      const response = await fetch('/api/v1/jira/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(v1TaskData),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.status === 201) {
          // Conversion du format v1 vers l'interface Task
          const newTask: Task = {
            id: result.data.id,
            projectId: taskData.projectId,
            title: result.data.title,
            status: result.data.status,
            description: result.data.description,
            priority: result.data.priority,
            createdAt: result.data.createdAt,
            dueDate: result.data.dueDate,
            assignedTo: result.data.assignedTo || result.data.assignee,
            assignee: result.data.assignee || result.data.assignedTo,
            sprintId: taskData.sprintId || null,
            jiraKey: result.data.jiraKey,
            jiraId: result.data.jiraId,
            // Nouveaux champs Jira
            issueType: result.data.issueType,
            storyPoints: result.data.storyPoints,
            labels: result.data.labels,
            components: result.data.components,
            epicLink: result.data.epicLink,
            sprint: result.data.sprint,
            // ✅ NOUVEAU : Champs pour les subtasks
            isSubtask: result.data.isSubtask,
            parentKey: result.data.parentKey,
            hasSubtasks: result.data.hasSubtasks,
            subtasksCount: result.data.subtasksCount
          };
          
          setTasks(prev => [...prev, newTask]);
          console.log('✅ [v1] Tâche créée via v1 API:', result.data.jiraKey || result.data.title);
          
          // 🔧 FIX : Rafraîchir automatiquement la liste des tâches pour s'assurer de la synchronisation
          console.log('🔄 [v1] Rafraîchissement automatique des tâches...');
          setTimeout(() => {
            fetchTasks();
          }, 1000); // Attendre 1 seconde pour que Jira synchronise
          
          return newTask;
        } else {
          throw new Error(result.message || 'Échec création tâche');
        }
      } else {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }
    } catch (error) {
      // 🔧 AMÉLIORATION : Utilisation de la gestion d'erreur intelligente
      const errorMessage = handleJiraError(error, 'création de la tâche');
      console.error('❌ [v1] Erreur addTask:', error);
      setError(errorMessage);
      return null;
    }
  };

  // Modifier une tâche (v1 Jira uniquement - migré de MCP)
  const editTask = async (id: number, taskData: Partial<TaskForm>) => {
    try {
      setError(null);
      
      console.log("✏️ [v1] Modification tâche via v1 API uniquement...");
      
      // Trouver la tâche pour récupérer jiraKey et autres infos nécessaires
      const currentTask = tasks.find(task => task.id === id);
      if (!currentTask) {
        throw new Error('Tâche non trouvée');
      }
      
      // Construire les données avec jiraKey pour v1 API
      const updateData = {
        jiraKey: currentTask.jiraKey,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        assignee: taskData.assignee || taskData.assignedTo,
        // Nouveaux champs Jira
        issueType: taskData.issueType,
        status: taskData.status,
        storyPoints: taskData.storyPoints,
        labels: taskData.labels,
        components: taskData.components,
        epicLink: taskData.epicLink,
        sprint: taskData.sprint
      };
      
      // Vérification des données avant envoi
      console.log("🔍 [v1] Vérification des données d'édition:", {
        jiraKey: updateData.jiraKey,
        title: updateData.title,
        description: updateData.description,
        priority: updateData.priority,
        assignee: updateData.assignee
      });
      
      console.log("📋 [v1] Données d'édition:", updateData);
      
      const response = await fetch('/api/v1/jira/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const updatedTask = await response.json();
      if (updatedTask.status === 200) {
        // ✅ CORRECTION : Mise à jour locale immédiate pour UX fluide
        console.log('✅ [v1] Tâche modifiée via v1 API, mise à jour locale...');
        
        // ✅ Mise à jour locale immédiate pour éviter le rechargement
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id 
              ? { ...task, ...taskData }
              : task
          )
        );
        
        console.log('✅ [v1] Mise à jour locale terminée, interface fluide');
      } else {
        throw new Error(updatedTask.message || 'Échec modification tâche');
      }
    } catch (error) {
      console.error('❌ [v1] Erreur editTask:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    }
  };

  // Supprimer une tâche (v1 Jira uniquement - migré de MCP)
  const deleteTask = async (id: number) => {
    try {
      setError(null);
      
      // Trouver la tâche pour récupérer jiraKey
      const taskToDelete = tasks.find(task => task.id === id);
      
      console.log("🗑️ [v1] Suppression tâche via v1 API uniquement...");
      
      // v1 API utilise DELETE avec query params jiraKey
      if (!taskToDelete?.jiraKey) {
        throw new Error('Impossible de supprimer la tâche : jiraKey manquant');
      }
      
      const response = await fetch(`/api/v1/jira/tasks?jiraKey=${taskToDelete.jiraKey}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (result.status === 200) {
        setTasks(prev => prev.filter(task => task.id !== id));
        console.log('✅ [v1] Tâche supprimée via v1 API:', taskToDelete.jiraKey);
      } else {
        throw new Error(result.message || 'Échec suppression');
      }
    } catch (error) {
      console.error('❌ [v1] Erreur deleteTask:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    }
  };

  // Récupérer les tâches d'un projet
  const getTasksByProject = (projectId: number | string): Task[] => {
    // ✅ Supporte les IDs numériques ET les clés Jira
    return tasks.filter(task => 
      task.projectId === projectId || 
      task.projectName === projectId ||
      task.jiraKey?.startsWith(projectId as string)
    );
  };

  // Charger les tâches au montage
  useEffect(() => {
    console.log("🚀 TasksProvider - useEffect déclenché, chargement initial des tâches...");
    fetchTasks();
  }, []); // Retour aux dépendances vides pour éviter les boucles

  // 🔧 NOUVELLE FONCTION : Validation des données de tâche avant envoi
  const validateTaskData = useCallback((taskData: TaskForm): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Validation du titre
    if (!taskData.title || taskData.title.trim().length < 3) {
      errors.push('Le titre doit contenir au moins 3 caractères');
    }
    
    if (taskData.title && taskData.title.length > 255) {
      errors.push('Le titre ne peut pas dépasser 255 caractères');
    }
    
    // Validation du projet
    if (!taskData.projectId || taskData.projectId <= 0) {
      errors.push('Un projet valide doit être sélectionné');
    }
    
    // Validation de la description
    if (taskData.description && taskData.description.length > 32767) {
      errors.push('La description ne peut pas dépasser 32767 caractères');
    }
    
    // Validation des story points
    if (taskData.storyPoints && (taskData.storyPoints < 0 || taskData.storyPoints > 100)) {
      errors.push('Les story points doivent être entre 0 et 100');
    }
    
    // Validation de la date d'échéance
    if (taskData.dueDate) {
      const dueDate = new Date(taskData.dueDate);
      const today = new Date();
      if (dueDate < today) {
        errors.push('La date d\'échéance ne peut pas être dans le passé');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }, []);

  // 🔧 NOUVELLE FONCTION : Gestion intelligente des erreurs Jira
  const handleJiraError = useCallback((error: any, operation: string): string => {
    console.error(`❌ [v1] Erreur Jira lors de ${operation}:`, error);
    
    // Messages d'erreur spécifiques selon le type d'erreur
    if (error.message?.includes('project')) {
      return `Erreur de projet: ${error.message}. Vérifiez que le projet existe et est accessible.`;
    }
    
    if (error.message?.includes('permission')) {
      return `Erreur de permission: ${error.message}. Vérifiez vos droits d'accès au projet.`;
    }
    
    if (error.message?.includes('field')) {
      return `Erreur de champ: ${error.message}. Certains champs peuvent ne pas être supportés par ce projet.`;
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return `Erreur de connexion: Impossible de joindre Jira. Vérifiez votre connexion internet et la configuration Jira.`;
    }
    
    // Message générique avec contexte
    return `Erreur lors de ${operation}: ${error.message || 'Erreur inconnue'}. Vérifiez la console pour plus de détails.`;
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
