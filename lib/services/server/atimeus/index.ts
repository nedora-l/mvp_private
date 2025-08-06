// Atimeus Library Exports
// Index file for easy importing

// DTOs and Types
export * from './atimeus.dtos';

// API Client Services
export { AtimeusServerService, atimeusServerService } from './atimeus.server.service';
export { AtimeusApiClient, atimeusApiClient } from '../../client/atimeus/atimeus.client';

// Re-export commonly used types for convenience
export type {
  EmployeeDto,
  EmployeeSearchParams,
  EmployeeView,
  AtimeusProjectDto,
  AtimeusProjectSearchParams,
  AtimeusProjectView,
  ProjectIndicatorsDto,
  CRADto,
  CRARequestDto,
  CRASearchParams,
  ActivityDto,
  ActivitySearchParams,
  ActivityView,
  AtimeusApiConfig,
  AtimeusApiResponse
} from './atimeus.dtos';

// Constants
export const ATIMEUS_API_ENDPOINTS = {
  EMPLOYEES_SEARCH: '/api/v1/atimeus/employees/search',
  EMPLOYEES: '/api/v1/atimeus/employees',
  EMPLOYEE_VIEWS: '/api/v1/atimeus/employees/views',
  PROJECTS_SEARCH: '/api/v1/atimeus/projects/search',
  PROJECTS: '/api/v1/atimeus/projects',
  PROJECT_VIEWS: '/api/v1/atimeus/projects/views',
  PROJECT_INDICATORS: (projectId: string) => `/api/v1/atimeus/projects/${projectId}/indicators`,
  CRAS: '/api/v1/atimeus/cras',
  CRAS_SEARCH: '/api/v1/atimeus/cras/search',
  ACTIVITIES_SEARCH: '/api/v1/atimeus/activities/search',
  ACTIVITIES: '/api/v1/atimeus/activities',
  ACTIVITY_VIEWS: '/api/v1/atimeus/activities/views',
} as const;

// Default configuration
export const DEFAULT_ATIMEUS_CONFIG = {
  apiKey: 'SA7lDfw3j9g0ncEvEJEszJwVr', // Default API key from environment
  baseUrl: '/api/v1/atimeus',
  timeout: 30000
} as const;
