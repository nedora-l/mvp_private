import { CreateChatSessionRequestDto,
  ChatSessionResponseDto,
  ChatSessionListItemDto,
  UpdateChatTitleRequestDto,
  AddMessageRequestDto,
  ChatMessageResponseDto,
  ChatMessageDto, } from "@/lib/interfaces/apis/chat";
import { getStoredToken } from "../../auth/token-storage";
import { ApiResponse, HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis/common";
import { AppDepartment, AppEmployee, AppTeam, UserRegistrationDto } from "@/lib/interfaces/apis";

export const SERVER_API_BASE_URL = '/api/v1/directory'; 

export const SECTION_EMPLOYEES = 'employees';
export const SECTION_TEAMS = 'teams';
export const SECTION_DEPARTMENTS = 'departments';

/**
 * Fetches data from the API.
 * @param url The URL to fetch.
 * @param options The fetch options.
 * @returns The JSON response.
 * @throws Error if the fetch fails or the response is not ok.
 */
async function fetchData<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token =  getStoredToken();
  const isServer = typeof window === 'undefined';
  const requestUrl = isServer ? `${process.env.NEXT_PUBLIC_API_URL}${url}` : url;

  const response = await fetch(requestUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorData || response.statusText}`);
  }
  if (response.status === 204) { // No Content
    return null as T;
  }
  return response.json() as Promise<T>;
}
 

/**
 * Client for interacting with the Directory API.
 */
export const directoryApiClient = {
 
  /**
   * Gets all employees.
   * GET /api/v1/directory/employees
   * @returns A list of employees.
   */
  addUser: ( user: UserRegistrationDto): Promise<ApiResponse<string>> => {
    return fetchData<ApiResponse<string>>(`${SERVER_API_BASE_URL}/${SECTION_EMPLOYEES}`, {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  
  /**
   * Gets all employees.
   * GET /api/v1/directory/employees
   * @returns A list of employees.
   */
  getEmployees: ( pagination: HateoasPagination): Promise<ApiResponse<HateoasResponse<AppEmployee>>> => {
    return fetchData<ApiResponse<HateoasResponse<AppEmployee>>>(`${SERVER_API_BASE_URL}/${SECTION_EMPLOYEES}?page=${pagination.page || 0}&size=${pagination.size || 10}&query=${pagination.query || '' }`);
  },

  /**
   * Gets all teams.
   * GET /api/v1/directory/teams
   * @returns A list of teams.
   */
  getTeams: (pagination: HateoasPagination): Promise<ApiResponse<HateoasResponse<AppTeam>>> => {
    return fetchData<ApiResponse<HateoasResponse<AppTeam>>>(`${SERVER_API_BASE_URL}/${SECTION_TEAMS}?page=${pagination.page || 0}&size=${pagination.size || 10}&query=${pagination.query || '' }`);
  },

  /**
   * Gets all departments.
   * GET /api/v1/directory/departments
   * @returns A list of departments.
   */
  getDepartments: (pagination: HateoasPagination): Promise<ApiResponse<HateoasResponse<AppDepartment>>> => {
    return fetchData<ApiResponse<HateoasResponse<AppDepartment>>>(`${SERVER_API_BASE_URL}/${SECTION_DEPARTMENTS}?page=${pagination.page || 0}&size=${pagination.size || 10}&query=${pagination.query || '' }`);
  },
};
