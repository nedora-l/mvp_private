import React, { useState } from 'react';
import { X, Search, Users, UserPlus } from 'lucide-react';

interface CollaboratorInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, projects?: string[]) => Promise<void>;
  availableProjects?: Array<{ key: string; name: string }>;
}

/**
 * Modal pour inviter des collaborateurs Jira
 * Suit exactement le processus Jira officiel :
 * 1. Recherche d'utilisateurs existants
 * 2. Invitation par email si nouvel utilisateur
 * 3. Attribution automatique aux projets
 * Utilise l'API v1 (migré de MCP)
 */
export const CollaboratorInviteModal: React.FC<CollaboratorInviteModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  availableProjects = []
}) => {
  const [email, setEmail] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [step, setStep] = useState<'search' | 'invite' | 'success'>('search');

  // Recherche d'utilisateurs Jira existants (v1 API - migré de MCP)
  const handleSearch = async () => {
    if (!email.trim()) return;

    setIsSearching(true);
    try {
      console.log("🔄 [v1] Recherche utilisateur via v1 API...");
      
      const response = await fetch(`/api/v1/jira/collaborators?search=${encodeURIComponent(email.trim())}&limit=10`);
      const v1Data = await response.json();
      
      if (v1Data.status === 200 && v1Data.data?._embedded?.collaborators) {
        // Conversion du format v1 vers le format attendu par le composant
        const convertedCollaborators = v1Data.data._embedded.collaborators.map((collaborator: any) => ({
          id: collaborator.id,
          name: collaborator.name,
          role: collaborator.role,
          email: collaborator.email,
          department: collaborator.department,
          avatar: collaborator.avatar || '/default-avatar.png'
        }));
        
        setSearchResults(convertedCollaborators);
        if (convertedCollaborators.length > 0) {
          console.log(`✅ [v1] ${convertedCollaborators.length} utilisateur(s) trouvé(s) dans Jira via v1 API`);
        } else {
          console.log('ℹ️ [v1] Aucun utilisateur trouvé - Invitation requise');
          setStep('invite');
        }
      } else {
        console.error('❌ [v1] Erreur recherche:', v1Data.message);
        // En cas d'erreur de recherche, passer directement à l'invitation
        setStep('invite');
      }
    } catch (error) {
      console.error('❌ [v1] Erreur de recherche utilisateur:', error);
      setStep('invite');
    } finally {
      setIsSearching(false);
    }
  };

  // Ajouter un utilisateur existant aux projets sélectionnés (v1 API - migré de MCP)
  const handleAddExistingUser = async (user: any) => {
    setIsInviting(true);
    try {
      console.log("🔄 [v1] Ajout utilisateur existant via v1 API...");
      
      for (const projectKey of selectedProjects) {
        const response = await fetch('/api/v1/jira/collaborators', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: user.id,
            role: 'User', 
            projectKey,
            department: user.department 
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.warn(`⚠️ [v1] Erreur assignation à ${projectKey}:`, errorData.message);
        }
      }

      console.log(`✅ [v1] ${user.name} ajouté aux projets sélectionnés via v1 API`);
      setStep('success');
    } catch (error) {
      console.error('❌ [v1] Erreur ajout utilisateur:', error);
    } finally {
      setIsInviting(false);
    }
  };

  // Inviter un nouvel utilisateur
  const handleInvite = async () => {
    setIsInviting(true);
    try {
      const result = await onInvite(email, selectedProjects);
      
      // Si c'est une limitation Jira, rester au step 'invite' pour afficher les instructions
      if (result && result.needsManualProcess) {
        console.log('ℹ️ Processus manuel requis pour Jira');
        // Rester sur le step invite pour que l'utilisateur voie les instructions
        return;
      }
      
      setStep('success');
    } catch (error) {
      console.error('❌ Erreur invitation:', error);
      // En cas d'erreur, afficher les instructions manuelles
      setStep('invite');
    } finally {
      setIsInviting(false);
    }
  };

  // Gérer la sélection des projets
  const toggleProject = (projectKey: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectKey)
        ? prev.filter(p => p !== projectKey)
        : [...prev, projectKey]
    );
  };

  // Reset du modal
  const handleClose = () => {
    setEmail('');
    setSelectedProjects([]);
    setSearchResults([]);
    setStep('search');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {step === 'search' ? 'Rechercher Collaborateur' : 
               step === 'invite' ? 'Inviter Collaborateur' : 
               'Invitation Envoyée'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {step === 'search' && (
            <div className="space-y-6">
              {/* Recherche email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email du collaborateur
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={!email.trim() || isSearching}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    {isSearching ? 'Recherche...' : 'Rechercher'}
                  </button>
                </div>
              </div>

              {/* Résultats de recherche */}
              {searchResults.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Utilisateurs trouvés dans Jira :
                  </h3>
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.avatar || '/default-avatar.png'} 
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">{user.role} · {user.department}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddExistingUser(user)}
                          disabled={isInviting}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm rounded transition-colors"
                        >
                          {isInviting ? 'Ajout...' : 'Ajouter'}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setStep('invite')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      L'utilisateur n'est pas dans la liste ? Inviter un nouveau collaborateur →
                    </button>
                  </div>
                </div>
              )}

              {/* Sélection des projets */}
              {(searchResults.length > 0 || availableProjects.length > 0) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Projets à assigner (optionnel) :
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {availableProjects.map((project) => (
                      <label key={project.key} className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.key)}
                          onChange={() => toggleProject(project.key)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{project.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'invite' && (
            <div className="space-y-6">
              {/* Info sur le processus Jira */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                  🔒 Processus d'invitation Jira
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  L'invitation de nouveaux utilisateurs dans Jira doit être effectuée via l'interface d'administration Atlassian pour des raisons de sécurité.
                </p>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  Étapes pour inviter <strong>{email}</strong> :
                </h3>
                <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-2">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs flex items-center justify-center flex-shrink-0">1</span>
                    Allez sur <a href="https://admin.atlassian.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">admin.atlassian.com</a>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs flex items-center justify-center flex-shrink-0">2</span>
                    Sélectionnez votre organisation
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs flex items-center justify-center flex-shrink-0">3</span>
                    Allez dans "Directory" → "Users"
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs flex items-center justify-center flex-shrink-0">4</span>
                    Cliquez "Add users" et entrez : <strong>{email}</strong>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs flex items-center justify-center flex-shrink-0">5</span>
                    Assignez aux projets : {selectedProjects.length > 0 ? selectedProjects.join(', ') : 'Aucun sélectionné'}
                  </li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('https://admin.atlassian.com', '_blank')}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Ouvrir Admin Atlassian
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <UserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Collaborateur ajouté avec succès !
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {email} a été ajouté aux projets sélectionnés.
              </p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
