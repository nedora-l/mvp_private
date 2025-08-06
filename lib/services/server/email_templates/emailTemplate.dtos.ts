// Email Template DTOs and Interfaces for Next.js Client

export interface EmailTemplateDto {
  id?: number;
  name: string;
  displayName: string;
  description?: string;
  category: string;
  subjectTemplate: string;
  htmlContent?: string;
  plainTextContent?: string;
  status?: EmailTemplateStatus;
  version?: number;
  isDefaultTemplate?: boolean;
  language?: string;
  tags?: string[];
  metadata?: Record<string, string>;
  variables?: EmailTemplateVariableDto[];
  attachments?: EmailTemplateAttachmentDto[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailTemplateVariableDto {
  id?: number;
  variableName: string;
  displayName: string;
  description?: string;
  variableType: EmailTemplateVariableType;
  required?: boolean;
  defaultValue?: string;
  validationPattern?: string;
  validationMessage?: string;
}

export interface EmailTemplateAttachmentDto {
  id?: number;
  filename: string;
  contentType: string;
  content?: Uint8Array;
  contentId?: string;
  inline?: boolean;
}

export enum EmailTemplateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  TESTING = 'TESTING'
}

export enum EmailTemplateVariableType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  EMAIL = 'EMAIL',
  URL = 'URL',
  BOOLEAN = 'BOOLEAN',
  IMAGE_URL = 'IMAGE_URL',
  LIST = 'LIST',
  OBJECT = 'OBJECT'
}

// Request/Response types
export interface CreateEmailTemplateRequest extends Omit<EmailTemplateDto, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateEmailTemplateRequest extends Partial<CreateEmailTemplateRequest> {
  id: number;
}

export interface EmailTemplatePreviewRequest {
  variables: Record<string, any>;
}

export interface EmailTemplatePreviewResponse {
  subject: string;
  htmlContent: string;
  plainTextContent: string;
}

export interface ExtractVariablesRequest {
  subjectTemplate?: string;
  htmlContent?: string;
  plainTextContent?: string;
}

export interface ExtractVariablesResponse {
  subjectVariables: string[];
  htmlVariables: string[];
  plainTextVariables: string[];
}

export interface CloneTemplateRequest {
  newName: string;
  newDisplayName?: string;
}

export interface BulkActionRequest {
  action: 'activate' | 'deactivate' | 'delete';
  templateIds: number[];
}

export interface EmailTemplateStatistics {
  totalTemplates: number;
  activeTemplates: number;
  draftTemplates: number;
  inactiveTemplates: number;
  archivedTemplates: number;
  categories: number;
}

// Pagination and filtering
export interface EmailTemplateSearchParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  status?: EmailTemplateStatus;
  category?: string;
  searchTerm?: string;
}

export interface PaginatedEmailTemplatesResponse {
  _embedded: {
    emailTemplateDtoList: EmailTemplateDto[];
  };
  _links?: {
    self: { href: string };
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
