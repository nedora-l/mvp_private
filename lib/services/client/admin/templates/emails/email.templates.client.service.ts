import { 
  EmailTemplateDto, 
  EmailTemplateSearchParams, 
  CreateEmailTemplateRequest, 
  UpdateEmailTemplateRequest,
  EmailTemplateStatus,
  PaginatedEmailTemplatesResponse,
  EmailTemplatePreviewResponse,
  ExtractVariablesRequest,
  ExtractVariablesResponse,
  CloneTemplateRequest,
  BulkActionRequest,
  EmailTemplateStatistics
} from '@/lib/services/server/email_templates';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { getStoredToken } from '@/lib/services/auth/token-storage';
import apiClient from '../../../api-client';

const EMAIL_TEMPLATES_BASE_PATH = '/admin/templates/emails';

/**
 * Get all email templates with pagination and filtering
 */
export const getAllEmailTemplates = async (params?: EmailTemplateSearchParams): Promise<ApiResponse<PaginatedEmailTemplatesResponse>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<PaginatedEmailTemplatesResponse>>(EMAIL_TEMPLATES_BASE_PATH, {
    method: 'GET',
    params,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Get template by ID
 */
export const getEmailTemplateById = async (id: number): Promise<ApiResponse<EmailTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplateDto>>(`${EMAIL_TEMPLATES_BASE_PATH}/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Create a new email template
 */
export const createEmailTemplate = async (template: CreateEmailTemplateRequest): Promise<ApiResponse<EmailTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplateDto>>(EMAIL_TEMPLATES_BASE_PATH, {
    method: 'POST',
    body: template,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Update an existing email template
 */
export const updateEmailTemplate = async (id: number, template: UpdateEmailTemplateRequest): Promise<ApiResponse<EmailTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplateDto>>(`${EMAIL_TEMPLATES_BASE_PATH}/${id}`, {
    method: 'PUT',
    body: template,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Delete a template
 */
export const deleteEmailTemplate = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<{ message: string }>>(`${EMAIL_TEMPLATES_BASE_PATH}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Activate a template
 */
export const activateEmailTemplate = async (id: number): Promise<ApiResponse<EmailTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplateDto>>(`${EMAIL_TEMPLATES_BASE_PATH}/${id}/activate`, {
    method: 'POST',
    body: {},
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Deactivate a template
 */
export const deactivateEmailTemplate = async (id: number): Promise<ApiResponse<EmailTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplateDto>>(`${EMAIL_TEMPLATES_BASE_PATH}/${id}/deactivate`, {
    method: 'POST',
    body: {},
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Set template as default for its category
 */
export const setEmailTemplateAsDefault = async (id: number): Promise<ApiResponse<EmailTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplateDto>>(`${EMAIL_TEMPLATES_BASE_PATH}/${id}/set-default`, {
    method: 'POST',
    body: {},
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Get active templates by category
 */
export const getEmailTemplatesByCategory = async (category: string): Promise<ApiResponse<EmailTemplateDto[]>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplateDto[]>>(`${EMAIL_TEMPLATES_BASE_PATH}/category/${encodeURIComponent(category)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Get default template for a category
 */
export const getDefaultEmailTemplate = async (category: string): Promise<ApiResponse<EmailTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplateDto>>(`${EMAIL_TEMPLATES_BASE_PATH}/category/${encodeURIComponent(category)}/default`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Preview template with variables
 */
export const previewEmailTemplate = async (id: number, variables: Record<string, any>): Promise<ApiResponse<EmailTemplatePreviewResponse>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplatePreviewResponse>>(`${EMAIL_TEMPLATES_BASE_PATH}/${id}/preview`, {
    method: 'POST',
    body: variables,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Extract variables from template content
 */
export const extractEmailTemplateVariables = async (content: ExtractVariablesRequest): Promise<ApiResponse<ExtractVariablesResponse>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<ExtractVariablesResponse>>(`${EMAIL_TEMPLATES_BASE_PATH}/extract-variables`, {
    method: 'POST',
    body: content,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Clone/duplicate a template
 */
export const cloneEmailTemplate = async (id: number, cloneRequest: CloneTemplateRequest): Promise<ApiResponse<EmailTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplateDto>>(`${EMAIL_TEMPLATES_BASE_PATH}/${id}/clone`, {
    method: 'POST',
    body: cloneRequest,
    params: cloneRequest,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Get template statistics
 */
export const getEmailTemplateStatistics = async (): Promise<ApiResponse<EmailTemplateStatistics>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<EmailTemplateStatistics>>(`${EMAIL_TEMPLATES_BASE_PATH}/statistics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Perform bulk operations on templates
 */
export const bulkActionEmailTemplates = async (bulkRequest: BulkActionRequest): Promise<ApiResponse<{ message: string }>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<{ message: string }>>(`${EMAIL_TEMPLATES_BASE_PATH}/bulk-action`, {
    method: 'POST',
    body: bulkRequest,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Get all categories
 */
export const getAllEmailTemplateCategories = async (): Promise<ApiResponse<string[]>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<string[]>>(`${EMAIL_TEMPLATES_BASE_PATH}/categories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

// Convenience methods

/**
 * Search templates with text query
 */
export const searchEmailTemplates = async (
  searchTerm: string,
  status?: EmailTemplateStatus,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PaginatedEmailTemplatesResponse>> => {
  return getAllEmailTemplates({
    searchTerm,
    status,
    page,
    size
  });
};

/**
 * Get templates by status
 */
export const getEmailTemplatesByStatus = async (
  status: EmailTemplateStatus,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PaginatedEmailTemplatesResponse>> => {
  return getAllEmailTemplates({
    status,
    page,
    size
  });
};

/**
 * Activate multiple templates
 */
export const activateMultipleEmailTemplates = async (templateIds: number[]): Promise<ApiResponse<{ message: string }>> => {
  return bulkActionEmailTemplates({
    action: 'activate',
    templateIds
  });
};

/**
 * Deactivate multiple templates
 */
export const deactivateMultipleEmailTemplates = async (templateIds: number[]): Promise<ApiResponse<{ message: string }>> => {
  return bulkActionEmailTemplates({
    action: 'deactivate',
    templateIds
  });
};

/**
 * Delete multiple templates
 */
export const deleteMultipleEmailTemplates = async (templateIds: number[]): Promise<ApiResponse<{ message: string }>> => {
  return bulkActionEmailTemplates({
    action: 'delete',
    templateIds
  });
};

