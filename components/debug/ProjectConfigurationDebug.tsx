"use client";
import React, { useState, useEffect } from 'react';
import { useProjectConfiguration } from '@/hooks/use-project-configuration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Wrench } from 'lucide-react';

// Interface pour les projets
interface Project {
  id: number;
  title: string;
  jiraKey?: string;
}

export default function ProjectConfigurationDebug() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Récupérer la liste des projets
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const response = await fetch('/api/v1/jira/projects');
        if (response.ok) {
          const data = await response.json();
          if (data.status === 200 && data.data?._embedded?.projects) {
            setProjects(data.data._embedded.projects);
          }
        }
      } catch (error) {
        console.error('Erreur récupération projets:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Hook pour la configuration du projet sélectionné
  const { configuration, loading, error, refreshConfiguration } = useProjectConfiguration(
    selectedProjectId ? parseInt(selectedProjectId) : null
  );

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleRefresh = () => {
    if (selectedProjectId) {
      refreshConfiguration();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Wrench className="h-6 w-6" />
          <CardTitle>Debug Configuration Projet Jira</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection du projet */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sélectionner un projet :</label>
            <Select value={selectedProjectId} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un projet..." />
              </SelectTrigger>
              <SelectContent>
                {loadingProjects ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Chargement des projets...
                  </div>
                ) : (
                  projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {/* 🔧 FIX : Afficher "ID - Nom du Projet" au lieu de juste "Projet ID" */}
                      Projet {project.id} - {project.title}
                      {project.jiraKey && ` (${project.jiraKey})`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Affichage des erreurs */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erreur: {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Affichage du succès */}
          {configuration && !error && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Configuration chargée pour Projet {configuration.projectId} ({configuration.projectKey})
              </AlertDescription>
            </Alert>
          )}

          {/* Configuration du projet */}
          {configuration && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Types d'Issues */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Types d'Issues ({configuration.issueTypes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {configuration.issueTypes.map((type) => (
                      <Badge key={type.id} variant="secondary">
                        {type.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statuts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Statuts ({configuration.statuses.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {configuration.statuses.map((status) => (
                      <Badge key={status.id} variant="outline">
                        {status.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Priorités */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Priorités ({configuration.priorities.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {configuration.priorities.map((priority) => (
                      <div key={priority.id} className="text-sm">
                        {priority.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Composants */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Composants ({configuration.components.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {configuration.components.length > 0 ? (
                    <div className="space-y-1">
                      {configuration.components.map((component) => (
                        <div key={component.id} className="text-sm">
                          {component.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucun composant</div>
                  )}
                </CardContent>
              </Card>

              {/* Labels */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Labels ({configuration.labels.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {configuration.labels.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {configuration.labels.map((label, index) => (
                        <Badge key={index} variant="outline">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucun label</div>
                  )}
                </CardContent>
              </Card>

              {/* Epics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Epics ({configuration.epics.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {configuration.epics.length > 0 ? (
                    <div className="space-y-1">
                      {configuration.epics.map((epic) => (
                        <div key={epic.id} className="text-sm">
                          {epic.key}: {epic.summary}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucun epic</div>
                  )}
                </CardContent>
              </Card>

              {/* Sprints */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Sprints ({configuration.sprints.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {configuration.sprints.length > 0 ? (
                    <div className="space-y-1">
                      {configuration.sprints.map((sprint) => (
                        <div key={sprint.id} className="text-sm">
                          {sprint.name} ({sprint.state})
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Aucun sprint</div>
                  )}
                </CardContent>
              </Card>

              {/* Workflow */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div>ID: {configuration.workflow.id}</div>
                    <div>Nom: {configuration.workflow.name}</div>
                    <div>Transitions: {configuration.workflow.transitions.length}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bouton de rafraîchissement */}
          <div className="flex justify-center">
            <Button 
              onClick={handleRefresh} 
              disabled={!selectedProjectId || loading}
              className="w-full max-w-xs"
            >
              {loading ? 'Chargement...' : 'Rafraîchir la configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
