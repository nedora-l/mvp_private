"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useProjects } from "@/contexts/projects-context";
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
import { toast } from "sonner";

export default function BoardPage() {
  const { projects, loading: projectsLoading, fetchProjects, addProject } = useProjects();
  const { tasks, loading: tasksLoading, fetchTasks, addTask, editTask, deleteTask } = useTasks();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Refresh automatique toutes les 10 minutes pour voir les nouveaux projets
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProjects();
    }, 600000); // 10 minutes = 600000ms
    return () => clearInterval(interval);
  }, []); // Suppression de fetchProjects des dépendances pour éviter la boucle

  // Filtrer les tâches du projet sélectionné
  const projectTasks = useMemo(() => {
    if (!selectedProjectId) return [];
    const projectIdNumber = parseInt(selectedProjectId, 10);
    return tasks.filter(task => task.projectId === projectIdNumber);
  }, [tasks, selectedProjectId]);

  // Obtenir le projet sélectionné
  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  // Grouper les tâches par statut
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, any[]> = {
      "À faire": [],
      "En cours": [],
      "En attente": [],
      "Terminé": []
    };

    projectTasks.forEach(task => {
      const status = task.status || "À faire";
      if (grouped[status]) {
        grouped[status].push(task);
      } else {
        grouped["À faire"].push(task);
      }
    });

    return grouped;
  }, [projectTasks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "À faire": return <Clock className="h-4 w-4" />;
      case "En cours": return <Target className="h-4 w-4" />;
      case "En attente": return <AlertCircle className="h-4 w-4" />;
      case "Terminé": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "À faire": return "bg-slate-100 text-slate-800";
      case "En cours": return "bg-blue-100 text-blue-800";
      case "En attente": return "bg-yellow-100 text-yellow-800";
      case "Terminé": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Faible": return "bg-green-100 text-green-700 border-green-200";
      case "Moyenne": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Élevée": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Critique": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Gestionnaires CRUD
  const handleCreateProject = async (projectForm: any) => {
    try {
      const result = await addProject(projectForm);
      setShowCreateProject(false);
      
      // Feedback selon la source
      if (result?.source === 'jira') {
        toast.success(`✅ Projet créé sur Jira: ${result.jiraKey}`);
      } else if (result?.source?.includes('local')) {
        if (result.warning) {
          toast.warning(`⚠️ ${result.warning}`);
        } else {
          toast.success("✅ Projet créé localement !");
        }
      } else {
        toast.success("✅ Projet créé avec succès !");
      }
      
      // Auto-sélectionner le nouveau projet si possible
      if (result?.project?.id) {
        setSelectedProjectId(result.project.id);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la création du projet:", error);
      toast.error("❌ Erreur lors de la création du projet");
    }
  };

  const handleCreateTask = async (taskForm: any) => {
    try {
      const taskData = {
        ...taskForm,
        projectId: parseInt(selectedProjectId, 10)
      };
      await addTask(taskData);
      setShowCreateForm(false);
      toast.success("✅ Tâche créée avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de la création:", error);
      toast.error("❌ Erreur lors de la création de la tâche");
    }
  };

  const handleEditTask = async (id: number, taskData: any) => {
    try {
      await editTask(id, taskData);
      setEditingTask(null);
      toast.success("✅ Tâche modifiée avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de la modification:", error);
      toast.error("❌ Erreur lors de la modification de la tâche");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm("🗑️ Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        await deleteTask(id);
        toast.success("✅ Tâche supprimée avec succès !");
      } catch (error) {
        console.error("❌ Erreur lors de la suppression:", error);
        toast.error("❌ Erreur lors de la suppression de la tâche");
      }
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, task: any) => {
    console.log("🎯 Drag started:", task.title, "Status:", task.status);
    setDraggedTask(task);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
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

    if (draggedTask.status === newStatus) {
      console.log("🔄 Même statut, pas de changement nécessaire");
      setDraggedTask(null);
      setIsDragging(false);
      return;
    }

    console.log(`🔄 Moving task "${draggedTask.title}" from "${draggedTask.status}" to "${newStatus}"`);
    
    try {
      // Mise à jour de la tâche avec le nouveau statut
      const updatedTask = {
        ...draggedTask,
        status: newStatus
      };

      await editTask(draggedTask.id, updatedTask);
      
      console.log("✅ Task moved successfully");
      toast.success(`✅ Tâche déplacée vers "${newStatus}"`);
      
      // Double refresh pour s'assurer que les changements sont visibles
      setTimeout(() => {
        fetchTasks();
      }, 500);
      
    } catch (error) {
      console.error("❌ Erreur lors du déplacement:", error);
      toast.error("❌ Erreur lors du déplacement de la tâche");
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
                  toast.success("🔄 Projets actualisés !");
                }}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Actualiser les projets
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un projet..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
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
                      className="p-3 cursor-pointer hover:shadow-md transition-shadow group"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => {
                        // Éviter le clic si on fait un drag
                        if (!isDragging && !draggedTask) {
                          e.stopPropagation();
                          setEditingTask(task);
                        }
                      }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium line-clamp-2 flex-1">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setEditingTask(task)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          {task.assignee && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{task.assignee}</span>
                            </div>
                          )}
                        </div>
                        
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                  
                  {/* Zone de drop améliorée */}
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
                    {draggedTask ? 
                      `📦 Déposer ici pour "${status}"` : 
                      'Glisser une tâche ici'
                    }
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{projectTasks.length}</div>
                  <div className="text-sm text-muted-foreground">Total tâches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{tasksByStatus["En cours"].length}</div>
                  <div className="text-sm text-muted-foreground">En cours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{tasksByStatus["En attente"].length}</div>
                  <div className="text-sm text-muted-foreground">En attente</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{tasksByStatus["Terminé"].length}</div>
                  <div className="text-sm text-muted-foreground">Terminées</div>
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
