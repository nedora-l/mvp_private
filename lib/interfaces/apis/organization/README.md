# Organization DTOs

This directory contains TypeScript interfaces for organization-related Data Transfer Objects (DTOs) converted from Java DTOs.

## Overview

The organization DTOs provide type definitions for various organization-related entities and operations within the DAWS (Digital Workspace Solution) application.

## DTOs Included

### Core DTOs

1. **OrganizationValueDto** - Represents organization values/principles
   - Used for defining company values, mission statements, core principles
   - Includes title, description, category, and ordering

2. **OrganizationLeaderDto** - Represents organization leadership
   - Links employees to leadership positions
   - Includes position, title, department, bio, and tenure information

3. **OrganizationLocationDto** - Represents organization locations/offices
   - Defines physical locations, addresses, coordinates
   - Includes business hours, facilities, and location type

4. **OrganizationPinnedDocumentDto** - Represents pinned organization documents
   - Important documents pinned for organization-wide visibility
   - Includes access levels, categories, and targeting options

5. **UserOrganizationDto** - Represents user-organization relationships
   - Defines user roles, permissions, and organizational structure
   - Includes department, team, manager relationships

### Request DTOs

Each core DTO has corresponding `Create*RequestDto` and `Update*RequestDto` interfaces for API operations:

- `CreateOrganizationValueRequestDto` / `UpdateOrganizationValueRequestDto`
- `CreateOrganizationLeaderRequestDto` / `UpdateOrganizationLeaderRequestDto`
- `CreateOrganizationLocationRequestDto` / `UpdateOrganizationLocationRequestDto`
- `CreateOrganizationPinnedDocumentRequestDto` / `UpdateOrganizationPinnedDocumentRequestDto`
- `CreateUserOrganizationRequestDto` / `UpdateUserOrganizationRequestDto`

### Utility DTOs

- **OrganizationFilterDto** - For filtering organization-related data
- **OrganizationSearchRequestDto** - For search operations with pagination

## Usage

Import the interfaces you need:

```typescript
import {
  OrganizationValueDto,
  OrganizationLeaderDto,
  OrganizationLocationDto,
  OrganizationPinnedDocumentDto,
  UserOrganizationDto,
  CreateOrganizationValueRequestDto,
  // ... other interfaces
} from '@/lib/interfaces/apis/organization';
```

## Key Features

- **TypeScript-first**: Full type safety and intellisense support
- **Consistent patterns**: Follows established DTO patterns from the existing codebase
- **Optional fields**: Most fields are optional for flexibility
- **Enum support**: Uses string literal types for status and type fields
- **Relationship mapping**: Includes related entity information for denormalized data
- **Audit fields**: Includes created/updated timestamps and user tracking
- **Organizational hierarchy**: Supports department, team, and manager relationships

## Field Patterns

- `id?` - Optional entity identifier
- `organizationId` - Required organization context
- `*At` fields - ISO string timestamps
- `*ById` / `*ByName` - User tracking for audit trails
- `isActive?` - Soft delete/enable toggle
- `order?` - For ordered lists/displays
- `*Ids` arrays - For many-to-many relationships

## Integration

These DTOs integrate with:
- API routes (`/api/v1/organization/*`)
- Server services (`OrganizationServerService`)
- Client services (`OrganizationClientService`)
- Database models
- UI components

The interfaces follow the established HATEOAS and ApiResponse patterns used throughout the application.
