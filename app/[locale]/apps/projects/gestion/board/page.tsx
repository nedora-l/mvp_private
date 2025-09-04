"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useProjects, ProjectCreate } from "@/contexts/projects-context";
import { useTasks } from "@/contexts/tasks-context";
import { TaskCreateModal } from "@/components/tasks/TaskCreateModal";
import { TaskEditModal } from "@/components/tasks/TaskEditModal";
import ProjectCreateModal from "@/components/projects/ProjectCreateModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Loader2, 
  ArrowLeft, 
  Kanban,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  RefreshCcw,
  User,
  Calendar
} from "lucide-react";
import { useIntelligentNotifications } from "@/hooks/use-intelligent-notifications";

export default function BoardPage() {
  const { projects, loading: projectsLoading, fetchProjects, addProject } = useProjects();
  const { tasks, loading: tasksLoading, fetchTasks, addTask, editTask, deleteTask } = useTasks();
  const { showJiraSuccess, showJiraError, showInfo } = useIntelligentNotifications();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Logs de debug pour suivre l'état
  useEffect(() => {
    console.log("📊 BOARD DEBUG - State update:");
    console.log("Projects count:", projects.length);
    console.log("Tasks count:", tasks.length);
    console.log("Selected project ID:", selectedProjectId);
    console.log("Projects loading:", projectsLoading);
    console.log("Tasks loading:", tasksLoading);
  }, [projects.length, tasks.length, selectedProjectId, projectsLoading, tasksLoading]);

  // Refresh automatique toutes les 10 minutes pour voir les nouveaux projets
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProjects();
    }, 600000); // 10 minutes = 600000ms
    return () => clearInterval(interval);
  }, []); // Suppression de fetchProjects des dépendances pour éviter la boucle

  // Sélectionner automatiquement le premier projet si aucun n'est sélectionné
  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      console.log("🎯 Sélection automatique du premier projet:", projects[0].name);
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Filtrer les tâches du projet sélectionné
  const projectTasks = useMemo(() => {
    if (!selectedProjectId) return [];
    console.log("🔍 DEBUG BOARD - selectedProjectId:", selectedProjectId);
    console.log("🔍 DEBUG BOARD - all tasks count:", tasks.length);
    console.log("🔍 DEBUG BOARD - all tasks:", tasks.map(t => ({ id: t.id, projectId: t.projectId, title: t.title })));
    
    const filtered = tasks.filter(task => {
      const matches = task.projectId === selectedProjectId;
      console.log(`🔍 DEBUG BOARD - Task "${task.title}": projectId=${task.projectId} vs ${selectedProjectId} = ${matches}`);
      return matches;
    });
    console.log("🔍 DEBUG BOARD - filtered tasks for project:", filtered);
    console.log("🔍 DEBUG BOARD - filtered count:", filtered.length);
    
    return filtered;
  }, [tasks, selectedProjectId]);

  // Obtenir le projet sélectionné
  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return undefined;
    return projects.find(p => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  // Grouper les tâches par statut
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, any[]> = {
      "To Do": [],
      "In Progress": [],
      "In Review": [],
      "Done": [],
      "Blocked": []
    };

    console.log("🔍 DEBUG BOARD - Grouping tasks by status:", projectTasks.length, "tasks");
    
    projectTasks.forEach(task => {
      const status = task.status || "To Do";
      console.log("🔍 DEBUG BOARD - Task:", task.title, "Status:", status);
      
      if (grouped[status]) {
        grouped[status].push(task);
      } else {
        console.log("🔍 DEBUG BOARD - Unknown status, adding to To Do:", status);
        grouped["To Do"].push(task);
      }
    });

    console.log("🔍 DEBUG BOARD - Final grouped:", grouped);
    return grouped;
  }, [projectTasks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "To Do": return <Clock className="h-4 w-4" />;
      case "In Progress": return <Target className="h-4 w-4" />;
      case "In Review": return <AlertCircle className="h-4 w-4" />;
      case "Done": return <CheckCircle className="h-4 w-4" />;
      case "Blocked": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do": return "bg-slate-100 text-slate-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "In Review": return "bg-yellow-100 text-yellow-800";
      case "Done": return "bg-green-100 text-green-800";
      case "Blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Lowest": return "bg-green-100 text-green-700 border-green-200";
      case "Low": return "bg-green-100 text-green-600 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "High": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Highest": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getIssueTypeIcon = (issueType: string) => {
    switch (issueType) {
      case "Story": return "📖";
      case "Bug": return "🐛";
      case "Task": return "✅";
      case "Epic": return "🚀";
      case "Subtask": return "🔧";
      default: return "📋";
    }
  };

  // Gestionnaires CRUD
  const handleCreateProject = async (projectForm: any) => {
    try {
      setError(null);
      // Ne pas inclure d'ID - l'API le générera automatiquement
      const newProject: ProjectCreate = {
        ...projectForm,
        // Supprimer l'ID - l'API v1 le génère automatiquement
      };
      
      await addProject(newProject);
      setShowCreateProject(false);
      console.log("✅ Projet créé avec succès");
      showJiraSuccess("✅ Projet créé avec succès !");
      
      // Auto-sélectionner le nouveau projet si possible
      await fetchProjects(); // Recharger la liste des projets
    } catch (error) {
      console.error("❌ Erreur lors de la création:", error);
      setError("Erreur lors de la création du projet");
      showJiraError("❌ Erreur lors de la création du projet");
    }
  };

  const handleCreateTask = async (taskForm: any) => {
    try {
      const taskData = {
        ...taskForm,
        projectId: selectedProjectId
      };
      await addTask(taskData);
      setShowCreateForm(false);
      showJiraSuccess("✅ Tâche créée avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de la création:", error);
      showJiraError("❌ Erreur lors de la création de la tâche");
    }
  };

  const handleEditTask = async (id: number, taskData: any) => {
    try {
      await editTask(id, taskData);
      setEditingTask(null);
      showJiraSuccess("✅ Tâche modifiée avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de la modification:", error);
      showJiraError("❌ Erreur lors de la modification de la tâche");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm("🗑️ Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        await deleteTask(id);
        showJiraSuccess("✅ Tâche supprimée avec succès !");
      } catch (error) {
        console.error("❌ Erreur lors de la suppression:", error);
        showJiraError("❌ Erreur lors de la suppression de la tâche");
      }
    }
  };

  // Drag & Drop handlers - CONNECTÉS AUX APIs JIRA
  const handleDragStart = (e: React.DragEvent, task: any) => {
    console.log("🎯 [v1] Drag started:", task.title, "Status:", task.status, "JiraKey:", task.jiraKey);
    setDraggedTask(task);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    
    // ✅ Validation que la tâche peut être déplacée
    if (!task.jiraKey) {
      console.warn("⚠️ [v1] Tâche sans jiraKey - déplacement limité");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (!draggedTask) {
      console.log("❌ Aucune tâche en cours de drag");
      return;
    }

    // ✅ DEBUG COMPLET DU DRAG & DROP
    console.log("🎯 [v1] DEBUG DRAG & DROP:");
    console.log("  - Tâche:", draggedTask.title);
    console.log("  - Ancien statut:", draggedTask.status);
    console.log("  - Nouveau statut:", newStatus);
    console.log("  - JiraKey:", draggedTask.jiraKey);
    console.log("  - ID:", draggedTask.id);

    if (draggedTask.status === newStatus) {
      console.log("🔄 Même statut, pas de changement nécessaire");
      setDraggedTask(null);
      setIsDragging(false);
      return;
    }

    console.log(`🔄 [v1] Moving task "${draggedTask.title}" from "${draggedTask.status}" to "${newStatus}"`);
    
    try {
      // ✅ CONNEXION RÉELLE AUX APIs JIRA - Mise à jour via v1 API
      const updatedTask = {
        ...draggedTask,
        status: newStatus
      };

      console.log("📦 [v1] Données envoyées à editTask:", updatedTask);

      // ✅ Utiliser editTask qui appelle l'API v1/jira/tasks ET actualise déjà l'interface
      await editTask(draggedTask.id, updatedTask);
      
      console.log("✅ [v1] Task moved successfully via Jira API");
      showJiraSuccess(`✅ Tâche déplacée vers "${newStatus}" via Jira`);
      
      // ✅ PAS BESOIN de fetchTasks() car editTask() l'appelle déjà !
      
    } catch (error) {
      console.error("❌ [v1] Erreur lors du déplacement via Jira:", error);
      showJiraError(`❌ Erreur lors du déplacement de la tâche: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      
      // ✅ En cas d'erreur, remettre la tâche à sa position originale
      setDraggedTask(null);
      setIsDragging(false);
      return;
    } finally {
      setDraggedTask(null);
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setIsDragging(false);
  };

  if (projectsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Kanban className="h-6 w-6" />
              Board Kanban
            </h1>
            <p className="text-muted-foreground">
              Gestion visuelle des tâches par projet
            </p>
          </div>
        </div>
      </div>

      {/* Sélection du projet */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sélectionner un projet</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateProject(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un projet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchProjects();
                  showInfo({
                    title: "🔄 Actualisation",
                    message: "Projets actualisés !",
                    type: "info"
                  });
                }}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Actualiser les projets
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log("=== DEBUG STATE ===");
                  console.log("Projects:", projects);
                  console.log("Tasks:", tasks);
                  console.log("selectedProjectId:", selectedProjectId);
                  console.log("projectTasks:", projectTasks);
                  console.log("tasksByStatus:", tasksByStatus);
                  showInfo({
                    title: "🐛 Debug Info",
                    message: `Debug: ${projects.length} projets, ${tasks.length} tâches, ${projectTasks.length} tâches pour projet`,
                    type: "info"
                  });
                }}
              >
                🐛 Debug
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedProjectId?.toString() || ""} 
            onValueChange={(value) => setSelectedProjectId(value ? parseInt(value, 10) : null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un projet..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{project.type}</Badge>
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            {projects.length} projets disponibles • Actualisation automatique toutes les 10 min
          </p>
        </CardContent>
      </Card>

      {/* Board Kanban */}
      {selectedProject ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {selectedProject.name} - Board Kanban
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => fetchTasks()}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle tâche
              </Button>
            </div>
          </div>

          {/* Colonnes Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
              <Card 
                key={status} 
                className="min-h-[500px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    {getStatusIcon(status)}
                    <span>{status}</span>
                    <Badge className={getStatusColor(status)}>
                      {statusTasks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {statusTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className={`p-3 cursor-pointer hover:shadow-md transition-shadow group border-l-4 ${
                        task.jiraKey ? 'border-l-blue-500' : 'border-l-gray-300'
                      } ${!task.jiraKey ? 'opacity-75' : ''}`}
                      draggable={!!task.jiraKey} // ✅ Seulement draggable si jiraKey existe
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => {
                        // Éviter le clic si on fait un drag
                        if (!isDragging && !draggedTask) {
                          e.stopPropagation();
                          setEditingTask(task);
                        }
                      }}
                      title={!task.jiraKey ? 'Tâche locale - Pas de drag & drop' : 'Tâche Jira - Déplacer pour changer le statut'}
                    >
                      <div className="space-y-3">
                        {/* Header avec type d'issue et actions */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg" title={`Type: ${task.issueType || 'Task'}`}>
                              {getIssueTypeIcon(task.issueType || 'Task')}
                            </span>
                            <h4 className="text-sm font-medium line-clamp-2 flex-1">
                              {task.title}
                            </h4>
                            {/* ✅ Indicateur de drag & drop */}
                            {task.jiraKey && (
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                🎯 Déplacer
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-blue-100"
                              onClick={() => setEditingTask(task)}
                              title="Modifier la tâche"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                              onClick={() => handleDeleteTask(task.id)}
                              title="Supprimer la tâche"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Description */}
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 bg-gray-50 p-2 rounded">
                            {task.description}
                          </p>
                        )}
                        
                        {/* Métadonnées Jira */}
                        <div className="space-y-2">
                          {/* Priorité et Assignee */}
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority || 'Medium'}
                            </Badge>
                            {task.assignee && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{task.assignee}</span>
                              </div>
                            )}
                          </div>

                          {/* Story Points et Labels */}
                          <div className="flex items-center justify-between text-xs">
                            {task.storyPoints && (
                              <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                <span className="font-medium">SP: {task.storyPoints}</span>
                              </div>
                            )}
                            {task.labels && task.labels.length > 0 && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <span className="text-xs">🏷️ {Array.isArray(task.labels) ? task.labels.slice(0, 2).join(', ') : task.labels}</span>
                              </div>
                            )}
                          </div>

                          {/* Composants et Epic */}
                          <div className="flex items-center justify-between text-xs">
                            {task.components && task.components.length > 0 && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <span className="text-xs">🔧 {Array.isArray(task.components) ? task.components.slice(0, 2).join(', ') : task.components}</span>
                              </div>
                            )}
                            {task.epicLink && (
                              <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                <span className="text-xs font-medium">Epic: {task.epicLink}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Date d'échéance et Sprint */}
                        <div className="flex items-center justify-between text-xs">
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          {task.sprint && (
                            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded">
                              <span className="text-xs font-medium">🏃 {task.sprint}</span>
                            </div>
                          )}
                        </div>

                        {/* Clé Jira si disponible */}
                        {task.jiraKey && (
                          <div className="text-xs text-muted-foreground bg-gray-100 p-1 rounded text-center">
                            🔗 {task.jiraKey}
                          </div>
                        )}
                        
                        {/* ✅ NOUVEAU : Indicateur des subtasks */}
                        {task.hasSubtasks && task.subtasksCount && task.subtasksCount > 0 && (
                          <div className="text-xs text-blue-600 bg-blue-50 p-1 rounded text-center mt-2">
                            📋 {task.subtasksCount} subtask{task.subtasksCount > 1 ? 's' : ''}
                          </div>
                        )}
                        
                        {/* ✅ NOUVEAU : Indicateur si c'est une subtask */}
                        {task.isSubtask && task.parentKey && (
                          <div className="text-xs text-purple-600 bg-purple-50 p-1 rounded text-center mt-2">
                            🔗 Subtask de {task.parentKey}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                  
                  {/* Zone de drop améliorée - CONNECTÉE AUX APIs JIRA */}
                  <div 
                    className={`
                      border-2 border-dashed rounded-lg p-4 text-center text-sm min-h-[60px] 
                      flex items-center justify-center transition-all duration-200
                      ${draggedTask ? 
                        'border-blue-400 bg-blue-50 text-blue-600' : 
                        'border-gray-200 text-muted-foreground hover:border-gray-300'
                      }
                    `}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    {draggedTask ? (
                      <div className="text-center">
                        <div className="text-lg mb-1">📦</div>
                        <div className="font-medium">Déposer ici pour</div>
                        <div className="text-blue-600 font-bold">{status}</div>
                        <div className="text-xs text-blue-500 mt-1">
                          {draggedTask.jiraKey ? 'Synchronisé avec Jira' : 'Tâche locale'}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-lg mb-1">🎯</div>
                        <div>Glisser une tâche ici</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Changement de statut via Jira
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats du projet */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques du projet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{projectTasks.length}</div>
                  <div className="text-sm text-muted-foreground">Total tâches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{tasksByStatus["In Progress"].length}</div>
                  <div className="text-sm text-muted-foreground">En cours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{tasksByStatus["In Review"].length}</div>
                  <div className="text-sm text-muted-foreground">En revue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{tasksByStatus["Done"].length}</div>
                  <div className="text-sm text-muted-foreground">Terminées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{tasksByStatus["Blocked"].length}</div>
                  <div className="text-sm text-muted-foreground">Bloquées</div>
                </div>
              </div>
              
              {/* Métriques avancées */}
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">
                      {projectTasks.filter(t => t.issueType === 'Story').length}
                    </div>
                    <div className="text-xs text-muted-foreground">📖 Stories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {projectTasks.filter(t => t.issueType === 'Bug').length}
                    </div>
                    <div className="text-xs text-muted-foreground">🐛 Bugs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">
                      {projectTasks.filter(t => t.priority === 'High' || t.priority === 'Highest').length}
                    </div>
                    <div className="text-xs text-muted-foreground">🚨 Priorité haute</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {projectTasks.filter(t => t.assignee).length}
                    </div>
                    <div className="text-xs text-muted-foreground">👤 Assignées</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Kanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                Sélectionnez un projet pour voir son board Kanban
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Choisissez un projet dans la liste ci-dessus pour commencer
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 z-10"
              onClick={() => setShowCreateProject(false)}
            >
              ✕
            </Button>
            <ProjectCreateModal onCreate={handleCreateProject} />
          </div>
        </div>
      )}

      {showCreateForm && (
        <TaskCreateModal 
          open={showCreateForm} 
          onOpenChange={setShowCreateForm}
        />
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
