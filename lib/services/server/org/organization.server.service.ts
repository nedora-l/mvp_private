//import { httpClient } from '../../auth/utils/http-client';

import { AppDepartment, AppEmployee, AppEmployeeSearchFilterDtro, AppTeam, HateoasResponse, OrganizationDto, OrganizationValueDto, OrganizationPinnedDocumentDto, OrganizationLocationDto, OrganizationLeaderDto, UserRegistrationDto } from "@/lib/interfaces/apis";
import { httpClient } from "@/lib/utils/http-client";
import { UserProfile } from "../../auth/auth-service";

// For server-side token management - not persisted between requests
export const SERVER_API_BASE_URL = '/api/organization';
export const SERVER_API_ENDPOINT_ME = '/';
export const SERVER_API_ENDPOINT_INFO = '/info';
export const SERVER_API_ENDPOINT_VALUES = '/values';
export const SERVER_API_ENDPOINT_PINNED_DOCUMENTS = '/pinned-documents';
export const SERVER_API_ENDPOINT_LOCATIONS = '/locations';
export const SERVER_API_ENDPOINT_LEADERS = '/leaders';

export class OrganizationServerService {

  getHeaders(accessToken: string) {
    return {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      };
  }

  async getOrg( accessToken : string): Promise<OrganizationDto> {
    try {
      console.log('EmployeesServerService: getOrg:', accessToken );
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const response = await httpClient.get<OrganizationDto>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_INFO}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('AuthService: Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('EmployeesServerService: getEmployees error:', error);
      throw error;
    }
  }

  async getOrganizationById(id: number, accessToken: string): Promise<OrganizationDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<OrganizationDto>(`${SERVER_API_BASE_URL}${id}`, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: getOrganizationById error:', error);
      throw error;
    }
  }

  // Organization Values methods
  async getOrganizationValues(accessToken: string): Promise<HateoasResponse<OrganizationValueDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<HateoasResponse<OrganizationValueDto>>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_VALUES}`, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: getOrganizationValues error:', error);
      throw error;
    }
  }

  async getOrganizationValueById(id: number, accessToken: string): Promise<OrganizationValueDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<OrganizationValueDto>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_VALUES}/${id}`, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: getOrganizationValueById error:', error);
      throw error;
    }
  }

  async createOrganizationValue(value: OrganizationValueDto, accessToken: string): Promise<OrganizationValueDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<OrganizationValueDto>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_VALUES}`, value, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: createOrganizationValue error:', error);
      throw error;
    }
  }

  async updateOrganizationValue(id: number, value: OrganizationValueDto, accessToken: string): Promise<OrganizationValueDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<OrganizationValueDto>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_VALUES}/${id}`, value, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: updateOrganizationValue error:', error);
      throw error;
    }
  }

  async deleteOrganizationValue(id: number, accessToken: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_VALUES}/${id}`, headers);
    } catch (error) {
      console.error('OrganizationServerService: deleteOrganizationValue error:', error);
      throw error;
    }
  }

  // Organization Pinned Documents methods
  async getOrganizationPinnedDocuments(organizationId: number, accessToken: string): Promise<HateoasResponse<OrganizationPinnedDocumentDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<HateoasResponse<OrganizationPinnedDocumentDto>>(`${SERVER_API_BASE_URL}/${organizationId}${SERVER_API_ENDPOINT_PINNED_DOCUMENTS}`, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: getOrganizationPinnedDocuments error:', error);
      throw error;
    }
  }

  async getOrganizationPinnedDocumentById(id: number, accessToken: string): Promise<OrganizationPinnedDocumentDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<OrganizationPinnedDocumentDto>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_PINNED_DOCUMENTS}/${id}`, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: getOrganizationPinnedDocumentById error:', error);
      throw error;
    }
  }

  async createOrganizationPinnedDocument(organizationId: number, document: OrganizationPinnedDocumentDto, accessToken: string): Promise<OrganizationPinnedDocumentDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<OrganizationPinnedDocumentDto>(`${SERVER_API_BASE_URL}/${organizationId}${SERVER_API_ENDPOINT_PINNED_DOCUMENTS}`, document, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: createOrganizationPinnedDocument error:', error);
      throw error;
    }
  }

  async updateOrganizationPinnedDocument(id: number, document: OrganizationPinnedDocumentDto, accessToken: string): Promise<OrganizationPinnedDocumentDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<OrganizationPinnedDocumentDto>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_PINNED_DOCUMENTS}/${id}`, document, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: updateOrganizationPinnedDocument error:', error);
      throw error;
    }
  }

  async deleteOrganizationPinnedDocument(id: number, accessToken: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_PINNED_DOCUMENTS}/${id}`, headers);
    } catch (error) {
      console.error('OrganizationServerService: deleteOrganizationPinnedDocument error:', error);
      throw error;
    }
  }

  // Organization Locations methods
  async getOrganizationLocations(organizationId: number, accessToken: string): Promise<HateoasResponse<OrganizationLocationDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<HateoasResponse<OrganizationLocationDto>>(`${SERVER_API_BASE_URL}/${organizationId}${SERVER_API_ENDPOINT_LOCATIONS}`, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: getOrganizationLocations error:', error);
      throw error;
    }
  }

  async getOrganizationLocationById(id: number, accessToken: string): Promise<OrganizationLocationDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<OrganizationLocationDto>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_LOCATIONS}/${id}`, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: getOrganizationLocationById error:', error);
      throw error;
    }
  }

  async createOrganizationLocation(organizationId: number, location: OrganizationLocationDto, accessToken: string): Promise<OrganizationLocationDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<OrganizationLocationDto>(`${SERVER_API_BASE_URL}/${organizationId}${SERVER_API_ENDPOINT_LOCATIONS}`, location, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: createOrganizationLocation error:', error);
      throw error;
    }
  }

  async updateOrganizationLocation(id: number, location: OrganizationLocationDto, accessToken: string): Promise<OrganizationLocationDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<OrganizationLocationDto>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_LOCATIONS}/${id}`, location, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: updateOrganizationLocation error:', error);
      throw error;
    }
  }

  async deleteOrganizationLocation(id: number, accessToken: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_LOCATIONS}/${id}`, headers);
    } catch (error) {
      console.error('OrganizationServerService: deleteOrganizationLocation error:', error);
      throw error;
    }
  }

  // Organization Leaders methods
  async getOrganizationLeaders(organizationId: number, accessToken: string): Promise<HateoasResponse<OrganizationLeaderDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<HateoasResponse<OrganizationLeaderDto>>(`${SERVER_API_BASE_URL}/${organizationId}${SERVER_API_ENDPOINT_LEADERS}`, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: getOrganizationLeaders error:', error);
      throw error;
    }
  }

  async getOrganizationLeaderById(id: number, accessToken: string): Promise<OrganizationLeaderDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<OrganizationLeaderDto>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_LEADERS}/${id}`, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: getOrganizationLeaderById error:', error);
      throw error;
    }
  }

  async createOrganizationLeader(organizationId: number, leader: OrganizationLeaderDto, accessToken: string): Promise<OrganizationLeaderDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<OrganizationLeaderDto>(`${SERVER_API_BASE_URL}/${organizationId}${SERVER_API_ENDPOINT_LEADERS}`, leader, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: createOrganizationLeader error:', error);
      throw error;
    }
  }

  async updateOrganizationLeader(id: number, leader: OrganizationLeaderDto, accessToken: string): Promise<OrganizationLeaderDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<OrganizationLeaderDto>(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_LEADERS}/${id}`, leader, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: updateOrganizationLeader error:', error);
      throw error;
    }
  }

  async deleteOrganizationLeader(id: number, accessToken: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete(`${SERVER_API_BASE_URL}${SERVER_API_ENDPOINT_LEADERS}/${id}`, headers);
    } catch (error) {
      console.error('OrganizationServerService: deleteOrganizationLeader error:', error);
      throw error;
    }
  }



  async createUser(user: UserRegistrationDto, accessToken: string): Promise<string> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<string>(`/auth/register`, user, headers);
      return response.data;
    } catch (error) {
      console.error('OrganizationServerService: createUser error:', error);
      throw error;
    }
  }

}

// Export a default instance
export const organizationServerService = new OrganizationServerService();