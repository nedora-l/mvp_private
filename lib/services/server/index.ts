import { HateoasResponsePage } from "@/lib/interfaces/apis";

// API Constants
export const ApiConstants = {
  STATUS_OK: 200,
  STATUS_BAD_REQUEST: 400,
  STATUS_INTERNAL_SERVER_ERROR: 500,
  MESSAGE_SUCCESS: 'Success'
} as const;

// API Response Types
export enum ApiAppResponseType {
  ERROR = 'ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PAGINATION = 'PAGINATION',
  COLLECTION = 'COLLECTION',
  RECORD_DETAILS = 'RECORD_DETAILS'
}

// Validation Error Data Structure
export interface ValidationErrorData {
  fieldErrors: Record<string, string[]>;
  generalErrors: string[];
}

// Main API Response Interface
export interface ApiAppResponse<T> {
  status: number;
  message: string;
  data: T;
  type: ApiAppResponseType;
}

// Factory Functions for ApiAppResponse
export const createPagination = <T>(data: T): ApiAppResponse<T> => ({
  status: ApiConstants.STATUS_OK,
  message: ApiConstants.MESSAGE_SUCCESS,
  data,
  type: ApiAppResponseType.PAGINATION
});

export const createCollection = <T>(data: T): ApiAppResponse<T> => ({
  status: ApiConstants.STATUS_OK,
  message: ApiConstants.MESSAGE_SUCCESS,
  data,
  type: ApiAppResponseType.COLLECTION
});

export const createRecordDetails = <T>(data: T, status: number = ApiConstants.STATUS_OK): ApiAppResponse<T> => ({
  status,
  message: ApiConstants.MESSAGE_SUCCESS,
  data,
  type: ApiAppResponseType.RECORD_DETAILS
});

export const createValidationError = <T>(message: string, data: T | null = null): ApiAppResponse<T | null> => ({
  status: ApiConstants.STATUS_BAD_REQUEST,
  message,
  data,
  type: ApiAppResponseType.VALIDATION_ERROR
});

export const createFieldValidationError = (
  message: string,
  status: number,
  fieldErrors: Record<string, string[]>,
  generalErrors: string[]
): ApiAppResponse<ValidationErrorData> => {
  const errorData: ValidationErrorData = { fieldErrors, generalErrors };
  return {
    status,
    message,
    data: errorData,
    type: ApiAppResponseType.VALIDATION_ERROR
  };
};

export const createError = <T>(
  message: string,
  data: T | null = null,
  status: number = ApiConstants.STATUS_INTERNAL_SERVER_ERROR
): ApiAppResponse<T | null> => ({
  status,
  message,
  data,
  type: ApiAppResponseType.ERROR
});

export const createSuccess = <T>(data: T): ApiAppResponse<T> => ({
  status: ApiConstants.STATUS_OK,
  message: ApiConstants.MESSAGE_SUCCESS,
  data,
  type: ApiAppResponseType.COLLECTION
});

export const createErrorFromException = (exception: Error): ApiAppResponse<null> => ({
  status: ApiConstants.STATUS_INTERNAL_SERVER_ERROR,
  message: exception.message,
  data: null,
  type: ApiAppResponseType.ERROR
});



export interface HateoasContentResponsePage { 
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
export interface HateoasContentResponseLink { 
    href: string, rel?: string
}

export interface HateoasContentResponse<T> {
  content: T[];
  links: {
    [key: string]: HateoasContentResponseLink;
  };
  page?: HateoasContentResponsePage;
}

// Base HATEOAS interfaces
export interface HateoasResponse<T> {
  _embedded: T;
  _links: {
    self: { href: string };
    first?: { href: string };
    prev?: { href: string };
    next?: { href: string };
    last?: { href: string };
  };
  page?: HateoasPagination;
}

export interface HateoasPagination {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
} 