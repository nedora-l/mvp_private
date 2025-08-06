/**
 * Base HTTP client for making API requests
 * Provides common functionality like adding headers, handling errors, etc.
 */

import { DEFAULT_BASE_URL } from '../constants/global';
import { getStoredToken } from '../services/auth/token-storage';

export interface HttpClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

export interface HttpClientResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(options: HttpClientOptions = {}) {
    // Check if we're running in development mode (Next.js sets NODE_ENV)
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Choose base URL based on environment
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_BASE_URL;
    // Ensure the URL has the correct protocol
    if (baseUrl && !baseUrl.startsWith('http')) {
      baseUrl = `https://${baseUrl}`;
    }
    console.log(`HttpClient initialized with baseUrl: ${baseUrl || 'relative path (empty string)'}`);
    
    this.baseUrl = options.baseUrl || baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  /**
   * Add authorization header with JWT token if available
   */
  private getAuthHeaders(): Record<string, string> {
    const token = getStoredToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Parse response from fetch API
   */
  private async parseResponse<T>(response: Response): Promise<HttpClientResponse<T>> {
    const status = response.status;
    const ok = response.ok;
    // For 204 No Content responses
    if (status === 204) {
      return { data: {} as T, status, ok };
    }

    // Parse JSON for other responses
    try {
      const data = await response.json() as T;
      return { data, status, ok };
    } catch (error) {
      throw new Error(`Failed to parse response: ${error}`);
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any, url: string, method: string): never {
    const message = error.message || 'Unknown error occurred';
    console.error(`${method} ${url} failed: ${message}`);
    throw error;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<HttpClientResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`HttpClient: Making GET request to ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...this.defaultHeaders,
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });
      return this.parseResponse<T>(response);
    } catch (error: any) {
      console.error(`HttpClient: GET request to ${url} failed:`, error);
      return this.handleError(error, url, 'GET');
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<HttpClientResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`HttpClient: Making POST request to ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        body: data instanceof FormData ? data : JSON.stringify(data),
        ...options,
      });
      return this.parseResponse<T>(response);
    } catch (error: any) {
      console.error(`HttpClient: POST request to ${url} failed:`, error);
      return this.handleError(error, url, 'POST');
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<HttpClientResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`HttpClient: Making PUT request to ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...this.defaultHeaders,
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        body: data instanceof FormData ? data : JSON.stringify(data),
        ...options,
      });
      return this.parseResponse<T>(response);
    } catch (error: any) {
      console.error(`HttpClient: PUT request to ${url} failed:`, error);
      return this.handleError(error, url, 'PUT');
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<HttpClientResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`HttpClient: Making DELETE request to ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...this.defaultHeaders,
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });
      return this.parseResponse<T>(response);
    } catch (error: any) {
      console.error(`HttpClient: DELETE request to ${url} failed:`, error);
      return this.handleError(error, url, 'DELETE');
    }
  }
}

// Export a default instance with common configuration
export const httpClient = new HttpClient();