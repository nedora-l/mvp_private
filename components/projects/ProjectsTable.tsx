import React from "react";
import { useProjects } from "@/contexts/projects-context";
import { useCollaborators } from "@/contexts/collaborators-context";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Eye, Users, Calendar, Save, X } from "lucide-react";

// Interface pour les projets
interface Project {
  id: string;
  name: string;
  type: string;
  customType?: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  members: string;
}

const ROLE_COLORS = {
  "Manager": "bg-purple-100 text-purple-800",
  "Dev Team": "bg-blue-100 text-blue-800", 
  "AI Team": "bg-green-100 text-green-800",
  "RH": "bg-orange-100 text-orange-800",
  "Sécurité": "bg-red-100 text-red-800"
};

export default function ProjectsTable() {
  const { projects, deleteProject, editProject } = useProjects();
  const { collaborators } = useCollaborators();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [showDetails, setShowDetails] = React.useState<string | null>(null);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedMembersEdit, setSelectedMembersEdit] = React.useState<{name: string, role: string}[]>([]);

  const handleDelete = (index: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      deleteProject(index);
    }
  };

  const handleView = (id: string) => {
    setSelectedId(id);
    setShowDetails(showDetails === id ? null : id);
    console.log("👁️ Voir projet:", id);
  };

  const handleEdit = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setEditingProject({ ...project });
      
      // Parse existing members to select them in the edit modal
      const existingMembers: {name: string, role: string}[] = [];
      if (project.members) {
        // Parse format: "Alice Martin (Manager), Bob Dupont (Dev Team)"
        const memberStrings = project.members.split(', ');
        memberStrings.forEach(memberStr => {
          const match = memberStr.match(/^(.+) \((.+)\)$/);
          if (match) {
            const [, name, role] = match;
            existingMembers.push({ name: name.trim(), role: role.trim() });
          }
        });
      }
      setSelectedMembersEdit(existingMembers);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProject) return;
    
    try {
      const index = projects.findIndex(p => p.id === editingProject.id);
      if (index !== -1) {
        await editProject(index, editingProject);
        setIsEditDialogOpen(false);
        setEditingProject(null);
        setSelectedMembersEdit([]);
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };

  const handleEditChange = (field: keyof Project, value: string) => {
    if (editingProject) {
      setEditingProject({ ...editingProject, [field]: value });
    }
  };

  // Gestion de la sélection des collaborateurs dans le modal d'édition
  const handleMemberToggleEdit = (member: {name: string, role: string}) => {
    const isSelected = selectedMembersEdit.some(m => m.name === member.name);
    const newSelectedMembers = isSelected
      ? selectedMembersEdit.filter(m => m.name !== member.name)
      : [...selectedMembersEdit, member];
    
    setSelectedMembersEdit(newSelectedMembers);
    
    if (editingProject) {
      // Format: "Alice Martin (Manager), Bob Dupont (Dev Team)"
      const membersString = newSelectedMembers.map(m => `${m.name} (${m.role})`).join(", ");
      setEditingProject({ ...editingProject, members: membersString });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'en-cours': { label: 'En cours', variant: 'default' as const },
      'termine': { label: 'Terminé', variant: 'success' as const },
      'pause': { label: 'En pause', variant: 'warning' as const },
      'attente': { label: 'En attente', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des Projets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Collaborateurs</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <React.Fragment key={project.id ?? index}>
                <TableRow className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{project.id ?? index + 1}</TableCell>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.type}</TableCell>
                  <TableCell>{getStatusBadge(project.status || 'en-cours')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {project.members ? project.members.split(', ').length : 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {project.startDate && project.endDate ? (
                        <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                      ) : (
                        <span>Non défini</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button variant="ghost" size="icon" aria-label="Voir le projet" onClick={() => handleView(project.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Modifier le projet" onClick={() => handleEdit(project.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Supprimer le projet" className="text-destructive hover:text-destructive" onClick={() => handleDelete(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                
                {/* Détails expandable */}
                {showDetails === project.id && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-muted/20 p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
                          <p className="text-sm">{project.description || "Aucune description"}</p>
                        </div>
                        
                        {project.members && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Collaborateurs</h4>
                            <div className="flex flex-wrap gap-1">
                              {project.members.split(', ').map((memberStr, idx) => {
                                const match = memberStr.match(/^(.+) \((.+)\)$/);
                                if (match) {
                                  const [, name, role] = match;
                                  return (
                                    <Badge key={idx} variant="outline" className={`text-xs ${ROLE_COLORS[role.trim() as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                                      {name.trim()} - {role.trim()}
                                    </Badge>
                                  );
                                }
                                return (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {memberStr.trim()}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-muted-foreground mb-1">Date de début</h4>
                            <p>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "Non définie"}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-muted-foreground mb-1">Date de fin</h4>
                            <p>{project.endDate ? new Date(project.endDate).toLocaleDateString() : "Non définie"}</p>
                          </div>
                        </div>
                        
                        {project.customType && (
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-1">Type personnalisé</h4>
                            <p className="text-sm">{project.customType}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Total de {projects.length} projets.
        </CardDescription>
      </CardFooter>
      
      {/* Modal d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
          </DialogHeader>
          
          {editingProject && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nom du projet</Label>
                <Input
                  id="edit-name"
                  value={editingProject.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select value={editingProject.type} onValueChange={(value) => handleEditChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jira">Jira</SelectItem>
                    <SelectItem value="Slack">Slack</SelectItem>
                    <SelectItem value="Trello">Trello</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {editingProject.type === "Autre" && (
                <div>
                  <Label htmlFor="edit-customType">Type personnalisé</Label>
                  <Input
                    id="edit-customType"
                    value={editingProject.customType || ''}
                    onChange={(e) => handleEditChange('customType', e.target.value)}
                  />
                </div>
              )}
              
              {editingProject.type === "Jira" && (
                <div>
                  <Label htmlFor="edit-boardType">Méthode Agile *</Label>
                  <Select value={editingProject.boardType || ''} onValueChange={(value) => handleEditChange('boardType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir la méthode agile..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scrum">🏃 Scrum (Sprints, Backlog, Review)</SelectItem>
                      <SelectItem value="Kanban">📋 Kanban (Flux continu)</SelectItem>
                      <SelectItem value="XP">⚡ XP (Extreme Programming)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 mt-1">
                    Cette méthode déterminera l'organisation de votre board Jira
                  </p>
                </div>
              )}
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProject.description}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-status">Statut</Label>
                <Select value={editingProject.status} onValueChange={(value) => handleEditChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                    <SelectItem value="pause">En pause</SelectItem>
                    <SelectItem value="attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-startDate">Date de début</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={editingProject.startDate}
                    onChange={(e) => handleEditChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endDate">Date de fin</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={editingProject.endDate}
                    onChange={(e) => handleEditChange('endDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Collaborateurs</Label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 mt-2">
                  {collaborators.map((member) => (
                    <label key={member.name} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedMembersEdit.some(m => m.name === member.name)}
                          onChange={() => handleMemberToggleEdit(member)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-sm">{member.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[member.role as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                        {member.role}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedMembersEdit.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <div className="text-xs font-medium text-blue-700 mb-2">
                      Sélectionnés: {selectedMembersEdit.length} collaborateur(s)
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedMembersEdit.map((member, idx) => (
                        <span key={idx} className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[member.role as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
