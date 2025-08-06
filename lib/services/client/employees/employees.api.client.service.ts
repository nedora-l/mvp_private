
import { getStoredToken } from "../../auth/token-storage";
import { ApiResponse, HateoasResponse } from "@/lib/interfaces/apis/common";
import { AppEmployee } from "@/lib/interfaces/apis";

export const SERVER_API_BASE_URL = '/api/v1/directory'; 


/**
 * Fetches data from the API.
 * @param url The URL to fetch.
 * @param options The fetch options.
 * @returns The JSON response.
 * @throws Error if the fetch fails or the response is not ok.
 */
async function fetchData<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token =  getStoredToken();
  const response = await fetch(url, {
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
 * Client for interacting with the Chat API.
 */
export const employeeApiClient = {
  
  getEmployees: (): Promise<ApiResponse<AppEmployee[]>> => {
    return fetchData<ApiResponse<AppEmployee[]>>(`${SERVER_API_BASE_URL}`);
  },

  getEmployeesPages: ({page,size}: {page: number, size: number}): Promise<ApiResponse<HateoasResponse<AppEmployee>>> => {
    return fetchData<ApiResponse<HateoasResponse<AppEmployee>>>(`${SERVER_API_BASE_URL}?page=${page}&size=${size}`);
  },

};
 