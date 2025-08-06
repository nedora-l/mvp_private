// Atimeus API Client for client-side usage
// This version can be used in React components and client-side code

import { ProjectFinancialSummaryDto } from "@/lib/interfaces/apis";
import { 
  EmployeeDto,
  EmployeeSearchParams,
  EmployeeView,
  AtimeusProjectDto,
  AtimeusProjectSearchParams,
  AtimeusProjectView,
  ProjectIndicatorsDto,
  CRADto,
  CRARequestDto,
  CRASearchParams,
  ActivityDto,
  ActivitySearchParams,
  ActivityView,
  AtimeusApiConfig
} from "../../server/atimeus/atimeus.dtos";
import { getStoredToken } from "../../auth/token-storage";

export class AtimeusApiClient {
  private baseUrl: string;
  private config: AtimeusApiConfig;

  constructor(baseUrl: string = '/api/v1/projects/atimeus', config: AtimeusApiConfig = {}) {
    this.baseUrl = baseUrl;
    this.config = config;
  }

  private async fetchWithAuth<T>(
    endpoint: string, 
    options: RequestInit = {},
    customApiKey?: string
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };
    const token =  getStoredToken();

    // Add authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Add custom API key if provided (overrides default)
    if (customApiKey) {
      headers['X-Atimeus-API-Key'] = customApiKey;
    } else if (this.config.apiKey) {
      headers['X-Atimeus-API-Key'] = this.config.apiKey;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ========================
  // EMPLOYEE OPERATIONS
  // ========================

  async searchEmployees(params?: EmployeeSearchParams, customApiKey?: string): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.view) searchParams.append('view', params.view);
      if (params.filter) searchParams.append('filter', params.filter);
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/employees/search${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithAuth(endpoint, {}, customApiKey);
  }

  async getEmployeeById(employeeId: string, customApiKey?: string): Promise<EmployeeDto> {
    return this.fetchWithAuth(`/employees/${employeeId}`, {}, customApiKey);
  }

  async getEmployeeViews(customApiKey?: string): Promise<EmployeeView[]> {
    return this.fetchWithAuth('/employees/views', {}, customApiKey);
  }

  // ========================
  // PROJECT OPERATIONS
  // ========================

  async searchProjects(params?: AtimeusProjectSearchParams, customApiKey?: string): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.view) searchParams.append('view', params.view);
      if (params.filter) searchParams.append('filter', params.filter);
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/projects/search${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithAuth(endpoint, {}, customApiKey);
  }

  async getAllProjects(params?: AtimeusProjectSearchParams, customApiKey?: string): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.filter) searchParams.append('filter', params.filter);
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    }
    
    const queryString = searchParams.toString();
    const endpoint = `${queryString ? `?${queryString}` : ''}`;
    return this.fetchWithAuth(endpoint, {}, customApiKey);
  }

  async getProjectById(projectId: string, customApiKey?: string): Promise<AtimeusProjectDto> {
    return this.fetchWithAuth(`/${projectId}`, {}, customApiKey);
  }

  async getProjectIndicators(projectId: string): Promise<ProjectFinancialSummaryDto> {
    return this.fetchWithAuth(`/${projectId}`);
  }

  async getProjectViews(customApiKey?: string): Promise<AtimeusProjectView[]> {
    return this.fetchWithAuth('/views', {}, customApiKey);
  }

  // ========================
  // CRA OPERATIONS
  // ========================

  async createCRA(craData: CRARequestDto, customApiKey?: string): Promise<CRADto> {
    return this.fetchWithAuth('/cras', {
      method: 'POST',
      body: JSON.stringify(craData),
    }, customApiKey);
  }

  async searchCRAs(params?: CRASearchParams, customApiKey?: string): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.filter) searchParams.append('filter', params.filter);
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/cras/search${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithAuth(endpoint, {}, customApiKey);
  }

  async getCRAById(craId: string, customApiKey?: string): Promise<CRADto> {
    return this.fetchWithAuth(`/cras/${craId}`, {}, customApiKey);
  }

  async updateCRA(craId: string, craData: CRARequestDto, customApiKey?: string): Promise<CRADto> {
    return this.fetchWithAuth(`/cras/${craId}`, {
      method: 'PUT',
      body: JSON.stringify(craData),
    }, customApiKey);
  }

  async deleteCRA(craId: string, customApiKey?: string): Promise<void> {
    return this.fetchWithAuth(`/cras/${craId}`, {
      method: 'DELETE',
    }, customApiKey);
  }

  // ========================
  // ACTIVITY OPERATIONS
  // ========================

  async searchActivities(params?: ActivitySearchParams, customApiKey?: string): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.view) searchParams.append('view', params.view);
      if (params.filter) searchParams.append('filter', params.filter);
      if (params.page !== undefined) searchParams.append('page', params.page.toString());
      if (params.size !== undefined) searchParams.append('size', params.size.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
    }
    
    const queryString = searchParams.toString();
    const endpoint = `/activities/search${queryString ? `?${queryString}` : ''}`;
    
    return this.fetchWithAuth(endpoint, {}, customApiKey);
  }

  async getActivityById(activityId: string, customApiKey?: string): Promise<ActivityDto> {
    return this.fetchWithAuth(`/activities/${activityId}`, {}, customApiKey);
  }

  async getActivityViews(customApiKey?: string): Promise<ActivityView[]> {
    return this.fetchWithAuth('/activities/views', {}, customApiKey);
  }

  // ========================
  // CONFIGURATION METHODS
  // ========================

  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  getConfig(): AtimeusApiConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<AtimeusApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export a default instance
export const atimeusApiClient = new AtimeusApiClient();
