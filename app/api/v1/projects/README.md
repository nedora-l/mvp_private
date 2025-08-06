# Projects API Routes

This document describes the Next.js API routes created for the Projects management system.

## API Endpoints Created

### Projects

- **GET** `/api/v1/projects/projects` - Get paginated list of projects
- **POST** `/api/v1/projects/projects` - Create a new project
- **GET** `/api/v1/projects/projects/[id]` - Get a specific project by ID
- **PUT** `/api/v1/projects/projects/[id]` - Update a specific project
- **DELETE** `/api/v1/projects/projects/[id]` - Delete a specific project

### Project Types

- **GET** `/api/v1/projects/projects-types` - Get paginated list of project types
- **POST** `/api/v1/projects/projects-types` - Create a new project type
- **GET** `/api/v1/projects/projects-types/[id]` - Get a specific project type by ID
- **PUT** `/api/v1/projects/projects-types/[id]` - Update a specific project type
- **DELETE** `/api/v1/projects/projects-types/[id]` - Delete a specific project type

### Project Members

- **GET** `/api/v1/projects/projects/[projectId]/members` - Get project members
- **POST** `/api/v1/projects/projects/[projectId]/members` - Add a member to project
- **GET** `/api/v1/projects/projects/[projectId]/members/[memberId]` - Get specific project member
- **DELETE** `/api/v1/projects/projects/[projectId]/members/[memberId]` - Remove member from project

## File Structure

```
app/api/v1/projects/
├── projects/
│   ├── route.ts                           # Projects CRUD operations
│   ├── [id]/
│   │   └── route.ts                       # Single project operations
│   └── [projectId]/
│       └── members/
│           ├── route.ts                   # Project members operations
│           └── [memberId]/
│               └── route.ts               # Single project member operations
└── projects-types/
    ├── route.ts                           # Project types CRUD operations
    └── [id]/
        └── route.ts                       # Single project type operations
```

## Authentication

All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-access-token>
```

## Request/Response Format

### Standard Response Format

```json
{
  "status": 200,
  "message": "Success",
  "data": { ... },
  "type": "RECORD_DETAILS" | "HATEOAS_RECORD_LIST" | "SUCCESS" | "ERROR"
}
```

### Error Response Format

```json
{
  "status": 400|500,
  "message": "Error message",
  "data": null,
  "type": "ERROR"
}
```

## Pagination Parameters

For list endpoints (GET), the following query parameters are supported:

- `page` - Page number (0-based)
- `size` - Number of items per page
- `sortBy` - Field to sort by
- `sortDirection` - 'asc' or 'desc'
- `query` - Search query string

Example:

```
GET /api/v1/projects/projects?page=0&size=10&sortBy=createdAt&sortDirection=desc&query=web
```

## Project Data Examples

### Create Project Request

```json
{
  "title": "E-commerce Platform",
  "description": "Building a modern e-commerce platform",
  "startsAt": "2025-01-01",
  "endsAt": "2025-12-31",
  "isActive": true,
  "isArchived": false,
  "budget": 150000
}
```

### Project Response

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "orgId": 1,
  "createdAt": "2025-01-15T10:30:00Z",
  "createdById": 456,
  "updatedAt": "2025-01-15T15:45:00Z",
  "updatedById": 456,
  "title": "E-commerce Platform",
  "description": "Building a modern e-commerce platform",
  "startsAt": "2025-01-01",
  "endsAt": "2025-12-31",
  "isActive": true,
  "isArchived": false,
  "budget": 150000
}
```

## Client Usage

The client-side API client is available for easy integration:

```typescript
import { projectsApiClient } from '@/lib/services/client/projects';

// Get projects
const projects = await projectsApiClient.getProjects({
  page: 0,
  size: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc'
});

// Create project
const newProject = await projectsApiClient.createProject({
  title: 'New Project',
  description: 'Project description',
  isActive: true
});

// Update project
const updatedProject = await projectsApiClient.updateProject('project-id', {
  title: 'Updated Project',
  budget: 200000
});
```

## Demo Component

A demo component is available at `components/projects/ProjectsApiDemo.tsx` that demonstrates how to use the Projects API client in a React component.

## Backend Integration

These API routes connect to the backend Projects service using the `projectsServerService` which handles:
- Authentication token management
- HTTP client configuration
- Error handling and response formatting
- Type-safe API calls to the Java backend

The routes act as a proxy layer between the Next.js frontend and the Java backend, providing:
- Consistent error handling
- Type safety with TypeScript
- Authentication validation
- Request/response transformation

## Next Steps

1. **Test the API routes** - Use the demo component or API testing tools
2. **Create project management UI** - Build forms and lists using the client API
3. **Add validation** - Implement client-side and server-side validation
4. **Error handling** - Improve error messages and user feedback
5. **Optimize performance** - Add caching and pagination optimizations
