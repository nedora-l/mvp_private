import apiClient from '../api-client';
import { ApiResponse, PaginationParams } from '@/lib/interfaces/apis/common';
import { getStoredToken } from '@/lib/services/auth/token-storage';

// DTOs for dynamic data operations
export interface DataRecordDto {
  id: string;
  createdAt: string;
  updatedAt?: string;
  metaDataRecord?: any;
  data: Record<string, any>;
  recordType?: any;
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

export interface DataRecordRequestDto {
  metaRecordApiName: string;
  recordTypeId?: string;
  data?: Record<string, any>;
  isActive?: boolean;
  isArchived?: boolean;
  isPublic?: boolean;
}

export interface DataRecordQueryParams extends PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  object?: string;
  fields?: string;
}

const DATA_RECORDS_BASE_PATH = '/data/records';

/**
 * Get paginated list of data records
 */
export const getDataRecordsClientApi = async (params?: DataRecordQueryParams): Promise<ApiResponse<DataRecordDto[]>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<DataRecordDto[]>>(DATA_RECORDS_BASE_PATH, {
    method: 'GET',
    params,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Get data record details by ID
 */
export const getDataRecordDetailsClientApi = async (id: string): Promise<ApiResponse<DataRecordDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<DataRecordDto>>(`${DATA_RECORDS_BASE_PATH}/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Create a new data record
 */
export const createDataRecordClientApi = async (requestDto: DataRecordRequestDto): Promise<ApiResponse<DataRecordDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<DataRecordDto>>(DATA_RECORDS_BASE_PATH, {
    method: 'POST',
    body: requestDto,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Update an existing data record
 */
export const updateDataRecordClientApi = async (id: string, requestDto: DataRecordRequestDto): Promise<ApiResponse<DataRecordDto>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<DataRecordDto>>(`${DATA_RECORDS_BASE_PATH}/${id}`, {
    method: 'PUT',
    body: requestDto,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Delete a data record
 */
export const deleteDataRecordClientApi = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<{ message: string }>>(`${DATA_RECORDS_BASE_PATH}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};
