"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useProjects } from "@/contexts/projects-context";
import { useTasks } from "@/contexts/tasks-context";
import { useIntelligentNotifications } from "@/hooks/use-intelligent-notifications";
import { useExport } from "@/hooks/use-export";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Flag, 
  Clock, 
  Target, 
  CheckCircle,
  AlertCircle,
  RefreshCcw,
  Download,
  Zap,
  Eye,
  Edit,
  Play,
  X
} from "lucide-react";
import { TaskEditModal } from "@/components/tasks/TaskEditModal";

export default function SearchPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, fetchTasks } = useTasks();
  const { showJiraError, showJiraSuccess, showInfo } = useIntelligentNotifications();
  const { handleExport } = useExport();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [issueTypeFilter, setIssueTypeFilter] = useState<string[]>([]);
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [hasStoryPoints, setHasStoryPoints] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // États pour les modals
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Charger les données au montage
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

  // Tâches du projet sélectionné (ou toutes si aucun projet sélectionné)
  const projectTasks = useMemo(() => {
    if (!selectedProjectId || selectedProjectId === "all") return tasks;
    return tasks.filter(task => task.projectId === parseInt(selectedProjectId));
  }, [tasks, selectedProjectId]);

  // Recherche et filtrage avancé
  const searchResults = useMemo(() => {
    let results = projectTasks;

    // Filtre par recherche textuelle
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.jiraKey?.toLowerCase().includes(query) ||
        task.assignee?.toLowerCase().includes(query)
      );
    }

    // Filtre par statut
    if (statusFilter.length > 0) {
      results = results.filter(task => statusFilter.includes(task.status));
    }

    // Filtre par priorité
    if (priorityFilter.length > 0) {
      results = results.filter(task => priorityFilter.includes(task.priority));
    }

    // Filtre par type d'issue
    if (issueTypeFilter.length > 0) {
      results = results.filter(task => issueTypeFilter.includes(task.issueType));
    }

    // Filtre par assigné
    if (assigneeFilter && assigneeFilter !== "all") {
      results = results.filter(task => task.assignee === assigneeFilter);
    }

    // Filtre par dates
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      results = results.filter(task => {
        if (task.dueDate) {
          return new Date(task.dueDate) >= fromDate;
        }
        return true;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      results = results.filter(task => {
        if (task.dueDate) {
          return new Date(task.dueDate) <= toDate;
        }
        return true;
      });
    }

    // Filtre par story points
    if (hasStoryPoints !== null) {
      results = results.filter(task => 
        hasStoryPoints ? task.storyPoints : !task.storyPoints
      );
    }

    // Tri des résultats
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "priority":
          const priorityOrder = { "Highest": 5, "High": 4, "Medium": 3, "Low": 2, "Lowest": 1 };
          comparison = (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - 
                      (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
          break;
        case "status":
          const statusOrder = { "To Do": 1, "In Progress": 2, "In Review": 3, "Done": 4, "Blocked": 5 };
          comparison = (statusOrder[a.status as keyof typeof statusOrder] || 0) - 
                      (statusOrder[b.status as keyof typeof statusOrder] || 0);
          break;
        case "assignee":
          comparison = (a.assignee || "").localeCompare(b.assignee || "");
          break;
        case "storyPoints":
          comparison = (a.storyPoints || 0) - (b.storyPoints || 0);
          break;
        default: // relevance
          comparison = 0;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return results;
  }, [
    projectTasks, 
    searchQuery, 
    statusFilter, 
    priorityFilter, 
    issueTypeFilter, 
    assigneeFilter, 
    dateFrom, 
    dateTo, 
    hasStoryPoints, 
    sortBy, 
    sortOrder
  ]);

  // Statistiques de recherche
  const searchStats = useMemo(() => {
    const total = projectTasks.length;
    const filtered = searchResults.length;
    const withStoryPoints = searchResults.filter(t => t.storyPoints).length;
    const unassigned = searchResults.filter(t => !t.assignee || t.assignee === "Non assigné").length;
    
    return { total, filtered, withStoryPoints, unassigned };
  }, [projectTasks.length, searchResults]);

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter([]);
    setPriorityFilter([]);
    setIssueTypeFilter([]);
    setAssigneeFilter("all");
    setDateFrom("");
    setDateTo("");
    setHasStoryPoints(null);
    setSortBy("relevance");
    setSortOrder("desc");
  };

  // Actualiser la recherche
  const handleRefresh = () => {
    fetchTasks();
    showInfo({
      title: "🔄 Actualisation",
      message: "Recherche actualisée !",
      type: "info"
    });
  };

  // Gestionnaires pour les boutons d'action CRUD
  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handlePlayTask = (task: any) => {
    showInfo({
      title: "▶️ Action",
      message: `Action sur la tâche ${task.jiraKey || task.title}`,
      type: "info"
    });
  };

  const handleCloseModals = () => {
    setSelectedTask(null);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
  };

  // Exporter les résultats avec le hook standardisé
  const handleExportSearch = async (format: string) => {
    // Préparer les données pour l'export
    const exportData = searchResults.map(task => ({
      ID: task.id,
      Clé_Jira: task.jiraKey || '',
      Titre: task.title,
      Description: task.description || '',
      Statut: task.status,
      Priorité: task.priority,
      Type: task.issueType,
      Assigné: task.assignee || 'Non assigné',
      'Story Points': task.storyPoints || 0,
      'Date d\'échéance': task.dueDate || '',
      Projet: selectedProject?.name || 'Tous les projets',
      'Clé Projet': selectedProject?.jiraKey || ''
    }));

    await handleExport(format, exportData, 'recherche', 'search');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔍 Recherche Avancée</h1>
            <p className="text-sm text-muted-foreground">
              Recherche intelligente et filtrage avancé de vos tâches Jira
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Jira Search
            </Badge>
            <Button variant="outline" onClick={handleRefresh} disabled={tasksLoading}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${tasksLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Barre de recherche principale */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Rechercher des tâches, descriptions, assignés, clés Jira..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg"
                />
              </div>
              <Button size="lg" className="px-8">
                <Search className="h-5 w-5 mr-2" />
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filtres avancés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres Avancés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sélection de projet */}
              <div>
                <label className="text-sm font-medium mb-2 block">Projet</label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les projets..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les projets</SelectItem>
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
              </div>

              {/* Filtre par statut */}
              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <div className="space-y-2">
                  {["To Do", "In Progress", "In Review", "Done", "Blocked"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={statusFilter.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setStatusFilter([...statusFilter, status]);
                          } else {
                            setStatusFilter(statusFilter.filter(s => s !== status));
                          }
                        }}
                      />
                      <label htmlFor={`status-${status}`} className="text-sm">{status}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtre par priorité */}
              <div>
                <label className="text-sm font-medium mb-2 block">Priorité</label>
                <div className="space-y-2">
                  {["Highest", "High", "Medium", "Low", "Lowest"].map((priority) => (
                    <div key={priority} className="flex items-center space-x-2">
                      <Checkbox
                        id={`priority-${priority}`}
                        checked={priorityFilter.includes(priority)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPriorityFilter([...priorityFilter, priority]);
                          } else {
                            setPriorityFilter(priorityFilter.filter(p => p !== priority));
                          }
                        }}
                      />
                      <label htmlFor={`priority-${priority}`} className="text-sm">{priority}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtre par type d'issue */}
              <div>
                <label className="text-sm font-medium mb-2 block">Type d'Issue</label>
                <div className="space-y-2">
                  {["Story", "Bug", "Task", "Epic", "Subtask"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={issueTypeFilter.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setIssueTypeFilter([...issueTypeFilter, type]);
                          } else {
                            setIssueTypeFilter(issueTypeFilter.filter(t => t !== type));
                          }
                        }}
                      />
                      <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtre par assigné */}
              <div>
                <label className="text-sm font-medium mb-2 block">Assigné</label>
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les assignés..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les assignés</SelectItem>
                    <SelectItem value="Non assigné">Non assigné</SelectItem>
                    {/* Ajouter d'autres assignés dynamiquement */}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par story points */}
              <div>
                <label className="text-sm font-medium mb-2 block">Story Points</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-story-points"
                      checked={hasStoryPoints === true}
                      onCheckedChange={(checked) => setHasStoryPoints(checked ? true : null)}
                    />
                    <label htmlFor="has-story-points" className="text-sm">Avec story points</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="no-story-points"
                      checked={hasStoryPoints === false}
                      onCheckedChange={(checked) => setHasStoryPoints(checked ? false : null)}
                    />
                    <label htmlFor="no-story-points" className="text-sm">Sans story points</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates et tri */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date de début</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Date de fin</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Trier par</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Pertinence</SelectItem>
                    <SelectItem value="title">Titre</SelectItem>
                    <SelectItem value="priority">Priorité</SelectItem>
                    <SelectItem value="status">Statut</SelectItem>
                    <SelectItem value="assignee">Assigné</SelectItem>
                    <SelectItem value="storyPoints">Story Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Ordre</label>
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Décroissant</SelectItem>
                    <SelectItem value="asc">Croissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {searchStats.filtered} résultat{searchStats.filtered !== 1 ? 's' : ''} sur {searchStats.total} tâches
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={resetFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
                                 <Button variant="outline" onClick={() => handleExportSearch("CSV")}>
                   <Download className="h-4 w-4 mr-2" />
                   Exporter CSV
                 </Button>
                 <Button variant="outline" onClick={() => handleExportSearch("JSON")}>
                   <Download className="h-4 w-4 mr-2" />
                   Exporter JSON
                 </Button>
                 <Button variant="outline" onClick={() => handleExportSearch("PDF")}>
                   <Download className="h-4 w-4 mr-2" />
                   Exporter PDF
                 </Button>
                 <Button variant="outline" onClick={() => handleExportSearch("Excel")}>
                   <Download className="h-4 w-4 mr-2" />
                   Exporter Excel
                 </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultats de recherche */}
        {searchQuery || selectedProjectId || statusFilter.length > 0 || priorityFilter.length > 0 || issueTypeFilter.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Résultats de Recherche
                </div>
                <Badge variant="outline">
                  {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
                  <p className="text-sm text-muted-foreground">
                    Essayez de modifier vos critères de recherche ou de réduire les filtres
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getIssueTypeIcon(task.issueType)}</span>
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            {task.jiraKey && (
                              <Badge variant="outline" className="font-mono">{task.jiraKey}</Badge>
                            )}
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewTask(task)}
                            title="Voir la tâche"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditTask(task)}
                            title="Modifier la tâche"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePlayTask(task)}
                            title="Actions sur la tâche"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Message d'accueil */
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Commencez votre recherche
              </h3>
              <p className="text-sm text-muted-foreground">
                Utilisez la barre de recherche ci-dessus et les filtres pour trouver vos tâches
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal d'édition de tâche */}
      <TaskEditModal
        task={selectedTask}
        onOpenChange={(task) => {
          if (!task) {
            handleCloseModals();
          }
        }}
        onClose={handleCloseModals}
      />

      {/* Modal de visualisation de tâche */}
      {isViewModalOpen && selectedTask && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-lg">{getIssueTypeIcon(selectedTask.issueType)}</span>
                {selectedTask.title}
                {selectedTask.jiraKey && (
                  <Badge variant="outline" className="font-mono">{selectedTask.jiraKey}</Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedTask.description && (
                <div>
                  <Label className="font-medium">Description</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedTask.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Statut</Label>
                  <Badge className={getStatusColor(selectedTask.status)}>
                    {selectedTask.status}
                  </Badge>
                </div>
                <div>
                  <Label className="font-medium">Priorité</Label>
                  <Badge className={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="font-medium">Type</Label>
                  <span>{selectedTask.issueType}</span>
                </div>
                <div>
                  <Label className="font-medium">Assigné</Label>
                  <span>{selectedTask.assignee || 'Non assigné'}</span>
                </div>
                {selectedTask.storyPoints && (
                  <div>
                    <Label className="font-medium">Story Points</Label>
                    <span>{selectedTask.storyPoints} SP</span>
                  </div>
                )}
                {selectedTask.dueDate && (
                  <div>
                    <Label className="font-medium">Date d'échéance</Label>
                    <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseModals}>
                Fermer
              </Button>
              <Button onClick={() => handleEditTask(selectedTask)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
