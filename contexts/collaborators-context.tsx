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

  // Récupérer les collaborateurs (v0 → MCP)
  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Tentative connexion Jira...");
      
      // 🚀 Essai MCP Jira avec fallback sécurisé
      try {
        const mcpResponse = await fetch('/api/mcp/collaborators');
        if (mcpResponse.ok) {
          const mcpData = await mcpResponse.json();
          if (mcpData.success && mcpData.source === 'jira') {
            setCollaborators(mcpData.collaborators);
            console.log(`✅ ${mcpData.collaborators?.length || 0} collaborateurs chargés depuis JIRA !`);
            return;
          }
        }
      } catch (mcpError) {
        console.log("⚠️ Jira indisponible, fallback vers v0");
      }
      
      // Fallback v0
      const response = await fetch('/api/v0/collaborators');
      const data = await response.json();
      
      if (data.success) {
        setCollaborators(data.collaborators);
        console.log(`✅ ${data.collaborators?.length || 0} collaborateurs chargés depuis v0`);
      } else {
        throw new Error(data.error || 'Erreur de chargement');
      }
    } catch (error) {
      console.error('❌ Erreur fetch collaborateurs:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un collaborateur
  const addCollaborator = async (collaboratorData: CollaboratorForm): Promise<Collaborator | null> => {
    try {
      setError(null);
      const response = await fetch('/api/v0/collaborators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collaboratorData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du collaborateur');
      }

      const newCollaborator = await response.json();
      setCollaborators(prev => [...prev, newCollaborator]);
      console.log('✅ Collaborateur ajouté:', newCollaborator);
      return newCollaborator;
    } catch (error) {
      console.error('❌ Erreur ajout collaborateur:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      return null;
    }
  };

  // Modifier un collaborateur
  const editCollaborator = async (id: string, collaboratorData: CollaboratorForm) => {
    try {
      setError(null);
      const response = await fetch(`/api/v0/collaborators/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collaboratorData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du collaborateur');
      }

      const updatedCollaborator = await response.json();
      setCollaborators(prev => 
        prev.map(c => c.id === id ? updatedCollaborator : c)
      );
      console.log('✅ Collaborateur modifié:', updatedCollaborator);
    } catch (error) {
      console.error('❌ Erreur modification collaborateur:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    }
  };

  // Supprimer un collaborateur
  const deleteCollaborator = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/v0/collaborators/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du collaborateur');
      }

      setCollaborators(prev => prev.filter(c => c.id !== id));
      console.log('✅ Collaborateur supprimé:', id);
    } catch (error) {
      console.error('❌ Erreur suppression collaborateur:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
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
