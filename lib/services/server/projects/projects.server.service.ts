// Projects API Server Service for Next.js
// Provides methods to interact with Projects API endpoints

import { 
  ProjectDto, 
  ProjectRequestDto, 
  ProjectTypeDto, 
  ProjectTypeRequestDto,
  
  ProjectRoleDto,
  ProjectRoleRequestDto,
  ProjectMemberDto,
  AddProjectMemberRequestDto,
  ProjectAttachmentDto,
  UploadProjectAttachmentRequestDto,
  ProjectPaginationParams,
  ProjectTypePaginationParams,
  ProjectMemberPaginationParams,
  ProjectRolePaginationParams,
  ProjectAttachmentPaginationParams
} from "./projects.dtos";
import { HateoasResponse, ApiAppResponse } from "../index";
import { httpClient } from "@/lib/utils/http-client";

// For server-side token management - not persisted between requests
export const SERVER_API_BASE_URL = '/api/v1/projects';

export const SECTION_PROJECTS = 'projects';
export const SECTION_PROJECT_TYPES = 'projects-types';
export const SECTION_MEMBERS = 'members';

export const SECTION_PROJECT_ROLES = 'project-roles';
export const SECTION_ATTACHMENTS = 'attachments';

export class ProjectsServerService {

  getHeaders(accessToken: string) {
    return {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    };
  }

  // ========================
  // PROJECT CRUD OPERATIONS
  // ========================

  /**
   * Get paginated list of projects
   */
  async getProjects(
    accessToken: string, 
    pagination?: ProjectPaginationParams
  ): Promise<HateoasResponse<ProjectDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: getProjects headers:', headers);
      
      const queryParams = new URLSearchParams();
      if (pagination) {
        if (pagination.page !== undefined) queryParams.append('page', pagination.page.toString());
        if (pagination.size !== undefined) queryParams.append('size', pagination.size.toString());
        if (pagination.sortBy) queryParams.append('sortBy', pagination.sortBy);
        if (pagination.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
        if (pagination.query) queryParams.append('query', pagination.query);
      }
      
      const searchQuery = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<ApiAppResponse<HateoasResponse<ProjectDto>>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}${searchQuery}`,
        headers
      );
      
      console.log('ProjectsServerService: getProjects response:', response);
      if (response.data?.data) {
        console.log('Projects response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: getProjects error:', error);
      throw error;
    }
  }

  /**
   * Get project details by ID
   */
  async getProjectById(
    accessToken: string, 
    projectId: string
  ): Promise<ProjectDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: getProjectById headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<ProjectDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}`,
        headers
      );
      
      console.log('ProjectsServerService: getProjectById response:', response);
      if (response.data?.data) {
        console.log('Project detail response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: getProjectById error:', error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  async createProject(
    accessToken: string, 
    projectData: ProjectRequestDto
  ): Promise<ProjectDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: createProject headers:', headers);
      
      const response = await httpClient.post<ApiAppResponse<ProjectDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}`,
        projectData,
        headers
      );
      
      console.log('ProjectsServerService: createProject response:', response);
      if (response.data?.data) {
        console.log('Create project response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: createProject error:', error);
      throw error;
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(
    accessToken: string, 
    projectId: string, 
    projectData: ProjectRequestDto
  ): Promise<ProjectDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: updateProject headers:', headers);
      
      const response = await httpClient.put<ApiAppResponse<ProjectDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}`,
        projectData,
        headers
      );
      
      console.log('ProjectsServerService: updateProject response:', response);
      if (response.data?.data) {
        console.log('Update project response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: updateProject error:', error);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(
    accessToken: string, 
    projectId: string
  ): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: deleteProject headers:', headers);
      
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}`,
        headers
      );
      
      console.log('ProjectsServerService: deleteProject completed successfully');
    } catch (error) {
      console.error('ProjectsServerService: deleteProject error:', error);
      throw error;
    }
  }

  // ========================
  // PROJECT TYPES OPERATIONS
  // ========================

  /**
   * Get paginated list of project types
   */
  async getProjectTypes(
    accessToken: string, 
    pagination?: ProjectTypePaginationParams
  ): Promise<HateoasResponse<ProjectTypeDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: getProjectTypes headers:', headers);
      
      const queryParams = new URLSearchParams();
      if (pagination) {
        if (pagination.page !== undefined) queryParams.append('page', pagination.page.toString());
        if (pagination.size !== undefined) queryParams.append('size', pagination.size.toString());
        if (pagination.sortBy) queryParams.append('sortBy', pagination.sortBy);
        if (pagination.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
        if (pagination.query) queryParams.append('query', pagination.query);
      }
      
      const searchQuery = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<ApiAppResponse<HateoasResponse<ProjectTypeDto>>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECT_TYPES}${searchQuery}`,
        headers
      );
      
      console.log('ProjectsServerService: getProjectTypes response:', response);
      if (response.data?.data) {
        console.log('Project types response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: getProjectTypes error:', error);
      throw error;
    }
  }

  /**
   * Get project type details by ID
   */
  async getProjectTypeById(
    accessToken: string, 
    projectTypeId: string
  ): Promise<ProjectTypeDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: getProjectTypeById headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<ProjectTypeDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECT_TYPES}/${projectTypeId}`,
        headers
      );
      
      console.log('ProjectsServerService: getProjectTypeById response:', response);
      if (response.data?.data) {
        console.log('Project type detail response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: getProjectTypeById error:', error);
      throw error;
    }
  }

  /**
   * Create a new project type
   */
  async createProjectType(
    accessToken: string, 
    projectTypeData: ProjectTypeRequestDto
  ): Promise<ProjectTypeDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: createProjectType headers:', headers);
      
      const response = await httpClient.post<ApiAppResponse<ProjectTypeDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECT_TYPES}`,
        projectTypeData,
        headers
      );
      
      console.log('ProjectsServerService: createProjectType response:', response);
      if (response.data?.data) {
        console.log('Create project type response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: createProjectType error:', error);
      throw error;
    }
  }

  /**
   * Update an existing project type
   */
  async updateProjectType(
    accessToken: string, 
    projectTypeId: string, 
    projectTypeData: ProjectTypeRequestDto
  ): Promise<ProjectTypeDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: updateProjectType headers:', headers);
      
      const response = await httpClient.put<ApiAppResponse<ProjectTypeDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECT_TYPES}/${projectTypeId}`,
        projectTypeData,
        headers
      );
      
      console.log('ProjectsServerService: updateProjectType response:', response);
      if (response.data?.data) {
        console.log('Update project type response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: updateProjectType error:', error);
      throw error;
    }
  }

  /**
   * Delete a project type
   */
  async deleteProjectType(
    accessToken: string, 
    projectTypeId: string
  ): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: deleteProjectType headers:', headers);
      
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECT_TYPES}/${projectTypeId}`,
        headers
      );
      
      console.log('ProjectsServerService: deleteProjectType completed successfully');
    } catch (error) {
      console.error('ProjectsServerService: deleteProjectType error:', error);
      throw error;
    }
  }

  // ========================
  // PROJECT MEMBERS OPERATIONS
  // ========================

  /**
   * Get project members by project ID
   */
  async getProjectMembers(
    accessToken: string, 
    projectId: string,
    pagination?: ProjectMemberPaginationParams
  ): Promise<HateoasResponse<ProjectMemberDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: getProjectMembers headers:', headers);
      
      const queryParams = new URLSearchParams();
      if (pagination) {
        if (pagination.page !== undefined) queryParams.append('page', pagination.page.toString());
        if (pagination.size !== undefined) queryParams.append('size', pagination.size.toString());
        if (pagination.sortBy) queryParams.append('sortBy', pagination.sortBy);
        if (pagination.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
        if (pagination.query) queryParams.append('query', pagination.query);
      }
      
      const searchQuery = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<ApiAppResponse<HateoasResponse<ProjectMemberDto>>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}/${SECTION_MEMBERS}${searchQuery}`,
        headers
      );
      
      console.log('ProjectsServerService: getProjectMembers response:', response);
      if (response.data?.data) {
        console.log('Project members response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: getProjectMembers error:', error);
      throw error;
    }
  }

  /**
   * Get project member details by project ID and member ID
   */
  async getProjectMemberById(
    accessToken: string, 
    projectId: string,
    memberId: string
  ): Promise<ProjectMemberDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: getProjectMemberById headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<ProjectMemberDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}/${SECTION_MEMBERS}/${memberId}`,
        headers
      );
      
      console.log('ProjectsServerService: getProjectMemberById response:', response);
      if (response.data?.data) {
        console.log('Project member detail response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: getProjectMemberById error:', error);
      throw error;
    }
  }

  /**
   * Add a member to a project
   */
  async addProjectMember(
    accessToken: string, 
    projectId: string,
    memberData: AddProjectMemberRequestDto
  ): Promise<ProjectMemberDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: addProjectMember headers:', headers);
      
      const response = await httpClient.post<ApiAppResponse<ProjectMemberDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}/${SECTION_MEMBERS}`,
        memberData,
        headers
      );
      
      console.log('ProjectsServerService: addProjectMember response:', response);
      if (response.data?.data) {
        console.log('Add project member response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: addProjectMember error:', error);
      throw error;
    }
  }

  /**
   * Remove a member from a project
   */
  async removeProjectMember(
    accessToken: string, 
    projectId: string,
    memberId: string
  ): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: removeProjectMember headers:', headers);
      
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}/${SECTION_MEMBERS}/${memberId}`,
        headers
      );
      
      console.log('ProjectsServerService: removeProjectMember completed successfully');
    } catch (error) {
      console.error('ProjectsServerService: removeProjectMember error:', error);
      throw error;
    }
  }


  
  // ========================
  // PROJECT ROLES OPERATIONS
  // ========================

  /**
   * Get paginated list of project roles
   */
  async getProjectRoles(
    accessToken: string, 
    pagination?: ProjectRolePaginationParams
  ): Promise<HateoasResponse<ProjectRoleDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: getProjectRoles headers:', headers);
      
      const queryParams = new URLSearchParams();
      if (pagination) {
        if (pagination.page !== undefined) queryParams.append('page', pagination.page.toString());
        if (pagination.size !== undefined) queryParams.append('size', pagination.size.toString());
        if (pagination.sortBy) queryParams.append('sortBy', pagination.sortBy);
        if (pagination.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
        if (pagination.query) queryParams.append('query', pagination.query);
      }
      
      const searchQuery = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<ApiAppResponse<HateoasResponse<ProjectRoleDto>>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECT_ROLES}${searchQuery}`,
        headers
      );
      
      console.log('ProjectsServerService: getProjectRoles response:', response);
      if (response.data?.data) {
        console.log('Project roles response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: getProjectRoles error:', error);
      throw error;
    }
  }

  /**
   * Get project role details by ID
   */
  async getProjectRoleById(
    accessToken: string, 
    projectRoleId: string
  ): Promise<ProjectRoleDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: getProjectRoleById headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<ProjectRoleDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECT_ROLES}/${projectRoleId}`,
        headers
      );
      
      console.log('ProjectsServerService: getProjectRoleById response:', response);
      if (response.data?.data) {
        console.log('Project role detail response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: getProjectRoleById error:', error);
      throw error;
    }
  }

  /**
   * Create a new project role
   */
  async createProjectRole(
    accessToken: string, 
    projectRoleData: ProjectRoleRequestDto
  ): Promise<ProjectRoleDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: createProjectRole headers:', headers);
      
      const response = await httpClient.post<ApiAppResponse<ProjectRoleDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECT_ROLES}`,
        projectRoleData,
        headers
      );
      
      console.log('ProjectsServerService: createProjectRole response:', response);
      if (response.data?.data) {
        console.log('Create project role response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: createProjectRole error:', error);
      throw error;
    }
  }

  /**
   * Update an existing project role
   */
  async updateProjectRole(
    accessToken: string, 
    projectRoleId: string, 
    projectRoleData: ProjectRoleRequestDto
  ): Promise<ProjectRoleDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: updateProjectRole headers:', headers);
      
      const response = await httpClient.put<ApiAppResponse<ProjectRoleDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECT_ROLES}/${projectRoleId}`,
        projectRoleData,
        headers
      );
      
      console.log('ProjectsServerService: updateProjectRole response:', response);
      if (response.data?.data) {
        console.log('Update project role response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: updateProjectRole error:', error);
      throw error;
    }
  }

  /**
   * Delete a project role
   */
  async deleteProjectRole(
    accessToken: string, 
    projectRoleId: string
  ): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: deleteProjectRole headers:', headers);
      
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECT_ROLES}/${projectRoleId}`,
        headers
      );
      
      console.log('ProjectsServerService: deleteProjectRole completed successfully');
    } catch (error) {
      console.error('ProjectsServerService: deleteProjectRole error:', error);
      throw error;
    }
  }

  // ========================
  // PROJECT ATTACHMENTS OPERATIONS
  // ========================

  /**
   * Get project attachments by project ID
   */
  async getProjectAttachments(
    accessToken: string, 
    projectId: string,
    pagination?: ProjectAttachmentPaginationParams
  ): Promise<HateoasResponse<ProjectAttachmentDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: getProjectAttachments headers:', headers);
      
      const queryParams = new URLSearchParams();
      if (pagination) {
        if (pagination.page !== undefined) queryParams.append('page', pagination.page.toString());
        if (pagination.size !== undefined) queryParams.append('size', pagination.size.toString());
        if (pagination.sortBy) queryParams.append('sortBy', pagination.sortBy);
        if (pagination.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
        if (pagination.query) queryParams.append('query', pagination.query);
      }
      
      const searchQuery = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<ApiAppResponse<HateoasResponse<ProjectAttachmentDto>>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}/${SECTION_ATTACHMENTS}${searchQuery}`,
        headers
      );
      
      console.log('ProjectsServerService: getProjectAttachments response:', response);
      if (response.data?.data) {
        console.log('Project attachments response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: getProjectAttachments error:', error);
      throw error;
    }
  }

  /**
   * Get project attachment details by project ID and attachment ID
   */
  async getProjectAttachmentById(
    accessToken: string, 
    projectId: string,
    attachmentId: string
  ): Promise<ProjectAttachmentDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: getProjectAttachmentById headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<ProjectAttachmentDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}/${SECTION_ATTACHMENTS}/${attachmentId}`,
        headers
      );
      
      console.log('ProjectsServerService: getProjectAttachmentById response:', response);
      if (response.data?.data) {
        console.log('Project attachment detail response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: getProjectAttachmentById error:', error);
      throw error;
    }
  }

  /**
   * Upload an attachment to a project
   */
  async uploadProjectAttachment(
    accessToken: string, 
    projectId: string,
    attachmentData: UploadProjectAttachmentRequestDto
  ): Promise<ProjectAttachmentDto> {
    try {
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        // Don't set Content-Type for FormData - let browser set it with boundary
      };
      console.log('ProjectsServerService: uploadProjectAttachment headers:', headers);
      
      const formData = new FormData();
      formData.append('file', attachmentData.file);
      if (attachmentData.title) formData.append('title', attachmentData.title);
      if (attachmentData.description) formData.append('description', attachmentData.description);
      if (attachmentData.typeId) formData.append('typeId', attachmentData.typeId);
      
      const response = await httpClient.post<ApiAppResponse<ProjectAttachmentDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}/${SECTION_ATTACHMENTS}`,
        formData,
        { headers }
      );
      
      console.log('ProjectsServerService: uploadProjectAttachment response:', response);
      if (response.data?.data) {
        console.log('Upload project attachment response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('ProjectsServerService: uploadProjectAttachment error:', error);
      throw error;
    }
  }

  /**
   * Delete an attachment from a project
   */
  async deleteProjectAttachment(
    accessToken: string, 
    projectId: string,
    attachmentId: string
  ): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('ProjectsServerService: deleteProjectAttachment headers:', headers);
      
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}/${SECTION_ATTACHMENTS}/${attachmentId}`,
        headers
      );
      
      console.log('ProjectsServerService: deleteProjectAttachment completed successfully');
    } catch (error) {
      console.error('ProjectsServerService: deleteProjectAttachment error:', error);
      throw error;
    }
  }
  
}

// Export a default instance
export const projectsServerService = new ProjectsServerService();
