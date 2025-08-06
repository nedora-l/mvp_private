// Projects API Client for client-side usage
// This version can be used in React components and client-side code

import { 
  ProjectDto, 
  ProjectRequestDto, 
  ProjectTypeDto, 
  ProjectTypeRequestDto,
  ProjectMemberDto,
  AddProjectMemberRequestDto,
  ProjectRoleDto,
  ProjectRoleRequestDto,
  ProjectAttachmentDto,
  UploadProjectAttachmentRequestDto,
  ProjectPaginationParams,
  ProjectTypePaginationParams,
  ProjectMemberPaginationParams,
  ProjectRolePaginationParams,
  ProjectAttachmentPaginationParams
} from "../../server/projects/projects.dtos";

export class ProjectsApiClient {
  private baseUrl: string;
  private accessToken?: string;

  constructor(baseUrl: string = '/api/v1/projects', accessToken?: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async fetchWithAuth<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // Add authorization header if access token is available
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      
      // Try to get more detailed error from response
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage += ` - ${errorData}`;
        }
      } catch {
        // Ignore error parsing
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // ========================
  // PROJECT OPERATIONS
  // ========================

  async getProjects(params?: ProjectPaginationParams): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
      if (params.query) searchParams.append('query', params.query);
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/projects${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithAuth(endpoint);
  }

  async getProjectById(projectId: string): Promise<ProjectDto> {
    return this.fetchWithAuth(`/projects/${projectId}`);
  }

  async createProject(projectData: ProjectRequestDto): Promise<ProjectDto> {
    return this.fetchWithAuth('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(projectId: string, projectData: ProjectRequestDto): Promise<ProjectDto> {
    return this.fetchWithAuth(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId: string): Promise<void> {
    return this.fetchWithAuth(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // ========================
  // PROJECT TYPES OPERATIONS
  // ========================

  async getProjectTypes(params?: ProjectTypePaginationParams): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
      if (params.query) searchParams.append('query', params.query);
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/projects-types${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithAuth(endpoint);
  }

  async getProjectTypeById(projectTypeId: string): Promise<ProjectTypeDto> {
    return this.fetchWithAuth(`/projects-types/${projectTypeId}`);
  }

  async createProjectType(projectTypeData: ProjectTypeRequestDto): Promise<ProjectTypeDto> {
    return this.fetchWithAuth('/projects-types', {
      method: 'POST',
      body: JSON.stringify(projectTypeData),
    });
  }

  async updateProjectType(projectTypeId: string, projectTypeData: ProjectTypeRequestDto): Promise<ProjectTypeDto> {
    return this.fetchWithAuth(`/projects-types/${projectTypeId}`, {
      method: 'PUT',
      body: JSON.stringify(projectTypeData),
    });
  }

  async deleteProjectType(projectTypeId: string): Promise<void> {
    return this.fetchWithAuth(`/projects-types/${projectTypeId}`, {
      method: 'DELETE',
    });
  }

  // ========================
  // PROJECT MEMBERS OPERATIONS
  // ========================

  async getProjectMembers(projectId: string, params?: ProjectMemberPaginationParams): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
      if (params.query) searchParams.append('query', params.query);
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/projects/${projectId}/members${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithAuth(endpoint);
  }

  async getProjectMemberById(projectId: string, memberId: string): Promise<ProjectMemberDto> {
    return this.fetchWithAuth(`/projects/${projectId}/members/${memberId}`);
  }

  async addProjectMember(projectId: string, memberData: AddProjectMemberRequestDto): Promise<ProjectMemberDto> {
    return this.fetchWithAuth(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async removeProjectMember(projectId: string, memberId: string): Promise<void> {
    return this.fetchWithAuth(`/projects/${projectId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  // ========================
  // PROJECT ROLES OPERATIONS
  // ========================

  async getProjectRoles(params?: ProjectRolePaginationParams): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
      if (params.query) searchParams.append('query', params.query);
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/project-roles${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithAuth(endpoint);
  }

  async getProjectRoleById(projectRoleId: string): Promise<ProjectRoleDto> {
    return this.fetchWithAuth(`/project-roles/${projectRoleId}`);
  }

  async createProjectRole(projectRoleData: ProjectRoleRequestDto): Promise<ProjectRoleDto> {
    return this.fetchWithAuth('/project-roles', {
      method: 'POST',
      body: JSON.stringify(projectRoleData),
    });
  }

  async updateProjectRole(projectRoleId: string, projectRoleData: ProjectRoleRequestDto): Promise<ProjectRoleDto> {
    return this.fetchWithAuth(`/project-roles/${projectRoleId}`, {
      method: 'PUT',
      body: JSON.stringify(projectRoleData),
    });
  }

  async deleteProjectRole(projectRoleId: string): Promise<void> {
    return this.fetchWithAuth(`/project-roles/${projectRoleId}`, {
      method: 'DELETE',
    });
  }

  // ========================
  // PROJECT ATTACHMENTS OPERATIONS
  // ========================

  async getProjectAttachments(projectId: string, params?: ProjectAttachmentPaginationParams): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/projects/${projectId}/attachments${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithAuth(endpoint);
  }

  async getProjectAttachmentById(projectId: string, attachmentId: string): Promise<ProjectAttachmentDto> {
    return this.fetchWithAuth(`/projects/${projectId}/attachments/${attachmentId}`);
  }

  async uploadProjectAttachment(projectId: string, attachmentData: UploadProjectAttachmentRequestDto): Promise<ProjectAttachmentDto> {
    const formData = new FormData();
    formData.append('file', attachmentData.file);
    if (attachmentData.title) formData.append('title', attachmentData.title);
    if (attachmentData.description) formData.append('description', attachmentData.description);
    if (attachmentData.typeId) formData.append('typeId', attachmentData.typeId);

    // For file uploads, we need different headers
    const headers: Record<string, string> = {};
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}/projects/${projectId}/attachments`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `File upload failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage += ` - ${errorData}`;
        }
      } catch {
        // Ignore error parsing
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async deleteProjectAttachment(projectId: string, attachmentId: string): Promise<void> {
    return this.fetchWithAuth(`/projects/${projectId}/attachments/${attachmentId}`, {
      method: 'DELETE',
    });
  }
}

// Note: Don't use a singleton instance - create new instances with authentication
// For React components, use the useProjectsApi hook instead
