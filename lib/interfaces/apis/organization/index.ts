/**
 * Organization-related DTOs and interfaces
 */
// Organization DTO
export interface OrganizationDto {
    id?: number;
    name?: string;
    description?: string;
    authProviderEmailDomain?: string;
    logoUrl?: string;
    thumbnailUrl?: string;
    locale?: string;
    createdAt?: string;
    updatedAt?: string;
    enabled?: boolean;
    story?: string;
    vision?: string;
    mission?: string;
    location?: string;
}

// Organization Value DTO
export interface OrganizationValueDto {
  id?: string;
  organizationId: string;
  title: string;
  description?: string;
  category?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdById?: string;
  updatedById?: string;
}

// Organization Leader DTO
export interface OrganizationLeaderDto {
  id?: string;
  organizationId: string;
  employeeId: string;
  employeeName?: string;
  employeeEmail?: string;
  employeeAvatar?: string;
  position: string;
  title?: string;
  department?: string;
  bio?: string;
  order?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  createdById?: string;
  updatedById?: string;
}

// Organization Location DTO
export interface OrganizationLocationDto {
  id?: string;
  organizationId: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  email?: string;
  type?: 'HEADQUARTERS' | 'BRANCH' | 'WAREHOUSE' | 'OFFICE' | 'OTHER';
  capacity?: number;
  description?: string;
  isActive?: boolean;
  isPrimary?: boolean;
  timezone?: string;
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  facilities?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdById?: string;
  updatedById?: string;
}

// Organization Pinned Document DTO
export interface OrganizationPinnedDocumentDto {
  id?: string;
  organizationId: string;
  fileId: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  filePath?: string;
  fileUrl?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  order?: number;
  isActive?: boolean;
  isPinned?: boolean;
  pinnedAt?: string;
  pinnedById?: string;
  pinnedByName?: string;
  accessLevel?: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'PRIVATE';
  departmentIds?: string[];
  teamIds?: string[];
  roleIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdById?: string;
  updatedById?: string;
}

// User Organization DTO
export interface UserOrganizationDto {
  id?: string;
  userId: string;
  organizationId: string;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  organizationName?: string;
  role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CONTRACTOR' | 'GUEST';
  permissions?: string[];
  departmentId?: string;
  departmentName?: string;
  teamId?: string;
  teamName?: string;
  position?: string;
  title?: string;
  employeeId?: string;
  managerId?: string;
  managerName?: string;
  startDate?: string;
  endDate?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'TERMINATED';
  isActive?: boolean;
  isPrimary?: boolean;
  lastLoginAt?: string;
  invitedAt?: string;
  invitedById?: string;
  invitedByName?: string;
  acceptedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  createdById?: string;
  updatedById?: string;
}

// Request DTOs for creating/updating organization entities
export interface CreateOrganizationValueRequestDto {
  title: string;
  description?: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateOrganizationValueRequestDto {
  title?: string;
  description?: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateOrganizationLeaderRequestDto {
  employeeId: string;
  position: string;
  title?: string;
  department?: string;
  bio?: string;
  order?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateOrganizationLeaderRequestDto {
  employeeId?: string;
  position?: string;
  title?: string;
  department?: string;
  bio?: string;
  order?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface CreateOrganizationLocationRequestDto {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  email?: string;
  type?: 'HEADQUARTERS' | 'BRANCH' | 'WAREHOUSE' | 'OFFICE' | 'OTHER';
  capacity?: number;
  description?: string;
  isActive?: boolean;
  isPrimary?: boolean;
  timezone?: string;
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  facilities?: string[];
}

export interface UpdateOrganizationLocationRequestDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  email?: string;
  type?: 'HEADQUARTERS' | 'BRANCH' | 'WAREHOUSE' | 'OFFICE' | 'OTHER';
  capacity?: number;
  description?: string;
  isActive?: boolean;
  isPrimary?: boolean;
  timezone?: string;
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  facilities?: string[];
}

export interface CreateOrganizationPinnedDocumentRequestDto {
  fileId: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  order?: number;
  isActive?: boolean;
  isPinned?: boolean;
  accessLevel?: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'PRIVATE';
  departmentIds?: string[];
  teamIds?: string[];
  roleIds?: string[];
}

export interface UpdateOrganizationPinnedDocumentRequestDto {
  fileId?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  order?: number;
  isActive?: boolean;
  isPinned?: boolean;
  accessLevel?: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'PRIVATE';
  departmentIds?: string[];
  teamIds?: string[];
  roleIds?: string[];
}

export interface CreateUserOrganizationRequestDto {
  userId: string;
  organizationId: string;
  role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CONTRACTOR' | 'GUEST';
  permissions?: string[];
  departmentId?: string;
  teamId?: string;
  position?: string;
  title?: string;
  managerId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'TERMINATED';
  isActive?: boolean;
  isPrimary?: boolean;
}

export interface UpdateUserOrganizationRequestDto {
  role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CONTRACTOR' | 'GUEST';
  permissions?: string[];
  departmentId?: string;
  teamId?: string;
  position?: string;
  title?: string;
  managerId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'TERMINATED';
  isActive?: boolean;
  isPrimary?: boolean;
}

// Filter and search DTOs
export interface OrganizationFilterDto {
  status?: 'ACTIVE' | 'INACTIVE';
  type?: string;
  department?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface OrganizationSearchRequestDto {
  query?: string;
  filters?: OrganizationFilterDto;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
