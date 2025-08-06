import { ApiResponse, HateoasPagination } from '@/lib/interfaces/apis/common';
import { getStoredToken } from '@/lib/services/auth/token-storage';
import apiClient from '../../../api-client';
import { CreateDocumentTemplateRequest, UpdateDocumentTemplateRequest, DocumentTemplateDto } from '@/lib/services/server/dyn_document/dynDocument.server.service';

const DOCUMENT_TEMPLATES_BASE_PATH = '/admin/templates/docs';

/**
 * Get all document templates with pagination and filtering
 */
export const getAllDocumentsTemplates = async (params?: HateoasPagination): Promise<ApiResponse<DocumentTemplateDto[]>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<DocumentTemplateDto[]>>(DOCUMENT_TEMPLATES_BASE_PATH, {
    method: 'GET',
    params,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Get a document template by ID
 */
export const getDocumentTemplateById = async (id: number): Promise<ApiResponse<DocumentTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<DocumentTemplateDto>>(`${DOCUMENT_TEMPLATES_BASE_PATH}/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Create a new document template
 */
export const createDocumentTemplate = async (data: CreateDocumentTemplateRequest): Promise<ApiResponse<DocumentTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<DocumentTemplateDto>>(DOCUMENT_TEMPLATES_BASE_PATH, {
    method: 'POST',
    body: data,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Update an existing document template
 */
export const updateDocumentTemplate = async (id: number, data: UpdateDocumentTemplateRequest): Promise<ApiResponse<DocumentTemplateDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<DocumentTemplateDto>>(`${DOCUMENT_TEMPLATES_BASE_PATH}/${id}`, {
    method: 'PUT',
    body: data,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Delete a document template
 */
export const deleteDocumentTemplate = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<{ message: string }>>(`${DOCUMENT_TEMPLATES_BASE_PATH}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};
