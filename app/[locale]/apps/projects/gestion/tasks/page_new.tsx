"use client";

import React, { useState, useMemo } from "react";
import { useTasks } from "@/contexts/tasks-context";
import { useProjects } from "@/contexts/projects-context";
import { useCollaborators } from "@/contexts/collaborators-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, Calendar, Users, AlertCircle, CheckCircle, Clock, Pause, Edit, Trash2, Eye } from "lucide-react";

// Types pour les filtres
interface TaskFilters {
  search: string;
  projectId: string;
  status: string;
  priority: string;
  assignedTo: string;
}

interface TaskForm {
  title: string;
  description: string;
  projectId: number;
  status: string;
  priority: string;
  assignedTo: string;
  dueDate: string;
}

const TASK_STATUSES = [
  { value: 'a-faire', label: 'À faire', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
  { value: 'en-cours', label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: Clock },
  { value: 'pause', label: 'En pause', color: 'bg-yellow-100 text-yellow-800', icon: Pause },
  { value: 'termine', label: 'Terminé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
];

const TASK_PRIORITIES = [
  { value: 'basse', label: 'Basse', color: 'bg-green-100 text-green-800' },
  { value: 'normale', label: 'Normale', color: 'bg-blue-100 text-blue-800' },
  { value: 'haute', label: 'Haute', color: 'bg-orange-100 text-orange-800' },
  { value: 'critique', label: 'Critique', color: 'bg-red-100 text-red-800' },
];

export default function TasksPage() {
  const { tasks, loading, error, addTask, editTask, deleteTask } = useTasks();
  const { projects } = useProjects();
  const { collaborators } = useCollaborators();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    projectId: '',
    status: '',
    priority: '',
    assignedTo: '',
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<TaskForm>({
    title: '',
    description: '',
    projectId: 0,
    status: 'a-faire',
    priority: 'normale',
    assignedTo: '',
    dueDate: '',
  });

  // Filtrage des tâches avec useMemo pour optimiser
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           task.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesProject = !filters.projectId || task.projectId.toString() === filters.projectId;
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesAssignee = !filters.assignedTo || task.assignedTo.toLowerCase().includes(filters.assignedTo.toLowerCase());
      
      return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [tasks, filters]);

  // Statistiques
  const stats = useMemo(() => ({
    total: tasks.length,
    aToDo: tasks.filter(t => t.status === 'a-faire').length,
    inProgress: tasks.filter(t => t.status === 'en-cours').length,
    completed: tasks.filter(t => t.status === 'termine').length,
    paused: tasks.filter(t => t.status === 'pause').length,
  }), [tasks]);

  // Fonction pour obtenir le projet d'une tâche
  const getTaskProject = (projectId: number) => {
    return projects.find(p => p.id === projectId.toString());
  };

  // Fonction pour obtenir le statut avec style
  const getStatusBadge = (status: string) => {
    const statusConfig = TASK_STATUSES.find(s => s.value === status);
    if (!statusConfig) return { value: status, label: status, color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    return statusConfig;
  };

  // Fonction pour obtenir la priorité avec style
  const getPriorityBadge = (priority: string) => {
    const priorityConfig = TASK_PRIORITIES.find(p => p.value === priority);
    if (!priorityConfig) return { value: priority, label: priority, color: 'bg-gray-100 text-gray-800' };
    return priorityConfig;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      projectId: 0,
      status: 'a-faire',
      priority: 'normale',
      assignedTo: '',
      dueDate: '',
    });
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingTask(null);
  };

  // Handle create task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.projectId) {
      toast({
        title: "Erreur",
        description: "Le titre et le projet sont obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const newTask = await addTask({
        title: formData.title,
        description: formData.description,
        projectId: formData.projectId,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        dueDate: formData.dueDate || undefined,
      });

      if (newTask) {
        toast({
          title: "Tâche créée",
          description: `${formData.title} a été créée avec succès.`,
        });
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit task
  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTask || !formData.title.trim() || !formData.projectId) {
      toast({
        title: "Erreur",
        description: "Le titre et le projet sont obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      await editTask(editingTask.id, {
        title: formData.title,
        description: formData.description,
        projectId: formData.projectId,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        dueDate: formData.dueDate || undefined,
      });

      toast({
        title: "Tâche modifiée",
        description: `${formData.title} a été mise à jour avec succès.`,
      });
      resetForm();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete task
  const handleDeleteTask = async (task: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`)) {
      return;
    }

    try {
      await deleteTask(task.id);
      toast({
        title: "Tâche supprimée",
        description: `${task.title} a été supprimée avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  // Open edit modal
  const openEditModal = (task: any) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate || '',
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des tâches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium">Erreur lors du chargement</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* En-tête avec titre et actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Tâches</h1>
          <p className="text-muted-foreground">
            Organisez et suivez vos tâches par projet • {filteredTasks.length} tâche(s)
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total tâches</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.aToDo}</div>
            <div className="text-sm text-muted-foreground">À faire</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.paused}</div>
            <div className="text-sm text-muted-foreground">En pause</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Terminées</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.projectId} onValueChange={(value) => setFilters({ ...filters, projectId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les projets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les projets</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                {TASK_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes priorités" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes priorités</SelectItem>
                {TASK_PRIORITIES.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Assigné à..."
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tableau des tâches */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des tâches • {filteredTasks.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-4" />
              <p>Aucune tâche trouvée</p>
              <p className="text-sm">Essayez de modifier vos filtres ou créez une nouvelle tâche</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tâche</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Assigné à</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => {
                  const project = getTaskProject(task.projectId);
                  const statusBadge = getStatusBadge(task.status);
                  const priorityBadge = getPriorityBadge(task.priority);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground">
                              {task.description.substring(0, 100)}...
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {project ? (
                          <Badge variant="outline">
                            {project.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusBadge.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityBadge.color}>
                          {priorityBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.assignedTo ? (
                          <div className="text-sm">{task.assignedTo}</div>
                        ) : (
                          <span className="text-muted-foreground">Non assigné</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTask(task)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de création de tâche */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle tâche</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre de la tâche *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Développer l'interface utilisateur"
                  required
                />
              </div>
              <div>
                <Label htmlFor="project">Projet *</Label>
                <Select value={formData.projectId.toString()} onValueChange={(value) => setFormData({...formData, projectId: Number(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Décrivez la tâche en détail..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">Échéance</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="assignedTo">Assigné à</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({...formData, assignedTo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un collaborateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Non assigné</SelectItem>
                  {collaborators.map((collaborator) => (
                    <SelectItem key={collaborator.id} value={`${collaborator.name} (${collaborator.role})`}>
                      {collaborator.name} ({collaborator.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Création..." : "Créer la tâche"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal d'édition de tâche */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTask} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Titre de la tâche *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Développer l'interface utilisateur"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-project">Projet *</Label>
                <Select value={formData.projectId.toString()} onValueChange={(value) => setFormData({...formData, projectId: Number(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Décrivez la tâche en détail..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-priority">Priorité</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-dueDate">Échéance</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-assignedTo">Assigné à</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({...formData, assignedTo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un collaborateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Non assigné</SelectItem>
                  {collaborators.map((collaborator) => (
                    <SelectItem key={collaborator.id} value={`${collaborator.name} (${collaborator.role})`}>
                      {collaborator.name} ({collaborator.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Modification..." : "Modifier la tâche"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
