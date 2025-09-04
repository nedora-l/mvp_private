"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useProjects } from "@/contexts/projects-context";
import { useTasks } from "@/contexts/tasks-context";
import { useIntelligentNotifications } from "@/hooks/use-intelligent-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  User, 
  Flag, 
  Clock, 
  Target,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  Zap,
  Edit
} from "lucide-react";

export default function BacklogPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, fetchTasks } = useTasks();
  const { showJiraError, showJiraSuccess, showInfo } = useIntelligentNotifications();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  // Charger les tâches au montage et quand le projet change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filtrer les projets Jira uniquement
  const jiraProjects = useMemo(() => {
    return projects.filter(p => p.type === "Jira" || p.jiraKey);
  }, [projects]);

  // Projet sélectionné
  const selectedProject = useMemo(() => {
    return jiraProjects.find(p => p.id === selectedProjectId);
  }, [jiraProjects, selectedProjectId]);

  // Tâches du projet sélectionné (backlog = pas de sprint)
  const projectTasks = useMemo(() => {
    if (!selectedProjectId) return [];
    return tasks.filter(task => 
      task.projectId === parseInt(selectedProjectId) && 
      (!task.sprint || task.sprint === "") // Pas de sprint = backlog
    );
  }, [tasks, selectedProjectId]);

  // Filtrage des tâches
  const filteredTasks = useMemo(() => {
    let filtered = projectTasks;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filtre par priorité
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Filtre par assigné
    if (assigneeFilter !== "all") {
      filtered = filtered.filter(task => task.assignee === assigneeFilter);
    }

    return filtered;
  }, [projectTasks, searchTerm, statusFilter, priorityFilter, assigneeFilter]);

  // Statistiques du backlog
  const backlogStats = useMemo(() => {
    const total = projectTasks.length;
    const unassigned = projectTasks.filter(t => !t.assignee || t.assignee === "Non assigné").length;
    const highPriority = projectTasks.filter(t => t.priority === "High" || t.priority === "Highest").length;
    const estimated = projectTasks.filter(t => t.storyPoints).length;

    return { total, unassigned, highPriority, estimated };
  }, [projectTasks]);

  // Obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do": return "bg-gray-100 text-gray-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "In Review": return "bg-yellow-100 text-yellow-800";
      case "Done": return "bg-green-100 text-green-800";
      case "Blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Obtenir la couleur de la priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Highest": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      case "Lowest": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Obtenir l'icône du type d'issue
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

  // Actualiser le backlog
  const handleRefresh = () => {
    fetchTasks();
    showInfo({
      title: "🔄 Actualisation",
      message: "Backlog actualisé !",
      type: "info"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📋 Backlog</h1>
            <p className="text-sm text-muted-foreground">
              Gestion des tâches non planifiées - Vue d'ensemble du travail à faire
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Jira Agile
            </Badge>
            <Button variant="outline" onClick={handleRefresh} disabled={tasksLoading}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${tasksLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Sélection de projet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Sélection du Projet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un projet Jira..." />
              </SelectTrigger>
              <SelectContent>
                {jiraProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Jira</Badge>
                      <span>{project.name}</span>
                      {project.jiraKey && (
                        <Badge className="text-xs">{project.jiraKey}</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Statistiques du backlog */}
        {selectedProject && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{backlogStats.total}</p>
                    <p className="text-sm text-muted-foreground">Tâches totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{backlogStats.unassigned}</p>
                    <p className="text-sm text-muted-foreground">Non assignées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{backlogStats.highPriority}</p>
                    <p className="text-sm text-muted-foreground">Priorité haute</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{backlogStats.estimated}</p>
                    <p className="text-sm text-muted-foreground">Estimées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtres et recherche */}
        {selectedProject && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="Rechercher des tâches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="To Do">À faire</SelectItem>
                    <SelectItem value="In Progress">En cours</SelectItem>
                    <SelectItem value="In Review">En revue</SelectItem>
                    <SelectItem value="Done">Terminé</SelectItem>
                    <SelectItem value="Blocked">Bloqué</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les priorités</SelectItem>
                    <SelectItem value="Highest">Critique</SelectItem>
                    <SelectItem value="High">Élevée</SelectItem>
                    <SelectItem value="Medium">Moyenne</SelectItem>
                    <SelectItem value="Low">Faible</SelectItem>
                    <SelectItem value="Lowest">Très faible</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assigné" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les assignés</SelectItem>
                    <SelectItem value="Non assigné">Non assigné</SelectItem>
                    {/* Ajouter d'autres assignés dynamiquement */}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des tâches du backlog */}
        {selectedProject && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Tâches du Backlog - {selectedProject.name}
                </div>
                <Badge variant="outline">
                  {filteredTasks.length} tâche{filteredTasks.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="flex justify-center py-8">
                  <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    {projectTasks.length === 0 ? "Aucune tâche dans le backlog" : "Aucune tâche ne correspond aux filtres"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {projectTasks.length === 0 
                      ? "Créez des tâches ou assignez-les à des sprints pour commencer"
                      : "Essayez de modifier vos critères de recherche"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getIssueTypeIcon(task.issueType)}</span>
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {task.assignee && task.assignee !== "Non assigné" && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {task.assignee}
                              </div>
                            )}
                            
                            {task.storyPoints && (
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {task.storyPoints} SP
                              </div>
                            )}
                            
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Message si aucun projet sélectionné */}
        {!selectedProject && (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Sélectionnez un projet Jira
              </h3>
              <p className="text-sm text-muted-foreground">
                Choisissez un projet ci-dessus pour voir son backlog
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
