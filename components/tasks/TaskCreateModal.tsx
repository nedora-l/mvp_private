"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/contexts/projects-context";
import { useCollaborators } from "@/contexts/collaborators-context";
import { useTasks } from "@/contexts/tasks-context";
import { useProjectConfiguration } from "@/hooks/use-project-configuration";
import { useIntelligentNotifications } from "@/hooks/use-intelligent-notifications";
import { Loader2, Calendar, User, Flag, FileText, AlertCircle, Info } from "lucide-react";

interface TaskCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de création de tâche COMPATIBLE JIRA
 * Design moderne avec formulaire adapté à Jira
 * 
 * @version 2.0.0 - Compatible Jira
 * @author DA Workspace
 */
export function TaskCreateModal({ open, onOpenChange }: TaskCreateModalProps) {
  const { projects } = useProjects();
  const { collaborators } = useCollaborators();
  const { addTask } = useTasks();
  const { showValidationError, showJiraError, showJiraSuccess, showLoading, dismissLoading } = useIntelligentNotifications();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    issueType: "Story", // Type Jira : Story, Bug, Task, Epic
    status: "To Do", // Statuts Jira réels
    priority: "Medium", // Priorités Jira réelles
    assignee: "", // Assignee Jira
    dueDate: "",
    storyPoints: "", // Story points pour Scrum
    labels: "", // Labels Jira
    components: "", // Composants Jira
    epicLink: "", // Lien vers Epic
    sprint: "", // Sprint Jira
    // ✅ NOUVEAU : Champ pour la tâche parent des subtasks
    parentIssueKey: "", // Clé de la tâche parent (pour les subtasks)
  });

  const [loading, setLoading] = useState(false);

  // 🔧 NOUVEAU : Configuration dynamique du projet sélectionné
  const { 
    configuration: projectConfig,
    issueTypes: dynamicIssueTypes,
    statuses: dynamicStatuses,
    priorities: dynamicPriorities,
    components: dynamicComponents,
    labels: dynamicLabels,
    epics: dynamicEpics,
    sprints: dynamicSprints,
    loading: configLoading,
    error: configError
  } = useProjectConfiguration(formData.projectId ? parseInt(formData.projectId) : null);

  // ✅ NOUVEAU : Récupérer les tâches du projet sélectionné pour la sélection parent
  const { tasks: projectTasks } = useTasks();
  
  // 🔧 NOUVEAU : Récupérer la clé Jira du projet sélectionné
  const selectedProject = projects.find(p => p.id === parseInt(formData.projectId || "0"));
  const selectedProjectKey = selectedProject?.jiraKey || selectedProject?.key;
  
  // 🔧 DEBUG : Logs pour diagnostiquer le problème
  console.log("🔍 DEBUG TaskCreateModal:", {
    projectTasksCount: projectTasks.length,
    selectedProjectId: formData.projectId,
    selectedIssueType: formData.issueType,
    projectTasks: projectTasks.slice(0, 3) // Afficher les 3 premières tâches
  });
  
  // ✅ CORRIGÉ : Filtrage intelligent des tâches parent
  const availableParentTasks = projectTasks.filter(task => {
    // 🔧 FIX : Utiliser la clé Jira du projet sélectionné
    const taskProjectKey = task.projectId; // Déjà une clé Jira (ex: "CAP")
    
    const isSameProject = taskProjectKey === selectedProjectKey;
    const isNotSubtask = task.issueType !== "Subtask";
    
    console.log("🔍 DEBUG Task Filter:", {
      taskId: task.id,
      taskProjectKey,
      selectedProjectKey,
      isSameProject,
      taskIssueType: task.issueType,
      isNotSubtask,
      included: isSameProject && isNotSubtask
    });
    
    return isSameProject && isNotSubtask;
  });
  
  console.log("🔍 DEBUG Available Parent Tasks:", {
    count: availableParentTasks.length,
    tasks: availableParentTasks.map(t => ({ id: t.id, title: t.title, jiraKey: t.jiraKey }))
  });

  // Types d'issues Jira - Dynamiques ou par défaut
  const issueTypes = dynamicIssueTypes.length > 0 ? dynamicIssueTypes.map(type => ({
    value: type.name,
    label: `${type.description ? '📖' : '✅'} ${type.name} (${type.description || 'Tâche'})`,
    color: type.name === 'Story' ? 'text-blue-600' : 
           type.name === 'Bug' ? 'text-red-600' : 
           type.name === 'Epic' ? 'text-purple-600' : 'text-green-600'
  })) : [
    { value: "Story", label: "📖 Story (Fonctionnalité)", color: "text-blue-600" },
    { value: "Bug", label: "🐛 Bug (Défaut)", color: "text-red-600" },
    { value: "Task", label: "✅ Task (Tâche)", color: "text-green-600" },
    { value: "Epic", label: "🚀 Epic (Épopée)", color: "text-purple-600" },
    { value: "Subtask", label: "🔧 Subtask (Sous-tâche)", color: "text-gray-600" }
  ];

  // Statuts Jira réels
  const jiraStatuses = [
    { value: "To Do", label: "📋 À faire", color: "text-gray-600" },
    { value: "In Progress", label: "🔄 En cours", color: "text-blue-600" },
    { value: "In Review", label: "👀 En revue", color: "text-yellow-600" },
    { value: "Done", label: "✅ Terminé", color: "text-green-600" },
    { value: "Blocked", label: "🚫 Bloqué", color: "text-red-600" }
  ];

  // Priorités Jira réelles
  const jiraPriorities = [
    { value: "Lowest", label: "🟢 Très faible", color: "text-green-600" },
    { value: "Low", label: "🟢 Faible", color: "text-green-500" },
    { value: "Medium", label: "🟡 Moyenne", color: "text-yellow-600" },
    { value: "High", label: "🟠 Élevée", color: "text-orange-600" },
    { value: "Highest", label: "🔴 Critique", color: "text-red-600" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showValidationError("Titre", "Le titre de la tâche est obligatoire");
      return;
    }

    if (!formData.projectId) {
      showValidationError("Projet", "Veuillez sélectionner un projet");
      return;
    }

    // ✅ NOUVEAU : Validation spécifique pour les subtasks
    if (formData.issueType === "Subtask" && !formData.parentIssueKey) {
      showValidationError("Tâche parent", "Une subtask doit obligatoirement être liée à une tâche principale");
      return;
    }

    setLoading(true);
    showLoading("🔄 Création de la tâche Jira en cours...");

    try {
      // Préparer les données pour Jira
      const taskData = {
        projectId: Number(formData.projectId),
        title: formData.title,
        description: formData.description,
        issueType: formData.issueType,
        status: formData.status,
        priority: formData.priority,
        assignee: formData.assignee || undefined,
        dueDate: formData.dueDate || undefined,
        storyPoints: formData.storyPoints ? Number(formData.storyPoints) : undefined,
        labels: formData.labels ? formData.labels.split(',').map(l => l.trim()) : [],
        components: formData.components ? formData.components.split(',').map(c => c.trim()) : [],
        epicLink: formData.epicLink || undefined,
        sprint: formData.sprint || undefined,
        // ✅ NOUVEAU : Ajouter le parentIssueKey pour les subtasks
        parentIssueKey: formData.issueType === "Subtask" ? formData.parentIssueKey : undefined,
      };

      console.log("🚀 Création de tâche Jira:", taskData);
      
      // ✅ NOUVEAU : Utiliser l'API appropriée selon le type
      if (formData.issueType === "Subtask") {
        // Créer une subtask via l'API des subtasks
        const subtaskData = {
          parentIssueKey: formData.parentIssueKey,
          summary: formData.title,
          description: formData.description,
          assignee: formData.assignee || undefined,
          priority: formData.priority,
          labels: formData.labels ? formData.labels.split(',').map(l => l.trim()) : [],
          components: formData.components ? formData.components.split(',').map(c => c.trim()) : [],
          storyPoints: formData.storyPoints ? Number(formData.storyPoints) : undefined,
          dueDate: formData.dueDate || undefined,
        };

        console.log("🔧 Création de subtask:", subtaskData);
        
        const subtaskResponse = await fetch('/api/v1/jira/subtasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subtaskData),
        });

        if (!subtaskResponse.ok) {
          throw new Error(`Erreur création subtask: ${subtaskResponse.status}`);
        }

        const subtaskResult = await subtaskResponse.json();
        console.log("✅ Subtask créée:", subtaskResult);
      } else {
        // Créer une tâche normale via l'API des tâches
        await addTask(taskData);
      }

      showJiraSuccess({
        message: formData.issueType === "Subtask" 
          ? `Subtask "${formData.title}" créée avec succès et liée à la tâche ${formData.parentIssueKey} !`
          : `Tâche Jira "${formData.title}" créée avec succès !`
      });

      // Reset du formulaire
      setFormData({
        title: "",
        description: "",
        projectId: "",
        issueType: "Story",
        status: "To Do",
        priority: "Medium",
        assignee: "",
        dueDate: "",
        storyPoints: "",
        labels: "",
        components: "",
        epicLink: "",
        sprint: "",
        parentIssueKey: "", // Reset le parentIssueKey
      });

      onOpenChange(false);
    } catch (error) {
      console.error("❌ Erreur lors de la création de la tâche:", error);
      showJiraError({
        message: "Impossible de créer la tâche Jira. Vérifiez la console pour plus de détails.",
        solution: "Vérifiez que tous les champs requis sont remplis et que le projet est valide",
        error: error instanceof Error ? error.message : "Erreur inconnue",
        source: "task-creation"
      });
    } finally {
      setLoading(false);
      dismissLoading();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      projectId: "",
      issueType: "Story",
      status: "To Do",
      priority: "Medium",
      assignee: "",
      dueDate: "",
      storyPoints: "",
      labels: "",
      components: "",
      epicLink: "",
      sprint: "",
      parentIssueKey: "", // Reset le parentIssueKey
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Flag className="h-4 w-4 text-blue-500" />
            </div>
            Nouvelle tâche Jira
            {configLoading && (
              <div className="ml-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            Créez une nouvelle tâche qui sera synchronisée avec Jira.
            {projectConfig && (
              <span className="text-green-600 font-medium">
                {" "}Configuration projet <strong>{projectConfig.projectName}</strong> chargée
              </span>
            )}
            {configError && (
              <span className="text-red-600 font-medium">
                {" "}⚠️ Erreur configuration: {configError}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informations de base */}
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700">
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">Informations de base</span>
            </div>
            
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Titre de la tâche *
              </Label>
              <Input
                id="title"
                placeholder="Ex: Implémenter l'authentification OAuth2"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="border-blue-200 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea
                id="description"
                placeholder="Décrivez en détail ce qui doit être fait, les critères d'acceptation, etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Configuration Jira */}
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Configuration Jira</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Projet */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Projet Jira *
                </Label>
                <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                  <SelectTrigger className="border-green-200 focus:border-green-500">
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{project.key || project.jiraKey || 'N/A'}</Badge>
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type d'issue */}
              <div className="space-y-2">
                <Label>Type d'issue *</Label>
                <Select value={formData.issueType} onValueChange={(value) => setFormData({ ...formData, issueType: value })}>
                  <SelectTrigger className="border-green-200 focus:border-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className={type.color}>{type.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Statut initial */}
              <div className="space-y-2">
                <Label>Statut initial</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="border-green-200 focus:border-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jiraStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <span className={status.color}>{status.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priorité */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Priorité
                </Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="border-green-200 focus:border-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jiraPriorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <span className={priority.color}>{priority.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Assignation et planification */}
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Assignation et planification</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Assigné à */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assigné à
                </Label>
                <Select value={formData.assignee} onValueChange={(value) => setFormData({ ...formData, assignee: value === "none" ? "" : value })}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue placeholder="Non assigné" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Non assigné</SelectItem>
                    {collaborators.map((collaborator) => (
                      <SelectItem key={collaborator.id} value={collaborator.name}>
                        {collaborator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date d'échéance */}
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date d'échéance
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Story Points (pour Scrum) */}
            {formData.issueType === "Story" && (
              <div className="space-y-2">
                <Label htmlFor="storyPoints">Story Points (estimation Scrum)</Label>
                <Select value={formData.storyPoints} onValueChange={(value) => setFormData({ ...formData, storyPoints: value })}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue placeholder="Sélectionner les story points" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 point (très simple)</SelectItem>
                    <SelectItem value="2">2 points (simple)</SelectItem>
                    <SelectItem value="3">3 points (moyen)</SelectItem>
                    <SelectItem value="5">5 points (complexe)</SelectItem>
                    <SelectItem value="8">8 points (très complexe)</SelectItem>
                    <SelectItem value="13">13 points (extrêmement complexe)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Métadonnées Jira */}
          <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 text-orange-700">
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">Métadonnées Jira (optionnel)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Labels */}
              <div className="space-y-2">
                <Label htmlFor="labels">Labels (séparés par des virgules)</Label>
                <Input
                  id="labels"
                  placeholder="Ex: frontend, bug, urgent"
                  value={formData.labels}
                  onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              {/* Composants */}
              <div className="space-y-2">
                <Label htmlFor="components">Composants (séparés par des virgules)</Label>
                <Input
                  id="components"
                  placeholder="Ex: API, UI, Database"
                  value={formData.components}
                  onChange={(e) => setFormData({ ...formData, components: e.target.value })}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Epic Link */}
              <div className="space-y-2">
                <Label htmlFor="epicLink">Lien vers Epic (clé Jira)</Label>
                <Input
                  id="epicLink"
                  placeholder="Ex: PROJ-123"
                  value={formData.epicLink}
                  onChange={(e) => setFormData({ ...formData, epicLink: e.target.value })}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              {/* Sprint */}
              <div className="space-y-2">
                <Label htmlFor="sprint">Sprint</Label>
                <Input
                  id="sprint"
                  placeholder="Ex: Sprint 1"
                  value={formData.sprint}
                  onChange={(e) => setFormData({ ...formData, sprint: e.target.value })}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Champ pour la tâche parent des subtasks */}
          {formData.issueType === "Subtask" && (
            <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-700">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">Tâche parent (obligatoire pour les subtasks)</span>
              </div>
              <Select value={formData.parentIssueKey} onValueChange={(value) => setFormData({ ...formData, parentIssueKey: value })}>
                <SelectTrigger className="border-yellow-200 focus:border-yellow-500">
                  <SelectValue placeholder="Sélectionner une tâche parent" />
                </SelectTrigger>
                <SelectContent>
                  {availableParentTasks.map((task) => (
                    <SelectItem key={task.id} value={task.jiraKey || task.id.toString()}>
                      {task.jiraKey || `TASK-${task.id}`} - {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-yellow-600">
                ⚠️ Une subtask doit obligatoirement être liée à une tâche principale
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "🚀 Créer la tâche Jira"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Composant Badge pour l'affichage des clés de projet
function Badge({ variant, className, children }: { variant?: string, className?: string, children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className || ''}`}>
      {children}
    </span>
  );
}
