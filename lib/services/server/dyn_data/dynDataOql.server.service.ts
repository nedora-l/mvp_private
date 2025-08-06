import { httpClient } from "@/lib/utils/http-client";

// DTOs (replace with actual imports or expand as needed)
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

export class DynDataOqlServerService {
  private readonly baseUrl = '/api/dbz/v1/oql';

  getHeaders(accessToken: string) {
    return {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    };
  }

  /**
   * Execute an OQL query
   * POST /api/dbz/v1/oql/execute
   */
  async executeOqlQuery(accessToken: string, query: string): Promise<Record<string, DataRecordDtoMin>> {
    try {
      const headers = this.getHeaders(accessToken);
      const body: OqlRequestDto = { query };
      const response = await httpClient.post<{ data: Record<string, DataRecordDtoMin> }>(
        `${this.baseUrl}/execute`,
        body,
        headers
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sync the knowledge graph
   * GET /api/dbz/v1/oql/sync
   */
  async syncGraph(accessToken: string): Promise<string> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<{ data: string }>(
        `${this.baseUrl}/sync`,
        headers
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export const dynDataOqlServerService = new DynDataOqlServerService();
