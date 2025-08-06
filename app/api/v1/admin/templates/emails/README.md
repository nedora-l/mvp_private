# Email Templates API Endpoints

This document describes all the API endpoints available for email template management.

## Base URL
All endpoints are prefixed with `/api/v1/admin/templates/emails`

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Template CRUD Operations

#### 1. Get All Templates
- **GET** `/api/v1/admin/templates/emails`
- **Query Parameters:**
  - `page` (number, optional): Page number (default: 0)
  - `size` (number, optional): Page size (default: 10)
  - `sortBy` (string, optional): Sort field
  - `sortDir` (string, optional): Sort direction ('asc' | 'desc')
  - `status` (string, optional): Filter by status
  - `category` (string, optional): Filter by category
  - `searchTerm` (string, optional): Search term
- **Response:** Paginated list of email templates

#### 2. Get Template by ID
- **GET** `/api/v1/admin/templates/emails/{id}`
- **Parameters:**
  - `id` (number): Template ID
- **Response:** Single email template

#### 3. Get Template by Name
- **GET** `/api/v1/admin/templates/emails/by-name/{name}`
- **Parameters:**
  - `name` (string): Template name (URL encoded)
- **Response:** Single email template

#### 4. Create New Template
- **POST** `/api/v1/admin/templates/emails`
- **Body:** CreateEmailTemplateRequest
- **Response:** Created email template

#### 5. Update Template
- **PUT** `/api/v1/admin/templates/emails/{id}`
- **Parameters:**
  - `id` (number): Template ID
- **Body:** UpdateEmailTemplateRequest
- **Response:** Updated email template

#### 6. Delete Template
- **DELETE** `/api/v1/admin/templates/emails/{id}`
- **Parameters:**
  - `id` (number): Template ID
- **Response:** Success message

### Template Status Management

#### 7. Activate Template
- **POST** `/api/v1/admin/templates/emails/{id}/activate`
- **Parameters:**
  - `id` (number): Template ID
- **Response:** Activated template

#### 8. Deactivate Template
- **POST** `/api/v1/admin/templates/emails/{id}/deactivate`
- **Parameters:**
  - `id` (number): Template ID
- **Response:** Deactivated template

#### 9. Set as Default
- **POST** `/api/v1/admin/templates/emails/{id}/set-default`
- **Parameters:**
  - `id` (number): Template ID
- **Response:** Updated template

### Category Management

#### 10. Get Templates by Category
- **GET** `/api/v1/admin/templates/emails/category/{category}`
- **Parameters:**
  - `category` (string): Category name (URL encoded)
- **Response:** List of templates in category

#### 11. Get Default Template for Category
- **GET** `/api/v1/admin/templates/emails/category/{category}/default`
- **Parameters:**
  - `category` (string): Category name (URL encoded)
- **Response:** Default template for category

#### 12. Get All Categories
- **GET** `/api/v1/admin/templates/emails/categories`
- **Response:** List of all category names

### Template Processing

#### 13. Preview Template
- **POST** `/api/v1/admin/templates/emails/{id}/preview`
- **Parameters:**
  - `id` (number): Template ID
- **Body:** Variables object for substitution
- **Response:** Processed template content

#### 14. Extract Variables
- **POST** `/api/v1/admin/templates/emails/extract-variables`
- **Body:** ExtractVariablesRequest (template content)
- **Response:** List of variables found in template

### Advanced Operations

#### 15. Clone Template
- **POST** `/api/v1/admin/templates/emails/{id}/clone`
- **Parameters:**
  - `id` (number): Template ID to clone
- **Query Parameters:**
  - `newName` (string): New template name
  - `newDisplayName` (string, optional): New display name
- **Body:** CloneTemplateRequest (alternative to query params)
- **Response:** Cloned template

#### 16. Bulk Actions
- **POST** `/api/v1/admin/templates/emails/bulk-action`
- **Body:** BulkActionRequest
  ```json
  {
    "action": "activate" | "deactivate" | "delete",
    "templateIds": [1, 2, 3]
  }
  ```
- **Response:** Success message

#### 17. Get Statistics
- **GET** `/api/v1/admin/templates/emails/statistics`
- **Response:** Template statistics summary

## Response Format

All responses follow the standard API response format:

```json
{
  "status": 200,
  "message": "Success message",
  "data": { /* actual data */ },
  "type": "COLLECTION" | "RECORD_DETAILS" | "ERROR"
}
```

## Error Handling

- **401**: Authentication required
- **400**: Bad request (invalid parameters)
- **404**: Resource not found
- **500**: Internal server error

All errors return a JSON response with error details in the same format as successful responses, but with `type: "ERROR"`.
