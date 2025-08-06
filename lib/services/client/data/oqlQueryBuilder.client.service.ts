import apiClient from '../api-client';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { getStoredToken } from '@/lib/services/auth/token-storage';
import { DataRecordDtoMin } from './oql.client.service';

export type OqlOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE';

// OQL Query builder for complex queries with fluent API
export class OqlQueryBuilderClient {
  private objectApiName: string;
  private fields: string[] = [];
  private whereClauses: string[] = [];
  private offsetValue?: number;
  private limitValue?: number;

  constructor(objectApiName: string) {
    this.objectApiName = objectApiName;
  }

  addField(field: string) {
    this.fields.push(field);
    return this;
  }

  where(field: string, operator: OqlOperator, value: any) {
    this.whereClauses.push(`${field} ${operator} '${value}'`);
    return this;
  }

  andWhere(field: string, operator: OqlOperator, value: any) {
    if (this.whereClauses.length > 0) {
      this.whereClauses.push('AND');
    }
    return this.where(field, operator, value);
  }

  orWhere(field: string, operator: OqlOperator, value: any) {
    if (this.whereClauses.length > 0) {
      this.whereClauses.push('OR');
    }
    return this.where(field, operator, value);
  }

  offset(offset: number) {
    this.offsetValue = offset;
    return this;
  }

  limit(limit: number) {
    this.limitValue = limit;
    return this;
  }

  buildOql(): string {
    let oql = `SELECT ${this.fields.length ? this.fields.join(', ') : '*'} FROM ${this.objectApiName}`;
    
    if (this.whereClauses.length) {
      oql += ' WHERE ' + this.whereClauses.join(' ');
    }
    
    if (this.limitValue !== undefined) {
      oql += ` LIMIT ${this.limitValue}`;
    }
    
    if (this.offsetValue !== undefined) {
      oql += ` OFFSET ${this.offsetValue}`;
    }
    
    return oql;
  }

  async fetch(): Promise<ApiResponse<Record<string, DataRecordDtoMin>>> {
    const token = getStoredToken();
    const query = this.buildOql();
    
    return apiClient<ApiResponse<Record<string, DataRecordDtoMin>>>('/data/oql/execute', {
      method: 'POST',
      body: { query },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  }
}

export function oqlQueryBuilderClient(objectApiName: string) {
  return new OqlQueryBuilderClient(objectApiName);
}
