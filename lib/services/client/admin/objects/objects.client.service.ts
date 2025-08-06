
import { ApiResponse, HateoasPagination } from "@/lib/interfaces/apis/common";
import { getStoredToken } from "@/lib/services/auth/token-storage";
import { 
  MetaDataRecordDto, 
  MetaDataRecordRequestDto, 
  MetaDataFieldDto, 
  MetaDataFieldDtoMin, 
  MetaDataFieldRequestDto,
  MetaDataRecordTypeDto,
  MetaDataRecordTypeRequestDto,
  MetaDataFieldTypeDto,
  MetaDataFieldCategoryDto,
  MetaDataTypeDto,
  PaginationParams,
  MetaDataTriggerDto
} from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { HateoasContentResponse } from "@/lib/services/server";
import { OqlExecutionResult, OqlQueryDto } from "@/lib/services/server/dynamicdb/dyn.db.oql.server.service";

export const NEXT_API_BASE_URL = '/api/v1/admin/objects';

/**
 * Fetches data from the API.
 * @param url The URL to fetch.
 * @param options The fetch options.
 * @returns The JSON response.
 * @throws Error if the fetch fails or the response is not ok.
 */
async function fetchData<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token =  getStoredToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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

export interface ObjectDto {
  id?: string;
  name: string;
  apiName: string;
  description?: string;
  recordCount: number;
  fieldsCount: number;
  relationshipsCount: number;
  lastModified: string;
  isCustom: boolean;
  status: string;
}

/**
 * Client for interacting with the Objects API.
 */
export const objectsApiClient = {

  // OQL API
  
  /**
   * Create a new field for a metadata record
   */
  executeOqlQuery: (queryDto: OqlQueryDto): Promise<any> => {
    const res = fetchData<any>(`${NEXT_API_BASE_URL}/oql`, {
      method: 'POST',
      body: JSON.stringify(queryDto),
    });

    console.log("OQL Query Nextjs api Response:", res);
    return res;
  },

  // ========================
  // METADATA RECORDS
  // ========================

  /**
   * Get paginated list of metadata records
   */
  getObjects: (pagination?: HateoasPagination): Promise<ApiResponse<MetaDataRecordDto[]>> => {
    return fetchData<ApiResponse<MetaDataRecordDto[]>>(`${NEXT_API_BASE_URL}?page=${pagination?.page}&size=${pagination?.size}&query=${pagination?.query}`);
  },

  /**
   * Get metadata record details by ID
   */
  getObjectDetails: (id: string): Promise<ApiResponse<MetaDataRecordDto>> => {
    return fetchData<ApiResponse<MetaDataRecordDto>>(`${NEXT_API_BASE_URL}/${id}`);
  },

  /**
   * Create a new metadata record
   */
  createMetaDataRecord: (data: MetaDataRecordRequestDto): Promise<ApiResponse<MetaDataRecordDto>> => {
    return fetchData<ApiResponse<MetaDataRecordDto>>(`${NEXT_API_BASE_URL}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing metadata record
   */
  updateMetaDataRecord: (id: string, data: MetaDataRecordRequestDto): Promise<ApiResponse<MetaDataRecordDto>> => {
    return fetchData<ApiResponse<MetaDataRecordDto>>(`${NEXT_API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a metadata record
   */
  deleteMetaDataRecord: (id: string): Promise<ApiResponse<string>> => {
    return fetchData<ApiResponse<string>>(`${NEXT_API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
  },

  // ========================
  // METADATA FIELDS
  // ========================

  /**
   * Get fields for a specific metadata record
   */
  getRecordFields: (recordId: string, pagination?: PaginationParams): Promise<ApiResponse<HateoasContentResponse<MetaDataFieldDtoMin>>> => {
    const queryParams = new URLSearchParams();
    if (pagination?.page !== undefined) queryParams.append('page', pagination.page.toString());
    if (pagination?.size !== undefined) queryParams.append('size', pagination.size.toString());
    if (pagination?.sortBy) queryParams.append('sortBy', pagination.sortBy);
    if (pagination?.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
    
    const queryString = queryParams.toString();
    const url = `${NEXT_API_BASE_URL}/${recordId}/fields${queryString ? '?' + queryString : ''}`;
    
    return fetchData<ApiResponse<HateoasContentResponse<MetaDataFieldDtoMin>>>(url);
  },

  /**
   * Get fields for a specific metadata record
   */
  getRecordTriggers: (recordId: string, pagination?: PaginationParams): Promise<ApiResponse<HateoasContentResponse<MetaDataTriggerDto>>> => {
    const queryParams = new URLSearchParams();
    if (pagination?.page !== undefined) queryParams.append('page', pagination.page.toString());
    if (pagination?.size !== undefined) queryParams.append('size', pagination.size.toString());
    if (pagination?.sortBy) queryParams.append('sortBy', pagination.sortBy);
    if (pagination?.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
    
    const queryString = queryParams.toString();
    const url = `${NEXT_API_BASE_URL}/${recordId}/triggers${queryString ? '?' + queryString : ''}`;
    
    return fetchData<ApiResponse<HateoasContentResponse<MetaDataTriggerDto>>>(url);
  },

  /**
   * Create a new field for a metadata record
   */
  createRecordTriggers: (recordId: string, data:MetaDataTriggerDto ): Promise<ApiResponse<HateoasContentResponse<MetaDataTriggerDto>>> => {
    return fetchData<ApiResponse<HateoasContentResponse<MetaDataTriggerDto>>>(`${NEXT_API_BASE_URL}/${recordId}/triggers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Create a new field for a metadata record
   */
  createRecordField: (recordId: string, data: Omit<MetaDataFieldRequestDto, 'recordId'>): Promise<ApiResponse<MetaDataFieldDto>> => {
    return fetchData<ApiResponse<MetaDataFieldDto>>(`${NEXT_API_BASE_URL}/${recordId}/fields`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing field
   */
  updateRecordField: (recordId: string, fieldId: string, data: MetaDataFieldRequestDto): Promise<ApiResponse<MetaDataFieldDto>> => {
    return fetchData<ApiResponse<MetaDataFieldDto>>(`${NEXT_API_BASE_URL}/${recordId}/fields/${fieldId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // ========================
  // METADATA RECORD TYPES
  // ========================

  /**
   * Get record types for a specific metadata record
   */
  getRecordTypes: (recordId: string, pagination?: PaginationParams): Promise<ApiResponse<HateoasContentResponse<MetaDataRecordTypeDto>>> => {
    const queryParams = new URLSearchParams();
    if (pagination?.page !== undefined) queryParams.append('page', pagination.page.toString());
    if (pagination?.size !== undefined) queryParams.append('size', pagination.size.toString());
    if (pagination?.sortBy) queryParams.append('sortBy', pagination.sortBy);
    if (pagination?.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
    
    const queryString = queryParams.toString();
    const url = `${NEXT_API_BASE_URL}/${recordId}/types${queryString ? '?' + queryString : ''}`;
    
    return fetchData<ApiResponse<HateoasContentResponse<MetaDataRecordTypeDto>>>(url);
  },

  /**
   * Get specific record type details
   */
  getRecordTypeDetails: (recordId: string, typeId: string): Promise<ApiResponse<MetaDataRecordTypeDto>> => {
    return fetchData<ApiResponse<MetaDataRecordTypeDto>>(`${NEXT_API_BASE_URL}/${recordId}/types/${typeId}`);
  },

  /**
   * Create a new record type for a metadata record
   */
  createRecordType: (recordId: string, data: Omit<MetaDataRecordTypeRequestDto, 'recordId'>): Promise<ApiResponse<MetaDataRecordTypeDto>> => {
    return fetchData<ApiResponse<MetaDataRecordTypeDto>>(`${NEXT_API_BASE_URL}/${recordId}/types`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing record type
   */
  updateRecordType: (recordId: string, typeId: string, data: MetaDataRecordTypeRequestDto): Promise<ApiResponse<MetaDataRecordTypeDto>> => {
    return fetchData<ApiResponse<MetaDataRecordTypeDto>>(`${NEXT_API_BASE_URL}/${recordId}/types/${typeId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a record type
   */
  deleteRecordType: (recordId: string, typeId: string): Promise<ApiResponse<null>> => {
    return fetchData<ApiResponse<null>>(`${NEXT_API_BASE_URL}/${recordId}/types/${typeId}`, {
      method: 'DELETE',
    });
  },

  // ========================
  // METADATA REFERENCE DATA
  // ========================

  /**
   * Get metadata field types
   */
  getFieldTypes: (pagination?: PaginationParams): Promise<ApiResponse<HateoasContentResponse<MetaDataFieldTypeDto>>> => {
    const queryParams = new URLSearchParams();
    if (pagination?.page !== undefined) queryParams.append('page', pagination.page.toString());
    if (pagination?.size !== undefined) queryParams.append('size', pagination.size.toString());
    if (pagination?.sortBy) queryParams.append('sortBy', pagination.sortBy);
    if (pagination?.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
    
    const queryString = queryParams.toString();
    const url = `${NEXT_API_BASE_URL}/metadata/field-types${queryString ? '?' + queryString : ''}`;
    
    return fetchData<ApiResponse<HateoasContentResponse<MetaDataFieldTypeDto>>>(url);
  },

  /**
   * Get metadata field categories
   */
  getFieldCategories: (pagination?: PaginationParams): Promise<ApiResponse<HateoasContentResponse<MetaDataFieldCategoryDto>>> => {
    const queryParams = new URLSearchParams();
    if (pagination?.page !== undefined) queryParams.append('page', pagination.page.toString());
    if (pagination?.size !== undefined) queryParams.append('size', pagination.size.toString());
    if (pagination?.sortBy) queryParams.append('sortBy', pagination.sortBy);
    if (pagination?.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
    
    const queryString = queryParams.toString();
    const url = `${NEXT_API_BASE_URL}/metadata/field-categories${queryString ? '?' + queryString : ''}`;
    
    return fetchData<ApiResponse<HateoasContentResponse<MetaDataFieldCategoryDto>>>(url);
  },

  /**
   * Get metadata types
   */
  getMetaDataTypes: (pagination?: PaginationParams): Promise<ApiResponse<HateoasContentResponse<MetaDataTypeDto>>> => {
    const queryParams = new URLSearchParams();
    if (pagination?.page !== undefined) queryParams.append('page', pagination.page.toString());
    if (pagination?.size !== undefined) queryParams.append('size', pagination.size.toString());
    if (pagination?.sortBy) queryParams.append('sortBy', pagination.sortBy);
    if (pagination?.sortDirection) queryParams.append('sortDirection', pagination.sortDirection);
    
    const queryString = queryParams.toString();
    const url = `${NEXT_API_BASE_URL}/metadata/types${queryString ? '?' + queryString : ''}`;
    
    return fetchData<ApiResponse<HateoasContentResponse<MetaDataTypeDto>>>(url);
  },

};
