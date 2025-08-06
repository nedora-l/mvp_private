//import { httpClient } from '../../auth/utils/http-client';

import { AppDepartment, AppEmployee, AppEmployeeSearchFilterDtro, AppTeam, HateoasResponse } from "@/lib/interfaces/apis";
import { httpClient } from "@/lib/utils/http-client";
import { UserProfile } from "../../auth/auth-service";

// For server-side token management - not persisted between requests
export const SERVER_API_BASE_URL = '/api/v1/admin/organization';
export const SERVER_API_ENDPOINT_USERS = '/api/admin/organization/users';
export const SERVER_API_ENDPOINT_EMPLOYEES = '/api/admin/organization/employees';
export const SERVER_API_ENDPOINT_DEPARTMENTS = '/api/admin/organization/departments';
export const SERVER_API_ENDPOINT_TEAMS = '/api/admin/organization/teams';

export class EmployeesServerService {

  getHeaders(accessToken: string) {
    return {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      };
  }

  /**
   * Login user with username and password
   */
  async getUsers( accessToken : string,query?: string): Promise<UserProfile[]> {
    try {
      console.log('EmployeesServerService: getUsers:', query );
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const response = await httpClient.get<UserProfile[]>(SERVER_API_ENDPOINT_USERS,headers);
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

  /**
   * Login user with username and password
   */
  async getEmployees( accessToken : string,filters?: AppEmployeeSearchFilterDtro): Promise<AppEmployee[]> {
    try {
      console.log('EmployeesServerService: getEmployees:', filters?.query, filters);
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const response = await httpClient.get<AppEmployee[]>(SERVER_API_ENDPOINT_EMPLOYEES,headers);
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
 
  /**
   * Login user with username and password
   */
  async getDepartements( accessToken : string): Promise<AppDepartment[]> {
    try {
      console.log('EmployeesServerService: getEmployees:',accessToken);
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const response = await httpClient.get<AppDepartment[]>(SERVER_API_ENDPOINT_DEPARTMENTS,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('AuthService: Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('EmployeesServerService: getDepartements error:', error);
      throw error;
    }
  }

  async getDepartementsPages( accessToken : string ): Promise<HateoasResponse<AppDepartment>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const response = await httpClient.get<HateoasResponse<AppDepartment>>(`${SERVER_API_ENDPOINT_DEPARTMENTS}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('AiChatServerService: getUserChatSessions error:', error);
      throw error;
    }
  }

  async getDepartementsPagesX( accessToken : string): Promise<AppDepartment[]> {
    try {
      console.log('EmployeesServerService: getEmployees:',accessToken);
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const response = await httpClient.get<AppDepartment[]>(SERVER_API_ENDPOINT_DEPARTMENTS,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('AuthService: Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('EmployeesServerService: getDepartements error:', error);
      throw error;
    }
  }

  /**
   * Login user with username and password
   */
  async getTeams( accessToken : string): Promise<AppTeam[]> {
    try {
      console.log('EmployeesServerService: getEmployees:', accessToken);
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const response = await httpClient.get<AppTeam[]>(SERVER_API_ENDPOINT_TEAMS,headers);
      console.log('response:', response);
      return response.data;
    } catch (error) {
      console.error('EmployeesServerService: getDepartements error:', error);
      throw error;
    }
  }
}

// Export a default instance
export const employeesServerService = new EmployeesServerService();