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
import { toast } from "@/components/ui/use-toast";
import { Loader2, Calendar, User, Flag, FileText, Edit2, AlertTriangle } from "lucide-react";

interface TaskEditModalProps {
  task: any | null;
  onSave?: (id: number, taskData: any) => Promise<void>;
  onClose?: () => void;
  onOpenChange?: (task: any | null) => void;
}

/**
 * Modal d'édition de tâche
 * Design moderne avec formulaire pré-rempli
 * 
 * @version 1.0.0
 * @author DA Workspace
 */
export function TaskEditModal({ task, onSave, onClose, onOpenChange }: TaskEditModalProps) {
  const { projects } = useProjects();
  const { collaborators } = useCollaborators();
  const { editTask } = useTasks();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    status: "À faire",
    priority: "Moyenne",
    assignedTo: "",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [isJiraTask, setIsJiraTask] = useState(false);
  const [originalProjectId, setOriginalProjectId] = useState("");
  
  // Fonction pour fermer le modal
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(null);
  };

  // Charger les données de la tâche quand le modal s'ouvre
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        projectId: task.projectId?.toString() || "",
        status: task.status || "À faire",
        priority: task.priority || "Moyenne",
        assignedTo: task.assignedTo || "",
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : "",
      });
      setIsJiraTask(!!task.jiraId);
      setOriginalProjectId(task.projectId?.toString() || "");
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "❌ Erreur",
        description: "Le titre de la tâche est obligatoire.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.projectId) {
      toast({
        title: "❌ Erreur", 
        description: "Veuillez sélectionner un projet.",
        variant: "destructive",
      });
      return;
    }

    // Vérification changement de projet pour tâches Jira
    if (isJiraTask && formData.projectId !== originalProjectId) {
      toast({
        title: "⚠️ Limitation Jira",
        description: "Les tâches Jira ne peuvent pas être déplacées vers un autre projet. Cette modification pourrait échouer.",
        variant: "destructive",
      });
    }

    setLoading(true);
    
    try {
      // Utiliser onSave si fourni, sinon editTask directement
      if (onSave) {
        await onSave(task.id, {
          projectId: Number(formData.projectId),
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          assignedTo: formData.assignedTo || undefined,
          dueDate: formData.dueDate || undefined,
        });
      } else {
        await editTask(task.id, {
          projectId: Number(formData.projectId),
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          assignedTo: formData.assignedTo || undefined,
          dueDate: formData.dueDate || undefined,
        });
      }

      toast({
        title: "✅ Tâche modifiée",
        description: `La tâche "${formData.title}" a été modifiée avec succès.`,
      });

      handleClose();
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de modifier la tâche. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={!!task} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Edit2 className="h-4 w-4 text-orange-500" />
            </div>
            Modifier la tâche
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de la tâche "{task.title}".
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Titre de la tâche *
            </Label>
            <Input
              id="title"
              placeholder="Ex: Configurer la base de données"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Détails de la tâche..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Projet */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Projet *
              </Label>
              <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
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

            {/* Statut */}
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="À faire">À faire</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priorité */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Priorité
              </Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Faible">Faible</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Élevée">Élevée</SelectItem>
                  <SelectItem value="Critique">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assigné à */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Assigné à
              </Label>
              <Select value={formData.assignedTo || "none"} onValueChange={(value) => setFormData({ ...formData, assignedTo: value === "none" ? "" : value })}>
                <SelectTrigger>
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
            />
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleClose()}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Modification...
                </>
              ) : (
                "Modifier la tâche"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
