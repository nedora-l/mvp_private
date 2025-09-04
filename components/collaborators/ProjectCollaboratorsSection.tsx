import React, { useState, useEffect } from 'react';
import { X, Users, Search, Plus, Trash2 } from 'lucide-react';
import { CollaboratorInviteModal } from './CollaboratorInviteModal';

interface ProjectCollaboratorsSectionProps {
  selectedCollaborators: string[];
  onCollaboratorsChange: (collaborators: string[]) => void;
  projectKey?: string; // Pour assigner automatiquement au projet
}

/**
 * Section collaborateurs intégrée dans la création/édition de projet
 * Combine recherche, sélection et invitation en un seul composant
 * Utilise l'API v1 (migré de MCP)
 */
export const ProjectCollaboratorsSection: React.FC<ProjectCollaboratorsSectionProps> = ({
  selectedCollaborators,
  onCollaboratorsChange,
  projectKey
}) => {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [filteredCollaborators, setFilteredCollaborators] = useState<any[]>([]);

  // Charger tous les collaborateurs disponibles
  useEffect(() => {
    fetchCollaborators();
  }, []);

  // Filtrer les collaborateurs selon la recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCollaborators(collaborators);
    } else {
      const filtered = collaborators.filter(collab =>
        collab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collab.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collab.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collab.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCollaborators(filtered);
    }
  }, [searchTerm, collaborators]);

  const fetchCollaborators = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 [v1] Récupération collaborateurs depuis v1 API...");
      
      const response = await fetch('/api/v1/jira/collaborators');
      const v1Data = await response.json();
      
      if (v1Data.status === 200 && v1Data.data?._embedded?.collaborators) {
        // Conversion du format v1 vers le format attendu par le composant
        const convertedCollaborators = v1Data.data._embedded.collaborators.map((collaborator: any) => ({
          id: collaborator.id,
          name: collaborator.name,
          role: collaborator.role,
          email: collaborator.email,
          department: collaborator.department,
          active: collaborator.active,
          dateAdded: collaborator.dateAdded,
          avatar: collaborator.avatar || '/default-avatar.png',
          projects: collaborator.projects || []
        }));
        
        setCollaborators(convertedCollaborators);
        console.log(`✅ [v1] ${convertedCollaborators.length} collaborateurs chargés depuis v1 API`);
        console.log(`📊 [v1] Total: ${v1Data.data.page.totalElements} collaborateurs`);
      } else {
        console.error('❌ [v1] Erreur récupération collaborateurs:', v1Data.message);
        setCollaborators([]);
      }
    } catch (error) {
      console.error('❌ [v1] Erreur fetch collaborateurs:', error);
      setCollaborators([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter/retirer un collaborateur de la sélection
  const toggleCollaborator = (collaboratorId: string) => {
    if (selectedCollaborators.includes(collaboratorId)) {
      onCollaboratorsChange(selectedCollaborators.filter(id => id !== collaboratorId));
    } else {
      onCollaboratorsChange([...selectedCollaborators, collaboratorId]);
    }
  };

  // Fonction d'ajout de collaborateur via v1 API
  const addCollaborator = async (collaboratorData: any) => {
    try {
      console.log("🔄 [v1] Ajout collaborateur via v1 API:", collaboratorData);
      
      const response = await fetch('/api/v1/jira/collaborators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collaboratorData),
      });

      const v1Result = await response.json();
      
      if (!response.ok || v1Result.status !== 201) {
        // Gérer les limitations Jira de manière informative
        if (response.status === 422 && v1Result.jiraLimitation) {
          console.log('ℹ️ [v1] Limitation Jira détectée:', v1Result.message);
          return {
            error: v1Result.message,
            instructions: v1Result.instructions,
            needsManualProcess: true
          };
        }
        
        throw new Error(v1Result.message || `Erreur HTTP ${response.status}`);
      }

      if (v1Result.status === 201 && v1Result.data) {
        console.log('✅ [v1] Collaborateur ajouté avec succès via v1 API');
        return v1Result.data;
      } else {
        throw new Error(v1Result.message || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('❌ [v1] Erreur addCollaborator:', error);
      throw error;
    }
  };

  // Gérer l'invitation d'un nouveau collaborateur (v1 API - migré de MCP)
  const handleInviteCollaborator = async (email: string, projects: string[] = []) => {
    try {
      // Si un projectKey est fourni, l'ajouter aux projets
      const assignToProjects = projectKey ? [projectKey, ...projects] : projects;
      
      console.log(`📧 [v1] Invitation de ${email} aux projets:`, assignToProjects);
      
      // Appel de l'API v1 d'invitation (qui retournera les instructions manuelles)
      const result = await addCollaborator({ 
        email, 
        name: email.split('@')[0], 
        role: 'Developer', // Rôle par défaut
        department: 'IT', // Département par défaut
        projects: assignToProjects 
      });
      
      if (result && result.needsManualProcess) {
        console.log('ℹ️ [v1] Processus manuel requis via Atlassian Admin');
        // La modal affichera les instructions automatiquement
        return result;
      }
      
      // Si succès (peu probable avec les limitations Jira), rafraîchir
      await fetchCollaborators();
      setShowInviteModal(false);
      
      return result;
    } catch (error) {
      console.error('❌ [v1] Erreur invitation:', error);
      throw error;
    }
  };

  // Obtenir les détails d'un collaborateur sélectionné
  const getSelectedCollaboratorDetails = () => {
    return collaborators.filter(collab => selectedCollaborators.includes(collab.id));
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Collaborateurs
        </label>
        <div className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-500">Chargement des collaborateurs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Collaborateurs ({selectedCollaborators.length} sélectionné{selectedCollaborators.length !== 1 ? 's' : ''})
        </label>
        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          Inviter nouveau
        </button>
      </div>

      {/* Collaborateurs sélectionnés */}
      {selectedCollaborators.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            Collaborateurs assignés au projet :
          </h4>
          <div className="flex flex-wrap gap-2">
            {getSelectedCollaboratorDetails().map((collab) => (
              <span
                key={collab.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full"
              >
                <img 
                  src={collab.avatar || '/default-avatar.png'} 
                  alt={collab.name}
                  className="w-4 h-4 rounded-full"
                />
                {collab.name}
                <button
                  type="button"
                  onClick={() => toggleCollaborator(collab.id)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un collaborateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
        />
      </div>

      {/* Liste des collaborateurs disponibles */}
      <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
        {filteredCollaborators.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {collaborators.length === 0 ? (
              <div>
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Aucun collaborateur trouvé</p>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Inviter le premier collaborateur
                </button>
              </div>
            ) : (
              <p className="text-sm">Aucun collaborateur ne correspond à votre recherche</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {filteredCollaborators.map((collab) => (
              <div
                key={collab.id}
                className={`p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                  selectedCollaborators.includes(collab.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => toggleCollaborator(collab.id)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCollaborators.includes(collab.id)}
                    onChange={() => toggleCollaborator(collab.id)}
                    className="rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <img 
                    src={collab.avatar || '/default-avatar.png'} 
                    alt={collab.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{collab.name}</p>
                    <p className="text-xs text-gray-500">{collab.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{collab.role}</p>
                  <p className="text-xs text-gray-500">{collab.department}</p>
                  {collab.projects && collab.projects.length > 0 && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">{collab.projects.length} projet(s)</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'invitation */}
      <CollaboratorInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteCollaborator}
        availableProjects={projectKey ? [{ key: projectKey, name: `Projet ${projectKey}` }] : []}
      />
    </div>
  );
};
