// Projects Library Exports
// Index file for easy importing

// DTOs and Types
export * from './projects.dtos';

// API Client Services
export { ProjectsServerService, projectsServerService } from './projects.server.service';
export { ProjectsApiClient, projectsApiClient } from './projects.client';

// Re-export commonly used types for convenience
export type {
  ProjectDto,
  ProjectRequestDto,
  ProjectTypeDto,
  ProjectTypeRequestDto,
  ProjectMemberDto,
  AddProjectMemberRequestDto,
  ProjectRoleDto,
  ProjectAttachmentDto,
  UploadProjectAttachmentRequestDto,
  ProjectAttachmentTypeDto,
  ProjectPaginationParams,
  ProjectTypePaginationParams,
  ProjectMemberPaginationParams
} from './projects.dtos';

// Constants
export const PROJECTS_API_ENDPOINTS = {
  PROJECTS: '/api/v1/projects/projects',
  PROJECT_TYPES: '/api/v1/projects/projects-types',
  PROJECT_MEMBERS: (projectId: string) => `/api/v1/projects/projects/${projectId}/members`,
  PROJECT_MEMBER: (projectId: string, memberId: string) => `/api/v1/projects/projects/${projectId}/members/${memberId}`,
} as const;
