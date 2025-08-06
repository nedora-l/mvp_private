"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useProjects } from "@/contexts/projects-context";
import { useSprints } from "@/contexts/sprints-context";
import { useTasks } from "@/contexts/tasks-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Play, 
  Square,
  Calendar,
  Target,
  Clock,
  TrendingUp,
  Users,
  Zap,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";

export default function SprintPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const { sprints, loading: sprintsLoading, fetchSprints, addSprint, editSprint, deleteSprint, startSprint, completeSprint, getActiveSprint } = useSprints();
  const { tasks, fetchTasks } = useTasks();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSprint, setEditingSprint] = useState<any>(null);
  const [sprintForm, setSprintForm] = useState({
    name: "",
    goal: "",
    startDate: "",
    endDate: ""
  });

  // Filtrer les projets Jira uniquement (les seuls qui supportent les sprints)
  const jiraProjects = useMemo(() => {
    return projects.filter(p => p.type === "Jira");
  }, [projects]);

  // Projet sélectionné
  const selectedProject = useMemo(() => {
    return jiraProjects.find(p => p.id === selectedProjectId);
  }, [jiraProjects, selectedProjectId]);

  // Sprint actif
  const activeSprint = useMemo(() => {
    return getActiveSprint();
  }, [getActiveSprint, sprints]);

  // Tâches du projet sélectionné
  const projectTasks = useMemo(() => {
    if (!selectedProjectId) return [];
    return tasks.filter(task => task.projectId === parseInt(selectedProjectId));
  }, [tasks, selectedProjectId]);

  // Charger les sprints quand le projet change
  useEffect(() => {
    if (selectedProjectId && selectedProject?.jiraId) {
      fetchSprints(selectedProject.jiraId);
      fetchTasks();
    }
  }, [selectedProjectId, selectedProject?.jiraId]); // Suppression de fetchSprints et fetchTasks des dépendances

  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sprintForm.name.trim()) {
      toast.error("Le nom du sprint est requis");
      return;
    }

    if (!selectedProject?.jiraId) {
      toast.error("Projet Jira requis pour créer un sprint");
      return;
    }

    try {
      await addSprint({
        name: sprintForm.name,
        goal: sprintForm.goal,
        startDate: sprintForm.startDate,
        endDate: sprintForm.endDate,
        boardId: parseInt(selectedProject.jiraId)
      });
      
      setShowCreateModal(false);
      setSprintForm({ name: "", goal: "", startDate: "", endDate: "" });
      toast.success("Sprint créé avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la création du sprint");
    }
  };

  const handleStartSprint = async (sprintId: number) => {
    try {
      await startSprint(sprintId);
      toast.success("Sprint démarré !");
    } catch (error) {
      toast.error("Erreur lors du démarrage du sprint");
    }
  };

  const handleCompleteSprint = async (sprintId: number) => {
    try {
      await completeSprint(sprintId);
      toast.success("Sprint terminé !");
    } catch (error) {
      toast.error("Erreur lors de la finalisation du sprint");
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "active": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      case "future": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "active": return <Play className="h-4 w-4" />;
      case "closed": return <CheckCircle className="h-4 w-4" />;
      case "future": return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Sprints</h1>
            <p className="text-sm text-muted-foreground">
              Planifiez et suivez vos sprints Jira avec story points et vélocité
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Jira Agile
            </Badge>
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
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
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
                          {project.boardType && (
                            <Badge className="text-xs">{project.boardType}</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                onClick={() => selectedProjectId && fetchSprints(selectedProject?.jiraId || "")}
                disabled={!selectedProjectId || sprintsLoading}
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${sprintsLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
            
            {jiraProjects.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Aucun projet Jira trouvé</p>
                <p className="text-xs">Seuls les projets Jira supportent les sprints</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sprint actif */}
        {activeSprint && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-green-600" />
                  Sprint Actif: {activeSprint.name}
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {activeSprint.velocity}% de vélocité
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{activeSprint.goal}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    Période
                  </div>
                  <p className="font-mono text-sm">
                    {activeSprint.startDate} → {activeSprint.endDate}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    Story Points
                  </div>
                  <p className="text-lg font-bold">
                    {activeSprint.completedPoints}/{activeSprint.storyPoints}
                  </p>
                  <Progress value={activeSprint.velocity} className="h-2" />
                </div>
                
                <div className="flex items-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompleteSprint(activeSprint.id)}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Terminer Sprint
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des sprints */}
        {selectedProject && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Sprints - {selectedProject.name}
              </h2>
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Sprint
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau sprint</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateSprint} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom du Sprint *</Label>
                      <Input
                        id="name"
                        value={sprintForm.name}
                        onChange={(e) => setSprintForm({...sprintForm, name: e.target.value})}
                        placeholder="Ex: Sprint 3"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="goal">Objectif du Sprint</Label>
                      <Textarea
                        id="goal"
                        value={sprintForm.goal}
                        onChange={(e) => setSprintForm({...sprintForm, goal: e.target.value})}
                        placeholder="Que souhaitez-vous accomplir dans ce sprint ?"
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={sprintForm.startDate}
                          onChange={(e) => setSprintForm({...sprintForm, startDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={sprintForm.endDate}
                          onChange={(e) => setSprintForm({...sprintForm, endDate: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={sprintsLoading}>
                        {sprintsLoading ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                        Créer Sprint
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Grille des sprints */}
            {sprintsLoading ? (
              <div className="flex justify-center py-8">
                <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sprints.map((sprint) => (
                  <Card key={sprint.id} className={sprint.state === 'active' ? 'ring-2 ring-green-500' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{sprint.name}</CardTitle>
                        <Badge className={getStateColor(sprint.state)}>
                          {getStateIcon(sprint.state)}
                          <span className="ml-1 capitalize">{sprint.state}</span>
                        </Badge>
                      </div>
                      {sprint.goal && (
                        <p className="text-sm text-muted-foreground">{sprint.goal}</p>
                      )}
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Dates */}
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {sprint.startDate} → {sprint.endDate}
                        </div>
                        {sprint.completeDate && (
                          <div className="mt-1">Terminé le {sprint.completeDate}</div>
                        )}
                      </div>
                      
                      {/* Story Points */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Story Points</span>
                          <span className="font-mono">
                            {sprint.completedPoints}/{sprint.storyPoints}
                          </span>
                        </div>
                        <Progress 
                          value={sprint.storyPoints > 0 ? (sprint.completedPoints / sprint.storyPoints) * 100 : 0} 
                          className="h-2" 
                        />
                        {sprint.velocity !== undefined && (
                          <div className="text-xs text-right text-muted-foreground">
                            Vélocité: {sprint.velocity}%
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        {sprint.state === 'future' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartSprint(sprint.id)}
                            className="flex-1"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Démarrer
                          </Button>
                        )}
                        
                        {sprint.state === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompleteSprint(sprint.id)}
                            className="flex-1"
                          >
                            <Square className="h-3 w-3 mr-1" />
                            Terminer
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingSprint(sprint)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteSprint(sprint.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {sprints.length === 0 && !sprintsLoading && selectedProject && (
              <Card>
                <CardContent className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Aucun sprint trouvé</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Créez votre premier sprint pour commencer à organiser votre travail
                  </p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le premier sprint
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Message si aucun projet sélectionné */}
        {!selectedProject && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Sélectionnez un projet Jira
              </h3>
              <p className="text-sm text-muted-foreground">
                Choisissez un projet ci-dessus pour voir et gérer ses sprints
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
