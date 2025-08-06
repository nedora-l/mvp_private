// Email Template API Client for Next.js Client-side Operations
// Similar pattern to chatApi.client.ts

import {
  EmailTemplateDto,
  EmailTemplateStatus,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
  EmailTemplatePreviewRequest,
  EmailTemplatePreviewResponse,
  ExtractVariablesRequest,
  ExtractVariablesResponse,
  CloneTemplateRequest,
  BulkActionRequest,
  EmailTemplateStatistics,
  EmailTemplateSearchParams,
  PaginatedEmailTemplatesResponse
} from './emailTemplate.dtos';

const BASE_URL = '/api/admin/emails/templates';

/**
 * Fetches data from the API.
 * @param url The URL to fetch.
 * @param options The fetch options.
 * @returns The JSON response.
 * @throws Error if the fetch fails or the response is not ok.
 */
async function fetchData<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Add any other default headers like Authorization if needed
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorData || response.statusText}`);
  }
  
  if (response.status === 204) { // No Content
    return null as T;
  }
  
  return response.json() as Promise<T>;
}

/**
 * Build query string from search parameters
 */
function buildQueryString(params: EmailTemplateSearchParams): string {
  const queryParams = new URLSearchParams();
  
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.size !== undefined) queryParams.append('size', params.size.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDir) queryParams.append('sortDir', params.sortDir);
  if (params.status) queryParams.append('status', params.status);
  if (params.category) queryParams.append('category', params.category);
  if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
  
  return queryParams.toString();
}

/**
 * Client for interacting with the Email Template API.
 */
export const emailTemplateApiClient = {
  /**
   * Get all email templates with pagination and filtering
   * GET /api/admin/emails/templates
   * @param searchParams Search and pagination parameters
   * @returns Paginated list of email templates
   */
  getAllTemplates: (searchParams?: EmailTemplateSearchParams): Promise<PaginatedEmailTemplatesResponse> => {
    const queryString = searchParams ? buildQueryString(searchParams) : '';
    const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
    return fetchData<PaginatedEmailTemplatesResponse>(url);
  },

  /**
   * Get template by ID
   * GET /api/admin/emails/templates/{id}
   * @param id The template ID
   * @returns The email template
   */
  getTemplateById: (id: number): Promise<EmailTemplateDto> => {
    return fetchData<EmailTemplateDto>(`${BASE_URL}/${id}`);
  },

  /**
   * Get template by name
   * GET /api/admin/emails/templates/by-name/{name}
   * @param name The template name
   * @returns The email template
   */
  getTemplateByName: (name: string): Promise<EmailTemplateDto> => {
    return fetchData<EmailTemplateDto>(`${BASE_URL}/by-name/${encodeURIComponent(name)}`);
  },

  /**
   * Create a new email template
   * POST /api/admin/emails/templates
   * @param template The template data
   * @returns The created template
   */
  createTemplate: (template: CreateEmailTemplateRequest): Promise<EmailTemplateDto> => {
    return fetchData<EmailTemplateDto>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(template),
    });
  },

  /**
   * Update an existing email template
   * PUT /api/admin/emails/templates/{id}
   * @param id The template ID
   * @param template The updated template data
   * @returns The updated template
   */
  updateTemplate: (id: number, template: UpdateEmailTemplateRequest): Promise<EmailTemplateDto> => {
    return fetchData<EmailTemplateDto>(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    });
  },

  /**
   * Delete a template
   * DELETE /api/admin/emails/templates/{id}
   * @param id The template ID
   * @returns Success message
   */
  deleteTemplate: (id: number): Promise<{ message: string }> => {
    return fetchData<{ message: string }>(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Activate a template
   * POST /api/admin/emails/templates/{id}/activate
   * @param id The template ID
   * @returns The activated template
   */
  activateTemplate: (id: number): Promise<EmailTemplateDto> => {
    return fetchData<EmailTemplateDto>(`${BASE_URL}/${id}/activate`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  /**
   * Deactivate a template
   * POST /api/admin/emails/templates/{id}/deactivate
   * @param id The template ID
   * @returns The deactivated template
   */
  deactivateTemplate: (id: number): Promise<EmailTemplateDto> => {
    return fetchData<EmailTemplateDto>(`${BASE_URL}/${id}/deactivate`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  /**
   * Set template as default for its category
   * POST /api/admin/emails/templates/{id}/set-default
   * @param id The template ID
   * @returns The updated template
   */
  setAsDefault: (id: number): Promise<EmailTemplateDto> => {
    return fetchData<EmailTemplateDto>(`${BASE_URL}/${id}/set-default`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  /**
   * Get active templates by category
   * GET /api/admin/emails/templates/category/{category}
   * @param category The category name
   * @returns List of templates in the category
   */
  getTemplatesByCategory: (category: string): Promise<EmailTemplateDto[]> => {
    return fetchData<EmailTemplateDto[]>(`${BASE_URL}/category/${encodeURIComponent(category)}`);
  },

  /**
   * Get default template for a category
   * GET /api/admin/emails/templates/category/{category}/default
   * @param category The category name
   * @returns The default template for the category
   */
  getDefaultTemplate: (category: string): Promise<EmailTemplateDto> => {
    return fetchData<EmailTemplateDto>(`${BASE_URL}/category/${encodeURIComponent(category)}/default`);
  },

  /**
   * Preview template with variables
   * POST /api/admin/emails/templates/{id}/preview
   * @param id The template ID
   * @param variables The variables to substitute
   * @returns The preview with processed content
   */
  previewTemplate: (id: number, variables: Record<string, any>): Promise<EmailTemplatePreviewResponse> => {
    return fetchData<EmailTemplatePreviewResponse>(`${BASE_URL}/${id}/preview`, {
      method: 'POST',
      body: JSON.stringify(variables),
    });
  },

  /**
   * Extract variables from template content
   * POST /api/admin/emails/templates/extract-variables
   * @param content The template content to analyze
   * @returns List of variables found in the content
   */
  extractVariables: (content: ExtractVariablesRequest): Promise<ExtractVariablesResponse> => {
    return fetchData<ExtractVariablesResponse>(`${BASE_URL}/extract-variables`, {
      method: 'POST',
      body: JSON.stringify(content),
    });
  },

  /**
   * Clone/duplicate a template
   * POST /api/admin/emails/templates/{id}/clone
   * @param id The template ID to clone
   * @param cloneRequest The clone parameters
   * @returns The cloned template
   */
  cloneTemplate: (id: number, cloneRequest: CloneTemplateRequest): Promise<EmailTemplateDto> => {
    const queryParams = new URLSearchParams();
    queryParams.append('newName', cloneRequest.newName);
    if (cloneRequest.newDisplayName) {
      queryParams.append('newDisplayName', cloneRequest.newDisplayName);
    }

    return fetchData<EmailTemplateDto>(`${BASE_URL}/${id}/clone?${queryParams.toString()}`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  /**
   * Get template statistics
   * GET /api/admin/emails/templates/statistics
   * @returns Template statistics
   */
  getTemplateStatistics: (): Promise<EmailTemplateStatistics> => {
    return fetchData<EmailTemplateStatistics>(`${BASE_URL}/statistics`);
  },

  /**
   * Perform bulk operations on templates
   * POST /api/admin/emails/templates/bulk-action
   * @param bulkRequest The bulk action request
   * @returns Success message
   */
  bulkAction: (bulkRequest: BulkActionRequest): Promise<{ message: string }> => {
    return fetchData<{ message: string }>(`${BASE_URL}/bulk-action`, {
      method: 'POST',
      body: JSON.stringify(bulkRequest),
    });
  },

  /**
   * Get all categories
   * GET /api/admin/emails/templates/categories
   * @returns List of all template categories
   */
  getAllCategories: (): Promise<string[]> => {
    return fetchData<string[]>(`${BASE_URL}/categories`);
  },

  // Convenience methods
  
  /**
   * Search templates with text query
   * @param searchTerm The search term
   * @param status Optional status filter
   * @param page Page number (default: 0)
   * @param size Page size (default: 10)
   * @returns Paginated search results
   */
  searchTemplates: (
    searchTerm: string,
    status?: EmailTemplateStatus,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedEmailTemplatesResponse> => {
    return emailTemplateApiClient.getAllTemplates({
      searchTerm,
      status,
      page,
      size
    });
  },

  /**
   * Get templates by status
   * @param status The template status
   * @param page Page number (default: 0)
   * @param size Page size (default: 10)
   * @returns Paginated templates by status
   */
  getTemplatesByStatus: (
    status: EmailTemplateStatus,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedEmailTemplatesResponse> => {
    return emailTemplateApiClient.getAllTemplates({
      status,
      page,
      size
    });
  },

  /**
   * Activate multiple templates
   * @param templateIds Array of template IDs to activate
   * @returns Success message
   */
  activateMultipleTemplates: (templateIds: number[]): Promise<{ message: string }> => {
    return emailTemplateApiClient.bulkAction({
      action: 'activate',
      templateIds
    });
  },

  /**
   * Deactivate multiple templates
   * @param templateIds Array of template IDs to deactivate
   * @returns Success message
   */
  deactivateMultipleTemplates: (templateIds: number[]): Promise<{ message: string }> => {
    return emailTemplateApiClient.bulkAction({
      action: 'deactivate',
      templateIds
    });
  },

  /**
   * Delete multiple templates
   * @param templateIds Array of template IDs to delete
   * @returns Success message
   */
  deleteMultipleTemplates: (templateIds: number[]): Promise<{ message: string }> => {
    return emailTemplateApiClient.bulkAction({
      action: 'delete',
      templateIds
    });
  },
};
