# Projects API Client Library

This library provides TypeScript client services for interacting with the Projects API endpoints in your Next.js application.

## Overview

The Projects API client library offers comprehensive support for:

- **Projects Management**: CRUD operations for projects
- **Project Types Management**: Managing different types of projects
- **Project Members Management**: Adding/removing members from projects
- **Project Attachments**: File management for projects (coming soon)

## Features

### Projects CRUD Operations
- Get paginated list of projects with filtering and sorting
- Get project details by ID
- Create new projects
- Update existing projects
- Delete projects

### Project Types Management
- Get paginated list of project types
- Get project type details by ID
- Create new project types
- Update existing project types
- Delete project types

### Project Members Management
- Get project members by project ID
- Get specific project member details
- Add members to projects with roles
- Remove members from projects

## Installation & Usage

### Basic Import

```typescript
import { 
  projectsServerService, 
  ProjectDto, 
  ProjectRequestDto,
  ProjectPaginationParams 
} from '@/lib/projects';
```

### Example Usage

#### Getting Projects

```typescript
import { projectsServerService } from '@/lib/projects';

// Get paginated projects
const projects = await projectsServerService.getProjects(
  accessToken, 
  {
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc'
  }
);

// Get specific project
const project = await projectsServerService.getProjectById(accessToken, 'project-id');
```

#### Creating Projects

```typescript
import { ProjectRequestDto } from '@/lib/projects';

const newProject: ProjectRequestDto = {
  title: 'New Project',
  description: 'Project description',
  startsAt: '2025-01-01',
  endsAt: '2025-12-31',
  isActive: true,
  isArchived: false,
  budget: 100000
};

const createdProject = await projectsServerService.createProject(accessToken, newProject);
```

#### Managing Project Types

```typescript
import { ProjectTypeRequestDto } from '@/lib/projects';

// Get project types
const projectTypes = await projectsServerService.getProjectTypes(accessToken);

// Create new project type
const newProjectType: ProjectTypeRequestDto = {
  title: 'Software Development',
  description: 'Software development projects',
  isActive: true,
  isArchived: false,
  orgId: 1
};

const createdType = await projectsServerService.createProjectType(accessToken, newProjectType);
```

#### Managing Project Members

```typescript
import { AddProjectMemberRequestDto } from '@/lib/projects';

// Get project members
const members = await projectsServerService.getProjectMembers(accessToken, 'project-id');

// Add member to project
const memberData: AddProjectMemberRequestDto = {
  memberId: 123,
  roleId: 'role-id'
};

const addedMember = await projectsServerService.addProjectMember(
  accessToken, 
  'project-id', 
  memberData
);

// Remove member from project
await projectsServerService.removeProjectMember(accessToken, 'project-id', 'member-id');
```

## API Endpoints

The following REST API endpoints are supported:

### Projects
- `GET /api/v1/projects/projects` - Get paginated projects
- `GET /api/v1/projects/projects/{id}` - Get project by ID
- `POST /api/v1/projects/projects` - Create new project
- `PUT /api/v1/projects/projects/{id}` - Update project
- `DELETE /api/v1/projects/projects/{id}` - Delete project

### Project Types
- `GET /api/v1/projects/projects-types` - Get paginated project types
- `GET /api/v1/projects/projects-types/{id}` - Get project type by ID
- `POST /api/v1/projects/projects-types` - Create new project type
- `PUT /api/v1/projects/projects-types/{id}` - Update project type
- `DELETE /api/v1/projects/projects-types/{id}` - Delete project type

### Project Members
- `GET /api/v1/projects/projects/{projectId}/members` - Get project members
- `GET /api/v1/projects/projects/{projectId}/members/{memberId}` - Get project member
- `POST /api/v1/projects/projects/{projectId}/members` - Add project member
- `DELETE /api/v1/projects/projects/{projectId}/members/{memberId}` - Remove project member

## Data Types

### Core Interfaces

```typescript
interface ProjectDto {
  id: string;
  orgId: number;
  createdAt: string;
  createdById: number;
  updatedAt?: string;
  updatedById?: number;
  title: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
  isArchived?: boolean;
  budget?: number;
}

interface ProjectRequestDto {
  title: string; // Required
  description?: string;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
  isArchived?: boolean;
  budget?: number;
}

interface ProjectTypeDto {
  id: string;
  createdBy: number;
  createdAt: string;
  updatedBy?: number;
  updatedAt?: string;
  title: string;
  description?: string;
  isActive?: boolean;
  isArchived?: boolean;
}

interface ProjectMemberDto {
  id: string;
  projectId: string;
  createdBy: number;
  createdAt: string;
  memberId: number;
  roleId: string;
  roleName?: string;
}
```

### Pagination Parameters

```typescript
interface ProjectPaginationParams {
  page?: number;
  size?: number;
  sortBy?: 'id' | 'title' | 'createdAt' | 'updatedAt' | 'startsAt' | 'endsAt' | 'isActive' | 'isArchived' | 'budget';
  sortDirection?: 'asc' | 'desc';
  query?: string;
}
```

## Error Handling

All API methods throw errors that should be caught and handled appropriately:

```typescript
try {
  const projects = await projectsServerService.getProjects(accessToken);
  // Handle success
} catch (error) {
  console.error('Failed to fetch projects:', error);
  // Handle error
}
```

## Authentication

All methods require an access token to be passed as the first parameter. Ensure you have a valid JWT token before making API calls.

## Support

For questions or issues with the Projects API client library, please refer to the main API documentation or contact the development team.

## File Structure

```
projects/
├── index.ts                    # Main exports
├── projects.dtos.ts           # TypeScript interfaces and types
├── projects.server.service.ts # Main service class
└── README.md                  # This documentation
```

## Dependencies

- `../http/http.client` - HTTP client for making API requests
- `../index` - Common interfaces (HateoasResponse, ApiAppResponse)

## Future Enhancements

- Project attachments management
- Project activity tracking
- Advanced project filtering and search
- Bulk operations for projects and members
- Project templates support
