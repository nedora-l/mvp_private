import { httpClient } from "@/lib/utils/http-client";

// DTOs (replace with actual imports or expand as needed)
export interface DataRecordDto {
  id: string;
  createdAt: string;
  updatedAt?: string;
  metaDataRecord?: any;
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

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export class DynDataCrudServerService {
  private readonly baseUrl = '/api/dbz/v1/data/records';

  getHeaders(accessToken: string) {
    return {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    };
  }

  buildQueryParams(params: PaginationParams = {}): string {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    return queryParams.toString() ? `?${queryParams.toString()}` : '';
  }

  /**
   * Get paginated list of data records
   * GET /api/dbz/v1/data/records
   */
  async getDataRecords(accessToken: string, params: PaginationParams = {}): Promise<DataRecordDto[]> {
    try {
      const headers = this.getHeaders(accessToken);
      const queryString = this.buildQueryParams(params);
      const response = await httpClient.get<{ data: DataRecordDto[] }>(
        `${this.baseUrl}${queryString}`,
        headers
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get data record details by ID
   * GET /api/dbz/v1/data/records/{id}
   */
  async getDataRecordDetails(accessToken: string, id: string): Promise<DataRecordDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<{ data: DataRecordDto }>(
        `${this.baseUrl}/${id}`,
        headers
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new data record
   * POST /api/dbz/v1/data/records
   */
  async createDataRecord(accessToken: string, requestDto: DataRecordRequestDto): Promise<DataRecordDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<{ data: DataRecordDto }>(
        this.baseUrl,
        requestDto,
        headers
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing data record
   * PUT /api/dbz/v1/data/records/{id}
   */
  async updateDataRecord(accessToken: string, id: string, requestDto: DataRecordRequestDto): Promise<DataRecordDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<{ data: DataRecordDto }>(
        `${this.baseUrl}/${id}`,
        requestDto,
        headers
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a data record
   * DELETE /api/dbz/v1/data/records/{id}
   */
  async deleteDataRecord(accessToken: string, id: string): Promise<{ message: string }> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.delete<{ message: string }>(
        `${this.baseUrl}/${id}`,
        headers
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const dynDataCrudServerService = new DynDataCrudServerService();
