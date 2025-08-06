import { getStoredToken } from "../../auth/token-storage";
import { ApiResponse, HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis/common";
import { 
  OrganizationDto, 
  OrganizationValueDto, 
  OrganizationPinnedDocumentDto, 
  OrganizationLocationDto, 
  OrganizationLeaderDto 
} from "@/lib/interfaces/apis";

export const SERVER_API_BASE_URL = '/api/organization'; 

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
 * Client for interacting with the Organization API.
 */
export const orgApiClient = {

  /**
   * Gets organization with pagination.
   * GET /api/organization
   * @returns Organization data.
   */
  getOrg: (): Promise<ApiResponse<OrganizationDto>> => {
    return fetchData<ApiResponse<OrganizationDto>>(`${SERVER_API_BASE_URL}`);
  },

  /**
   * Gets organization with pagination.
   * GET /api/organization
   * @returns Organization data.
   */
  updateOrg: (id: number, data: OrganizationDto): Promise<ApiResponse<OrganizationDto>> => {
    return fetchData<ApiResponse<OrganizationDto>>(`${SERVER_API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Gets organization by ID.
   * GET /api/organization/{id}
   * @param id Organization ID
   * @returns Organization data.
   */
  getOrganizationById: (id: number): Promise<ApiResponse<OrganizationDto>> => {
    return fetchData<ApiResponse<OrganizationDto>>(`${SERVER_API_BASE_URL}/${id}`);
  },

  // Organization Values methods
  /**
   * Gets organization values with pagination.
   * GET /api/organization/values
   * @returns Organization values data.
   */
  getOrgValues: (pagination: HateoasPagination): Promise<ApiResponse<HateoasResponse<OrganizationValueDto>>> => {
    return fetchData<ApiResponse<HateoasResponse<OrganizationValueDto>>>(`${SERVER_API_BASE_URL}/values?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}`);
  },

  /**
   * Gets organization value by ID.
   * GET /api/organization/values/{id}
   * @param id Value ID
   * @returns Organization value data.
   */
  getOrganizationValueById: (id: number): Promise<ApiResponse<OrganizationValueDto>> => {
    return fetchData<ApiResponse<OrganizationValueDto>>(`${SERVER_API_BASE_URL}/values/${id}`);
  },

  /**
   * Creates a new organization value.
   * POST /api/organization/values
   * @param value Organization value data
   * @returns Created organization value.
   */
  createOrganizationValue: (value: OrganizationValueDto): Promise<ApiResponse<OrganizationValueDto>> => {
    return fetchData<ApiResponse<OrganizationValueDto>>(`${SERVER_API_BASE_URL}/values`, {
      method: 'POST',
      body: JSON.stringify(value),
    });
  },

  /**
   * Updates an organization value.
   * PUT /api/organization/values/{id}
   * @param id Value ID
   * @param value Organization value data
   * @returns Updated organization value.
   */
  updateOrganizationValue: (id: number, value: OrganizationValueDto): Promise<ApiResponse<OrganizationValueDto>> => {
    return fetchData<ApiResponse<OrganizationValueDto>>(`${SERVER_API_BASE_URL}/values/${id}`, {
      method: 'PUT',
      body: JSON.stringify(value),
    });
  },

  /**
   * Deletes an organization value.
   * DELETE /api/organization/values/{id}
   * @param id Value ID
   */
  deleteOrganizationValue: (id: number): Promise<void> => {
    return fetchData<void>(`${SERVER_API_BASE_URL}/values/${id}`, {
      method: 'DELETE',
    });
  },

  // Organization Pinned Documents methods
  /**
   * Gets organization pinned documents with pagination.
   * GET /api/organization/pinned-documents
   * @returns Organization pinned documents data.
   */
  getOrganizationPinnedDocuments: (pagination: HateoasPagination): Promise<HateoasResponse<OrganizationPinnedDocumentDto[]>> => {
    return fetchData<HateoasResponse<OrganizationPinnedDocumentDto[]>>(`${SERVER_API_BASE_URL}/pinned-documents?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}`);
  },

  /**
   * Gets organization pinned document by ID.
   * GET /api/organization/pinned-documents/{id}
   * @param id Document ID
   * @returns Organization pinned document data.
   */
  getOrganizationPinnedDocumentById: (id: number): Promise<ApiResponse<OrganizationPinnedDocumentDto>> => {
    return fetchData<ApiResponse<OrganizationPinnedDocumentDto>>(`${SERVER_API_BASE_URL}/pinned-documents/${id}`);
  },

  /**
   * Creates a new organization pinned document.
   * POST /api/organization/pinned-documents
   * @param document Organization pinned document data
   * @returns Created organization pinned document.
   */
  createOrganizationPinnedDocument: (document: OrganizationPinnedDocumentDto): Promise<ApiResponse<OrganizationPinnedDocumentDto>> => {
    return fetchData<ApiResponse<OrganizationPinnedDocumentDto>>(`${SERVER_API_BASE_URL}/pinned-documents`, {
      method: 'POST',
      body: JSON.stringify(document),
    });
  },

  /**
   * Updates an organization pinned document.
   * PUT /api/organization/pinned-documents/{id}
   * @param id Document ID
   * @param document Organization pinned document data
   * @returns Updated organization pinned document.
   */
  updateOrganizationPinnedDocument: (id: number, document: OrganizationPinnedDocumentDto): Promise<ApiResponse<OrganizationPinnedDocumentDto>> => {
    return fetchData<ApiResponse<OrganizationPinnedDocumentDto>>(`${SERVER_API_BASE_URL}/pinned-documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(document),
    });
  },

  /**
   * Deletes an organization pinned document.
   * DELETE /api/organization/pinned-documents/{id}
   * @param id Document ID
   */
  deleteOrganizationPinnedDocument: (id: number): Promise<void> => {
    return fetchData<void>(`${SERVER_API_BASE_URL}/pinned-documents/${id}`, {
      method: 'DELETE',
    });
  },

  // Organization Locations methods
  /**
   * Gets organization locations with pagination.
   * GET /api/organization/locations
   * @returns Organization locations data.
   */
  getOrganizationLocations: (pagination: HateoasPagination): Promise<HateoasResponse<OrganizationLocationDto[]>> => {
    return fetchData<HateoasResponse<OrganizationLocationDto[]>>(`${SERVER_API_BASE_URL}/locations?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}`);
  },

  /**
   * Gets organization location by ID.
   * GET /api/organization/locations/{id}
   * @param id Location ID
   * @returns Organization location data.
   */
  getOrganizationLocationById: (id: number): Promise<ApiResponse<OrganizationLocationDto>> => {
    return fetchData<ApiResponse<OrganizationLocationDto>>(`${SERVER_API_BASE_URL}/locations/${id}`);
  },

  /**
   * Creates a new organization location.
   * POST /api/organization/locations
   * @param location Organization location data
   * @returns Created organization location.
   */
  createOrganizationLocation: (location: OrganizationLocationDto): Promise<ApiResponse<OrganizationLocationDto>> => {
    return fetchData<ApiResponse<OrganizationLocationDto>>(`${SERVER_API_BASE_URL}/locations`, {
      method: 'POST',
      body: JSON.stringify(location),
    });
  },

  /**
   * Updates an organization location.
   * PUT /api/organization/locations/{id}
   * @param id Location ID
   * @param location Organization location data
   * @returns Updated organization location.
   */
  updateOrganizationLocation: (id: number, location: OrganizationLocationDto): Promise<ApiResponse<OrganizationLocationDto>> => {
    return fetchData<ApiResponse<OrganizationLocationDto>>(`${SERVER_API_BASE_URL}/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(location),
    });
  },

  /**
   * Deletes an organization location.
   * DELETE /api/organization/locations/{id}
   * @param id Location ID
   */
  deleteOrganizationLocation: (id: number): Promise<void> => {
    return fetchData<void>(`${SERVER_API_BASE_URL}/locations/${id}`, {
      method: 'DELETE',
    });
  },

  // Organization Leaders methods
  /**
   * Gets organization leaders with pagination.
   * GET /api/organization/leaders
   * @returns Organization leaders data.
   */
  getOrganizationLeaders: (orgId:string,pagination: HateoasPagination): Promise<HateoasResponse<OrganizationLeaderDto[]>> => {
    return fetchData<HateoasResponse<OrganizationLeaderDto[]>>(`${SERVER_API_BASE_URL}/leaders?organizationId=${orgId}&page=${pagination.page}&size=${pagination.size}&query=${pagination.query}`);
  },

  /**
   * Gets organization leader by ID.
   * GET /api/organization/leaders/{id}
   * @param id Leader ID
   * @returns Organization leader data.
   */
  getOrganizationLeaderById: (id: number): Promise<ApiResponse<OrganizationLeaderDto>> => {
    return fetchData<ApiResponse<OrganizationLeaderDto>>(`${SERVER_API_BASE_URL}/leaders/${id}`);
  },

  /**
   * Creates a new organization leader.
   * POST /api/organization/leaders
   * @param leader Organization leader data
   * @returns Created organization leader.
   */
  createOrganizationLeader: (leader: OrganizationLeaderDto): Promise<ApiResponse<OrganizationLeaderDto>> => {
    return fetchData<ApiResponse<OrganizationLeaderDto>>(`${SERVER_API_BASE_URL}/leaders`, {
      method: 'POST',
      body: JSON.stringify(leader),
    });
  },

  /**
   * Updates an organization leader.
   * PUT /api/organization/leaders/{id}
   * @param id Leader ID
   * @param leader Organization leader data
   * @returns Updated organization leader.
   */
  updateOrganizationLeader: (id: number, leader: OrganizationLeaderDto): Promise<ApiResponse<OrganizationLeaderDto>> => {
    return fetchData<ApiResponse<OrganizationLeaderDto>>(`${SERVER_API_BASE_URL}/leaders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leader),
    });
  },

  /**
   * Deletes an organization leader.
   * DELETE /api/organization/leaders/{id}
   * @param id Leader ID
   */
  deleteOrganizationLeader: (id: number): Promise<void> => {
    return fetchData<void>(`${SERVER_API_BASE_URL}/leaders/${id}`, {
      method: 'DELETE',
    });
  },

};
