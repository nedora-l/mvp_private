// Atimeus API Server Service for Next.js
// Provides methods to interact with Atimeus API endpoints

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
  AtimeusApiResponse,
  AtimeusApiConfig
} from "./atimeus.dtos";
import { HateoasResponse, ApiAppResponse } from "../index";
import { httpClient } from "@/lib/utils/http-client";
import { ProjectFinancialSummaryDto } from "@/lib/interfaces/apis";

// For server-side token management - not persisted between requests
export const ATIMEUS_API_BASE_URL = '/api/v1/atimeus';

export const SECTION_EMPLOYEES = 'employees';
export const SECTION_PROJECTS = 'projects';
export const SECTION_CRAS = 'cras';
export const SECTION_ACTIVITIES = 'activities';

export class AtimeusServerService {
  private config: AtimeusApiConfig;

  constructor(config: AtimeusApiConfig = {}) {
    this.config = config;
  }

  getHeaders(accessToken: string, customApiKey?: string) {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // Add custom API key if provided (overrides default)
    if (customApiKey) {
      headers['X-Atimeus-API-Key'] = customApiKey;
    } else if (this.config.apiKey) {
      headers['X-Atimeus-API-Key'] = this.config.apiKey;
    }

    return { headers };
  }

  // ========================
  // EMPLOYEE OPERATIONS
  // ========================

  /**
   * Search employees with view and filter parameters
   */
  async searchEmployees(
    accessToken: string,
    params?: EmployeeSearchParams,
    customApiKey?: string
  ): Promise<HateoasResponse<EmployeeDto>> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: searchEmployees headers:', headers);
      
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.view) queryParams.append('view', params.view);
        if (params.filter) queryParams.append('filter', params.filter);
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      }
      
      const searchQuery = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<ApiAppResponse<HateoasResponse<EmployeeDto>>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_EMPLOYEES}/search${searchQuery}`,
        headers
      );
      
      console.log('AtimeusServerService: searchEmployees response:', response);
      if (response.data?.data) {
        console.log('Employees search response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: searchEmployees error:', error);
      throw error;
    }
  }

  /**
   * Get employee details by ID
   */
  async getEmployeeById(
    accessToken: string,
    employeeId: string,
    customApiKey?: string
  ): Promise<EmployeeDto> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: getEmployeeById headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<EmployeeDto>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_EMPLOYEES}/${employeeId}`,
        headers
      );
      
      console.log('AtimeusServerService: getEmployeeById response:', response);
      if (response.data?.data) {
        console.log('Employee detail response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: getEmployeeById error:', error);
      throw error;
    }
  }

  /**
   * Get available employee views
   */
  async getEmployeeViews(
    accessToken: string,
    customApiKey?: string
  ): Promise<EmployeeView[]> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: getEmployeeViews headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<EmployeeView[]>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_EMPLOYEES}/views`,
        headers
      );
      
      console.log('AtimeusServerService: getEmployeeViews response:', response);
      if (response.data?.data) {
        console.log('Employee views response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: getEmployeeViews error:', error);
      throw error;
    }
  }

  // ========================
  // PROJECT OPERATIONS
  // ========================

  /**
   * Search projects with view and filter parameters
   */
  async searchProjects(
    accessToken: string,
    params?: AtimeusProjectSearchParams,
    customApiKey?: string
  ): Promise<HateoasResponse<AtimeusProjectDto>> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: searchProjects headers:', headers);
      
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.view) queryParams.append('view', params.view);
        if (params.filter) queryParams.append('filter', params.filter);
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      }
      
      const searchQuery = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<ApiAppResponse<HateoasResponse<AtimeusProjectDto>>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_PROJECTS}/search${searchQuery}`,
        headers
      );
      
      console.log('AtimeusServerService: searchProjects response:', response);
      if (response.data?.data) {
        console.log('Projects search response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: searchProjects error:', error);
      throw error;
    }
  }

  /**
   * Get all projects with optional filtering
   */
  async getAllProjects(
    accessToken: string,
    params?: AtimeusProjectSearchParams,
    customApiKey?: string
  ): Promise<HateoasResponse<AtimeusProjectDto>> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: getAllProjects headers:', headers);
      
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.filter) queryParams.append('filter', params.filter);
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      }
      
      const searchQuery = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<ApiAppResponse<HateoasResponse<AtimeusProjectDto>>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_PROJECTS}${searchQuery}`,
        headers
      );
      
      console.log('AtimeusServerService: getAllProjects response:', response);
      if (response.data?.data) {
        console.log('All projects response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: getAllProjects error:', error);
      throw error;
    }
  }

  /**
   * Get project details by ID
   */
  async getProjectById(
    accessToken: string,
    projectId: string,
    customApiKey?: string
  ): Promise<AtimeusProjectDto> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: getProjectById headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<AtimeusProjectDto>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}`,
        headers
      );
      
      console.log('AtimeusServerService: getProjectById response:', response);
      if (response.data?.data) {
        console.log('Project detail response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: getProjectById error:', error);
      throw error;
    }
  }

  /**
   * Get project indicators/metrics
   */
  async getProjectIndicators(
    accessToken: string,
    projectId: string,
    customApiKey?: string
  ): Promise<ProjectFinancialSummaryDto> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: getProjectIndicators headers:', headers);

      const response = await httpClient.get<ApiAppResponse<ProjectFinancialSummaryDto>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_PROJECTS}/${projectId}/indicators`,
        headers
      );
      
      console.log('AtimeusServerService: getProjectIndicators response:', response);
      
      // Check the actual response structure
      console.log('Response structure check:');
      console.log('- response.data exists:', !!response.data);
      console.log('- response.data.data exists:', !!(response.data && response.data.data));
      console.log('- response.data type:', typeof response.data);
      
      // Handle different response structures
      let projectData: ProjectFinancialSummaryDto;
      
      if (response.data && response.data.data) {
        // Standard wrapped response
        projectData = response.data.data;
        console.log('Using response.data.data');
      } else if (response.data && typeof response.data === 'object' && 'id' in response.data) {
        // Direct response - cast to ProjectFinancialSummaryDto
        projectData = response.data as unknown as ProjectFinancialSummaryDto;
        console.log('Using response.data directly');
      } else {
        throw new Error('No data found in response');
      }
      
      if (projectData) {
        console.log('Project indicators response data received:', JSON.stringify(projectData));
      }
      
      return projectData;
    } catch (error) {
      console.error('AtimeusServerService: getProjectIndicators error:', error);
      throw error;
    }
  }

  /**
   * Get available project views
   */
  async getProjectViews(
    accessToken: string,
    customApiKey?: string
  ): Promise<AtimeusProjectView[]> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: getProjectViews headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<AtimeusProjectView[]>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_PROJECTS}/views`,
        headers
      );
      
      console.log('AtimeusServerService: getProjectViews response:', response);
      if (response.data?.data) {
        console.log('Project views response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: getProjectViews error:', error);
      throw error;
    }
  }

  // ========================
  // CRA OPERATIONS
  // ========================

  /**
   * Create a new CRA entry
   */
  async createCRA(
    accessToken: string,
    craData: CRARequestDto,
    customApiKey?: string
  ): Promise<CRADto> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: createCRA headers:', headers);
      
      const response = await httpClient.post<ApiAppResponse<CRADto>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_CRAS}`,
        craData,
        headers
      );
      
      console.log('AtimeusServerService: createCRA response:', response);
      if (response.data?.data) {
        console.log('Create CRA response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: createCRA error:', error);
      throw error;
    }
  }

  /**
   * Search CRA entries with optional filtering
   */
  async searchCRAs(
    accessToken: string,
    params?: CRASearchParams,
    customApiKey?: string
  ): Promise<HateoasResponse<CRADto>> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: searchCRAs headers:', headers);
      
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.filter) queryParams.append('filter', params.filter);
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      }
      
      const searchQuery = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<ApiAppResponse<HateoasResponse<CRADto>>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_CRAS}/search${searchQuery}`,
        headers
      );
      
      console.log('AtimeusServerService: searchCRAs response:', response);
      if (response.data?.data) {
        console.log('CRAs search response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: searchCRAs error:', error);
      throw error;
    }
  }

  /**
   * Get CRA details by ID
   */
  async getCRAById(
    accessToken: string,
    craId: string,
    customApiKey?: string
  ): Promise<CRADto> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: getCRAById headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<CRADto>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_CRAS}/${craId}`,
        headers
      );
      
      console.log('AtimeusServerService: getCRAById response:', response);
      if (response.data?.data) {
        console.log('CRA detail response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: getCRAById error:', error);
      throw error;
    }
  }

  /**
   * Update an existing CRA entry
   */
  async updateCRA(
    accessToken: string,
    craId: string,
    craData: CRARequestDto,
    customApiKey?: string
  ): Promise<CRADto> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: updateCRA headers:', headers);
      
      const response = await httpClient.put<ApiAppResponse<CRADto>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_CRAS}/${craId}`,
        craData,
        headers
      );
      
      console.log('AtimeusServerService: updateCRA response:', response);
      if (response.data?.data) {
        console.log('Update CRA response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: updateCRA error:', error);
      throw error;
    }
  }

  /**
   * Delete a CRA entry
   */
  async deleteCRA(
    accessToken: string,
    craId: string,
    customApiKey?: string
  ): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: deleteCRA headers:', headers);
      
      await httpClient.delete(
        `${ATIMEUS_API_BASE_URL}/${SECTION_CRAS}/${craId}`,
        headers
      );
      
      console.log('AtimeusServerService: deleteCRA completed successfully');
    } catch (error) {
      console.error('AtimeusServerService: deleteCRA error:', error);
      throw error;
    }
  }

  // ========================
  // ACTIVITY OPERATIONS
  // ========================

  /**
   * Search activities with view and filter parameters
   */
  async searchActivities(
    accessToken: string,
    params?: ActivitySearchParams,
    customApiKey?: string
  ): Promise<HateoasResponse<ActivityDto>> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: searchActivities headers:', headers);
      
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.view) queryParams.append('view', params.view);
        if (params.filter) queryParams.append('filter', params.filter);
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
      }
      
      const searchQuery = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await httpClient.get<ApiAppResponse<HateoasResponse<ActivityDto>>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_ACTIVITIES}/search${searchQuery}`,
        headers
      );
      
      console.log('AtimeusServerService: searchActivities response:', response);
      if (response.data?.data) {
        console.log('Activities search response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: searchActivities error:', error);
      throw error;
    }
  }

  /**
   * Get activity details by ID
   */
  async getActivityById(
    accessToken: string,
    activityId: string,
    customApiKey?: string
  ): Promise<ActivityDto> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: getActivityById headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<ActivityDto>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_ACTIVITIES}/${activityId}`,
        headers
      );
      
      console.log('AtimeusServerService: getActivityById response:', response);
      if (response.data?.data) {
        console.log('Activity detail response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: getActivityById error:', error);
      throw error;
    }
  }

  /**
   * Get available activity views
   */
  async getActivityViews(
    accessToken: string,
    customApiKey?: string
  ): Promise<ActivityView[]> {
    try {
      const headers = this.getHeaders(accessToken, customApiKey);
      console.log('AtimeusServerService: getActivityViews headers:', headers);
      
      const response = await httpClient.get<ApiAppResponse<ActivityView[]>>(
        `${ATIMEUS_API_BASE_URL}/${SECTION_ACTIVITIES}/views`,
        headers
      );
      
      console.log('AtimeusServerService: getActivityViews response:', response);
      if (response.data?.data) {
        console.log('Activity views response data received:', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      console.error('AtimeusServerService: getActivityViews error:', error);
      throw error;
    }
  }
}

// Export a default instance
export const atimeusServerService = new AtimeusServerService();
