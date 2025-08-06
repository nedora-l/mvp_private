"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockProjects } from "@/app/[locale]/apps/projects/gestion/mockProjects";

// Type du projet (reprend le modèle v0)
export interface Project {
  id: string;
  name: string;
  type: string;
  boardType?: string; // Type de board (Scrum, Kanban, XP, Simple)
  customType?: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  members: string;
  jiraId?: string; // ID Jira du projet
  jiraKey?: string; // Clé Jira du projet (ex: ECS)
}

// Type pour la création d'un projet (sans ID)
export interface ProjectCreate {
  name: string;
  type: string;
  boardType?: string;
  customType?: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  members: string;
}

// Mock data initiale (à adapter selon ton fichier mockProjects)
const initialProjects: Project[] = [
  // La mock data est chargée uniquement au premier lancement si le localStorage est vide
  ...mockProjects.map(p => ({
    id: p.id.toString(),
    name: p.name,
    type: p.type,
    customType: '',
    description: p.description || '',
    status: '',
    startDate: '',
    endDate: '',
    members: '',
  }))
];

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (project: ProjectCreate) => Promise<any>;
  editProject: (index: number, project: Project) => Promise<void>;
  deleteProject: (index: number) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error("useProjects must be used within ProjectsProvider");
  return context;
};

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger les projets depuis MCP ou v0
  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching projects from MCP...");
      
      // 🚀 Essai MCP d'abord, puis fallback v0
      let response = await fetch('/api/mcp/projects');
      
      if (!response.ok) {
        console.log("⚠️ MCP indisponible, fallback vers v0");
        response = await fetch('/api/v0/projects');
      }
      
      const data = await response.json();
      console.log("📦 Raw API response:", data);
      
      if (data.success) {
        setProjects(data.projects || []);
        console.log(`✅ ${data.projects?.length || 0} projets chargés depuis ${data.source || 'v0'}`);
        
        // Affichage des infos de connexion Jira
        if (data.source === 'jira') {
          console.log(`🔗 Connecté à Jira: ${data.domain}`);
          console.log(`� ${data.count} projets Jira synchronisés`);
        }
      } else {
        throw new Error(data.error || 'Erreur de chargement');
      }
    } catch (error) {
      console.warn("❌ Erreur lors du chargement des projets:", error);
      console.log("🔄 Fallback vers données mock...");
      setProjects(initialProjects);
    } finally {
      setLoading(false);
    }
  };

  // Charger les projets au démarrage
  React.useEffect(() => {
    fetchProjects();
  }, []); // Pas de dépendance à la session

  // Ajout avec MCP (Jira) d'abord, puis fallback v0 locale
  const addProject = async (project: ProjectCreate) => {
    try {
      console.log("🔄 Adding project via MCP/Jira...");
      
      // 🚀 Essai MCP d'abord pour Jira et fallbacks automatiques
      let response = await fetch('/api/mcp/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      // Si MCP échoue, fallback vers v0
      if (!response.ok) {
        console.log("⚠️ MCP indisponible, fallback vers v0");
        response = await fetch('/api/v0/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(project),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Feedback selon la source
      if (result.source === 'jira') {
        console.log(`✅ Projet créé sur Jira: ${result.jiraKey}`);
      } else if (result.source?.includes('local')) {
        console.log(`✅ Projet créé localement: ${result.warning || 'OK'}`);
      }

      await fetchProjects(); // Recharger la liste
      console.log("✅ Project added successfully");
      
      return result; // Retourner le résultat pour feedback UI
    } catch (error) {
      console.error("❌ Error adding project:", error);
      throw error; // Relancer pour gestion UI
    }
  };

  // Édition avec API v0 locale
  const editProject = async (index: number, project: Project) => {
    try {
      console.log("🔄 Editing project via local API v0...");
      const response = await fetch(`/api/v0/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchProjects(); // Recharger la liste
      console.log("✅ Project edited successfully");
    } catch (error) {
      console.error("❌ Error editing project:", error);
    }
  };

  // Suppression avec API v0 locale
  const deleteProject = async (index: number) => {
    try {
      const projectId = projects[index]?.id;
      if (!projectId) return;
      
      console.log("🔄 Deleting project via local API v0...");
      const response = await fetch(`/api/v0/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchProjects(); // Recharger la liste
      console.log("✅ Project deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting project:", error);
    }
  };

  return (
    <ProjectsContext.Provider value={{ projects, loading, fetchProjects, addProject, editProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};
