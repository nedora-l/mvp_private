"use client";

import React, { useState, useMemo } from "react";
import { useTasks } from "@/contexts/tasks-context";
import { useProjects } from "@/contexts/projects-context";
import { useCollaborators } from "@/contexts/collaborators-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Calendar, User, Flag, Loader2, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Task, Project, Collaborator } from "@/types";
import { toast } from "sonner";

/**
 * Page de gestion des tâches
 * Affiche toutes les tâches avec filtres et CRUD complet
 * 
 * @version 1.0.0
 * @author DA Workspace
 * @description Interface moderne pour la gestion des tâches avec filtres avancés
 */
export default function TasksPage() {
  // Contextes
  const { tasks, loading: tasksLoading, addTask, editTask, deleteTask } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();
  const { collaborators } = useCollaborators();
  
  // États locaux pour les filtres
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");

  // États pour les modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loading = tasksLoading || projectsLoading;

  // Options pour les filtres
  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "À faire", label: "À faire" },
    { value: "En cours", label: "En cours" },
    { value: "En attente", label: "En attente" },
    { value: "Terminé", label: "Terminé" },
  ];

  const priorityOptions = [
    { value: "all", label: "Toutes les priorités" },
    { value: "Faible", label: "Faible" },
    { value: "Moyenne", label: "Moyenne" },
    { value: "Élevée", label: "Élevée" },
    { value: "Critique", label: "Critique" },
  ];

  // Filtrage des tâches
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                           task.description?.toLowerCase().includes(search.toLowerCase()) ||
                           false;
      
      const matchesProject = selectedProject === "all" || task.projectId === Number(selectedProject);
      const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
      const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;
      const matchesAssignee = selectedAssignee === "all" || task.assigneeId === Number(selectedAssignee);

      return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [tasks, search, selectedProject, selectedStatus, selectedPriority, selectedAssignee]);

  // Fonction pour obtenir le nom du projet
  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || "Projet inconnu";
  };

  // Fonction pour obtenir le nom du collaborateur
  const getCollaboratorName = (collaboratorId: number) => {
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    return collaborator ? `${collaborator.firstName} ${collaborator.lastName}` : "Non assigné";
  };

  // Fonction pour obtenir la couleur du badge statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "À faire": return "bg-gray-100 text-gray-800";
      case "En cours": return "bg-blue-100 text-blue-800";
      case "En attente": return "bg-yellow-100 text-yellow-800";
      case "Terminé": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir la couleur du badge priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Faible": return "bg-green-100 text-green-800";
      case "Moyenne": return "bg-yellow-100 text-yellow-800";
      case "Élevée": return "bg-orange-100 text-orange-800";
      case "Critique": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Gestion de la suppression
  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`)) {
      return;
    }

    try {
      await deleteTask(task.id);
      toast({
        title: "Tâche supprimée",
        description: `La tâche "${task.title}" a été supprimée avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearch("");
    setSelectedProject("all");
    setSelectedStatus("all");
    setSelectedPriority("all");
    setSelectedAssignee("all");
  };

  return (
    <div className="container mx-auto p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des tâches</h1>
          <p className="text-gray-600 mt-1">
            Gérez toutes les tâches de vos projets en un seul endroit
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Recherche */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher une tâche..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtre projet */}
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Projet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les projets</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
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
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre priorité */}
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre assigné */}
            <div className="flex gap-2">
              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Assigné à" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les assignés</SelectItem>
                  {collaborators.map((collaborator) => (
                    <SelectItem key={collaborator.id} value={collaborator.id.toString()}>
                      {collaborator.firstName} {collaborator.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={resetFilters} size="sm">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{filteredTasks.length}</div>
            <div className="text-sm text-gray-600">Tâches trouvées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredTasks.filter(t => t.status === "En cours").length}
            </div>
            <div className="text-sm text-gray-600">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {filteredTasks.filter(t => t.status === "Terminé").length}
            </div>
            <div className="text-sm text-gray-600">Terminées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {filteredTasks.filter(t => t.priority === "Critique").length}
            </div>
            <div className="text-sm text-gray-600">Critiques</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading state */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des tâches...</p>
          </CardContent>
        </Card>
      )}

      {/* Liste des tâches */}
      {!loading && (
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune tâche trouvée</h3>
                <p className="text-gray-600 mb-4">
                  Aucune tâche ne correspond à vos critères de recherche.
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        {task.priority && (
                          <Badge className={getPriorityColor(task.priority)}>
                            <Flag className="w-3 h-3 mr-1" />
                            {task.priority}
                          </Badge>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 mb-3">{task.description}</p>
                      )}

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Projet: {getProjectName(task.projectId)}
                        </div>
                        {task.assigneeId && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {getCollaboratorName(task.assigneeId)}
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Échéance: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingTask(task)}
                          className="flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(task)}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modals TODO: À créer plus tard */}
      {/* TaskCreateModal */}
      {/* TaskEditModal */}
    </div>
  );
}
