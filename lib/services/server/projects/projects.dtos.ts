// Projects API DTOs and Interfaces for Next.js Client
// Based on the Java DTOs from the backend

import { HateoasResponse, HateoasPagination } from "../index";

// ========================
// PROJECT INTERFACES
// ========================

export interface ProjectDto {
  id: string;
  orgId: number;
  createdAt: string; // ISO date string
  createdById: number;
  updatedAt?: string; // ISO date string 
  updatedById?: number;
  title: string;
  description?: string;
  startsAt?: string; // ISO date string (yyyy-MM-dd format)
  endsAt?: string; // ISO date string (yyyy-MM-dd format)
  isActive?: boolean;
  isArchived?: boolean;
  avatarUrl?: string; // URL to project avatar image
  externalSource?: string; // External source identifier (e.g., Atimeus, Jira, Trello)
  externalId?: string; // External ID for the project in the external source
  budget?: number; // BigDecimal in Java maps to number in TS
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface ProjectRequestDto {
  title: string; // Required field
  description?: string;
  startsAt?: string; // ISO date string (yyyy-MM-dd format)
  endsAt?: string; // ISO date string (yyyy-MM-dd format)
  isActive?: boolean;
  isArchived?: boolean;
  budget?: number;
  avatarUrl?: string; // URL to project avatar image
  externalSource?: string; // External source identifier (e.g., Atimeus, Jira, Trello)
  externalId?: string; // External ID for the project in the external source
}

// ========================
// PROJECT TYPE INTERFACES
// ========================

export interface ProjectTypeDto {
  id: string;
  createdBy: number;
  createdAt: string; // ISO date string
  updatedBy?: number;
  updatedAt?: string; // ISO date string
  title: string;
  description?: string;
  isActive?: boolean;
  isArchived?: boolean;
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface ProjectTypeRequestDto {
  title: string; // Required field
  description?: string;
  isActive?: boolean;
  isArchived?: boolean;
  orgId: number; // Required - Organization ID
}

// ========================
// PROJECT MEMBER INTERFACES
// ========================

export interface ProjectMemberDto {
  id: string;
  projectId: string;
  createdBy: number;
  createdAt: string; // ISO date string
  memberId: number; // User ID
  roleId: string; // Role ID
  roleName?: string; // Role name for convenience
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface AddProjectMemberRequestDto {
  memberId: number; // User ID
  roleId: string; // Role ID
}

// ========================
// PROJECT ROLE INTERFACES
// ========================

export interface ProjectRoleDto {
  id: string;
  createdBy: number;
  createdAt: string; // ISO date string
  title: string;
  description?: string;
  isActive?: boolean;
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}


export interface ProjectRoleRequestDto {
  title: string; // Required field
  description?: string;
  isActive?: boolean;
}

// ========================
// PROJECT ATTACHMENT INTERFACES
// ========================

export interface ProjectAttachmentDto {
  id: string;
  projectId: string;
  createdBy: number;
  createdAt: string; // ISO date string
  title?: string;
  description?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  typeId?: string;
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface UploadProjectAttachmentRequestDto {
  file: File;
  title?: string;
  description?: string;
  typeId?: string;
}

export interface ProjectAttachmentTypeDto {
  id: string;
  createdBy: number;
  createdAt: string; // ISO date string
  title: string;
  description?: string;
  isActive?: boolean;
  isArchived?: boolean;
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

// ========================
// RESPONSE WRAPPERS
// ========================

export interface ProjectsResponse extends HateoasResponse<{ projects: ProjectDto[] }> {}
export interface ProjectTypesResponse extends HateoasResponse<{ projectTypes: ProjectTypeDto[] }> {}
export interface ProjectMembersResponse extends HateoasResponse<{ members: ProjectMemberDto[] }> {}
export interface ProjectRolesResponse extends HateoasResponse<{ projectRoles: ProjectRoleDto[] }> {}
export interface ProjectAttachmentsResponse extends HateoasResponse<{ attachments: ProjectAttachmentDto[] }> {}

// ========================
// PAGINATION PARAMETERS
// ========================

export interface ProjectPaginationParams {
  page?: number;
  size?: number;
  sortBy?: 'id' | 'title' | 'createdAt' | 'updatedAt' | 'startsAt' | 'endsAt' | 'isActive' | 'isArchived' | 'budget';
  sortDirection?: 'asc' | 'desc';
  query?: string;
}

export interface ProjectTypePaginationParams {
  page?: number;
  size?: number;
  sortBy?: 'id' | 'title' | 'createdAt' | 'updatedAt' | 'isActive' | 'isArchived';
  sortDirection?: 'asc' | 'desc';
  query?: string;
}

export interface ProjectMemberPaginationParams {
  page?: number;
  size?: number;
  sortBy?: 'id' | 'createdAt' | 'memberId' | 'roleId';
  sortDirection?: 'asc' | 'desc';
  query?: string;
}

export interface ProjectRolePaginationParams {
  page?: number;
  size?: number;
  sortBy?: 'id' | 'title' | 'createdAt' | 'isActive';
  sortDirection?: 'asc' | 'desc';
  query?: string;
}

export interface ProjectAttachmentPaginationParams {
  page?: number;
  size?: number;
  sortBy?: 'id' | 'title' | 'createdAt' | 'fileName' | 'fileSize';
  sortDirection?: 'asc' | 'desc';
  query?: string;
}