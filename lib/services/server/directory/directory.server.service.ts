//import { httpClient } from '../../auth/utils/http-client';
import { auth } from "@/auth"


import { AppDepartment, AppEmployee, AppEmployeeSearchFilterDtro, AppTeam, HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis";
import { httpClient } from "@/lib/utils/http-client";
import { UserProfile } from "../../auth/auth-service";

// For server-side token management - not persisted between requests
export const SERVER_API_BASE_URL = '/api/v1/directory';

export const SECTION_EMPLOYEES = 'employees';
export const SECTION_TEAMS = 'teams';
export const SECTION_DEPARTMENTS = 'departments';

export class DirectoryServerService {

  private async getAuthAccessToken() {
    const session = await auth();
    // const session = await getServerSession(authOptions);
     console.log('✓ ----> session:', session);
     console.log('✓ ----> session.user:', session?.user);
      console.log('✓ ----> session.user.token:', session?.user?.accessToken);
    const accessToken = session?.user?.accessToken;
    if (!accessToken) {
      throw new Error("User is not authenticated.");
    }
    return accessToken;
  }

  getHeaders(accessToken: string) {
    return {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      };
  }

  async getEmployees( accessToken : string , pagination?: HateoasPagination): Promise<HateoasResponse<AppEmployee>> {
    try {
      const accessToken1 = await this.getAuthAccessToken();
             console.log('Access token ',accessToken1);
 if(!accessToken || accessToken === '') {
        console.log('Access token is not provided');
        accessToken = await this.getAuthAccessToken();
      }
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}` : '';
      const response = await httpClient.get<HateoasResponse<AppEmployee>>(`${SERVER_API_BASE_URL}/${SECTION_EMPLOYEES}${searchQuery}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('DirectoryServerService: getEmployees error:', error);
      throw error;
    }
  }


  async getDepartements( accessToken : string , pagination?: HateoasPagination): Promise<HateoasResponse<AppDepartment>> {
    try {
      if(!accessToken || accessToken === '') {
        console.log('Access token is not provided');
        accessToken = await this.getAuthAccessToken();
      }
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}` : '';
      const response = await httpClient.get<HateoasResponse<AppDepartment>>(`${SERVER_API_BASE_URL}/${SECTION_DEPARTMENTS}${searchQuery}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('DirectoryServerService: getDepartments error:', error);
      throw error;
    }
  }

  async getTeams( accessToken : string , pagination?: HateoasPagination): Promise<HateoasResponse<AppTeam>> {
    try {
      if(!accessToken || accessToken === '') {
        console.log('Access token is not provided');
        accessToken = await this.getAuthAccessToken();
      }
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}` : '';
      const response = await httpClient.get<HateoasResponse<AppTeam>>(`${SERVER_API_BASE_URL}/${SECTION_TEAMS}${searchQuery}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('DirectoryServerService: getTeams error:', error);
      throw error;
    }
  }



}

// Export a default instance
export const directoryServerService = new DirectoryServerService();
