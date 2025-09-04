import React, { createContext, useContext, useState, useEffect } from 'react';

// Interface pour les collaborateurs
interface Collaborator {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  active: boolean;
  dateAdded: string;
}

// Interface pour les formulaires
interface CollaboratorForm {
  name: string;
  role: string;
  email: string;
  department: string;
}

interface CollaboratorsContextType {
  collaborators: Collaborator[];
  loading: boolean;
  error: string | null;
  addCollaborator: (collaborator: CollaboratorForm) => Promise<Collaborator | null>;
  editCollaborator: (id: string, collaborator: CollaboratorForm) => Promise<void>;
  deleteCollaborator: (id: string) => Promise<void>;
  fetchCollaborators: () => Promise<void>;
}

const CollaboratorsContext = createContext<CollaboratorsContextType | undefined>(undefined);

export function CollaboratorsProvider({ children }: { children: React.ReactNode }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les collaborateurs (UNIQUEMENT Jira v1 - migré de MCP)
  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 [v1] Récupération collaborateurs depuis Jira...");
      
      // ✅ UNIQUEMENT v1 Jira - Plus de fallback MCP
      const response = await fetch('/api/v1/jira/collaborators');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const v1Data = await response.json();
      
      if (v1Data.status === 200 && v1Data.data?._embedded?.collaborators) {
        // Conversion du format v1 vers l'interface Collaborator existante
        const convertedCollaborators = v1Data.data._embedded.collaborators.map((collaborator: any) => ({
          id: collaborator.id,
          name: collaborator.name,
          role: collaborator.role,
          email: collaborator.email,
          department: collaborator.department,
          active: collaborator.active,
          dateAdded: collaborator.dateAdded
        }));
        
        setCollaborators(convertedCollaborators);
        console.log(`✅ [v1] ${convertedCollaborators.length} collaborateurs chargés depuis Jira via v1 API`);
        console.log(`📊 [v1] Total: ${v1Data.data.page.totalElements} collaborateurs`);
      } else {
        setCollaborators([]); // ✅ Array vide si erreur - Plus de fallback
        console.warn('⚠️ [v1] Aucun collaborateur retourné par l\'API v1');
      }
    } catch (error) {
      console.error('❌ [v1] Erreur fetch collaborateurs:', error);
      setError(error instanceof Error ? error.message : 'Erreur de connexion Jira');
      setCollaborators([]); // ✅ Array vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un collaborateur (invitation Jira v1 - migré de MCP)
  const addCollaborator = async (collaboratorData: CollaboratorForm): Promise<Collaborator | null> => {
    try {
      setError(null);
      console.log("🔄 [v1] Invitation collaborateur via Jira...");
      
      // ✅ UNIQUEMENT v1 Jira - POST pour inviter
      const response = await fetch('/api/v1/jira/collaborators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: collaboratorData.email,
          name: collaboratorData.name,
          role: collaboratorData.role,
          department: collaboratorData.department
        }),
      });

      const v1Result = await response.json();
      
      if (!response.ok || v1Result.status !== 201) {
        // Gérer les limitations Jira de manière informative
        if (response.status === 422 && v1Result.jiraLimitation) {
          console.log('ℹ️ [v1] Limitation Jira détectée:', v1Result.message);
          setError(`${v1Result.message}\n\nProcessus manuel requis :\n${v1Result.instructions?.steps?.join('\n') || ''}`);
          // Retourner un objet informatif au lieu de null
          return {
            error: v1Result.message,
            instructions: v1Result.instructions,
            needsManualProcess: true
          } as any;
        }
        
        throw new Error(v1Result.message || `Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      if (v1Result.status === 201 && v1Result.data) {
        // Conversion du format v1 vers l'interface Collaborator
        const newCollaborator: Collaborator = {
          id: v1Result.data.id,
          name: v1Result.data.name,
          role: v1Result.data.role,
          email: v1Result.data.email,
          department: v1Result.data.department,
          active: v1Result.data.active,
          dateAdded: v1Result.data.dateAdded
        };
        
        // Refresh la liste après ajout
        await fetchCollaborators();
        console.log('✅ [v1] Collaborateur invité avec succès via v1 API:', newCollaborator);
        return newCollaborator;
      } else {
        throw new Error(v1Result.message || 'Erreur lors de l\'invitation');
      }
    } catch (error) {
      console.error('❌ [v1] Erreur invitation collaborateur:', error);
      setError(error instanceof Error ? error.message : 'Erreur d\'invitation');
      return null;
    }
  };

  // Modifier un collaborateur (rôle/assignation Jira v1 - migré de MCP)
  const editCollaborator = async (id: string, collaboratorData: CollaboratorForm) => {
    try {
      setError(null);
      console.log("🔄 [v1] Modification collaborateur via Jira...");
      
      // ✅ UNIQUEMENT v1 Jira - PUT pour assigner rôles
      const response = await fetch('/api/v1/jira/collaborators', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...collaboratorData
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const v1Result = await response.json();
      
      if (v1Result.status === 200) {
        // Refresh la liste après modification
        await fetchCollaborators();
        console.log('✅ [v1] Collaborateur modifié avec succès via v1 API');
      } else {
        throw new Error(v1Result.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('❌ [v1] Erreur modification collaborateur:', error);
      setError(error instanceof Error ? error.message : 'Erreur de modification');
      throw error;
    }
  };

  // Supprimer un collaborateur (retirer de projet/org Jira v1 - migré de MCP)
  const deleteCollaborator = async (id: string) => {
    try {
      setError(null);
      console.log("🔄 [v1] Suppression collaborateur via Jira...");
      
      // ✅ UNIQUEMENT v1 Jira - DELETE pour retirer
      const response = await fetch(`/api/v1/jira/collaborators?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const v1Result = await response.json();
      
      if (v1Result.status === 200) {
        // Refresh la liste après suppression
        await fetchCollaborators();
        console.log('✅ [v1] Collaborateur retiré avec succès via v1 API');
      } else {
        throw new Error(v1Result.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('❌ [v1] Erreur suppression collaborateur:', error);
      setError(error instanceof Error ? error.message : 'Erreur de suppression');
      throw error;
    }
  };

  // Charger les collaborateurs au démarrage
  useEffect(() => {
    fetchCollaborators();
  }, []);

  const value = {
    collaborators,
    loading,
    error,
    addCollaborator,
    editCollaborator,
    deleteCollaborator,
    fetchCollaborators,
  };

  return (
    <CollaboratorsContext.Provider value={value}>
      {children}
    </CollaboratorsContext.Provider>
  );
}

export function useCollaborators() {
  const context = useContext(CollaboratorsContext);
  if (context === undefined) {
    throw new Error('useCollaborators must be used within a CollaboratorsProvider');
  }
  return context;
}

export type { Collaborator, CollaboratorForm };
