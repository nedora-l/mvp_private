// For server-side token management - not persisted between requests

import { FileDto } from "@/lib/interfaces/apis";

export const DERIVATIVES_API_BASE_URL = '/api/v1/app-files-derivatives';

export class DerivativesServerService {
  getHeaders(accessToken: string, isMultipart: boolean = false) {
    const headers: HeadersInit = {
      Authorization: `Bearer ${accessToken}`,
    };
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  /**
   * Get all derivatives for a file
   * GET /api/v1/app-files-derivatives/{fileId}/derivatives
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @returns Array of derivative files
   */
  async getDerivatives(accessToken: string, fileId: string): Promise<FileDto[]> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/${fileId}/derivatives`, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to get derivatives');
    }
    return response.json();
  }

  /**
   * Get derivatives by category
   * GET /api/v1/app-files-derivatives/{fileId}/derivatives/category/{category}
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @param category The derivative category
   * @returns Array of derivative files
   */
  async getDerivativesByCategory(accessToken: string, fileId: string, category: string): Promise<FileDto[]> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/${fileId}/derivatives/category/${category}`, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to get derivatives by category');
    }
    return response.json();
  }

  /**
   * Get derivatives by page number
   * GET /api/v1/app-files-derivatives/{fileId}/derivatives/page/{pageNumber}
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @param pageNumber The page number
   * @returns Array of derivative files
   */
  async getDerivativesByPageNumber(accessToken: string, fileId: string, pageNumber: number): Promise<FileDto[]> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/${fileId}/derivatives/page/${pageNumber}`, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to get derivatives by page number');
    }
    return response.json();
  }

  /**
   * Get a specific derivative by category and page number
   * GET /api/v1/app-files-derivatives/{fileId}/derivatives/category/{category}/page/{pageNumber}
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @param category The derivative category
   * @param pageNumber The page number
   * @returns The specific derivative file
   */
  async getSpecificDerivative(accessToken: string, fileId: string, category: string, pageNumber: number): Promise<FileDto> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/${fileId}/derivatives/category/${category}/page/${pageNumber}`, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to get specific derivative');
    }
    return response.json();
  }

  /**
   * Manually create a derivative for a file
   * POST /api/v1/app-files-derivatives/{fileId}/derivatives
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @param file The derivative file to upload
   * @param derivativeCategory The category of the derivative
   * @param pageNumber Optional page number
   * @returns The created derivative file
   */
  async createDerivative(
    accessToken: string,
    fileId: string,
    file: File,
    derivativeCategory: string,
    pageNumber?: number
  ): Promise<FileDto> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('derivativeCategory', derivativeCategory);
    if (pageNumber !== undefined) {
      formData.append('pageNumber', pageNumber.toString());
    }

    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/${fileId}/derivatives`, {
      method: 'POST',
      headers: this.getHeaders(accessToken, true),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create derivative');
    }
    return response.json();
  }

  /**
   * Process derivatives for a file
   * POST /api/v1/app-files-derivatives/{fileId}/process-derivatives
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @returns Array of processed derivative files
   */
  async processDerivatives(accessToken: string, fileId: string): Promise<FileDto[]> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/${fileId}/process-derivatives`, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to process derivatives');
    }
    return response.json();
  }

  /**
   * Process PDF page images for a file
   * POST /api/v1/app-files-derivatives/{fileId}/generate-pdf-page-images
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @returns Array of generated image derivative files
   */
  async generatePdfPageImages(accessToken: string, fileId: string): Promise<FileDto[]> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/${fileId}/generate-pdf-page-images`, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to generate PDF page images');
    }
    return response.json();
  }

  /**
   * Process PDF page images for a file asynchronously
   * POST /api/v1/app-files-derivatives/{fileId}/generate-pdf-page-images-async
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @returns A map with a message and taskId
   */
  async generatePdfPageImagesAsync(accessToken: string, fileId: string): Promise<{ [key: string]: any }> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/${fileId}/generate-pdf-page-images-async`, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to trigger async PDF page image generation');
    }
    return response.json();
  }

  /**
   * Delete a derivative
   * DELETE /api/v1/app-files-derivatives/derivatives/{derivativeId}
   * @param accessToken The access token for authorization
   * @param derivativeId The ID of the derivative to delete
   */
  async deleteDerivative(accessToken: string, derivativeId: string): Promise<void> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/derivatives/${derivativeId}`, {
      method: 'DELETE',
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to delete derivative');
    }
  }

  /**
   * Check if the GCP bucket environment is properly configured
   * GET /api/v1/app-files-derivatives/check-storage-config
   * @param accessToken The access token for authorization
   * @returns Storage configuration details
   */
  async checkStorageConfig(accessToken: string): Promise<{ [key: string]: any }> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/check-storage-config`, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to check storage config');
    }
    return response.json();
  }

  /**
   * Get the JSON content for a specific page of a file
   * GET /api/v1/app-files-derivatives/{fileId}/page-content-json/{pageNumber}
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @param pageNumber The page number
   * @returns The JSON content of the page
   */
  async getPageContentJson(accessToken: string, fileId: string, pageNumber: number): Promise<any> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/${fileId}/page-content-json/${pageNumber}`, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to get page content as JSON');
    }
    return response.json();
  }

  /**
   * Get the CSV content for a specific page of a file
   * GET /api/v1/app-files-derivatives/{fileId}/page-content-csv/{pageNumber}
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @param pageNumber The page number
   * @returns The CSV content of the page
   */
  async getPageContentCsv(accessToken: string, fileId: string, pageNumber: number): Promise<any> {
    const response = await fetch(`${DERIVATIVES_API_BASE_URL}/${fileId}/page-content-csv/${pageNumber}`, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to get page content as CSV');
    }
    return response.json();
  }
}

// Export a default instance
export const derivativesServerService = new DerivativesServerService();
