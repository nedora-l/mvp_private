# Atimeus API Client Library

This library provides TypeScript client services for interacting with the Atimeus API endpoints in your Next.js application.

## Overview

The Atimeus API client library offers comprehensive support for:

- **Employee Management**: Search and retrieve employee information
- **Project Management**: Access project data and indicators
- **CRA Management**: Full CRUD operations for Client Requirement Analysis
- **Activity Management**: Search and view activity data
- **Custom API Key Support**: Override default API keys per request

## Features

### Employee Management
- Search employees with views and RSQL filters
- Get employee details by ID
- Retrieve available employee views
- Support for pagination and sorting

### Project Management
- Search projects with views and filters
- Get all projects with optional filtering
- Get project details by ID
- Retrieve project performance indicators/metrics
- Get available project views

### CRA (Client Requirement Analysis) Management
- Create new CRA entries
- Search CRAs with filtering
- Get CRA details by ID
- Update existing CRAs
- Delete CRA entries
- Full CRUD operations support

### Activity Management
- Search activities with views and filters
- Get activity details by ID
- Retrieve available activity views
- Support for pagination and sorting

### Authentication & Security
- JWT token-based authentication
- Custom API key override support
- Secure header management

## Installation & Usage

### Basic Import

```typescript
import { 
  atimeusServerService, 
  atimeusApiClient,
  EmployeeDto, 
  AtimeusProjectDto,
  CRARequestDto,
  EmployeeSearchParams 
} from '@/lib/atimeus';
```

### Example Usage

#### Searching Employees

```typescript
import { atimeusServerService, EmployeeSearchParams } from '@/lib/atimeus';

// Search employees with filters
const searchParams: EmployeeSearchParams = {
  view: 'default',
  filter: 'isActive==true and department==IT', // RSQL filter
  page: 0,
  size: 10,
  sortBy: 'firstName',
  sortDirection: 'asc'
};

const employees = await atimeusServerService.searchEmployees(
  accessToken, 
  searchParams,
  'custom-api-key' // Optional
);

// Get specific employee
const employee = await atimeusServerService.getEmployeeById(
  accessToken, 
  'employee-id'
);

// Get available employee views
const views = await atimeusServerService.getEmployeeViews(accessToken);
```

#### Managing Projects

```typescript
import { AtimeusProjectSearchParams } from '@/lib/atimeus';

// Search projects
const projectParams: AtimeusProjectSearchParams = {
  view: 'detailed',
  filter: 'status==active and budget>=50000',
  page: 0,
  size: 20,
  sortBy: 'startDate',
  sortDirection: 'desc'
};

const projects = await atimeusServerService.searchProjects(
  accessToken, 
  projectParams
);

// Get all projects
const allProjects = await atimeusServerService.getAllProjects(accessToken);

// Get project indicators/metrics
const indicators = await atimeusServerService.getProjectIndicators(
  accessToken, 
  'project-id'
);
```

#### CRA Management

```typescript
import { CRARequestDto, CRASearchParams } from '@/lib/atimeus';

// Create new CRA
const newCRA: CRARequestDto = {
  title: 'New Client Analysis',
  description: 'Analysis for new feature requirements',
  clientId: 'client-123',
  projectId: 'project-456',
  requirements: 'Client needs real-time dashboard',
  status: 'pending',
  priority: 'high',
  estimatedHours: 40,
  startDate: '2025-07-15',
  endDate: '2025-08-15'
};

const createdCRA = await atimeusServerService.createCRA(accessToken, newCRA);

// Search CRAs
const craParams: CRASearchParams = {
  filter: 'status==pending and priority==high',
  page: 0,
  size: 10
};

const cras = await atimeusServerService.searchCRAs(accessToken, craParams);

// Update CRA
const updateData: CRARequestDto = {
  title: 'Updated CRA Title',
  status: 'in-progress'
};

const updatedCRA = await atimeusServerService.updateCRA(
  accessToken, 
  'cra-id', 
  updateData
);

// Delete CRA
await atimeusServerService.deleteCRA(accessToken, 'cra-id');
```

#### Activity Management

```typescript
import { ActivitySearchParams } from '@/lib/atimeus';

// Search activities
const activityParams: ActivitySearchParams = {
  view: 'default',
  filter: 'isActive==true and type==development',
  page: 0,
  size: 15
};

const activities = await atimeusServerService.searchActivities(
  accessToken, 
  activityParams
);

// Get specific activity
const activity = await atimeusServerService.getActivityById(
  accessToken, 
  'activity-id'
);
```

## API Endpoints

The following REST API endpoints are supported:

### Employees
- `GET /api/v1/atimeus/employees/search` - Search employees with filters
- `GET /api/v1/atimeus/employees/{id}` - Get employee by ID
- `GET /api/v1/atimeus/employees/views` - Get available employee views

### Projects
- `GET /api/v1/atimeus/projects/search` - Search projects with filters
- `GET /api/v1/atimeus/projects` - Get all projects
- `GET /api/v1/atimeus/projects/{id}` - Get project by ID
- `GET /api/v1/atimeus/projects/{id}/indicators` - Get project indicators
- `GET /api/v1/atimeus/projects/views` - Get available project views

### CRAs (Client Requirement Analysis)
- `POST /api/v1/atimeus/cras` - Create new CRA
- `GET /api/v1/atimeus/cras/search` - Search CRAs
- `GET /api/v1/atimeus/cras/{id}` - Get CRA by ID
- `PUT /api/v1/atimeus/cras/{id}` - Update CRA
- `DELETE /api/v1/atimeus/cras/{id}` - Delete CRA

### Activities
- `GET /api/v1/atimeus/activities/search` - Search activities with filters
- `GET /api/v1/atimeus/activities/{id}` - Get activity by ID
- `GET /api/v1/atimeus/activities/views` - Get available activity views

## Data Types

### Core Interfaces

```typescript
interface EmployeeDto {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
}

interface AtimeusProjectDto {
  id: string;
  name?: string;
  code?: string;
  clientName?: string;
  status?: string;
  budget?: number;
  isActive?: boolean;
}

interface CRADto {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  estimatedHours?: number;
  actualHours?: number;
}

interface ActivityDto {
  id: string;
  name?: string;
  type?: string;
  duration?: number;
  isActive?: boolean;
}
```

### Search Parameters

```typescript
interface EmployeeSearchParams {
  view?: string;
  filter?: string; // RSQL format
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
```

## RSQL Filtering

The Atimeus API supports RSQL (RESTful Service Query Language) for advanced filtering:

### Basic Operators
- `==` - equals
- `!=` - not equals
- `>=` - greater than or equal
- `<=` - less than or equal
- `=in=` - in list
- `=out=` - not in list

### Logical Operators
- `and` - logical AND
- `or` - logical OR
- `;` - logical AND (alternative)
- `,` - logical OR (alternative)

### Example Filters

```typescript
// Employee filters
'isActive==true'
'department==IT and isActive==true'
'position==*Developer* and isActive==true'
'email==*@company.com'

// Project filters
'status==active'
'budget>=100000'
'startDate>=2025-01-01 and status==active'
'clientName==*ACME*'

// CRA filters
'status==pending and priority==high'
'estimatedHours>=20 and estimatedHours<=80'
'assignedTo==current-user-id'

// Activity filters
'isActive==true and type==development'
'duration>=480' // 8 hours in minutes
'startTime>=2025-07-10'
```

## Authentication & API Keys

### JWT Authentication
All endpoints require JWT authentication via the `Authorization` header:

```typescript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

### Custom API Keys
You can override the default API key using the `X-Atimeus-API-Key` header:

```typescript
// Using custom API key in server service
await atimeusServerService.searchEmployees(
  accessToken, 
  searchParams, 
  'custom-api-key'
);

// Using custom API key in client
await atimeusApiClient.searchEmployees(searchParams, 'custom-api-key');
```

## Error Handling

All API methods throw errors that should be caught and handled appropriately:

```typescript
try {
  const employees = await atimeusServerService.searchEmployees(accessToken);
  // Handle success
} catch (error) {
  console.error('Failed to fetch employees:', error);
  // Handle error - could be network, authentication, or API error
}
```

## Configuration

### Default Configuration

```typescript
import { DEFAULT_ATIMEUS_CONFIG } from '@/lib/atimeus';

const config = {
  apiKey: 'SA7lDfw3j9g0ncEvEJEszJwVr',
  baseUrl: '/api/v1/atimeus',
  timeout: 30000
};
```

### Custom Configuration

```typescript
import { AtimeusApiClient, AtimeusServerService } from '@/lib/atimeus';

// Custom client configuration
const customClient = new AtimeusApiClient('/custom/api/path', {
  apiKey: 'your-custom-api-key',
  timeout: 60000
});

// Custom server service configuration
const customServerService = new AtimeusServerService({
  apiKey: 'your-custom-api-key'
});
```

## Best Practices

### 1. Use Views Appropriately
Different views return different sets of fields. Use the appropriate view for your use case:
- `default` - Standard fields
- `detailed` - Extended information
- `summary` - Minimal fields for lists

### 2. Implement Proper Error Handling
Always wrap API calls in try-catch blocks and provide meaningful error messages to users.

### 3. Use RSQL Filters Efficiently
Combine multiple conditions in a single filter rather than making multiple API calls:

```typescript
// Good
filter: 'isActive==true and department==IT and position==*Senior*'

// Less efficient
// Multiple separate calls with different filters
```

### 4. Paginate Large Results
Use pagination parameters to avoid loading too much data at once:

```typescript
const params = {
  page: 0,
  size: 20, // Reasonable page size
  sortBy: 'createdAt',
  sortDirection: 'desc'
};
```

### 5. Cache API Keys Securely
Store API keys securely and avoid hardcoding them in client-side code.

## Support

For questions or issues with the Atimeus API client library, please refer to the main API documentation or contact the development team.

## File Structure

```
atimeus/
├── index.ts                      # Main exports
├── atimeus.dtos.ts              # TypeScript interfaces and types
├── atimeus.server.service.ts    # Server-side service class
├── atimeus.client.ts            # Client-side service class
├── examples.ts                  # Usage examples
└── README.md                    # This documentation
```

## Dependencies

- `../http/http-client` - HTTP client for making API requests
- `../index` - Common interfaces (HateoasResponse, ApiAppResponse)

## Future Enhancements

- Batch operations for multiple entities
- Real-time updates via WebSocket integration
- Advanced caching strategies
- GraphQL support
- Bulk CRA operations
- Activity time tracking integration
- Enhanced project metrics and analytics
