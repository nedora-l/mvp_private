// Example usage of the Projects API Client Library
// This file demonstrates how to use the projects API in your Next.js application

import { 
  projectsServerService, 
  projectsApiClient,
  ProjectRequestDto,
  ProjectTypeRequestDto,
  AddProjectMemberRequestDto,
  ProjectPaginationParams
} from './index';

// ========================
// SERVER-SIDE EXAMPLES (for API routes, getServerSideProps, etc.)
// ========================

export async function serverSideExamples() {
  const accessToken = 'your-access-token'; // Get from your auth system

  try {
    // 1. Get paginated list of projects
    const paginationParams: ProjectPaginationParams = {
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    };
    
    const projectsResponse = await projectsServerService.getProjects(accessToken, paginationParams);
    console.log('Projects:', projectsResponse);

    // 2. Get specific project
    const project = await projectsServerService.getProjectById(accessToken, 'project-id-123');
    console.log('Project details:', project);

    // 3. Create new project
    const newProject: ProjectRequestDto = {
      title: 'E-commerce Platform',
      description: 'Building a modern e-commerce platform with React and Node.js',
      startsAt: '2025-02-01',
      endsAt: '2025-08-31',
      isActive: true,
      isArchived: false,
      budget: 150000
    };

    const createdProject = await projectsServerService.createProject(accessToken, newProject);
    console.log('Created project:', createdProject);

    // 4. Update project
    const updateData: ProjectRequestDto = {
      title: 'E-commerce Platform (Updated)',
      description: 'Updated description with new requirements',
      budget: 175000
    };

    const updatedProject = await projectsServerService.updateProject(
      accessToken, 
      createdProject.id, 
      updateData
    );
    console.log('Updated project:', updatedProject);

    // 5. Create project type
    const newProjectType: ProjectTypeRequestDto = {
      title: 'Web Development',
      description: 'Projects focused on web application development',
      isActive: true,
      isArchived: false,
      orgId: 1
    };

    const createdType = await projectsServerService.createProjectType(accessToken, newProjectType);
    console.log('Created project type:', createdType);

    // 6. Add member to project
    const memberData: AddProjectMemberRequestDto = {
      memberId: 456,
      roleId: 'developer-role-id'
    };

    const addedMember = await projectsServerService.addProjectMember(
      accessToken,
      createdProject.id,
      memberData
    );
    console.log('Added member:', addedMember);

    // 7. Get project members
    const members = await projectsServerService.getProjectMembers(accessToken, createdProject.id);
    console.log('Project members:', members);

  } catch (error) {
    console.error('Server-side API error:', error);
  }
}

// ========================
// CLIENT-SIDE EXAMPLES (for React components)
// ========================

export function useProjectsExamples() {
  // These would typically be used in React components

  const handleGetProjects = async () => {
    try {
      const projects = await projectsApiClient.getProjects({
        page: 0,
        size: 10,
        sortBy: 'title',
        sortDirection: 'asc'
      });
      console.log('Client-side projects:', projects);
      return projects;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  };

  const handleCreateProject = async (formData: ProjectRequestDto) => {
    try {
      const newProject = await projectsApiClient.createProject(formData);
      console.log('Client-side created project:', newProject);
      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const handleUpdateProject = async (projectId: string, updateData: ProjectRequestDto) => {
    try {
      const updatedProject = await projectsApiClient.updateProject(projectId, updateData);
      console.log('Client-side updated project:', updatedProject);
      return updatedProject;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectsApiClient.deleteProject(projectId);
      console.log('Client-side deleted project successfully');
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  const handleGetProjectTypes = async () => {
    try {
      const projectTypes = await projectsApiClient.getProjectTypes();
      console.log('Client-side project types:', projectTypes);
      return projectTypes;
    } catch (error) {
      console.error('Failed to fetch project types:', error);
      throw error;
    }
  };

  const handleAddMemberToProject = async (projectId: string, memberData: AddProjectMemberRequestDto) => {
    try {
      const addedMember = await projectsApiClient.addProjectMember(projectId, memberData);
      console.log('Client-side added member:', addedMember);
      return addedMember;
    } catch (error) {
      console.error('Failed to add member to project:', error);
      throw error;
    }
  };

  return {
    handleGetProjects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    handleGetProjectTypes,
    handleAddMemberToProject
  };
}

// ========================
// REACT COMPONENT EXAMPLE
// ========================

/*
// Example React component using the projects API

import React, { useState, useEffect } from 'react';
import { projectsApiClient, ProjectDto, ProjectRequestDto } from '@/lib/projects';

export const ProjectsComponent: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApiClient.getProjects({
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });
      setProjects(response.content || []);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData: ProjectRequestDto) => {
    try {
      await projectsApiClient.createProject(projectData);
      await loadProjects(); // Refresh the list
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Projects</h1>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <p>Budget: ${project.budget}</p>
          <p>Status: {project.isActive ? 'Active' : 'Inactive'}</p>
        </div>
      ))}
    </div>
  );
};
*/

// ========================
// API ROUTE EXAMPLE (Next.js)
// ========================

/*
// pages/api/projects/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { projectsServerService } from '@/lib/projects';
import { getAccessToken } from '@/lib/auth'; // Your auth utility

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const accessToken = await getAccessToken(req); // Get token from request
    
    switch (req.method) {
      case 'GET':
        const projects = await projectsServerService.getProjects(accessToken, {
          page: parseInt(req.query.page as string) || 0,
          size: parseInt(req.query.size as string) || 10,
          sortBy: req.query.sortBy as string || 'createdAt',
          sortDirection: (req.query.sortDirection as string) || 'desc'
        });
        res.status(200).json(projects);
        break;

      case 'POST':
        const newProject = await projectsServerService.createProject(accessToken, req.body);
        res.status(201).json(newProject);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
*/
