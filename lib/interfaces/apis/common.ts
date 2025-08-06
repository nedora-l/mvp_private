/**
 * Common DTOs and interfaces used across the API
 */
export interface HateoasResponse<T> {
  _embedded: {
    [key: string]: T[]; // Assuming the key for the list can vary, or be specific like 'chatSessionListItemDtoList'
  };
  _links: {
    [key: string]: { href: string };
  };
  page?: HateoasResponsePage;
}

export interface HateoasResponsePage { 
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}


export interface  HateoasPagination {
  query?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponseDataList<T> {
  data: T[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}


export enum ApiResponseTYPE {
   RECORD_DETAILS = "RECORD_DETAILS",
   RECORD_LIST = "RECORD_LIST",
   HATEOAS_RECORD_LIST = "HATEOAS_RECORD_LIST",
   ERROR = "ERROR",
   HATEOAS_RECORD_DETAILS = "HATEOAS_RECORD_DETAILS",
}

export interface ApiResponse<T> {
  status?: number;
  message?: string;
  type?: string; 
  success?: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  _embedded?: {
    [key: string]: T[]; // Assuming the key for the list can vary, or be specific like 'chatSessionListItemDtoList'
  };
  _links?: {
    [key: string]: { href: string };
  };
  page?: HateoasResponsePage;
}

export interface LocalizedString {
  ar?: string;
  fr?: string;
  en?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface AppImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface AppAddress {
  street?: string,
  city?: string,
  postalCode?: string,
  country?: string,
  coordinates?: AppAddressCoordinates
}

export interface AppAddressCoordinates {
  z?: number,
  latitude?: number,
  longitude?: number,
  lat?: number,
  lon?: number
}

export interface AppCountry {
  id?: number,
  name: string
}

export interface AppCity {
  id?: number,
  country?: string | AppCountry,
  name: string
}