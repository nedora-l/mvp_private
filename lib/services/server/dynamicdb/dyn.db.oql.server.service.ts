import { httpClient } from "@/lib/utils/http-client";
import { ApiAppResponse } from "..";


export interface OqlQueryDto {
  query: string;
} 

export interface DataRecordDtoMin {
  id?: string;
  createdAt: string;
  updatedAt?: string;
  name?: string | null;
  metaRecordId?: string | null;
  recordTypeId?: string | null;
  data?: [string, any][] | Record<string, any> | null;
  active?: boolean;
  archived?: boolean;
  public?: boolean;
}

export interface OqlRequestDto {
  query: string;
}

export interface OqlExecutionResult {
  records: Map<string, DataRecordDtoMin>;
  executionTime?: number;
  recordCount: number;
  queryInfo?: {
    originalQuery: string;
    parsedQuery?: string;
    executedAt: string;
  };
}

export interface OqlQueryValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface OqlQueryHistory {
  id: string;
  query: string;
  executedAt: string;
  executionTime: number;
  recordCount: number;
  success: boolean;
  errorMessage?: string;
}

/**
 * Dynamic DB OQL Server Service
 * Provides methods to interact with DynOqlApiAppsController APIs
 */
export class DynamicDBOqlServerService {
  private readonly baseUrl = '/api/dbz/v1/oql';

  // API URL constants
  public static readonly ENDPOINTS = {
    EXECUTE_QUERY: '/execute',
    SYNC_GRAPH: '/sync'
  } as const;

  private queryHistory: OqlQueryHistory[] = [];

  private async getAuthHeaders(token: string): Promise<Record<string, string>> {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // ========================
  // CORE OQL OPERATIONS
  // ========================

  /**
   * Execute an OQL query and return matching records
   */
  async executeOqlQuery(
    token: string, 
    query: string
  ): Promise<OqlExecutionResult> {
    const headers = await this.getAuthHeaders(token);
    const requestDto: OqlRequestDto = { query };
    const startTime = Date.now();
    
    try {
      console.log(`Executing OQL query: ${query}`);
      const response = await httpClient.post<ApiAppResponse<Map<string, DataRecordDtoMin>>>(
        `${this.baseUrl}${DynamicDBOqlServerService.ENDPOINTS.EXECUTE_QUERY}`,
        requestDto,
        { headers }
    );
      console.log(`OQL query executed successfully: ${query}`);

      // Check if response is valid
      if (!response || !response.data) {
        console.log('Invalid response from OQL execution');
      }

      const apiResponse: ApiAppResponse<Map<string, DataRecordDtoMin>> =   response.data ;
      const executionTime = Date.now() - startTime;
      console.log(`apiResponse data:`, apiResponse.data);

      // Convert the response data to a proper Map if it's not already
      const recordsMap = new Map<string, DataRecordDtoMin>();
      if (apiResponse.data) {
        console.log(apiResponse.data);
        if (apiResponse.data instanceof Map) {
          apiResponse.data.forEach((value, key) => {
            recordsMap.set(key, this.transformRecord(value));
          });
        } 
        else if (typeof apiResponse.data === 'object') {
          // Convert object to Map
          Object.entries(apiResponse.data).forEach(([key, value]) => {
            recordsMap.set(key, this.transformRecord(value));
          });
        } 
        else {
          console.log('Invalid typeof apiResponse.data', apiResponse.data);
        }
      }

      const result: OqlExecutionResult = {
        records: recordsMap,
        executionTime,
        recordCount: recordsMap.size,
        queryInfo: {
          originalQuery: query,
          executedAt: new Date().toISOString()
        }
      };

      // Add to query history
      this.addToQueryHistory({
        id: this.generateQueryId(),
        query,
        executedAt: new Date().toISOString(),
        executionTime,
        recordCount: recordsMap.size,
        success: true
      });

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Add failed query to history
      this.addToQueryHistory({
        id: this.generateQueryId(),
        query,
        executedAt: new Date().toISOString(),
        executionTime,
        recordCount: 0,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  /**
   * Sync the knowledge graph
   */
  async syncGraph(token: string): Promise<string> {
    const headers = await this.getAuthHeaders(token);
    
    const response = await fetch(`${this.baseUrl}${DynamicDBOqlServerService.ENDPOINTS.SYNC_GRAPH}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`Failed to sync graph: ${response.statusText}`);
    }

    const apiResponse: ApiAppResponse<string> = await response.json();
    return apiResponse.data;
  }

  // ========================
  // QUERY VALIDATION & HELPERS
  // ========================

// Helper function to transform API response to DTO format
  transformRecord(apiRecord: any): DataRecordDtoMin {
    return {
      id: apiRecord.id,
      createdAt: apiRecord.createdAt,
      updatedAt: apiRecord.updatedAt,
      name: apiRecord.name || '', // Provide default empty string if null
      metaRecordId: apiRecord.metaRecordId,
      recordTypeId: apiRecord.recordTypeId,
      data: apiRecord.data,
      active: apiRecord.active,     // 
      archived: apiRecord.archived, // 
      public: apiRecord.public      // 
    };
  }
  /**
   * Validate an OQL query (client-side basic validation)
   */
  validateOqlQuery(query: string): OqlQueryValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Basic validation
    if (!query || query.trim().length === 0) {
      errors.push('Query cannot be empty');
      return { isValid: false, errors, warnings, suggestions };
    }

    // Check for minimum query structure
    const trimmedQuery = query.trim();
    
    // Basic OQL syntax checks (you can expand these based on your OQL grammar)
    if (!trimmedQuery.includes('SELECT') && !trimmedQuery.includes('MATCH') && !trimmedQuery.includes('FIND')) {
      warnings.push('Query might be missing a SELECT, MATCH, or FIND clause');
      suggestions.push('Consider starting with SELECT, MATCH, or FIND');
    }

    // Check for potential SQL injection patterns (basic)
    const suspiciousPatterns = [
      /DROP\s+TABLE/i,
      /DELETE\s+FROM/i,
      /UPDATE\s+.*\s+SET/i,
      /INSERT\s+INTO/i,
      /--/,
      /\/\*/
    ];

    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(query)) {
        errors.push('Query contains potentially dangerous SQL patterns');
      }
    });

    // Check query length
    if (query.length > 10000) {
      warnings.push('Query is very long and might impact performance');
    }

    // Suggest improvements
    if (!query.includes('LIMIT') && !query.includes('TOP')) {
      suggestions.push('Consider adding a LIMIT clause to control result size');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Get query execution history
   */
  getQueryHistory(): OqlQueryHistory[] {
    return [...this.queryHistory].sort((a, b) => 
      new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
    );
  }

  /**
   * Get recent successful queries
   */
  getRecentSuccessfulQueries(limit: number = 10): OqlQueryHistory[] {
    return this.queryHistory
      .filter(q => q.success)
      .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime())
      .slice(0, limit);
  }

  /**
   * Clear query history
   */
  clearQueryHistory(): void {
    this.queryHistory = [];
  }

  // ========================
  // ADVANCED QUERY OPERATIONS
  // ========================

  /**
   * Execute multiple OQL queries in sequence
   */
  async executeBatchQueries(
    token: string,
    queries: string[]
  ): Promise<{
    results: OqlExecutionResult[];
    totalExecutionTime: number;
    successCount: number;
    failureCount: number;
    errors: Array<{ query: string; error: string }>;
  }> {
    const startTime = Date.now();
    const results: OqlExecutionResult[] = [];
    const errors: Array<{ query: string; error: string }> = [];
    let successCount = 0;
    let failureCount = 0;

    for (const query of queries) {
      try {
        const result = await this.executeOqlQuery(token, query);
        results.push(result);
        successCount++;
      } catch (error) {
        failureCount++;
        errors.push({
          query,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      results,
      totalExecutionTime: Date.now() - startTime,
      successCount,
      failureCount,
      errors
    };
  }

  /**
   * Execute OQL query with timeout
   */
  async executeOqlQueryWithTimeout(
    token: string,
    query: string,
    timeoutMs: number = 30000
  ): Promise<OqlExecutionResult> {
    return Promise.race([
      this.executeOqlQuery(token, query),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Query execution timeout')), timeoutMs)
      )
    ]);
  }

  /**
   * Get query execution statistics
   */
  getQueryStatistics(): {
    totalQueries: number;
    successfulQueries: number;
    failedQueries: number;
    averageExecutionTime: number;
    averageRecordCount: number;
    mostFrequentQueries: Array<{ query: string; count: number }>;
  } {
    const history = this.queryHistory;
    const successful = history.filter(q => q.success);
    const failed = history.filter(q => !q.success);

    // Calculate averages
    const avgExecutionTime = successful.length > 0 
      ? successful.reduce((sum, q) => sum + q.executionTime, 0) / successful.length 
      : 0;

    const avgRecordCount = successful.length > 0
      ? successful.reduce((sum, q) => sum + q.recordCount, 0) / successful.length
      : 0;

    // Find most frequent queries
    const queryFrequency = new Map<string, number>();
    history.forEach(q => {
      const count = queryFrequency.get(q.query) || 0;
      queryFrequency.set(q.query, count + 1);
    });

    const mostFrequentQueries = Array.from(queryFrequency.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalQueries: history.length,
      successfulQueries: successful.length,
      failedQueries: failed.length,
      averageExecutionTime: avgExecutionTime,
      averageRecordCount: avgRecordCount,
      mostFrequentQueries
    };
  }

  // ========================
  // QUERY BUILDING HELPERS
  // ========================

  /**
   * Build a simple SELECT query
   */
  buildSelectQuery(
    recordType?: string,
    fields?: string[],
    conditions?: Record<string, any>,
    limit?: number
  ): string {
    let query = 'SELECT ';
    
    if (fields && fields.length > 0) {
      query += fields.join(', ');
    } else {
      query += '*';
    }

    if (recordType) {
      query += ` FROM ${recordType}`;
    }

    if (conditions && Object.keys(conditions).length > 0) {
      const whereClause = Object.entries(conditions)
        .map(([field, value]) => {
          if (typeof value === 'string') {
            return `${field} = '${value}'`;
          }
          return `${field} = ${value}`;
        })
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    return query;
  }

  /**
   * Build a MATCH query for graph-style queries
   */
  buildMatchQuery(
    pattern: string,
    returnClause?: string,
    whereClause?: string,
    limit?: number
  ): string {
    let query = `MATCH ${pattern}`;

    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }

    if (returnClause) {
      query += ` RETURN ${returnClause}`;
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    return query;
  }

  /**
   * Escape string values for OQL queries
   */
  escapeString(value: string): string {
    return value.replace(/'/g, "''").replace(/\\/g, '\\\\');
  }

  // ========================
  // PERFORMANCE MONITORING
  // ========================

  /**
   * Get slow queries (above threshold)
   */
  getSlowQueries(thresholdMs: number = 5000): OqlQueryHistory[] {
    return this.queryHistory
      .filter(q => q.executionTime > thresholdMs)
      .sort((a, b) => b.executionTime - a.executionTime);
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): {
    fastestQuery: OqlQueryHistory | null;
    slowestQuery: OqlQueryHistory | null;
    averageExecutionTime: number;
    p95ExecutionTime: number;
    queriesAboveThreshold: number;
  } {
    const successful = this.queryHistory.filter(q => q.success);
    
    if (successful.length === 0) {
      return {
        fastestQuery: null,
        slowestQuery: null,
        averageExecutionTime: 0,
        p95ExecutionTime: 0,
        queriesAboveThreshold: 0
      };
    }

    const sorted = [...successful].sort((a, b) => a.executionTime - b.executionTime);
    const p95Index = Math.floor(sorted.length * 0.95);
    const threshold = 5000; // 5 seconds

    return {
      fastestQuery: sorted[0],
      slowestQuery: sorted[sorted.length - 1],
      averageExecutionTime: sorted.reduce((sum, q) => sum + q.executionTime, 0) / sorted.length,
      p95ExecutionTime: sorted[p95Index]?.executionTime || 0,
      queriesAboveThreshold: sorted.filter(q => q.executionTime > threshold).length
    };
  }

  // ========================
  // PRIVATE HELPER METHODS
  // ========================

  private generateQueryId(): string {
    return `oql_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private addToQueryHistory(query: OqlQueryHistory): void {
    this.queryHistory.push(query);
    
    // Keep only last 100 queries to prevent memory issues
    if (this.queryHistory.length > 100) {
      this.queryHistory = this.queryHistory.slice(-100);
    }
  }

  // ========================
  // HEALTH CHECK & MONITORING
  // ========================

  /**
   * Health check for the OQL service
   */
  async healthCheck(token: string): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    checks: {
      queryExecution: boolean;
      graphSync: boolean;
      responseTime: number;
    };
  }> {
    const timestamp = new Date().toISOString();
    const startTime = Date.now();
    
    const checks = {
      queryExecution: false,
      graphSync: false,
      responseTime: 0
    };

    try {
      // Test basic query execution with a simple query
      await this.executeOqlQuery(token, 'SELECT * LIMIT 1');
      checks.queryExecution = true;

      // Test graph sync (assuming it doesn't cause side effects in a health check)
      // In production, you might want a dedicated health check endpoint
      checks.graphSync = true; // Assume true if query execution works

      checks.responseTime = Date.now() - startTime;

      const allHealthy = checks.queryExecution && checks.graphSync;
      
      return {
        status: allHealthy ? 'healthy' : 'unhealthy',
        timestamp,
        checks
      };
    } catch (error) {
      checks.responseTime = Date.now() - startTime;
      
      return {
        status: 'unhealthy',
        timestamp,
        checks
      };
    }
  }
}

// ========================
// SPECIALIZED OQL HELPERS
// ========================

export interface OqlQueryTemplate {
  name: string;
  description: string;
  template: string;
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean';
    required: boolean;
    description: string;
  }>;
}

/**
 * Extension with query templates and advanced utilities
 */
export class DynamicDBOqlAdvancedService extends DynamicDBOqlServerService {
  
  private queryTemplates: OqlQueryTemplate[] = [
    {
      name: 'Find Records by Type',
      description: 'Find all records of a specific type',
      template: 'SELECT * FROM {recordType} LIMIT {limit}',
      parameters: [
        { name: 'recordType', type: 'string', required: true, description: 'The record type to search for' },
        { name: 'limit', type: 'number', required: false, description: 'Maximum number of records to return' }
      ]
    },
    {
      name: 'Find Active Records',
      description: 'Find all active records',
      template: 'SELECT * WHERE isActive = true LIMIT {limit}',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Maximum number of records to return' }
      ]
    },
    {
      name: 'Find Records by Name Pattern',
      description: 'Find records with names matching a pattern',
      template: 'SELECT * WHERE name LIKE \'{pattern}%\' LIMIT {limit}',
      parameters: [
        { name: 'pattern', type: 'string', required: true, description: 'The name pattern to search for' },
        { name: 'limit', type: 'number', required: false, description: 'Maximum number of records to return' }
      ]
    }
  ];

  /**
   * Get available query templates
   */
  getQueryTemplates(): OqlQueryTemplate[] {
    return [...this.queryTemplates];
  }

  /**
   * Apply parameters to a query template
   */
  applyTemplate(template: string, parameters: Record<string, any>): string {
    let query = template;
    
    Object.entries(parameters).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      const replacement = typeof value === 'string' ? value : String(value);
      query = query.replace(new RegExp(placeholder, 'g'), replacement);
    });

    return query;
  }

  /**
   * Execute a query using a template
   */
  async executeTemplateQuery(
    token: string,
    templateName: string,
    parameters: Record<string, any>
  ): Promise<OqlExecutionResult> {
    const template = this.queryTemplates.find(t => t.name === templateName);
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    // Validate required parameters
    const missingParams = template.parameters
      .filter(p => p.required && !(p.name in parameters))
      .map(p => p.name);

    if (missingParams.length > 0) {
      throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
    }

    const query = this.applyTemplate(template.template, parameters);
    return this.executeOqlQuery(token, query);
  }
}

// Export singleton instances
export const dynDBOqlServerService = new DynamicDBOqlServerService();
export const dynDBOqlAdvancedService = new DynamicDBOqlAdvancedService();

