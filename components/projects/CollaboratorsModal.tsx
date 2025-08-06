import React, { useState, useMemo } from 'react';
import { useCollaborators, type Collaborator, type CollaboratorForm } from '@/contexts/collaborators-context';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Plus, Edit, Trash2, Users, Save, X, Loader2, Search, AlertTriangle } from 'lucide-react';

const AVAILABLE_ROLES = ['Manager', 'Dev Team', 'AI Team', 'RH', 'Sécurité'];
const AVAILABLE_DEPARTMENTS = ['Direction', 'IT', 'RH', 'Marketing', 'Sécurité'];

const ROLE_COLORS = {
  'Manager': 'bg-purple-100 text-purple-800',
  'Dev Team': 'bg-blue-100 text-blue-800', 
  'AI Team': 'bg-green-100 text-green-800',
  'RH': 'bg-orange-100 text-orange-800',
  'Sécurité': 'bg-red-100 text-red-800'
};

interface CollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCollaboratorCreated?: (collaborator: Collaborator) => void;
}

export default function CollaboratorsModal({ isOpen, onClose, onCollaboratorCreated }: CollaboratorsModalProps) {
  const { collaborators, loading, addCollaborator, editCollaborator, deleteCollaborator } = useCollaborators();
  // Toast via sonner (imported above)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formData, setFormData] = useState<CollaboratorForm>({
    name: '',
    role: 'Dev Team',
    email: '',
    department: 'IT'
  });
  const [formError, setFormError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Filtrer les collaborateurs selon la recherche (avec sécurité)
  const filteredCollaborators = useMemo(() => {
    // Sécurité : s'assurer que collaborators est un array
    const safeCollaborators = Array.isArray(collaborators) ? collaborators : [];
    
    if (!searchQuery.trim()) return safeCollaborators;
    
    const query = searchQuery.toLowerCase();
    return safeCollaborators.filter(collaborator => 
      collaborator.name.toLowerCase().includes(query) ||
      collaborator.role.toLowerCase().includes(query) ||
      collaborator.email.toLowerCase().includes(query) ||
      collaborator.department.toLowerCase().includes(query)
    );
  }, [collaborators, searchQuery]);

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'Dev Team',
      email: '',
      department: 'IT'
    });
    setFormError('');
    setShowCreateForm(false);
    setEditingCollaborator(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Le nom et l\'email sont obligatoires');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      
      if (editingCollaborator) {
        await editCollaborator(editingCollaborator.id, formData);
        toast({
          title: "Collaborateur modifié",
          description: `${formData.name} a été mis à jour avec succès.`,
        });
      } else {
        const newCollaborator = await addCollaborator(formData);
        toast({
          title: "Collaborateur ajouté",
          description: `${formData.name} a été ajouté avec succès.`,
        });
        // Notifier le parent qu'un nouveau collaborateur a été créé
        if (onCollaboratorCreated && newCollaborator) {
          onCollaboratorCreated(newCollaborator);
        }
      }
      
      resetForm();
    } catch (error) {
      setFormError('Erreur lors de la sauvegarde');
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (collaborator: Collaborator) => {
    setEditingCollaborator(collaborator);
    setFormData({
      name: collaborator.name,
      role: collaborator.role,
      email: collaborator.email,
      department: collaborator.department
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
      try {
        await deleteCollaborator(id);
        toast({
          title: "Collaborateur supprimé",
          description: `${name} a été supprimé avec succès.`,
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Collaborateurs
          </DialogTitle>
        </DialogHeader>

        {showCreateForm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {editingCollaborator ? 'Modifier le collaborateur' : 'Ajouter un collaborateur'}
              </h3>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>

            {/* Avertissement pour la synchronisation Jira */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Synchronisation Jira</p>
                  <p className="text-amber-700 mt-1">
                    Les collaborateurs créés ici sont stockés localement dans DA Workspace. 
                    Ils ne seront pas automatiquement ajoutés à Jira. Pour ajouter des utilisateurs à Jira, 
                    utilisez l'interface d'administration Jira directement.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Alice Martin"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Ex: alice.martin@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Département</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_DEPARTMENTS.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formError && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {formError}
                </div>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {editingCollaborator ? 'Modifier' : 'Ajouter'}
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Liste des collaborateurs</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredCollaborators.length} collaborateur(s) trouvé(s) sur {collaborators.length}
                </p>
              </div>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par nom, rôle, email ou département..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Chargement...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>                {!Array.isArray(filteredCollaborators) || filteredCollaborators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {loading ? 'Chargement des collaborateurs...' : 
                       searchQuery ? 'Aucun collaborateur trouvé pour cette recherche' : 
                       'Aucun collaborateur disponible'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCollaborators.map((collaborator) => (
                      <TableRow key={collaborator.id}>
                        <TableCell className="font-medium">{collaborator.name}</TableCell>
                        <TableCell>{collaborator.email}</TableCell>
                        <TableCell>
                          <Badge className={ROLE_COLORS[collaborator.role as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800'}>
                            {collaborator.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{collaborator.department}</TableCell>
                        <TableCell className="text-center space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(collaborator)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(collaborator.id, collaborator.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
