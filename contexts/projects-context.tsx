"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// ✅ Clean Jira-native Project interface
export interface Project {
  id: number;
  name: string;
  type: string;
  boardType?: string; // Type de board (Scrum, Kanban, etc.)
  customType?: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  members: string;
  jiraId?: string; // ID Jira du projet
  jiraKey?: string; // Clé Jira du projet (ex: ECS)
  key?: string; // 🔧 FIX: Propriété key pour compatibilité
  source?: string; // Source des données ('jira')
}

// ✅ Clean Jira-native ProjectCreate interface
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

  // ✅ JIRA-NATIVE - Fetch projects from v1 API (migrated from MCP)
  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log("🔄 [v1] Fetching projects from Jira via v1 API...");
      
      const response = await fetch('/api/v1/jira/projects');
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📦 Raw v1 API response:", data);
      
      if (data.status === 200 && data.data?._embedded?.projects) {
        // Conversion du format v1 vers l'interface Project existante
        const convertedProjects = data.data._embedded.projects.map((project: any) => ({
          id: project.id,
          name: project.title, // v1 utilise 'title', on convertit vers 'name'
          type: project.boardType || 'Kanban',
          boardType: project.boardType,
          customType: project.boardType,
          description: project.description,
          status: 'Active', // Par défaut
          startDate: project.startsAt,
          endDate: project.endsAt,
          members: 'Team', // Par défaut
          jiraId: project.jiraId,
          jiraKey: project.jiraKey,
          key: project.jiraKey || project.key || `PROJ-${project.id}`, // 🔧 FIX: Assurer la présence de key
          source: data.source || 'jira'
        }));
        
        setProjects(convertedProjects);
        console.log(`✅ [v1] ${convertedProjects.length} projects loaded from ${data.source || 'Jira'}`);
        console.log(`🔗 [v1] Connected to Jira via v1 API`);
        console.log(`📊 [v1] ${data.data.page.totalElements} Jira projects synchronized`);
      } else {
        console.warn('⚠️ [v1] No projects returned from v1 API');
        setProjects([]); // Empty array if no projects
      }
    } catch (error) {
      console.error("❌ [v1] Error fetching projects from v1 API:", error);
      setProjects([]); // Empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Charger les projets au démarrage
  React.useEffect(() => {
    fetchProjects();
  }, []); // Pas de dépendance à la session

  // ✅ JIRA-NATIVE - Add project via v1 API (migrated from MCP)
  const addProject = async (project: ProjectCreate) => {
    try {
      console.log("🔄 [v1] Adding project via Jira v1 API...");
      
      // 🔧 FIX: Mapping correct des données du formulaire vers l'API v1
      const v1ProjectData = {
        title: project.name, // 🔧 FIX: name → title
        description: project.description,
        boardType: project.boardType || 'Kanban',
        startsAt: project.startDate,
        endsAt: project.endDate,
        jiraKey: project.name.substring(0, 3).toUpperCase() // Génération automatique de la clé Jira
      };
      
      console.log(`🛠️ [v1] Données mappées vers v1:`, JSON.stringify(v1ProjectData, null, 2));
      
      const response = await fetch('/api/v1/jira/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(v1ProjectData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 201) {
        console.log(`✅ [v1] Project created successfully in Jira: ${result.data.jiraKey || 'N/A'}`);
        await fetchProjects(); // Reload project list
        return result;
      } else {
        throw new Error(result.message || 'Failed to create project');
      }
    } catch (error) {
      console.error("❌ [v1] Error adding project via v1 API:", error);
      throw error; // Re-throw for UI error handling
    }
  };

  // ✅ JIRA-NATIVE - Edit project via v1 API (migrated from MCP)
  const editProject = async (index: number, project: Project) => {
    try {
      console.log("🔄 [v1] Editing project via Jira v1 API...");
      
      // Conversion du format Project vers le format v1
      const v1ProjectData = {
        title: project.name,
        description: project.description,
        boardType: project.boardType || 'Kanban',
        startsAt: project.startDate,
        endsAt: project.endDate,
        jiraKey: project.jiraKey
      };
      
      const response = await fetch('/api/v1/jira/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(v1ProjectData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 200) {
        console.log(`✅ [v1] Project edited successfully in Jira: ${project.jiraKey || project.id}`);
        await fetchProjects(); // Reload project list
      } else {
        throw new Error(result.message || 'Failed to edit project');
      }
    } catch (error) {
      console.error("❌ [v1] Error editing project via v1 API:", error);
      throw error; // Re-throw for UI error handling
    }
  };

  // ✅ JIRA-NATIVE - Delete project via v1 API (migrated from MCP)
  const deleteProject = async (index: number) => {
    try {
      const project = projects[index];
      if (!project) {
        throw new Error('Project not found at index ' + index);
      }
      
      console.log("🔄 [v1] Deleting project via Jira v1 API...");
      
      // Note: v1 API utilise DELETE avec query params, pas body
      const response = await fetch(`/api/v1/jira/projects?jiraKey=${project.jiraKey}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 200) {
        console.log(`✅ [v1] Project deleted successfully from Jira: ${project.jiraKey || project.id}`);
        await fetchProjects(); // Reload project list
      } else {
        throw new Error(result.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error("❌ [v1] Error deleting project via v1 API:", error);
      throw error; // Re-throw for UI error handling
    }
  };

  return (
    <ProjectsContext.Provider value={{ projects, loading, fetchProjects, addProject, editProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};
