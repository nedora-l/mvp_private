// Projects Client Library Exports
// Index file for easy importing from client code

// API Client Service Class (use useProjectsApi hook instead for React components)
export { ProjectsApiClient } from './projects.client';

// Re-export DTOs and types for convenience
export type {
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
} from '../../server/projects/projects.dtos';

// Note: For React components, use the useProjectsApi hook from @/lib/hooks/useProjectsApi
// This ensures proper authentication is handled automatically
