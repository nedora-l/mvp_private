
import { getStoredToken } from "../../auth/token-storage";
import { ApiResponse, HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis/common";
import { CreateProcessDefinitionRequestDto, ProcessDefinitionResponseDto, ProcessDefinitionsResponse } from "../../server/camunda/camunda.server.service";

export const SERVER_API_BASE_URL = '/api/v1/camunda'; 

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
 * Client for interacting with the Camunda API.
 */
export const camundaApiClient = {
 
  getProcessDefinitions: ( pagination?: HateoasPagination): Promise<ApiResponse<ProcessDefinitionsResponse>> => {
    return fetchData<ApiResponse<ProcessDefinitionsResponse>>(`${SERVER_API_BASE_URL}/process-definitions?page=${pagination?.page}&size=${pagination?.size}&query=${pagination?.query}`);
  },

  getAllProcessDefinitions: ( pagination?: HateoasPagination): Promise<ApiResponse<ProcessDefinitionResponseDto[]>> => {
    return fetchData<ApiResponse<ProcessDefinitionResponseDto[]>>(`${SERVER_API_BASE_URL}/process-definitions/all?page=${pagination?.page}&size=${pagination?.size}&query=${pagination?.query}`);
  },
 
  createProcessDefinition: ( request: CreateProcessDefinitionRequestDto, bpmnFile?: File | null): Promise<ApiResponse<ProcessDefinitionsResponse>> => {
    return fetchData<ApiResponse<ProcessDefinitionsResponse>>(`${SERVER_API_BASE_URL}/process-definitions`, {
      method: 'POST',
      body: JSON.stringify(request),
      ...(bpmnFile && { files: [bpmnFile] }),
    });
  },
};
