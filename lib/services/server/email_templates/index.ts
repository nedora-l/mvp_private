// Email Template Library Exports
// Index file for easy importing

// DTOs and Types
export * from './emailTemplate.dtos';

// API Clients
export { emailTemplateApiClient } from './emailTemplate.client';
export { EmailTemplateServerService, emailTemplateServerService } from './emailTemplate.server.service';

// Re-export commonly used types for convenience
export type {
  EmailTemplateDto,
  EmailTemplateStatus,
  EmailTemplateVariableType,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
  EmailTemplatePreviewResponse,
  EmailTemplateStatistics,
  PaginatedEmailTemplatesResponse
} from './emailTemplate.dtos';
