import apiClient from '../api-client';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { getStoredToken } from '@/lib/services/auth/token-storage';
import { DataRecordQueryParams, DataRecordDto } from './dynData.client.service';

// Query builder for data records with fluent API
export class DataQueryBuilderClient {
  private params: DataRecordQueryParams = {};

  constructor(objectApiName: string) {
    this.params.object = objectApiName;
  }

  withFields(fields: string[]) {
    this.params.fields = fields.join(',');
    return this;
  }

  page(page: number) {
    this.params.page = page;
    return this;
  }

  limit(limit: number) {
    this.params.size = limit;
    return this;
  }

  sortBy(sortBy: string, sortDirection: 'asc' | 'desc' = 'asc') {
    this.params.sortBy = sortBy;
    this.params.sortDirection = sortDirection;
    return this;
  }

  async fetch(): Promise<ApiResponse<DataRecordDto[]>> {
    const token = getStoredToken();
    return apiClient<ApiResponse<DataRecordDto[]>>('/data/records', {
      method: 'GET',
      params: this.params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  }
}

export function dataQueryBuilderClient(objectApiName: string) {
  return new DataQueryBuilderClient(objectApiName);
}
