import apiClient from '../api-client';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { getStoredToken } from '@/lib/services/auth/token-storage';

// DTOs for OQL operations
export interface OqlRequestDto {
  query: string;
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

const OQL_BASE_PATH = '/data/oql';

/**
 * Execute an OQL query
 */
export const executeOqlQueryClientApi = async (query: string): Promise<ApiResponse<Record<string, DataRecordDtoMin>>> => {
  const token = getStoredToken();
  const body: OqlRequestDto = { query };
  
  return apiClient<ApiResponse<Record<string, DataRecordDtoMin>>>(`${OQL_BASE_PATH}/execute`, {
    method: 'POST',
    body,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

/**
 * Sync the knowledge graph
 */
export const syncGraphClientApi = async (): Promise<ApiResponse<string>> => {
  const token = getStoredToken();
  
  return apiClient<ApiResponse<string>>(`${OQL_BASE_PATH}/sync`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};
