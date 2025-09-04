"use client";

import React, { useState, useMemo } from "react";
import { useTasks } from "@/contexts/tasks-context";
import { useProjects } from "@/contexts/projects-context";
import { useCollaborators } from "@/contexts/collaborators-context";
import { TaskCreateModal } from "@/components/tasks/TaskCreateModal";
import { TaskEditModal } from "@/components/tasks/TaskEditModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Loader2, 
  ArrowLeft, 
  Search, 
  Filter, 
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Calendar,
  User,
  Building2,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";

export default function TasksPage() {
  const { tasks, loading: tasksLoading, addTask, editTask, deleteTask } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();
  const { collaborators } = useCollaborators();
  
  // Debug des données chargées
  console.log("📊 TasksPage Debug:", {
    tasksCount: tasks.length,
    projectsCount: projects.length,
    collaboratorsCount: collaborators.length,
    tasksLoading,
    projectsLoading,
    firstTask: tasks[0],
    firstProject: projects[0]
  });
  
  // États pour la page - suivi de la méthodologie
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const loading = tasksLoading || projectsLoading;

  // Filtrage des tâches - logique métier séparée
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                           task.description?.toLowerCase().includes(search.toLowerCase()) ||
                           false;
      
      const matchesProject = selectedProject === "all" || 
                             Number(task.projectId) === Number(selectedProject);
      
      const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
      
      const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;

      return matchesSearch && matchesProject && matchesStatus && matchesPriority;
    });
  }, [tasks, search, selectedProject, selectedStatus, selectedPriority]);

  // Statistiques - même style que D&A Workspace
  const stats = useMemo(() => {
    const total = filteredTasks.length;
    
    // 🔧 FIX : Utiliser les vrais statuts Jira au lieu de valeurs hardcodées
    const enCours = filteredTasks.filter(t => 
      t.status === "In Progress" || 
      t.status === "En cours" || 
      t.status?.toLowerCase().includes("progress")
    ).length;
    
    const terminees = filteredTasks.filter(t => 
      t.status === "Done" || 
      t.status === "Terminé" || 
      t.status === "Closed" ||
      t.status === "Resolved" ||
      t.status?.toLowerCase().includes("done") ||
      t.status?.toLowerCase().includes("closed")
    ).length;
    
    const critiques = filteredTasks.filter(t => 
      t.priority === "Highest" || 
      t.priority === "Critique" || 
      t.priority === "Critical" ||
      t.priority?.toLowerCase().includes("highest") ||
      t.priority?.toLowerCase().includes("critical")
    ).length;
    
    return { total, enCours, terminees, critiques };
  }, [filteredTasks]);

  // Fonctions utilitaires - synchronisation dynamique
  const getProjectName = (projectId: number | string) => {
    // Recherche flexible : compare number avec number ET string avec string
    const project = projects.find(p => 
      Number(p.id) === Number(projectId) || 
      String(p.id) === String(projectId)
    );
    console.log("🔍 Debug getProjectName:", { 
      projectId, 
      projectIdType: typeof projectId,
      projects: projects.map(p => ({ id: p.id, name: p.name, idType: typeof p.id })),
      foundProject: project 
    });
    return project?.name || "Projet inconnu";
  };

  const getCollaboratorName = (assignedTo: string) => {
    const collaborator = collaborators.find(c => c.name === assignedTo);
    return collaborator?.name || assignedTo;
  };

  // Couleurs des badges - cohérentes avec D&A Workspace
  const getStatusColor = (status: string) => {
    switch (status) {
      case "À faire": return "bg-slate-100 text-slate-700 border-slate-200";
      case "En cours": return "bg-blue-100 text-blue-700 border-blue-200";
      case "En attente": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Terminé": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
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

  // Gestionnaires d'événements avec feedback UX
  const handleCreateTask = async (taskForm: any) => {
    try {
      await addTask(taskForm);
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

  const resetFilters = () => {
    setSearch("");
    setSelectedProject("all");
    setSelectedStatus("all");
    setSelectedPriority("all");
    toast.success("🔄 Filtres réinitialisés");
  };

  const refreshData = async () => {
    // Forcer le rechargement des données
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Chargement des tâches...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Navigation - même style que D&A Workspace */}
      {showCreateForm && (
        <Button 
          variant="ghost" 
          onClick={() => setShowCreateForm(false)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      )}

      {/* Affichage conditionnel - structure D&A Workspace */}
      {showCreateForm ? (
        <div>
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Créer une nouvelle tâche
              </h1>
            </div>
          </div>
          <TaskCreateModal 
            open={showCreateForm} 
            onOpenChange={(open) => {
              setShowCreateForm(open);
              if (!open) {
                // Modal fermé, on peut revenir à la liste
              }
            }} 
          />
        </div>
      ) : (
        <div>
          {/* En-tête avec icône - style D&A Workspace */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Gestion des Tâches
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={refreshData}>
                <RefreshCcw className="h-4 w-4" />
                <span className="sr-only">Actualiser</span>
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle tâche
              </Button>
            </div>
          </div>
          
          <p className="text-gray-600 flex items-center gap-2 mb-6">
            <span>Organisez et suivez vos tâches par projet</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              Gestion Avancée
            </span>
          </p>

          {/* Statistiques - même design que D&A Workspace */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total tâches</div>
                  </div>
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
                    <div className="text-sm text-gray-600">En cours</div>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.terminees}</div>
                    <div className="text-sm text-gray-600">Terminées</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{stats.critiques}</div>
                    <div className="text-sm text-gray-600">Critiques</div>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres - design moderne */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-500" />
                Filtres intelligents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Recherche */}
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher une tâche..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Filtre projet - SYNCHRONISATION DYNAMIQUE */}
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Projet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🏢 Tous les projets</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        📂 {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Filtre statut */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">📋 Tous les statuts</SelectItem>
                    <SelectItem value="À faire">⏳ À faire</SelectItem>
                    <SelectItem value="En cours">🔄 En cours</SelectItem>
                    <SelectItem value="En attente">⏸️ En attente</SelectItem>
                    <SelectItem value="Terminé">✅ Terminé</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtre priorité */}
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">🏷️ Toutes</SelectItem>
                    <SelectItem value="Faible">🟢 Faible</SelectItem>
                    <SelectItem value="Moyenne">🟡 Moyenne</SelectItem>
                    <SelectItem value="Élevée">🟠 Élevée</SelectItem>
                    <SelectItem value="Critique">🔴 Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Bouton reset */}
              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  🔄 Réinitialiser les filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des tâches - design moderne */}
          <div className="grid gap-4">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-gray-900">Aucune tâche trouvée</h3>
                    <p className="text-gray-600 mb-4">
                      {search || selectedProject !== "all" || selectedStatus !== "all" || selectedPriority !== "all" 
                        ? "Aucune tâche ne correspond à vos critères de recherche."
                        : "Commencez par créer votre première tâche."
                      }
                    </p>
                    {!search && selectedProject === "all" && selectedStatus === "all" && selectedPriority === "all" && (
                      <Button onClick={() => setShowCreateForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer une tâche
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1 text-gray-900">{task.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                            
                            {/* Badges avec couleurs cohérentes */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline" className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>

                            {/* Métadonnées - synchronisation dynamique */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <span>{getProjectName(typeof task.projectId === 'number' ? task.projectId : 0)}</span>
                              </div>
                              {task.assignee && (
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>{task.assignee}</span>
                                </div>
                              )}
                              {task.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>Échéance: {new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                              )}
                              {/* ✅ NOUVEAU : Affichage des subtasks */}
                              {task.hasSubtasks && task.subtasksCount && task.subtasksCount > 0 && (
                                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  <span className="text-xs">📋 {task.subtasksCount} subtask{task.subtasksCount > 1 ? 's' : ''}</span>
                                </div>
                              )}
                              {task.isSubtask && task.parentKey && (
                                <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                  <span className="text-xs">🔗 Subtask de {task.parentKey}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTask(task)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleEditTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
