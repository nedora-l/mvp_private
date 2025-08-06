// Atimeus API DTOs and Interfaces for Next.js Client
// Based on the Atimeus API endpoints

import { HateoasResponse, HateoasPagination } from "../index";

// ========================
// EMPLOYEE INTERFACES
// ========================

export interface EmployeeDto {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  employeeNumber?: string;
  department?: string;
  position?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface EmployeeSearchParams {
  view?: string; // Employee view type
  filter?: string; // RSQL filter
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface EmployeeView {
  name: string;
  displayName?: string;
  description?: string;
  fields?: string[];
}

// ========================
// PROJECT INTERFACES
// ========================

export interface AtimeusProjectDto {
  id: string;
  name?: string;
  code?: string;
  description?: string;
  clientName?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  status?: string;
  budget?: number;
  isActive?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface AtimeusProjectSearchParams {
  view?: string; // Project view type
  filter?: string; // RSQL filter
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface AtimeusProjectView {
  name: string;
  displayName?: string;
  description?: string;
  fields?: string[];
}

export interface ProjectIndicatorsDto {
  projectId: string;
  totalHours?: number;
  completedTasks?: number;
  totalTasks?: number;
  progressPercentage?: number;
  budgetUsed?: number;
  budgetRemaining?: number;
  teamSize?: number;
  indicators?: {
    [key: string]: any;
  };
}

// ========================
// CRA (Client Requirement Analysis) INTERFACES
// ========================

export interface CRADto {
  id: string;
  title?: string;
  description?: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectName?: string;
  requirements?: string;
  status?: string;
  priority?: string;
  estimatedHours?: number;
  actualHours?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  assignedTo?: string;
  assignedToName?: string;
  createdBy?: string;
  createdByName?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface CRARequestDto {
  title: string; // Required
  description?: string;
  clientId?: string;
  projectId?: string;
  requirements?: string;
  status?: string;
  priority?: string;
  estimatedHours?: number;
  startDate?: string; // ISO date string (yyyy-MM-dd format)
  endDate?: string; // ISO date string (yyyy-MM-dd format)
  assignedTo?: string;
}

export interface CRASearchParams {
  filter?: string; // RSQL filter
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ========================
// ACTIVITY INTERFACES
// ========================

export interface ActivityDto {
  id: string;
  name?: string;
  description?: string;
  type?: string;
  category?: string;
  projectId?: string;
  projectName?: string;
  employeeId?: string;
  employeeName?: string;
  startTime?: string; // ISO date string
  endTime?: string; // ISO date string
  duration?: number; // in minutes
  status?: string;
  isActive?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface ActivitySearchParams {
  view?: string; // Activity view type
  filter?: string; // RSQL filter
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ActivityView {
  name: string;
  displayName?: string;
  description?: string;
  fields?: string[];
}

// ========================
// RESPONSE WRAPPERS
// ========================

export interface EmployeesResponse extends HateoasResponse<{ employees: EmployeeDto[] }> {}
export interface AtimeusProjectsResponse extends HateoasResponse<{ projects: AtimeusProjectDto[] }> {}
export interface CRAsResponse extends HateoasResponse<{ cras: CRADto[] }> {}
export interface ActivitiesResponse extends HateoasResponse<{ activities: ActivityDto[] }> {}

// ========================
// API RESPONSE INTERFACES
// ========================

export interface AtimeusApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// ========================
// COMMON TYPES
// ========================

export type AtimeusViewType = 'default' | 'detailed' | 'summary' | string;

export interface AtimeusApiConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}
