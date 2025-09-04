"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  User, 
  Flag, 
  Tag, 
  Puzzle,
  Star
} from 'lucide-react';
import { useSubtasks, Subtask, SubtaskForm, SubtaskUpdateForm } from '@/contexts/subtasks-context';
import { useIntelligentNotifications } from '@/hooks/use-intelligent-notifications';

interface SubtaskModalProps {
  parentIssueKey: string;
  parentIssueSummary: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SubtaskModal: React.FC<SubtaskModalProps> = ({
  parentIssueKey,
  parentIssueSummary,
  isOpen,
  onClose
}) => {
  const { 
    subtasks, 
    loading, 
    error, 
    fetchSubtasks, 
    createSubtask, 
    updateSubtask, 
    deleteSubtask,
    getSubtasksByParent,
    clearError 
  } = useSubtasks();

  const { showJiraError, showJiraSuccess, showInfo } = useIntelligentNotifications();

  // États locaux
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);
  const [formData, setFormData] = useState<SubtaskForm>({
    parentIssueKey,
    summary: '',
    description: '',
    assignee: '',
    priority: '',
    labels: [],
    components: [],
    storyPoints: undefined,
    dueDate: ''
  });

  // Récupération des subtasks au montage et à l'ouverture
  useEffect(() => {
    if (isOpen && parentIssueKey) {
      fetchSubtasks(parentIssueKey);
    }
  }, [isOpen, parentIssueKey, fetchSubtasks]);

  // Nettoyage des erreurs
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Gestion de la fermeture
  const handleClose = () => {
    setIsCreateMode(false);
    setEditingSubtask(null);
    setFormData({
      parentIssueKey,
      summary: '',
      description: '',
      assignee: '',
      priority: '',
      labels: [],
      components: [],
      storyPoints: undefined,
      dueDate: ''
    });
    onClose();
  };

  // Gestion de la création
  const handleCreate = () => {
    setIsCreateMode(true);
    setEditingSubtask(null);
    setFormData({
      parentIssueKey,
      summary: '',
      description: '',
      assignee: '',
      priority: '',
      labels: [],
      components: [],
      storyPoints: undefined,
      dueDate: ''
    });
  };

  // Gestion de l'édition
  const handleEdit = (subtask: Subtask) => {
    setEditingSubtask(subtask);
    setIsCreateMode(false);
    setFormData({
      parentIssueKey,
      summary: subtask.summary,
      description: subtask.description || '',
      assignee: subtask.assignee?.id || '',
      priority: subtask.priority?.id || '',
      labels: subtask.labels || [],
      components: subtask.components || [],
      storyPoints: subtask.storyPoints,
      dueDate: subtask.dueDate || ''
    });
  };

  // Gestion de la suppression
  const handleDelete = async (subtask: Subtask) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la subtask "${subtask.summary}" ?`)) {
      const success = await deleteSubtask(subtask.key);
      if (success) {
        showJiraSuccess({
          message: `Subtask "${subtask.summary}" supprimée avec succès`
        });
      }
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.summary.trim()) {
      showJiraError({
        message: "Le résumé est obligatoire",
        solution: "Veuillez saisir un résumé pour la subtask",
        error: "Champ requis manquant",
        source: 'subtask-validation-error'
      });
      return;
    }

    try {
      if (isCreateMode) {
        const newSubtask = await createSubtask(formData);
        if (newSubtask) {
          setIsCreateMode(false);
          setFormData({
            parentIssueKey,
            summary: '',
            description: '',
            assignee: '',
            priority: '',
            labels: [],
            components: [],
            storyPoints: undefined,
            dueDate: ''
          });
        }
      } else if (editingSubtask) {
        const updateData: SubtaskUpdateForm = {
          issueKey: editingSubtask.key,
          summary: formData.summary,
          description: formData.description,
          assignee: formData.assignee,
          priority: formData.priority,
          labels: formData.labels,
          components: formData.components,
          storyPoints: formData.storyPoints,
          dueDate: formData.dueDate
        };
        
        const updatedSubtask = await updateSubtask(updateData);
        if (updatedSubtask) {
          setEditingSubtask(null);
          setFormData({
            parentIssueKey,
            summary: '',
            description: '',
            assignee: '',
            priority: '',
            labels: [],
            components: [],
            storyPoints: undefined,
            dueDate: ''
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  // Gestion des labels
  const handleLabelChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newLabel = e.currentTarget.value.trim();
      const currentLabels = formData.labels || [];
      if (!currentLabels.includes(newLabel)) {
        setFormData(prev => ({
          ...prev,
          labels: [...(prev.labels || []), newLabel]
        }));
      }
      e.currentTarget.value = '';
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      labels: (prev.labels || []).filter(label => label !== labelToRemove)
    }));
  };

  // Récupération des subtasks de la tâche parent
  const parentSubtasks = getSubtasksByParent(parentIssueKey);
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            Subtasks - {parentIssueSummary}
            <Badge variant="outline" className="ml-2">
              {parentSubtasks.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bouton de création */}
          <div className="flex justify-between items-center">
            <Button 
              onClick={handleCreate}
              disabled={isCreateMode || !!editingSubtask}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une subtask
            </Button>
            
            {isCreateMode && (
              <Button 
                variant="outline" 
                onClick={() => setIsCreateMode(false)}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
            )}
          </div>

          {/* Formulaire de création/édition */}
          {(isCreateMode || editingSubtask) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isCreateMode ? 'Nouvelle subtask' : 'Modifier la subtask'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Résumé */}
                    <div className="md:col-span-2">
                      <Label htmlFor="summary">Résumé *</Label>
                      <Input
                        id="summary"
                        value={formData.summary}
                        onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Résumé de la subtask"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description détaillée de la subtask"
                        rows={3}
                      />
                    </div>

                    {/* Assigné */}
                    <div>
                      <Label htmlFor="assignee">Assigné</Label>
                      <Input
                        id="assignee"
                        value={formData.assignee}
                        onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                        placeholder="ID de l'utilisateur"
                      />
                    </div>

                    {/* Priorité */}
                    <div>
                      <Label htmlFor="priority">Priorité</Label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une priorité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Highest</SelectItem>
                          <SelectItem value="2">High</SelectItem>
                          <SelectItem value="3">Medium</SelectItem>
                          <SelectItem value="4">Low</SelectItem>
                          <SelectItem value="5">Lowest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Story Points */}
                    <div>
                      <Label htmlFor="storyPoints">Story Points</Label>
                      <Input
                        id="storyPoints"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.storyPoints || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          storyPoints: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        placeholder="Points d'histoire"
                      />
                    </div>

                    {/* Date d'échéance */}
                    <div>
                      <Label htmlFor="dueDate">Date d'échéance</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Labels */}
                  <div>
                    <Label htmlFor="labels">Labels</Label>
                    <Input
                      id="labels"
                      placeholder="Appuyez sur Entrée pour ajouter un label"
                      onKeyDown={handleLabelChange}
                    />
                    {formData.labels && formData.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.labels.map((label, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {label}
                            <button
                              type="button"
                              onClick={() => removeLabel(label)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex justify-end gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {isCreateMode ? 'Création...' : 'Modification...'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          {isCreateMode ? 'Créer' : 'Modifier'}
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Liste des subtasks */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Puzzle className="h-5 w-5" />
              Subtasks existantes
            </h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : parentSubtasks.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Puzzle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune subtask pour cette tâche</p>
                  <p className="text-sm">Cliquez sur "Ajouter une subtask" pour commencer</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {parentSubtasks.map((subtask) => (
                  <Card key={subtask.key} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          {/* En-tête */}
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {subtask.key}
                            </Badge>
                            <Badge 
                              variant={subtask.status.name === 'Done' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {subtask.status.name}
                            </Badge>
                            {subtask.priority && (
                              <Badge variant="outline" className="text-xs">
                                <Flag className="h-3 w-3 mr-1" />
                                {subtask.priority.name}
                              </Badge>
                            )}
                          </div>

                          {/* Résumé */}
                          <h4 className="font-medium">{subtask.summary}</h4>

                          {/* Description */}
                          {subtask.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {subtask.description}
                            </p>
                          )}

                          {/* Métadonnées */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            {subtask.assignee && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {subtask.assignee.name || subtask.assignee.id}
                              </div>
                            )}
                            
                            {subtask.storyPoints && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {subtask.storyPoints} SP
                              </div>
                            )}
                            
                            {subtask.dueDate && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(subtask.dueDate).toLocaleDateString('fr-FR')}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(subtask.created).toLocaleDateString('fr-FR')}
                            </div>
                          </div>

                          {/* Labels */}
                          {subtask.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {subtask.labels.map((label, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(subtask)}
                            disabled={isCreateMode || !!editingSubtask}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(subtask)}
                            disabled={isCreateMode || !!editingSubtask || loading}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

