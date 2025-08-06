# Email Template API Client for Next.js

This directory contains TypeScript API clients for the Email Template management system, providing both server-side and client-side implementations for Next.js applications.

## Files Structure

```
email_templates/
├── emailTemplate.dtos.ts          # TypeScript interfaces and types
├── emailTemplate.client.ts        # Client-side API client (browser)
├── emailTemplate.server.service.ts # Server-side API client (SSR/API routes)
├── index.ts                       # Exports for easy importing
└── README.md                      # This documentation
```

## Features

### Complete Email Template Management
- ✅ **CRUD Operations**: Create, read, update, delete templates
- ✅ **Status Management**: Activate, deactivate, set as default
- ✅ **Category Management**: Filter and organize by categories
- ✅ **Search & Filtering**: Full-text search with status/category filters
- ✅ **Template Preview**: Preview with variable substitution
- ✅ **Variable Extraction**: Automatically detect template variables
- ✅ **Template Cloning**: Duplicate existing templates
- ✅ **Bulk Operations**: Batch activate/deactivate/delete
- ✅ **Statistics**: Template usage and status statistics
- ✅ **Pagination**: Efficient data loading with pagination

### Template Features
- **Multi-format Content**: HTML and plain text versions
- **Variable Substitution**: Dynamic content with `{{variable}}` syntax
- **Internationalization**: Multi-language template support
- **Metadata & Tags**: Flexible tagging and metadata system
- **Attachments**: Support for template attachments
- **Versioning**: Template version tracking

## Installation & Setup

### 1. Copy Files to Your Project

Copy the TypeScript files to your Next.js project:

```bash
# Copy to your project structure
cp email_templates/* /your-nextjs-project/src/lib/api/email-templates/
```

### 2. Update Import Paths

In `emailTemplate.server.service.ts`, update the imports to match your project structure:

```typescript
// Replace these mock imports with your actual imports:
import { httpClient } from "@/lib/utils/http-client";
import { HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis";
```

### 3. Install Dependencies

Ensure you have the required dependencies in your Next.js project:

```bash
npm install axios  # or your preferred HTTP client
```

## Usage Examples

### Client-Side Usage (React Components)

```typescript
import { emailTemplateApiClient, EmailTemplateStatus } from '@/lib/api/email-templates';

// Get all templates with pagination
const MyTemplatesComponent = () => {
  const [templates, setTemplates] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const result = await emailTemplateApiClient.getAllTemplates({
          page: 0,
          size: 10,
          status: EmailTemplateStatus.ACTIVE
        });
        setTemplates(result);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div>
      {templates?.content.map(template => (
        <div key={template.id}>
          <h3>{template.displayName}</h3>
          <p>{template.description}</p>
        </div>
      ))}
    </div>
  );
};

// Create a new template
const createTemplate = async () => {
  try {
    const newTemplate = await emailTemplateApiClient.createTemplate({
      name: "welcome-email",
      displayName: "Welcome Email",
      category: "user-onboarding",
      subjectTemplate: "Welcome to {{companyName}}!",
      htmlContent: "<h1>Welcome {{userName}}!</h1>",
      status: EmailTemplateStatus.DRAFT
    });
    console.log('Template created:', newTemplate);
  } catch (error) {
    console.error('Failed to create template:', error);
  }
};

// Preview template with variables
const previewTemplate = async (templateId: number) => {
  try {
    const preview = await emailTemplateApiClient.previewTemplate(templateId, {
      companyName: "Acme Corp",
      userName: "John Doe"
    });
    console.log('Preview:', preview);
  } catch (error) {
    console.error('Failed to preview template:', error);
  }
};
```

### Server-Side Usage (API Routes, SSR)

```typescript
import { emailTemplateServerService } from '@/lib/api/email-templates';

// API Route example
export async function GET(request: Request) {
  try {
    const accessToken = getTokenFromRequest(request);
    const templates = await emailTemplateServerService.getAllTemplates(
      accessToken,
      { page: 0, size: 20 }
    );
    
    return Response.json(templates);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

// Server-side template management
const manageTemplate = async (accessToken: string) => {
  try {
    // Create template
    const newTemplate = await emailTemplateServerService.createTemplate(accessToken, {
      name: "password-reset",
      displayName: "Password Reset",
      category: "security",
      subjectTemplate: "Reset your password",
      htmlContent: "<p>Click <a href='{{resetLink}}'>here</a> to reset your password.</p>"
    });

    // Activate template
    await emailTemplateServerService.activateTemplate(accessToken, newTemplate.id!);

    // Set as default for category
    await emailTemplateServerService.setAsDefault(accessToken, newTemplate.id!);

    return newTemplate;
  } catch (error) {
    console.error('Template management failed:', error);
    throw error;
  }
};
```

### Advanced Usage Examples

```typescript
// Search templates
const searchResults = await emailTemplateApiClient.searchTemplates(
  "welcome",
  EmailTemplateStatus.ACTIVE,
  0,
  10
);

// Get templates by category
const categoryTemplates = await emailTemplateApiClient.getTemplatesByCategory("user-onboarding");

// Extract variables from content
const variables = await emailTemplateApiClient.extractVariables({
  subjectTemplate: "Welcome {{userName}} to {{companyName}}",
  htmlContent: "<h1>Hello {{userName}}!</h1><p>Your account: {{accountId}}</p>"
});
// Returns: { subjectVariables: ["userName", "companyName"], htmlVariables: ["userName", "accountId"], plainTextVariables: [] }

// Clone template
const clonedTemplate = await emailTemplateApiClient.cloneTemplate(templateId, {
  newName: "welcome-email-v2",
  newDisplayName: "Welcome Email V2"
});

// Bulk operations
await emailTemplateApiClient.bulkAction({
  action: "activate",
  templateIds: [1, 2, 3, 4, 5]
});

// Get statistics
const stats = await emailTemplateApiClient.getTemplateStatistics();
console.log(`Total templates: ${stats.totalTemplates}, Active: ${stats.activeTemplates}`);
```

## API Endpoints Covered

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/emails/templates` | GET | Get all templates (paginated, filtered) |
| `/api/admin/emails/templates` | POST | Create new template |
| `/api/admin/emails/templates/{id}` | GET | Get template by ID |
| `/api/admin/emails/templates/{id}` | PUT | Update template |
| `/api/admin/emails/templates/{id}` | DELETE | Delete template |
| `/api/admin/emails/templates/by-name/{name}` | GET | Get template by name |
| `/api/admin/emails/templates/{id}/activate` | POST | Activate template |
| `/api/admin/emails/templates/{id}/deactivate` | POST | Deactivate template |
| `/api/admin/emails/templates/{id}/set-default` | POST | Set as default template |
| `/api/admin/emails/templates/category/{category}` | GET | Get templates by category |
| `/api/admin/emails/templates/category/{category}/default` | GET | Get default template for category |
| `/api/admin/emails/templates/{id}/preview` | POST | Preview template with variables |
| `/api/admin/emails/templates/extract-variables` | POST | Extract variables from content |
| `/api/admin/emails/templates/{id}/clone` | POST | Clone template |
| `/api/admin/emails/templates/statistics` | GET | Get template statistics |
| `/api/admin/emails/templates/bulk-action` | POST | Bulk operations |
| `/api/admin/emails/templates/categories` | GET | Get all categories |

## Error Handling

Both clients include comprehensive error handling:

```typescript
try {
  const template = await emailTemplateApiClient.getTemplateById(123);
} catch (error) {
  if (error.message.includes('404')) {
    console.log('Template not found');
  } else if (error.message.includes('403')) {
    console.log('Access denied');
  } else {
    console.log('Unexpected error:', error.message);
  }
}
```

## TypeScript Support

All interfaces and types are fully typed for excellent TypeScript support:

```typescript
// Strongly typed template creation
const template: CreateEmailTemplateRequest = {
  name: "my-template",
  displayName: "My Template",
  category: "marketing",
  subjectTemplate: "Subject with {{variable}}",
  htmlContent: "<html>...</html>",
  status: EmailTemplateStatus.DRAFT
};

// Type-safe responses
const result: PaginatedEmailTemplatesResponse = await emailTemplateApiClient.getAllTemplates();
```

## Integration with Spring Boot Backend

These clients are designed to work with the Spring Boot Email Template API:

- **Controller**: `EmailTemplateAdminApiController`
- **Service**: `EmailTemplateService`
- **Model**: `EmailTemplate`, `EmailTemplateVariable`, `EmailTemplateAttachment`
- **DTOs**: `EmailTemplateDto`, `EmailTemplateVariableDto`, `EmailTemplateAttachmentDto`

## Best Practices

1. **Authentication**: Always include proper authentication tokens
2. **Error Handling**: Implement comprehensive error handling
3. **Pagination**: Use pagination for large datasets
4. **Caching**: Consider caching frequently accessed templates
5. **Validation**: Validate template content before saving
6. **Testing**: Test template previews before activating

## Contributing

When adding new features:

1. Update the DTOs in `emailTemplate.dtos.ts`
2. Add corresponding methods to both client and server services
3. Update this README with new examples
4. Ensure TypeScript types are properly defined

## License

This code follows the same license as the main Spring Boot project.
