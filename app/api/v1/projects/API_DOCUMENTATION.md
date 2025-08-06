# Projects API Routes

This document describes the complete API routes for the Projects management system.

## Base URL
All endpoints are prefixed with `/api/v1/projects`

## Authentication
All endpoints require Bearer token authentication via the `Authorization` header.

## API Endpoints

### Projects
- `GET /projects` - Get paginated list of projects
- `POST /projects` - Create a new project
- `GET /projects/{projectId}` - Get project details by ID
- `PUT /projects/{projectId}` - Update an existing project
- `DELETE /projects/{projectId}` - Delete a project

### Project Types
- `GET /projects-types` - Get paginated list of project types
- `POST /projects-types` - Create a new project type
- `GET /projects-types/{typeId}` - Get project type details by ID
- `PUT /projects-types/{typeId}` - Update an existing project type
- `DELETE /projects-types/{typeId}` - Delete a project type

### Project Members
- `GET /projects/{projectId}/members` - Get project members by project ID
- `POST /projects/{projectId}/members` - Add a member to a project
- `GET /projects/{projectId}/members/{memberId}` - Get project member details
- `DELETE /projects/{projectId}/members/{memberId}` - Remove a member from a project

### Project Roles
- `GET /project-roles` - Get paginated list of project roles
- `POST /project-roles` - Create a new project role
- `GET /project-roles/{roleId}` - Get project role details by ID
- `PUT /project-roles/{roleId}` - Update an existing project role
- `DELETE /project-roles/{roleId}` - Delete a project role

### Project Attachments
- `GET /projects/{projectId}/attachments` - Get project attachments by project ID
- `POST /projects/{projectId}/attachments` - Upload an attachment to a project
- `GET /projects/{projectId}/attachments/{attachmentId}` - Get project attachment details
- `DELETE /projects/{projectId}/attachments/{attachmentId}` - Delete a project attachment

## Query Parameters

### Pagination Parameters
- `page` - Page number (0-based)
- `size` - Number of items per page
- `sortBy` - Field to sort by
- `sortDirection` - Sort direction ('asc' or 'desc')
- `query` - Search query string

### Project-specific Sort Fields
- Projects: `id`, `title`, `createdAt`, `updatedAt`, `startsAt`, `endsAt`, `isActive`, `isArchived`, `budget`
- Project Types: `id`, `title`, `createdAt`, `updatedAt`, `isActive`, `isArchived`
- Project Members: `id`, `createdAt`, `memberId`, `roleId`
- Project Roles: `id`, `title`, `createdAt`, `isActive`

## Response Format

All endpoints return responses in the following format:

```json
{
  "status": 200,
  "message": "Success",
  "data": { ... },
  "type": "HATEOAS_RECORD_LIST" | "SINGLE_RECORD"
}
```

For paginated responses, the data includes HATEOAS links and embedded resources:

```json
{
  "data": {
    "_embedded": {
      "projects": [...],
      "projectTypes": [...],
      "members": [...],
      "projectRoles": [...]
    },
    "_links": { ... },
    "page": { ... }
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `500` - Internal Server Error
- `501` - Not Implemented (for features not yet available)

## Notes

- File upload functionality for attachments is marked as "Not Implemented" (501) until the server service is updated
- All date fields use ISO 8601 format
- Boolean fields default to appropriate values when not specified
- The API follows REST conventions and includes HATEOAS links for navigation
