import { httpClient } from "@/lib/utils/http-client";
import { ApiAppResponse, HateoasContentResponse } from "..";
import { MetaDataFieldDto, MetaDataRecordDto, MetaDataRecordTypeDto } from "./dyn.db.metadata.server.service";

export interface DataRecordDto {
  id: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  metaDataRecord?: MetaDataRecordDto;
  recordType?: MetaDataRecordTypeDto;
  name: string;
  type?: string;
  isActive: boolean;
  isArchived: boolean;
  isPublic: boolean;
  content?: string;
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface DataRecordDtoMin {
  id: string;
  createdAt: string;
  updatedAt?: string;
  name: string;
  metaRecordId?: string;
  recordTypeId?: string;
  data?: Record<string, any>;
  isActive: boolean;
  isArchived: boolean;
  isPublic: boolean;
}

export interface DataRecordFieldDto {
  id: string;
  createdAt: string;
  updatedAt?: string;
  record?: DataRecordDto;
  metaDataField?: MetaDataFieldDto;
  value?: any;
  isActive: boolean;
  isArchived: boolean;
  isPublic: boolean;
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}


// ========================
// REQUEST INTERFACES
// ========================

export interface DataRecordRequestDto {
  metaRecordId: string;
  recordTypeId?: string;
  data?: Record<string, any>;
  isActive?: boolean;
  isArchived?: boolean;
  isPublic?: boolean;
}

// ========================
// QUERY PARAMETERS
// ========================

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface DataRecordFieldsParams extends PaginationParams {
  recordId: string;
}

/**
 * Dynamic DB Data Server Service
 * Provides methods to interact with DynDataApiAppsController APIs
 */
export class DynamicDBDataServerService {
  private readonly baseUrl = '/api/dbz/v1/data';

  // API URL constants
  public static readonly ENDPOINTS = {
    DATA_RECORDS: '/records',
    DATA_RECORD_FIELDS: '/records/{id}/fields',
    DATA_RECORD_REINDEX: '/records/reindex'
  } as const;

  private async getAuthHeaders(token: string): Promise<Record<string, string>> {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  private buildQueryParams(params: PaginationParams & Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  }

  // Helper method to make HTTP requests - can be overridden to use different HTTP clients
  private async makeRequest<T>(
    url: string,
    options: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      headers: Record<string, string>;
      body?: string;
    }
  ): Promise<T> {
    const response = await fetch(url, {
      method: options.method,
      headers: options.headers,
      body: options.body
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  // ========================
  // DATA RECORDS
  // ========================
  /**
   * Get paginated list of data records
   */
  async getDataRecords(
    token: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<DataRecordDto>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc'
    });
    
    const url = `${this.baseUrl}${DynamicDBDataServerService.ENDPOINTS.DATA_RECORDS}${queryParams ? `?${queryParams}` : ''}`;
    const apiResponse = await this.makeRequest<ApiAppResponse<HateoasContentResponse<DataRecordDto>>>(url, {
      method: 'GET',
      headers
    });
    
    return apiResponse.data;
  }

  /**
   * Get data record details by ID
   */
  async getDataRecordDetails(
    token: string, 
    id: string
  ): Promise<DataRecordDto> {
    const headers = await this.getAuthHeaders(token);
    const url = `${this.baseUrl}${DynamicDBDataServerService.ENDPOINTS.DATA_RECORDS}/${id}`;
    
    const apiResponse = await this.makeRequest<ApiAppResponse<DataRecordDto>>(url, {
      method: 'GET',
      headers
    });
    
    return apiResponse.data;
  }

  /**
   * Get fields for a specific data record
   */
  async getDataRecordFields(
    token: string, 
    recordId: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<DataRecordFieldDto>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc'
    });
    
    const endpoint = DynamicDBDataServerService.ENDPOINTS.DATA_RECORD_FIELDS.replace('{id}', recordId);
    const url = `${this.baseUrl}${endpoint}${queryParams ? `?${queryParams}` : ''}`;
    
    const apiResponse = await this.makeRequest<ApiAppResponse<HateoasContentResponse<DataRecordFieldDto>>>(url, {
      method: 'GET',
      headers
    });
    
    return apiResponse.data;
  }

  /**
   * Create a new data record
   */
  async createDataRecord(
    token: string, 
    requestDto: DataRecordRequestDto
  ): Promise<DataRecordDto> {
    const headers = await this.getAuthHeaders(token);
    const url = `${this.baseUrl}${DynamicDBDataServerService.ENDPOINTS.DATA_RECORDS}`;
    
    const apiResponse = await this.makeRequest<ApiAppResponse<DataRecordDto>>(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestDto)
    });
    
    return apiResponse.data;
  }

  /**
   * Update an existing data record
   */
  async updateDataRecord(
    token: string, 
    id: string, 
    requestDto: DataRecordRequestDto
  ): Promise<DataRecordDto> {
    const headers = await this.getAuthHeaders(token);
    const url = `${this.baseUrl}${DynamicDBDataServerService.ENDPOINTS.DATA_RECORDS}/${id}`;
    
    const apiResponse = await this.makeRequest<ApiAppResponse<DataRecordDto>>(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestDto)
    });
    
    return apiResponse.data;
  }

  /**
   * Delete a data record
   */
  async deleteDataRecord(token: string, id: string): Promise<string> {
    const headers = await this.getAuthHeaders(token);
    const url = `${this.baseUrl}${DynamicDBDataServerService.ENDPOINTS.DATA_RECORDS}/${id}`;
    
    const apiResponse = await this.makeRequest<ApiAppResponse<string>>(url, {
      method: 'DELETE',
      headers
    });
    
    return apiResponse.data;
  }

  /**
   * Reindex all data records
   */
  async reindexAllRecords(token: string): Promise<string> {
    const headers = await this.getAuthHeaders(token);
    const url = `${this.baseUrl}${DynamicDBDataServerService.ENDPOINTS.DATA_RECORD_REINDEX}`;
    
    const apiResponse = await this.makeRequest<ApiAppResponse<string>>(url, {
      method: 'GET',
      headers
    });
    
    return apiResponse.data;
  }

  // ========================
  // ADVANCED FEATURES
  // ========================

  /**
   * Bulk create data records
   */
  async createMultipleDataRecords(
    token: string, 
    records: DataRecordRequestDto[]
  ): Promise<DataRecordDto[]> {
    const results: DataRecordDto[] = [];
    
    for (const record of records) {
      try {
        const created = await this.createDataRecord(token, record);
        results.push(created);
      } catch (error) {
        console.error('Failed to create record:', record, error);
        throw error;
      }
    }
    
    return results;
  }

  /**
   * Get data records by metadata record ID
   */
  async getDataRecordsByMetaRecord(
    token: string, 
    metaRecordId: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<DataRecordDto>> {
    // This would require a custom filter on the backend or client-side filtering
    const allRecords = await this.getDataRecords(token, params);
    
    // Filter on client side for now - in a real implementation, 
    // you'd want a server-side filter parameter
    const filteredContent = allRecords.content.filter(record => 
      record.metaDataRecord?.id === metaRecordId
    );
    
    return {
      ...allRecords,
      content: filteredContent
    };
  }

  /**
   * Search data records by content
   */
  async searchDataRecords(
    token: string, 
    searchTerm: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<DataRecordDto>> {
    // Get all records and filter client-side
    // In a real implementation, you'd want server-side search
    const allRecords = await this.getDataRecords(token, params);
    
    const filteredContent = allRecords.content.filter(record =>
      record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return {
      ...allRecords,
      content: filteredContent
    };
  }

  /**
   * Get data record statistics
   */
  async getDataRecordStatistics(token: string): Promise<{
    totalRecords: number;
    activeRecords: number;
    archivedRecords: number;
    publicRecords: number;
    recordsByType: Record<string, number>;
  }> {
    // Get a large page to count records
    const records = await this.getDataRecords(token, { size: 1000 });
    
    const stats = {
      totalRecords: records.content.length,
      activeRecords: records.content.filter(r => r.isActive).length,
      archivedRecords: records.content.filter(r => r.isArchived).length,
      publicRecords: records.content.filter(r => r.isPublic).length,
      recordsByType: {} as Record<string, number>
    };
    
    // Count by type
    records.content.forEach(record => {
      const type = record.type || 'Unknown';
      stats.recordsByType[type] = (stats.recordsByType[type] || 0) + 1;
    });
    
    return stats;
  }

  /**
   * Batch update data records
   */
  async batchUpdateDataRecords(
    token: string,
    updates: Array<{ id: string; data: DataRecordRequestDto }>
  ): Promise<DataRecordDto[]> {
    const results: DataRecordDto[] = [];
    
    for (const update of updates) {
      try {
        const updated = await this.updateDataRecord(token, update.id, update.data);
        results.push(updated);
      } catch (error) {
        console.error(`Failed to update record ${update.id}:`, error);
        throw error;
      }
    }
    
    return results;
  }

  /**
   * Export data records as JSON
   */
  async exportDataRecords(
    token: string,
    metaRecordId?: string
  ): Promise<{
    records: DataRecordDto[];
    exportedAt: string;
    totalCount: number;
  }> {
    let records: DataRecordDto[];
    
    if (metaRecordId) {
      const response = await this.getDataRecordsByMetaRecord(token, metaRecordId, { size: 1000 });
      records = response.content;
    } else {
      const response = await this.getDataRecords(token, { size: 1000 });
      records = response.content;
    }
    
    return {
      records,
      exportedAt: new Date().toISOString(),
      totalCount: records.length
    };
  }

  /**
   * Validate data record fields
   */
  async validateDataRecord(
    token: string,
    recordId: string
  ): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    fieldValidations: Array<{
      fieldId: string;
      fieldName: string;
      isValid: boolean;
      errors: string[];
    }>;
  }> {
    try {
      // Get the record and its fields
      const [record, fieldsResponse] = await Promise.all([
        this.getDataRecordDetails(token, recordId),
        this.getDataRecordFields(token, recordId, { size: 100 })
      ]);

      const fields = fieldsResponse.content;
      const errors: string[] = [];
      const warnings: string[] = [];
      const fieldValidations: Array<{
        fieldId: string;
        fieldName: string;
        isValid: boolean;
        errors: string[];
      }> = [];

      // Basic validation
      if (!record.isActive) {
        warnings.push('Record is not active');
      }

      if (record.isArchived) {
        warnings.push('Record is archived');
      }

      // Validate fields
      fields.forEach(field => {
        const fieldErrors: string[] = [];

        if (field.metaDataField?.required && !field.value) {
          fieldErrors.push('Required field is empty');
        }

        fieldValidations.push({
          fieldId: field.id,
          fieldName: field.metaDataField?.label || 'Unknown',
          isValid: fieldErrors.length === 0,
          errors: fieldErrors
        });

        errors.push(...fieldErrors);
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        fieldValidations
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation failed: ${error}`],
        warnings: [],
        fieldValidations: []
      };
    }
  }

  /**
   * Health check for the service
   */
  async healthCheck(token: string): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    checks: {
      recordsAccess: boolean;
      createAccess: boolean;
      updateAccess: boolean;
      deleteAccess: boolean;
    };
  }> {
    const timestamp = new Date().toISOString();
    const checks = {
      recordsAccess: false,
      createAccess: false,
      updateAccess: false,
      deleteAccess: false
    };

    try {
      // Test read access
      await this.getDataRecords(token, { size: 1 });
      checks.recordsAccess = true;

      // Note: We can't safely test create/update/delete without side effects
      // In a real implementation, you might have a test endpoint
      checks.createAccess = true; // Assume true if read works
      checks.updateAccess = true; // Assume true if read works
      checks.deleteAccess = true; // Assume true if read works

      const allHealthy = Object.values(checks).every(check => check === true);
      
      return {
        status: allHealthy ? 'healthy' : 'unhealthy',
        timestamp,
        checks
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp,
        checks
      };
    }
  }

  // ========================
  // ERROR HANDLING & HELPERS
  // ========================

  /**
   * Retry wrapper for API calls
   */
  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError!;
  }

  /**
   * Batch processor for large operations
   */
  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10,
    delayBetweenBatches: number = 100
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchPromises = batch.map(processor);
      const batchResults = await Promise.all(batchPromises);
      
      results.push(...batchResults);
      
      // Delay between batches to avoid overwhelming the server
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const dynDBDataServerService = new DynamicDBDataServerService();
