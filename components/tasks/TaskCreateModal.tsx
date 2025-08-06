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
import { toast } from "@/components/ui/use-toast";
import { Loader2, Calendar, User, Flag, FileText } from "lucide-react";

interface TaskCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de création de tâche
 * Design moderne avec formulaire complet
 * 
 * @version 1.0.0
 * @author DA Workspace
 */
export function TaskCreateModal({ open, onOpenChange }: TaskCreateModalProps) {
  const { projects } = useProjects();
  const { collaborators } = useCollaborators();
  const { addTask } = useTasks();

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

    setLoading(true);
    
    try {
      await addTask({
        projectId: Number(formData.projectId),
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || undefined,
        dueDate: formData.dueDate || undefined,
      });

      toast({
        title: "✅ Tâche créée",
        description: `La tâche "${formData.title}" a été créée avec succès.`,
      });

      // Reset du formulaire
      setFormData({
        title: "",
        description: "",
        projectId: "",
        status: "À faire",
        priority: "Moyenne",
        assignedTo: "",
        dueDate: "",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de créer la tâche. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      projectId: "",
      status: "À faire",
      priority: "Moyenne",
      assignedTo: "",
      dueDate: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Flag className="h-4 w-4 text-blue-500" />
            </div>
            Nouvelle tâche
          </DialogTitle>
          <DialogDescription>
            Créez une nouvelle tâche pour organiser votre travail.
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
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value === "none" ? "" : value })}>
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
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la tâche"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
