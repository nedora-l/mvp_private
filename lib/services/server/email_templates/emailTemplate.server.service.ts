import { httpClient } from "@/lib/utils/http-client";
import { HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis";

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
} from "./emailTemplate.dtos";

// API endpoints
export const SERVER_API_BASE_URL = '/api/admin/emails/templates';

export const SECTION_BY_NAME = 'by-name';
export const SECTION_ACTIVATE = 'activate';
export const SECTION_DEACTIVATE = 'deactivate';
export const SECTION_SET_DEFAULT = 'set-default';
export const SECTION_CATEGORY = 'category';
export const SECTION_PREVIEW = 'preview';
export const SECTION_EXTRACT_VARIABLES = 'extract-variables';
export const SECTION_CLONE = 'clone';
export const SECTION_STATISTICS = 'statistics';
export const SECTION_BULK_ACTION = 'bulk-action';
export const SECTION_CATEGORIES = 'categories';

export class EmailTemplateServerService {
  
  getHeaders(accessToken: string, isMultipart: boolean = false) {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
    };
    
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    
    return { headers };
  }

  /**
   * Get all email templates with pagination and filtering
   * GET /api/admin/emails/templates
   */
  async getAllTemplates(
    accessToken: string, 
    searchParams?: EmailTemplateSearchParams
  ): Promise<PaginatedEmailTemplatesResponse> {
    try {
      const headers = this.getHeaders(accessToken);
      
      const queryParams = new URLSearchParams();
      if (searchParams) {
        if (searchParams.page !== undefined) queryParams.append('page', searchParams.page.toString());
        if (searchParams.size !== undefined) queryParams.append('size', searchParams.size.toString());
        if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy);
        if (searchParams.sortDir) queryParams.append('sortDir', searchParams.sortDir);
        if (searchParams.status) queryParams.append('status', searchParams.status);
        if (searchParams.category) queryParams.append('category', searchParams.category);
        if (searchParams.searchTerm) queryParams.append('searchTerm', searchParams.searchTerm);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<PaginatedEmailTemplatesResponse>(
        `${SERVER_API_BASE_URL}${queryString}`,
        headers
      );
      
      console.log('EmailTemplateServerService: getAllTemplates response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: getAllTemplates error:', error);
      throw error;
    }
  }

  /**
   * Get template by ID
   * GET /api/admin/emails/templates/{id}
   */
  async getTemplateById(accessToken: string, id: number): Promise<EmailTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<EmailTemplateDto>(
        `${SERVER_API_BASE_URL}/${id}`,
        headers
      );
      
      console.log('EmailTemplateServerService: getTemplateById response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: getTemplateById error:', error);
      throw error;
    }
  }

  /**
   * Get template by name
   * GET /api/admin/emails/templates/by-name/{name}
   */
  async getTemplateByName(accessToken: string, name: string): Promise<EmailTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<EmailTemplateDto>(
        `${SERVER_API_BASE_URL}/${SECTION_BY_NAME}/${encodeURIComponent(name)}`,
        headers
      );
      
      console.log('EmailTemplateServerService: getTemplateByName response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: getTemplateByName error:', error);
      throw error;
    }
  }

  /**
   * Create a new email template
   * POST /api/admin/emails/templates
   */
  async createTemplate(accessToken: string, template: CreateEmailTemplateRequest): Promise<EmailTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<EmailTemplateDto>(
        SERVER_API_BASE_URL,
        template,
        headers
      );
      
      console.log('EmailTemplateServerService: createTemplate response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: createTemplate error:', error);
      throw error;
    }
  }

  /**
   * Update an existing email template
   * PUT /api/admin/emails/templates/{id}
   */
  async updateTemplate(accessToken: string, id: number, template: UpdateEmailTemplateRequest): Promise<EmailTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<EmailTemplateDto>(
        `${SERVER_API_BASE_URL}/${id}`,
        template,
        headers
      );
      
      console.log('EmailTemplateServerService: updateTemplate response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: updateTemplate error:', error);
      throw error;
    }
  }

  /**
   * Delete a template
   * DELETE /api/admin/emails/templates/{id}
   */
  async deleteTemplate(accessToken: string, id: number): Promise<{ message: string }> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.delete<{ message: string }>(
        `${SERVER_API_BASE_URL}/${id}`,
        headers
      );
      
      console.log('EmailTemplateServerService: deleteTemplate response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: deleteTemplate error:', error);
      throw error;
    }
  }

  /**
   * Activate a template
   * POST /api/admin/emails/templates/{id}/activate
   */
  async activateTemplate(accessToken: string, id: number): Promise<EmailTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<EmailTemplateDto>(
        `${SERVER_API_BASE_URL}/${id}/${SECTION_ACTIVATE}`,
        {},
        headers
      );
      
      console.log('EmailTemplateServerService: activateTemplate response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: activateTemplate error:', error);
      throw error;
    }
  }

  /**
   * Deactivate a template
   * POST /api/admin/emails/templates/{id}/deactivate
   */
  async deactivateTemplate(accessToken: string, id: number): Promise<EmailTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<EmailTemplateDto>(
        `${SERVER_API_BASE_URL}/${id}/${SECTION_DEACTIVATE}`,
        {},
        headers
      );
      
      console.log('EmailTemplateServerService: deactivateTemplate response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: deactivateTemplate error:', error);
      throw error;
    }
  }

  /**
   * Set template as default for its category
   * POST /api/admin/emails/templates/{id}/set-default
   */
  async setAsDefault(accessToken: string, id: number): Promise<EmailTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<EmailTemplateDto>(
        `${SERVER_API_BASE_URL}/${id}/${SECTION_SET_DEFAULT}`,
        {},
        headers
      );
      
      console.log('EmailTemplateServerService: setAsDefault response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: setAsDefault error:', error);
      throw error;
    }
  }

  /**
   * Get active templates by category
   * GET /api/admin/emails/templates/category/{category}
   */
  async getTemplatesByCategory(accessToken: string, category: string): Promise<EmailTemplateDto[]> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<EmailTemplateDto[]>(
        `${SERVER_API_BASE_URL}/${SECTION_CATEGORY}/${encodeURIComponent(category)}`,
        headers
      );
      
      console.log('EmailTemplateServerService: getTemplatesByCategory response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: getTemplatesByCategory error:', error);
      throw error;
    }
  }

  /**
   * Get default template for a category
   * GET /api/admin/emails/templates/category/{category}/default
   */
  async getDefaultTemplate(accessToken: string, category: string): Promise<EmailTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<EmailTemplateDto>(
        `${SERVER_API_BASE_URL}/${SECTION_CATEGORY}/${encodeURIComponent(category)}/default`,
        headers
      );
      
      console.log('EmailTemplateServerService: getDefaultTemplate response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: getDefaultTemplate error:', error);
      throw error;
    }
  }

  /**
   * Process template with variables (for preview)
   * POST /api/admin/emails/templates/{id}/preview
   */
  async previewTemplate(
    accessToken: string, 
    id: number, 
    variables: Record<string, any>
  ): Promise<EmailTemplatePreviewResponse> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<EmailTemplatePreviewResponse>(
        `${SERVER_API_BASE_URL}/${id}/${SECTION_PREVIEW}`,
        variables,
        headers
      );
      
      console.log('EmailTemplateServerService: previewTemplate response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: previewTemplate error:', error);
      throw error;
    }
  }

  /**
   * Extract variables from template content
   * POST /api/admin/emails/templates/extract-variables
   */
  async extractVariables(
    accessToken: string, 
    content: ExtractVariablesRequest
  ): Promise<ExtractVariablesResponse> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<ExtractVariablesResponse>(
        `${SERVER_API_BASE_URL}/${SECTION_EXTRACT_VARIABLES}`,
        content,
        headers
      );
      
      console.log('EmailTemplateServerService: extractVariables response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: extractVariables error:', error);
      throw error;
    }
  }

  /**
   * Clone/duplicate a template
   * POST /api/admin/emails/templates/{id}/clone
   */
  async cloneTemplate(
    accessToken: string, 
    id: number, 
    cloneRequest: CloneTemplateRequest
  ): Promise<EmailTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const queryParams = new URLSearchParams();
      queryParams.append('newName', cloneRequest.newName);
      if (cloneRequest.newDisplayName) {
        queryParams.append('newDisplayName', cloneRequest.newDisplayName);
      }
      
      const response = await httpClient.post<EmailTemplateDto>(
        `${SERVER_API_BASE_URL}/${id}/${SECTION_CLONE}?${queryParams.toString()}`,
        {},
        headers
      );
      
      console.log('EmailTemplateServerService: cloneTemplate response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: cloneTemplate error:', error);
      throw error;
    }
  }

  /**
   * Get template statistics
   * GET /api/admin/emails/templates/statistics
   */
  async getTemplateStatistics(accessToken: string): Promise<EmailTemplateStatistics> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<EmailTemplateStatistics>(
        `${SERVER_API_BASE_URL}/${SECTION_STATISTICS}`,
        headers
      );
      
      console.log('EmailTemplateServerService: getTemplateStatistics response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: getTemplateStatistics error:', error);
      throw error;
    }
  }

  /**
   * Bulk operations on templates
   * POST /api/admin/emails/templates/bulk-action
   */
  async bulkAction(accessToken: string, bulkRequest: BulkActionRequest): Promise<{ message: string }> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<{ message: string }>(
        `${SERVER_API_BASE_URL}/${SECTION_BULK_ACTION}`,
        bulkRequest,
        headers
      );
      
      console.log('EmailTemplateServerService: bulkAction response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: bulkAction error:', error);
      throw error;
    }
  }

  /**
   * Get all categories
   * GET /api/admin/emails/templates/categories
   */
  async getAllCategories(accessToken: string): Promise<string[]> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<string[]>(
        `${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}`,
        headers
      );
      
      console.log('EmailTemplateServerService: getAllCategories response:', response);
      return response.data;
    } catch (error) {
      console.error('EmailTemplateServerService: getAllCategories error:', error);
      throw error;
    }
  }

  /**
   * Search templates with text query
   * Convenience method that uses getAllTemplates with searchTerm
   */
  async searchTemplates(
    accessToken: string, 
    searchTerm: string,
    status?: EmailTemplateStatus,
    pagination?: HateoasPagination
  ): Promise<PaginatedEmailTemplatesResponse> {
    const searchParams: EmailTemplateSearchParams = {
      searchTerm,
      status,
      page: pagination?.page || 0,
      size: pagination?.size || 10
    };
    
    return this.getAllTemplates(accessToken, searchParams);
  }

  /**
   * Get templates by status
   * Convenience method that uses getAllTemplates with status filter
   */
  async getTemplatesByStatus(
    accessToken: string, 
    status: EmailTemplateStatus,
    pagination?: HateoasPagination
  ): Promise<PaginatedEmailTemplatesResponse> {
    const searchParams: EmailTemplateSearchParams = {
      status,
      page: pagination?.page || 0,
      size: pagination?.size || 10
    };
    
    return this.getAllTemplates(accessToken, searchParams);
  }
}

// Export singleton instance
export const emailTemplateServerService = new EmailTemplateServerService();
