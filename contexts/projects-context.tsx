"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockProjects } from "@/app/[locale]/apps/projects/gestion/mockProjects";

// Type du projet (reprend le modèle v0)
export interface Project {
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
  addProject: (project: Project) => Promise<void>;
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

  // Fonction pour charger les projets depuis l'API v0 locale
  const fetchProjects = async () => {
    try {
      console.log("🔄 Fetching projects from local API v0...");
      const response = await fetch('/api/v0/projects');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("📦 Raw API response:", data);
      setProjects(data.projects || []);
      console.log("✅ Projects loaded from API v0:", data.projects?.length || 0);
      console.log("📋 Projects list:", data.projects);
    } catch (error) {
      console.warn("❌ Local API not available, using mock data:", error);
      setProjects(initialProjects);
    } finally {
      setLoading(false);
    }
  };

  // Charger les projets au démarrage
  React.useEffect(() => {
    fetchProjects();
  }, []); // Pas de dépendance à la session

  // Ajout avec API v0 locale
  const addProject = async (project: Project) => {
    try {
      console.log("🔄 Adding project via local API v0...");
      const response = await fetch('/api/v0/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchProjects(); // Recharger la liste
      console.log("✅ Project added successfully");
    } catch (error) {
      console.error("❌ Error adding project:", error);
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
    <ProjectsContext.Provider value={{ projects, loading, addProject, editProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};
