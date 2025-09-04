"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/contexts/projects-context";
import { useCollaborators } from "@/contexts/collaborators-context";
import { useTasks } from "@/contexts/tasks-context";
import { useSubtasks } from "@/contexts/subtasks-context";
import { toast } from "sonner";
import { Loader2, Calendar, User, Flag, FileText, Edit2, AlertTriangle, Info, AlertCircle, Puzzle } from "lucide-react";
import { SubtaskModal } from "@/components/subtasks/SubtaskModal";

interface TaskEditModalProps {
  task: any | null;
  onSave?: (id: number, taskData: any) => Promise<void>;
  onClose?: () => void;
  onOpenChange?: (task: any | null) => void;
}

/**
 * Modal d'édition de tâche COMPATIBLE JIRA
 * Design moderne avec formulaire adapté à Jira
 * 
 * @version 2.0.0 - Compatible Jira
 * @author DA Workspace
 */
export function TaskEditModal({ task, onSave, onClose, onOpenChange }: TaskEditModalProps) {
  const { projects } = useProjects();
  const { collaborators } = useCollaborators();
  const { editTask } = useTasks();
  const { getSubtasksByParent } = useSubtasks();

  const [formData, setFormData] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [isJiraTask, setIsJiraTask] = useState(false);
  const [originalProjectId, setOriginalProjectId] = useState("");
  const [isSubtasksModalOpen, setIsSubtasksModalOpen] = useState(false);
  
  // Types d'issues Jira
  const issueTypes = [
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
  
  // Fonction pour fermer le modal
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(null);
  };

  // Fonction pour sauvegarder la tâche
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }

    setLoading(true);
    
    try {
      // Préparer les données pour l'API
      const taskData = {
        title: formData.title,
        description: formData.description,
        projectId: parseInt(formData.projectId),
        issueType: formData.issueType,
        status: formData.status,
        priority: formData.priority,
        assignee: formData.assignee || null,
        dueDate: formData.dueDate || null,
        storyPoints: formData.storyPoints ? parseInt(formData.storyPoints) : null,
        labels: formData.labels ? formData.labels.split(',').map(l => l.trim()) : [],
        components: formData.components ? formData.components.split(',').map(c => c.trim()) : [],
        epicLink: formData.epicLink || null,
        sprint: formData.sprint || null
      };

      // Appeler l'API d'édition
      await editTask(task.id, taskData);
      
      toast.success("Tâche modifiée avec succès !");
      
      // Fermer le modal
      handleClose();
      
      // Actualiser la liste des tâches
      if (onSave) {
        await onSave(task.id, taskData);
      }
      
    } catch (error) {
      console.error("❌ Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification de la tâche");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données de la tâche quand le modal s'ouvre
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        projectId: task.projectId?.toString() || "",
        issueType: task.issueType || "Story",
        status: task.status || "To Do",
        priority: task.priority || "Medium",
        assignee: task.assignee || task.assignedTo || "",
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : "",
        storyPoints: task.storyPoints?.toString() || "",
        labels: Array.isArray(task.labels) ? task.labels.join(', ') : task.labels || "",
        components: Array.isArray(task.components) ? task.components.join(', ') : task.components || "",
        epicLink: task.epicLink || "",
        sprint: task.sprint || "",
      });
      setIsJiraTask(!!task.jiraKey || !!task.jiraId);
      setOriginalProjectId(task.projectId?.toString() || "");
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("❌ Le titre de la tâche est obligatoire");
      return;
    }

    if (!formData.projectId) {
      toast.error("❌ Veuillez sélectionner un projet");
      return;
    }

    // Vérification changement de projet pour tâches Jira
    if (isJiraTask && formData.projectId !== originalProjectId) {
      toast.warning("⚠️ Les tâches Jira ne peuvent pas être déplacées vers un autre projet");
    }

    setLoading(true);
    
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
      };

      console.log("🔄 Modification de tâche Jira:", taskData);

      // Utiliser onSave si fourni, sinon editTask directement
      if (onSave) {
        await onSave(task.id, taskData);
      } else {
        await editTask(task.id, taskData);
      }

      toast.success(`✅ Tâche Jira "${formData.title}" modifiée avec succès`);

      handleClose();
    } catch (error) {
      console.error("❌ Erreur lors de la modification:", error);
      toast.error("❌ Impossible de modifier la tâche Jira. Vérifiez la console pour plus de détails.");
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={!!task} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Edit2 className="h-4 w-4 text-orange-500" />
            </div>
            Modifier la tâche Jira
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de la tâche "{task.title}".
            {isJiraTask && (
              <span className="block mt-2 text-amber-600 bg-amber-50 p-2 rounded text-sm">
                🔗 Cette tâche est synchronisée avec Jira
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
                          <Badge variant="outline" className="text-xs">{project.key}</Badge>
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isJiraTask && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Tâche Jira - Le changement de projet peut échouer</span>
                  </div>
                )}
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
              {/* Statut */}
              <div className="space-y-2">
                <Label>Statut</Label>
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

          {/* Gestion des Subtasks - UNIQUEMENT pour les tâches principales */}
          {formData.issueType && formData.issueType !== "Subtask" && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700">
                  <Puzzle className="h-4 w-4" />
                  <span className="text-sm font-medium">Gestion des Subtasks</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSubtasksModalOpen(true)}
                  className="border-blue-300 hover:bg-blue-100"
                >
                  <Puzzle className="h-4 w-4 mr-2" />
                  Gérer les subtasks
                  {task?.jiraKey && (
                    <Badge variant="outline" className="ml-2">
                      {task.subtasksCount || getSubtasksByParent(task.jiraKey).length}
                    </Badge>
                  )}
                </Button>
              </div>
              <p className="text-xs text-blue-600">
                Créez et gérez les sous-tâches de cette tâche principale
              </p>
            </div>
          )}

          {/* Indicateur pour les subtasks */}
          {formData.issueType === "Subtask" && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <Puzzle className="h-4 w-4" />
                <span className="text-sm font-medium">Cette tâche est une subtask</span>
              </div>
              <p className="text-xs text-gray-600">
                ⚠️ Les subtasks ne peuvent pas avoir de sous-tâches. Utilisez ce modal pour modifier les informations de la subtask.
              </p>
            </div>
          )}

          {/* 🔧 NOUVEAU : Gestion des cas où issueType est undefined */}
          {!formData.issueType && (
            <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Type d'issue non défini</span>
              </div>
              <p className="text-xs text-yellow-600">
                ⚠️ Le type de cette tâche n'a pas pu être déterminé. Veuillez sélectionner un type d'issue approprié.
              </p>
              <div className="text-xs text-yellow-600">
                <strong>Type actuel :</strong> {task?.issueType || 'Non défini'}
              </div>
            </div>
          )}

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

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Modification en cours...
                </>
              ) : (
                "🔄 Modifier la tâche Jira"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Modal des Subtasks */}
      {task?.jiraKey && (
        <SubtaskModal
          parentIssueKey={task.jiraKey}
          parentIssueSummary={task.title || task.summary || 'Tâche'}
          isOpen={isSubtasksModalOpen}
          onClose={() => setIsSubtasksModalOpen(false)}
        />
      )}
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
