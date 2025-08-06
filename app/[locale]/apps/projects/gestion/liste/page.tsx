"use client";

import React, { useState } from "react";
import { useProjects, ProjectCreate } from "@/contexts/projects-context";
import { CollaboratorsProvider } from "@/contexts/collaborators-context";
import ProjectCreateModal from "@/components/projects/ProjectCreateModal";
import ProjectsTable from "@/components/projects/ProjectsTable";
import CollaboratorsModal from "@/components/projects/CollaboratorsModal";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ArrowLeft, Users } from "lucide-react";

// Interface pour les formulaires de projet (doit correspondre au ProjectCreateModal)
interface ProjectForm {
  name: string;
  type: string;
  customType?: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  members: string;
}

export default function ProjectsListePage() {
  const { projects, loading, addProject } = useProjects();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestion de la création de projet
  const handleCreateProject = async (projectForm: ProjectForm) => {
    try {
      setError(null);
      // Ne pas inclure d'ID - l'API le générera automatiquement
      const newProject: ProjectCreate = {
        ...projectForm,
        // Supprimer l'ID - l'API v0 le génère automatiquement
      };
      
      await addProject(newProject);
      setShowCreateForm(false);
      console.log("✅ Projet créé avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la création:", error);
      setError("Erreur lors de la création du projet");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des projets...</span>
      </div>
    );
  }

  return (
    <CollaboratorsProvider>
      <div className="container mx-auto p-6">
        {/* Navigation */}
        {showCreateForm && (
          <Button 
            variant="ghost" 
            onClick={() => setShowCreateForm(false)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Button>
        )}

        {/* Affichage conditionnel */}
        {showCreateForm ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Créer un nouveau projet</h1>
            
            {/* Affichage des erreurs */}
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <ProjectCreateModal onCreate={handleCreateProject} />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Liste des Projets</h1>
                <p className="text-muted-foreground">
                  Gérez vos projets et collaborateurs
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau projet
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCollaboratorsModal(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Collaborateurs
                </Button>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card text-card-foreground p-4 rounded-lg border">
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-sm text-muted-foreground">Total projets</div>
              </div>
              <div className="bg-card text-card-foreground p-4 rounded-lg border">
                <div className="text-2xl font-bold">{projects.filter(p => p.status === 'en-cours').length}</div>
                <div className="text-sm text-muted-foreground">En cours</div>
              </div>
              <div className="bg-card text-card-foreground p-4 rounded-lg border">
                <div className="text-2xl font-bold">{projects.filter(p => p.status === 'termine').length}</div>
                <div className="text-sm text-muted-foreground">Terminés</div>
              </div>
              <div className="bg-card text-card-foreground p-4 rounded-lg border">
                <div className="text-2xl font-bold">{projects.filter(p => p.status === 'pause').length}</div>
                <div className="text-sm text-muted-foreground">En pause</div>
              </div>
            </div>

            {/* Table des projets */}
            <ProjectsTable />
          </div>
        )}

        {/* Modal de gestion des collaborateurs */}
        <CollaboratorsModal 
          isOpen={showCollaboratorsModal}
          onClose={() => setShowCollaboratorsModal(false)}
        />
      </div>
    </CollaboratorsProvider>
  );
}
