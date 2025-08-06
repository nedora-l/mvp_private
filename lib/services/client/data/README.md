# Dynamic Data API Services

This document describes the client services and API routes for dynamic data operations, including CRUD operations and OQL query execution.

## Architecture Overview

The dynamic data services follow a layered architecture:

1. **Client Services** - Frontend API calls using the standardized apiClient
2. **API Routes** - Next.js API routes that handle HTTP requests
3. **Server Services** - Backend services that communicate with external APIs

## File Structure

```
lib/services/client/data/
├── dynData.client.service.ts          # CRUD operations client service
├── oql.client.service.ts               # OQL operations client service  
├── dataQueryBuilder.client.service.ts # Data query builder with fluent API
├── oqlQueryBuilder.client.service.ts  # OQL query builder with fluent API
└── index.ts                           # Export all client services

app/api/v1/data/
├── records/
│   ├── route.ts                       # GET /api/v1/data/records, POST /api/v1/data/records
│   └── [id]/
│       └── route.ts                   # GET, PUT, DELETE /api/v1/data/records/{id}
└── oql/
    ├── execute/
    │   └── route.ts                   # POST /api/v1/data/oql/execute
    └── sync/
        └── route.ts                   # GET /api/v1/data/oql/sync
```

## Client Services

### Basic CRUD Operations

```typescript
import {
  getDataRecordsClientApi,
  getDataRecordDetailsClientApi,
  createDataRecordClientApi,
  updateDataRecordClientApi,
  deleteDataRecordClientApi
} from '@/lib/services/client/data';

// Get paginated records
const records = await getDataRecordsClientApi({
  page: 1,
  size: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc'
});

// Get specific record
const record = await getDataRecordDetailsClientApi('record-id');

// Create new record
const newRecord = await createDataRecordClientApi({
  metaRecordApiName: 'Contact',
  data: { name: 'John Doe', email: 'john@example.com' },
  isActive: true,
  isPublic: false
});

// Update record
const updatedRecord = await updateDataRecordClientApi('record-id', {
  metaRecordApiName: 'Contact',
  data: { name: 'Jane Doe', email: 'jane@example.com' }
});

// Delete record
await deleteDataRecordClientApi('record-id');
```

### Query Builder for Data Records

```typescript
import { dataQueryBuilderClient } from '@/lib/services/client/data';

// Fluent API for building data queries
const results = await dataQueryBuilderClient('Contact')
  .withFields(['id', 'name', 'email', 'createdAt'])
  .page(1)
  .limit(20)
  .sortBy('name', 'asc')
  .fetch();
```

### OQL Operations

```typescript
import {
  executeOqlQueryClientApi,
  syncGraphClientApi
} from '@/lib/services/client/data';

// Execute OQL query
const result = await executeOqlQueryClientApi(
  "SELECT id, name, email FROM Contact WHERE isActive = 'true' LIMIT 10"
);

// Sync knowledge graph
const syncResult = await syncGraphClientApi();
```

### OQL Query Builder

```typescript
import { oqlQueryBuilderClient } from '@/lib/services/client/data';

// Fluent API for building OQL queries
const results = await oqlQueryBuilderClient('Contact')
  .addField('id')
  .addField('name')
  .addField('email')
  .where('isActive', '=', true)
  .andWhere('email', 'LIKE', '%@company.com')
  .limit(50)
  .fetch();

// Complex query with OR conditions
const complexResults = await oqlQueryBuilderClient('Task')
  .addField('*')
  .where('status', '=', 'open')
  .orWhere('priority', '=', 'high')
  .andWhere('assignee', '=', 'john.doe')
  .sortBy('createdAt', 'desc')
  .limit(25)
  .fetch();
```

## API Routes

### Data Records Routes

#### GET /api/v1/data/records
Get paginated list of data records.

**Query Parameters:**
- `page` (number, optional): Page number for pagination
- `size` (number, optional): Number of records per page
- `sortBy` (string, optional): Field to sort by
- `sortDirection` ('asc' | 'desc', optional): Sort direction
- `object` (string, optional): Object API name filter
- `fields` (string, optional): Comma-separated list of fields to return

**Response:**
```typescript
{
  success: boolean;
  data: DataRecordDto[];
  message: string;
}
```

#### POST /api/v1/data/records
Create a new data record.

**Request Body:**
```typescript
{
  metaRecordApiName: string;
  recordTypeId?: string;
  data?: Record<string, any>;
  isActive?: boolean;
  isArchived?: boolean;
  isPublic?: boolean;
}
```

#### GET /api/v1/data/records/{id}
Get specific data record by ID.

#### PUT /api/v1/data/records/{id}
Update existing data record.

#### DELETE /api/v1/data/records/{id}
Delete data record.

### OQL Routes

#### POST /api/v1/data/oql/execute
Execute an OQL query.

**Request Body:**
```typescript
{
  query: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: Record<string, DataRecordDtoMin>;
  message: string;
}
```

#### GET /api/v1/data/oql/sync
Sync the knowledge graph.

**Response:**
```typescript
{
  success: boolean;
  data: string;
  message: string;
}
```

## Data Types

### DataRecordDto
```typescript
interface DataRecordDto {
  id: string;
  createdAt: string;
  updatedAt?: string;
  metaDataRecord?: any;
  recordType?: any;
  name: string;
  type?: string;
  isActive: boolean;
  isArchived: boolean;
  isPublic: boolean;
  content?: string;
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}
```

### DataRecordRequestDto
```typescript
interface DataRecordRequestDto {
  metaRecordApiName: string;
  recordTypeId?: string;
  data?: Record<string, any>;
  isActive?: boolean;
  isArchived?: boolean;
  isPublic?: boolean;
}
```

### DataRecordDtoMin
```typescript
interface DataRecordDtoMin {
  id: string;
  createdAt: string;
  updatedAt?: string;
  name: string;
  metaRecordId?: string;
  recordTypeId?: string;
  data?: Record<string, any>;
  isActive: boolean;
  isArchived: boolean;
  isPublic: boolean;
}
```

## Authentication

All API routes require Bearer token authentication. The token is extracted from the `Authorization` header:

```
Authorization: Bearer <your-access-token>
```

## Error Handling

All API routes follow a consistent error response format:

```typescript
{
  success: false;
  error: string;
  message: string;
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing or invalid token)
- `500` - Internal Server Error

## Integration with Server Services

The API routes integrate with the existing server services:

- `dynDataCrudServerService` - Handles CRUD operations
- `dynDataOqlServerService` - Handles OQL operations and graph sync

These services are located in:
- `lib/services/server/dyn_data/dynDataCrud.server.service.ts`
- `lib/services/server/dyn_data/dynDataOql.server.service.ts`

## Usage Examples

### Complete CRUD Workflow

```typescript
import { 
  createDataRecordClientApi,
  getDataRecordDetailsClientApi,
  updateDataRecordClientApi,
  deleteDataRecordClientApi
} from '@/lib/services/client/data';

// Create a contact
const newContact = await createDataRecordClientApi({
  metaRecordApiName: 'Contact',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890'
  },
  isActive: true,
  isPublic: false
});

// Read the contact
const contact = await getDataRecordDetailsClientApi(newContact.data.id);

// Update the contact
const updatedContact = await updateDataRecordClientApi(contact.data.id, {
  metaRecordApiName: 'Contact',
  data: {
    ...contact.data.data,
    phone: '+0987654321'
  }
});

// Delete the contact
await deleteDataRecordClientApi(contact.data.id);
```

### Advanced OQL Queries

```typescript
import { oqlQueryBuilderClient } from '@/lib/services/client/data';

// Find all active contacts in a specific department
const departmentContacts = await oqlQueryBuilderClient('Contact')
  .addField('id')
  .addField('name')
  .addField('email')
  .addField('department')
  .where('isActive', '=', true)
  .andWhere('department', '=', 'Engineering')
  .sortBy('name', 'asc')
  .fetch();

// Find recent high-priority tasks
const urgentTasks = await oqlQueryBuilderClient('Task')
  .addField('*')
  .where('priority', '=', 'high')
  .andWhere('createdAt', '>=', '2024-01-01')
  .orWhere('status', '=', 'urgent')
  .limit(100)
  .fetch();
```
