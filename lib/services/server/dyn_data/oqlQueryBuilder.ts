// documentation/nextjs/libraries/dyn_data/oqlQueryBuilder.ts
// Portable OQL Query Builder for dynamic OQL queries
// Usage: oqlQueryBuilder("ObjectApiName").addField(...).where(...).limit(...).fetch(token)

export type OqlOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE';

export interface OqlQueryBuilderOptions {
  objectApiName: string;
  fields: string[];
  whereClauses: string[];
  offset?: number;
  limit?: number;
  httpClient?: any;
  baseUrl?: string;
}

export class OqlQueryBuilder {
  private options: OqlQueryBuilderOptions;

  constructor(objectApiName: string, httpClient?: any, baseUrl = '/api/dbz/v1/oql/execute') {
    this.options = {
      objectApiName,
      fields: [],
      whereClauses: [],
      httpClient,
      baseUrl
    };
  }

  addField(field: string) {
    this.options.fields.push(field);
    return this;
  }

  where(field: string, operator: OqlOperator, value: any) {
    this.options.whereClauses.push(`${field} ${operator} '${value}'`);
    return this;
  }

  andWhere(field: string, operator: OqlOperator, value: any) {
    if (this.options.whereClauses.length > 0) {
      this.options.whereClauses.push('AND');
    }
    return this.where(field, operator, value);
  }

  orWhere(field: string, operator: OqlOperator, value: any) {
    if (this.options.whereClauses.length > 0) {
      this.options.whereClauses.push('OR');
    }
    return this.where(field, operator, value);
  }

  offset(offset: number) {
    this.options.offset = offset;
    return this;
  }

  limit(limit: number) {
    this.options.limit = limit;
    return this;
  }

  setHttpClient(httpClient: any) {
    this.options.httpClient = httpClient;
    return this;
  }

  setBaseUrl(baseUrl: string) {
    this.options.baseUrl = baseUrl;
    return this;
  }

  buildOql(): string {
    const { objectApiName, fields, whereClauses, offset, limit } = this.options;
    let oql = `SELECT ${fields.length ? fields.join(', ') : '*'} FROM ${objectApiName}`;
    if (whereClauses.length) {
      oql += ' WHERE ' + whereClauses.join(' ');
    }
    if (limit !== undefined) {
      oql += ` LIMIT ${limit}`;
    }
    if (offset !== undefined) {
      oql += ` OFFSET ${offset}`;
    }
    return oql;
  }

  async fetch(accessToken: string): Promise<any> {
    const { httpClient, baseUrl } = this.options;
    if (!httpClient) throw new Error('httpClient is required');
    const oql = this.buildOql();
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const body = { query: oql };
    const response = await httpClient.post(baseUrl, body, { headers });
    return response.data;
  }
}

export function oqlQueryBuilder(objectApiName: string, httpClient?: any, baseUrl?: string) {
  return new OqlQueryBuilder(objectApiName, httpClient, baseUrl);
}
