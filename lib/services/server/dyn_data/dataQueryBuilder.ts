// documentation/nextjs/libraries/dyn_data/dataQueryBuilder.ts
// Portable Data Query Builder for dynamic data records
// Usage: dataQueryBuilder("ObjectApiName").withFields([...]).page(1).limit(10).fetch(token)

export interface DataQueryBuilderOptions {
  objectApiName: string;
  fields?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  httpClient?: any;
  baseUrl?: string;
}

export class DataQueryBuilder {
  private options: DataQueryBuilderOptions;

  constructor(objectApiName: string, httpClient?: any, baseUrl = '/api/dbz/v1/data/records') {
    this.options = { objectApiName, httpClient, baseUrl };
  }

  withFields(fields: string[]) {
    this.options.fields = fields;
    return this;
  }

  page(page: number) {
    this.options.page = page;
    return this;
  }

  limit(limit: number) {
    this.options.limit = limit;
    return this;
  }

  sortBy(sortBy: string, sortDirection: 'asc' | 'desc' = 'asc') {
    this.options.sortBy = sortBy;
    this.options.sortDirection = sortDirection;
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

  async fetch(accessToken: string): Promise<any> {
    const {
      objectApiName,
      fields,
      page,
      limit,
      sortBy,
      sortDirection,
      httpClient,
      baseUrl
    } = this.options;
    if (!httpClient) throw new Error('httpClient is required');
    const params = new URLSearchParams();
    if (objectApiName) params.append('object', objectApiName);
    if (fields && fields.length) params.append('fields', fields.join(','));
    if (page !== undefined) params.append('page', String(page));
    if (limit !== undefined) params.append('size', String(limit));
    if (sortBy) params.append('sortBy', sortBy);
    if (sortDirection) params.append('sortDirection', sortDirection);
    const url = `${baseUrl}?${params.toString()}`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const response = await httpClient.get(url, { headers });
    return response.data;
  }
}

export function dataQueryBuilder(objectApiName: string, httpClient?: any, baseUrl?: string) {
  return new DataQueryBuilder(objectApiName, httpClient, baseUrl);
}
