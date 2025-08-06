import { HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis";
import { httpClient } from "@/lib/utils/http-client";

// DTOs (replace with actual imports or expand as needed)
export interface DocumentTemplateDto {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  category?: string;
  content: string;
  format: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDocumentTemplateRequest {
  name: string;
  displayName: string;
  description?: string;
  category?: string;
  content: string;
  format: string;
  status: string;
}

export interface DocumentTemplateVariableDto {
  id?: number;
  variableName: string;
  displayName?: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  validationPattern?: string;
  validationErrorMessage?: string;
  displayOrder?: number;
}

export interface UpdateDocumentTemplateRequest extends CreateDocumentTemplateRequest {}

export interface PaginatedDocumentTemplatesResponse extends HateoasResponse<DocumentTemplateDto> {}


export const SERVER_API_BASE_URL = '/api/admin/document-templates';

export class DynDocumentServerService {
  getHeaders(accessToken: string, isMultipart: boolean = false) {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
    };
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    return { headers };
  }

  // Get all document templates with pagination and filtering
  async getAllTemplates(accessToken: string, searchParams?: HateoasPagination): Promise<DocumentTemplateDto[]>{
    try {
      const headers = this.getHeaders(accessToken);
      const queryParams = new URLSearchParams();
      if (searchParams) {
        if (searchParams.page !== undefined) queryParams.append('page', searchParams.page.toString());
        if (searchParams.size !== undefined) queryParams.append('size', searchParams.size.toString());
        if (searchParams.query) queryParams.append('query', searchParams.query);
      }
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<DocumentTemplateDto[]>(
        `${SERVER_API_BASE_URL}${queryString}`,
        headers
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get template by ID
  async getTemplateById(accessToken: string, id: number): Promise<DocumentTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<DocumentTemplateDto>(
        `${SERVER_API_BASE_URL}/${id}`,
        headers
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  // Extract variables from template content
  async extractVariables(accessToken: string, template: CreateDocumentTemplateRequest): Promise<string[]> {
    const headers = this.getHeaders(accessToken);
    const response = await httpClient.post<string[]>(
      `${SERVER_API_BASE_URL}/extract-variables`,
      template,
      headers
    );
    return response.data;
  }

  // Get variables for a template by ID
  async getTemplateVariables(accessToken: string, id: number): Promise<string[]> {
    const headers = this.getHeaders(accessToken);
    const response = await httpClient.get<string[]>(
      `${SERVER_API_BASE_URL}/${id}/variables`,
      headers
    );
    return response.data;
  }
  // Create a new document template
  async createTemplate(accessToken: string, template: CreateDocumentTemplateRequest): Promise<DocumentTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<DocumentTemplateDto>(
        SERVER_API_BASE_URL,
        template,
        headers
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update an existing document template
  async updateTemplate(accessToken: string, id: number, template: UpdateDocumentTemplateRequest): Promise<DocumentTemplateDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<DocumentTemplateDto>(
        `${SERVER_API_BASE_URL}/${id}`,
        template,
        headers
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete a template
  async deleteTemplate(accessToken: string, id: number): Promise<{ message: string }> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.delete<{ message: string }>(
        `${SERVER_API_BASE_URL}/${id}`,
        headers
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Preview document with variables
  async previewDocument(accessToken: string, template: CreateDocumentTemplateRequest, variables?: Record<string, any>): Promise<string> {
    const headers = this.getHeaders(accessToken);
    const params = variables ? { params: variables } : {};
    const response = await httpClient.post<string>(
      `${SERVER_API_BASE_URL}/preview`,
      template,
      { ...headers, ...params }
    );
    return response.data;
  }

  // Generate PDF with variables
  async generatePdf(accessToken: string, template: CreateDocumentTemplateRequest, variables?: Record<string, any>): Promise<Blob> {
    const headers = this.getHeaders(accessToken);
    const params = variables ? { params: variables } : {};
    const response = await httpClient.post<Blob>(
      `${SERVER_API_BASE_URL}/generate-pdf`,
      template,
      { ...headers, ...params }
    );
    return response.data;
  }
}

// Export singleton instance
export const dynDocumentServerService = new DynDocumentServerService();
