import { HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis";
import { httpClient } from "@/lib/utils/http-client";
import { 
  CreateFileFolderRequestDto, 
  FileDto, 
  FileFolderDto, 
  FileUploadRequestDto,
  FileCategoryDto,
  CreateFileCategoryRequestDto,
  UpdateFileCategoryRequestDto,
  FileTypeDto,
  CreateFileTypeRequestDto,
  UpdateFileTypeRequestDto,
  UpdateFileRequestDto,
  UpdateFileFolderRequestDto,
  FileDownloadUrlResponseDto,
  FileCommentDto,
  CreateFileCommentRequestDto,
  UpdateFileCommentRequestDto,
  UpdateFileMetadataRequestDto
} from "@/lib/interfaces/apis/files";

// For server-side token management - not persisted between requests
export const SERVER_API_BASE_URL = '/api/v1/files';

export const SECTION_USER = 'user';
export const SECTION_RECENT = 'recent';
export const SECTION_SEARCH = 'search';
export const SECTION_FOLDERS = 'folders';
export const SECTION_FOLDERS_ROOT = 'folders/root';
export const SECTION_FOLDERS_SEARCH = 'folders/search';
export const SECTION_UPLOAD = 'upload';
export const SECTION_CATEGORIES = 'categories';
export const SECTION_TYPES = 'types';
export const SECTION_ORGANIZATION = 'organization';

export const SECTION_COMMENTS = 'comments';
export const SECTION_USER_COMMENTS = 'user/comments';

export const SECTION_CHAT = 'chat';
export const SECTION_USER_CHAT = 'user/chat';

export class FilesServerService {
  getHeaders(accessToken: string, isMultipart: boolean = false) {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
    };
    
    // Don't set Content-Type for multipart requests to let the browser set it with boundary
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    
    return { headers };
  }

  async searchFiles( accessToken : string , pagination?: HateoasPagination): Promise<HateoasResponse<FileDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}` : '';
      const response = await httpClient.get<HateoasResponse<FileDto>>(`${SERVER_API_BASE_URL}/${SECTION_SEARCH}${searchQuery}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('FilesServerService: searchFiles error:', error);
      throw error;
    }
  }

  async getFoldersFiles( accessToken : string , pagination?: HateoasPagination): Promise<HateoasResponse<FileFolderDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}` : '';
      const response = await httpClient.get<HateoasResponse<FileFolderDto>>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS}${searchQuery}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getFoldersFiles error:', error);
      throw error;
    }
  }

  async createNewFolder( accessToken : string , folderData: CreateFileFolderRequestDto): Promise<FileFolderDto> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      //const formData = JSON.stringify(folderData);
      const response = await httpClient.post<FileFolderDto>(
        `${SERVER_API_BASE_URL}/${SECTION_FOLDERS}`,
        folderData,
        headers
      );
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('FilesServerService: createNewFolder error:', error);
      throw error;
    }
  }

  async searchFoldersFiles( accessToken : string , pagination?: HateoasPagination): Promise<HateoasResponse<FileFolderDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}` : '';
      const response = await httpClient.get<HateoasResponse<FileFolderDto>>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS_SEARCH}${searchQuery}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('FilesServerService: searchFoldersFiles error:', error);
      throw error;
    }
  }


  async getRootFoldersFiles( accessToken : string , pagination?: HateoasPagination): Promise<FileFolderDto[]> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}` : '';
      const response = await httpClient.get<FileFolderDto[]>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS_ROOT}${searchQuery}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getRootFoldersFiles error:', error);
      throw error;
    }
  }

  async getUserFiles( accessToken : string , pagination?: HateoasPagination): Promise<HateoasResponse<FileDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}` : '';
      const response = await httpClient.get<HateoasResponse<FileDto>>(`${SERVER_API_BASE_URL}/${SECTION_USER}${searchQuery}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getUserFiles error:', error);
      throw error;
    }
  }
  async getRecentFiles( accessToken : string , pagination?: HateoasPagination): Promise<FileDto[]> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}` : '';
      const response = await httpClient.get<FileDto[]>(`${SERVER_API_BASE_URL}/${SECTION_RECENT}${searchQuery}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getRecentFiles error:', error);
      throw error;
    }
  }

  /**
   * Get organization accessible files with folder filtering
   * GET /api/v1/files/organization/accessible
   * @param accessToken The access token for authorization
   * @param folderIds Optional array of folder IDs to filter by
   * @param includeNoFolder Optional flag to include files with no folder assignment
   * @param pagination Optional pagination parameters
   * @returns Paginated organization accessible files
   */
  async getOrganizationAccessibleFiles(
    accessToken: string, 
    folderIds?: string[], 
    includeNoFolder?: boolean,
    pagination?: HateoasPagination
  ): Promise<HateoasResponse<FileDto>> {
    const params = new URLSearchParams();
    console.log('getOrganizationAccessibleFiles params:', params);
    // Add folder IDs if provided
    if (folderIds && folderIds.length > 0) {
      folderIds.forEach(id => params.append('folderIds', id));
    }
    console.log('getOrganizationAccessibleFiles params:', params);
    // Add includeNoFolder flag if provided
    if (includeNoFolder !== undefined) {
      params.append('includeNoFolder', includeNoFolder.toString());
    }
    console.log('getOrganizationAccessibleFiles params:', params);
    // Add pagination parameters
    if (pagination) {
      if (pagination.page !== undefined) params.append('page', pagination.page.toString());
      if (pagination.size !== undefined) params.append('size', pagination.size.toString());
      if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination.sortDir) params.append('sortDir', pagination.sortDir);
    }
    
    const queryString = params.toString();
    const url = `${SERVER_API_BASE_URL}/organization/accessible${queryString ? `?${queryString}` : ''}`;
    const response = await httpClient.get<HateoasResponse<FileDto> >(url,this.getHeaders(accessToken));
    console.log('getOrganizationAccessibleFiles response:', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.data as HateoasResponse<FileDto>;
  }

  /**
   * Get recent files with limit parameter (matching Spring Boot controller)
   * GET /api/v1/files/recent?limit={limit}
   * @param accessToken The access token for authorization
   * @param limit The maximum number of recent files to return
   * @returns Array of recent files
   */
  async getRecentFilesWithLimit(accessToken: string, limit: number = 10): Promise<FileDto[]> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<FileDto[]>
        (`${SERVER_API_BASE_URL}/${SECTION_RECENT}?limit=${limit}`,
        headers
      );
      
      console.log('Get recent files with limit response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getRecentFilesWithLimit error:', error);
      throw error;
    }
  }

  /**
   * Upload a file with multipart form data
   * POST /api/v1/files/upload
   * @param accessToken The access token for authorization
   * @param uploadRequest The upload request containing file and optional parameters
   * @returns The uploaded file details
   */
  async uploadFile(accessToken: string, uploadRequest: FileUploadRequestDto): Promise<FileDto> {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('file', uploadRequest.file);
      
      // Add optional parameters if provided
      if (uploadRequest.typeId) {
        formData.append('typeId', uploadRequest.typeId);
      }
      if (uploadRequest.folderId) {
        formData.append('folderId', uploadRequest.folderId);
      }
      if (uploadRequest.customPath) {
        formData.append('customPath', uploadRequest.customPath);
      }
      if (uploadRequest.metadata) {
        formData.append('metadata', uploadRequest.metadata);
      }

      // Use multipart headers (no Content-Type to let browser set boundary)
      const headers = this.getHeaders(accessToken, true);
      console.log('Upload headers:', headers);
      
      const response = await httpClient.post<FileDto>(
        `${SERVER_API_BASE_URL}/${SECTION_UPLOAD}`,
        formData,
        headers
      );
      
      console.log('Upload response:', response);
      if (response.data) {
        console.log('Upload success:', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('FilesServerService: uploadFile error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   * POST /api/v1/files/upload/multiple
   * @param accessToken The access token for authorization
   * @param files Array of files to upload
   * @param typeId Optional type ID
   * @param folderId Optional folder ID
   * @param customPath Optional custom path
   * @param metadata Optional metadata
   * @returns Array of uploaded file details
   */
  async uploadMultipleFiles(
    accessToken: string, 
    files: File[], 
    typeId?: string, 
    folderId?: string, 
    customPath?: string, 
    metadata?: string
  ): Promise<FileDto[]> {
    try {
      const formData = new FormData();
      
      // Append all files
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Add optional parameters if provided
      if (typeId) {
        formData.append('typeId', typeId);
      }
      if (folderId) {
        formData.append('folderId', folderId);
      }
      if (customPath) {
        formData.append('customPath', customPath);
      }
      if (metadata) {
        formData.append('metadata', metadata);
      }

      const headers = this.getHeaders(accessToken, true);
      console.log('Multiple upload headers:', headers);
      
      const response = await httpClient.post<FileDto[]>(
        `${SERVER_API_BASE_URL}/${SECTION_UPLOAD}/multiple`,
        formData,
        headers
      );
      
      console.log('Multiple upload response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: uploadMultipleFiles error:', error);
      throw error;
    }
  }

  /**
   * Get organization files
   * GET /api/v1/files/organization
   * @param accessToken The access token for authorization
   * @param pagination Optional pagination parameters
   * @returns Paginated organization files
   */
  async getOrganizationFiles(accessToken: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query || ''}&sortBy=${pagination.sortBy || 'createdAt'}&sortDir=${pagination.sortDir || 'desc'}` : '';
      const response = await httpClient.get<HateoasResponse<FileDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_ORGANIZATION}${searchQuery}`,
        headers
      );
      
      console.log('Organization files response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getOrganizationFiles error:', error);
      throw error;
    }
  }

  /**
   * Get file by ID
   * GET /api/v1/files/{id}
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @returns File details
   */
  async getFileById(accessToken: string, fileId: string): Promise<FileDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<FileDto>(
        `${SERVER_API_BASE_URL}/${fileId}`,
        headers
      );
      
      console.log('Get file by ID response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getFileById error:', error);
      throw error;
    }
  }

  /**
   * Update file metadata
   * PUT /api/v1/files/{id}
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @param updateRequest The update request data
   * @returns Updated file details
   */
  async updateFile(accessToken: string, fileId: string, updateRequest: UpdateFileRequestDto): Promise<FileDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<FileDto>(
        `${SERVER_API_BASE_URL}/${fileId}`,
        updateRequest,
        headers
      );
      
      console.log('Update file response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: updateFile error:', error);
      throw error;
    }
  }


  /**
   * Delete file by ID
   * DELETE /api/v1/files/{id}
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   */
  async deleteFile(accessToken: string, fileId: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/${fileId}`,
        headers
      );
      
      console.log('Delete file success for ID:', fileId);
    } catch (error) {
      console.error('FilesServerService: deleteFile error:', error);
      throw error;
    }
  }

  /**
   * Delete file and all derivatives
   * DELETE /api/v1/files/{id}/with-derivatives
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   */
  async deleteFileWithDerivatives(accessToken: string, fileId: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/${fileId}/with-derivatives`,
        headers
      );
      
      console.log('Delete file with derivatives success for ID:', fileId);
    } catch (error) {
      console.error('FilesServerService: deleteFileWithDerivatives error:', error);
      throw error;
    }
  }

  /**
   * Get file download URL
   * GET /api/v1/files/{id}/download-url
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @returns Download URL response
   */
  async getFileDownloadUrl(accessToken: string, fileId: string): Promise<FileDownloadUrlResponseDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<FileDownloadUrlResponseDto>(
        `${SERVER_API_BASE_URL}/${fileId}/download-url`,
        headers
      );
      
      console.log('Get download URL response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getFileDownloadUrl error:', error);
      throw error;
    }
  }

  /**
   * Get temporary download URL
   * GET /api/v1/files/{id}/temp-download-url
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @returns Temporary download URL response
   */
  async getTemporaryDownloadUrl(accessToken: string, fileId: string): Promise<FileDownloadUrlResponseDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<FileDownloadUrlResponseDto>(
        `${SERVER_API_BASE_URL}/${fileId}/temp-download-url`,
        headers
      );
      
      console.log('Get temporary download URL response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getTemporaryDownloadUrl error:', error);
      throw error;
    }
  }

  /**
   * Get derivative files
   * GET /api/v1/files/{id}/derivatives
   * @param accessToken The access token for authorization
   * @param fileId The parent file ID
   * @returns Array of derivative files
   */
  async getDerivativeFiles(accessToken: string, fileId: string): Promise<FileDto[]> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<FileDto[]>(
        `${SERVER_API_BASE_URL}/${fileId}/derivatives`,
        headers
      );
      
      console.log('Get derivative files response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getDerivativeFiles error:', error);
      throw error;
    }
  }

  /**
   * Create derivative file
   * POST /api/v1/files/{id}/derivatives
   * @param accessToken The access token for authorization
   * @param parentFileId The parent file ID
   * @param file The derivative file to upload
   * @param category The derivative category
   * @param pageNumber Optional page number for derivatives
   * @returns The created derivative file
   */
  async createDerivativeFile(
    accessToken: string, 
    parentFileId: string, 
    file: File, 
    category: string, 
    pageNumber?: number
  ): Promise<FileDto> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (pageNumber !== undefined) {
        formData.append('pageNumber', pageNumber.toString());
      }

      const headers = this.getHeaders(accessToken, true);
      const response = await httpClient.post<FileDto>(
        `${SERVER_API_BASE_URL}/${parentFileId}/derivatives`,
        formData,
        headers
      );
      
      console.log('Create derivative file response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: createDerivativeFile error:', error);
      throw error;
    }
  }

  // =========================
  // FILE CATEGORY OPERATIONS
  // =========================

  /**
   * Create file category
   * POST /api/v1/files/categories
   * @param accessToken The access token for authorization
   * @param categoryData The category data
   * @returns Created category
   */
  async createFileCategory(accessToken: string, categoryData: CreateFileCategoryRequestDto): Promise<FileCategoryDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<FileCategoryDto>(
        `${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}`,
        categoryData,
        headers
      );
      
      console.log('Create file category response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: createFileCategory error:', error);
      throw error;
    }
  }

  /**
   * Get all file categories
   * GET /api/v1/files/categories
   * @param accessToken The access token for authorization
   * @param pagination Optional pagination parameters
   * @returns Paginated file categories
   */
  async getAllFileCategories(accessToken: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileCategoryDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}` : '';
      const response = await httpClient.get<HateoasResponse<FileCategoryDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}${searchQuery}`,
        headers
      );
      
      console.log('Get all file categories response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getAllFileCategories error:', error);
      throw error;
    }
  }

  /**
   * Get file category by ID
   * GET /api/v1/files/categories/{id}
   * @param accessToken The access token for authorization
   * @param categoryId The category ID
   * @returns File category details
   */
  async getFileCategoryById(accessToken: string, categoryId: string): Promise<FileCategoryDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<FileCategoryDto>(
        `${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}/${categoryId}`,
        headers
      );
      
      console.log('Get file category by ID response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getFileCategoryById error:', error);
      throw error;
    }
  }

  /**
   * Update file category
   * PUT /api/v1/files/categories/{id}
   * @param accessToken The access token for authorization
   * @param categoryId The category ID
   * @param updateRequest The update request data
   * @returns Updated file category
   */
  async updateFileCategory(accessToken: string, categoryId: string, updateRequest: UpdateFileCategoryRequestDto): Promise<FileCategoryDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<FileCategoryDto>(
        `${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}/${categoryId}`,
        updateRequest,
        headers
      );
      
      console.log('Update file category response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: updateFileCategory error:', error);
      throw error;
    }
  }

  /**
   * Delete file category
   * DELETE /api/v1/files/categories/{id}
   * @param accessToken The access token for authorization
   * @param categoryId The category ID
   */
  async deleteFileCategory(accessToken: string, categoryId: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}/${categoryId}`,
        headers
      );
      
      console.log('Delete file category success for ID:', categoryId);
    } catch (error) {
      console.error('FilesServerService: deleteFileCategory error:', error);
      throw error;
    }
  }

  /**
   * Search file categories
   * GET /api/v1/files/categories/search
   * @param accessToken The access token for authorization
   * @param query Search query
   * @param pagination Optional pagination parameters
   * @returns Paginated search results
   */
  async searchFileCategories(accessToken: string, query: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileCategoryDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = `?query=${encodeURIComponent(query)}${pagination ? `&page=${pagination.page}&size=${pagination.size}` : ''}`;
      const response = await httpClient.get<HateoasResponse<FileCategoryDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}/search${searchQuery}`,
        headers
      );
      
      console.log('Search file categories response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: searchFileCategories error:', error);
      throw error;
    }
  }

  // =========================
  // FILE TYPE OPERATIONS
  // =========================

  /**
   * Create file type
   * POST /api/v1/files/types
   * @param accessToken The access token for authorization
   * @param typeData The type data
   * @returns Created file type
   */
  async createFileType(accessToken: string, typeData: CreateFileTypeRequestDto): Promise<FileTypeDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<FileTypeDto>(
        `${SERVER_API_BASE_URL}/${SECTION_TYPES}`,
        typeData,
        headers
      );
      
      console.log('Create file type response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: createFileType error:', error);
      throw error;
    }
  }

  /**
   * Get all file types
   * GET /api/v1/files/types
   * @param accessToken The access token for authorization
   * @param pagination Optional pagination parameters
   * @returns Paginated file types
   */
  async getAllFileTypes(accessToken: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileTypeDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}` : '';
      const response = await httpClient.get<HateoasResponse<FileTypeDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_TYPES}${searchQuery}`,
        headers
      );
      
      console.log('Get all file types response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getAllFileTypes error:', error);
      throw error;
    }
  }

  /**
   * Get file type by ID
   * GET /api/v1/files/types/{id}
   * @param accessToken The access token for authorization
   * @param typeId The type ID
   * @returns File type details
   */
  async getFileTypeById(accessToken: string, typeId: string): Promise<FileTypeDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<FileTypeDto>(
        `${SERVER_API_BASE_URL}/${SECTION_TYPES}/${typeId}`,
        headers
      );
      
      console.log('Get file type by ID response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getFileTypeById error:', error);
      throw error;
    }
  }

  /**
   * Update file type
   * PUT /api/v1/files/types/{id}
   * @param accessToken The access token for authorization
   * @param typeId The type ID
   * @param updateRequest The update request data
   * @returns Updated file type
   */
  async updateFileType(accessToken: string, typeId: string, updateRequest: UpdateFileTypeRequestDto): Promise<FileTypeDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<FileTypeDto>(
        `${SERVER_API_BASE_URL}/${SECTION_TYPES}/${typeId}`,
        updateRequest,
        headers
      );
      
      console.log('Update file type response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: updateFileType error:', error);
      throw error;
    }
  }

  /**
   * Delete file type
   * DELETE /api/v1/files/types/{id}
   * @param accessToken The access token for authorization
   * @param typeId The type ID
   */
  async deleteFileType(accessToken: string, typeId: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/${SECTION_TYPES}/${typeId}`,
        headers
      );
      
      console.log('Delete file type success for ID:', typeId);
    } catch (error) {
      console.error('FilesServerService: deleteFileType error:', error);
      throw error;
    }
  }

  /**
   * Search file types
   * GET /api/v1/files/types/search
   * @param accessToken The access token for authorization
   * @param query Search query
   * @param pagination Optional pagination parameters
   * @returns Paginated search results
   */
  async searchFileTypes(accessToken: string, query: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileTypeDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = `?query=${encodeURIComponent(query)}${pagination ? `&page=${pagination.page}&size=${pagination.size}` : ''}`;
      const response = await httpClient.get<HateoasResponse<FileTypeDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_TYPES}/search${searchQuery}`,
        headers
      );
      
      console.log('Search file types response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: searchFileTypes error:', error);
      throw error;
    }
  }

  // =========================
  // ADDITIONAL FOLDER OPERATIONS
  // =========================

  /**
   * Get file folder by ID
   * GET /api/v1/files/folders/{id}
   * @param accessToken The access token for authorization
   * @param folderId The folder ID
   * @returns File folder details
   */
  async getFileFolderById(accessToken: string, folderId: string): Promise<FileFolderDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<FileFolderDto>(
        `${SERVER_API_BASE_URL}/${SECTION_FOLDERS}/${folderId}`,
        headers
      );
      
      console.log('Get file folder by ID response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getFileFolderById error:', error);
      throw error;
    }
  }

  /**
   * Update file folder
   * PUT /api/v1/files/folders/{id}
   * @param accessToken The access token for authorization
   * @param folderId The folder ID
   * @param updateRequest The update request data
   * @returns Updated file folder
   */
  async updateFileFolder(accessToken: string, folderId: string, updateRequest: UpdateFileFolderRequestDto): Promise<FileFolderDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<FileFolderDto>(
        `${SERVER_API_BASE_URL}/${SECTION_FOLDERS}/${folderId}`,
        updateRequest,
        headers
      );
      
      console.log('Update file folder response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: updateFileFolder error:', error);
      throw error;
    }
  }

  /**
   * Delete file folder
   * DELETE /api/v1/files/folders/{id}
   * @param accessToken The access token for authorization
   * @param folderId The folder ID
   */
  async deleteFileFolder(accessToken: string, folderId: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/${SECTION_FOLDERS}/${folderId}`,
        headers
      );
      
      console.log('Delete file folder success for ID:', folderId);
    } catch (error) {
      console.error('FilesServerService: deleteFileFolder error:', error);
      throw error;
    }
  }

  /**
   * Get child folders
   * GET /api/v1/files/folders/{id}/children
   * @param accessToken The access token for authorization
   * @param parentFolderId The parent folder ID
   * @returns Array of child folders
   */
  async getChildFolders(accessToken: string, parentFolderId: string): Promise<FileFolderDto[]> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<FileFolderDto[]>(
        `${SERVER_API_BASE_URL}/${SECTION_FOLDERS}/${parentFolderId}/children`,
        headers
      );
      
      console.log('Get child folders response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getChildFolders error:', error);
      throw error;
    }
  }

  // =========================
  // ADVANCED FILTERING
  // =========================

  /**
   * Get files by category
   * GET /api/v1/files/by-category/{categoryId}
   * @param accessToken The access token for authorization
   * @param categoryId The category ID
   * @param pagination Optional pagination parameters
   * @returns Paginated files by category
   */
  async getFilesByCategory(accessToken: string, categoryId: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}` : '';
      const response = await httpClient.get<HateoasResponse<FileDto>>(
        `${SERVER_API_BASE_URL}/by-category/${categoryId}${searchQuery}`,
        headers
      );
      
      console.log('Get files by category response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getFilesByCategory error:', error);
      throw error;
    }
  }

  /**
   * Get files by type
   * GET /api/v1/files/by-type/{typeId}
   * @param accessToken The access token for authorization
   * @param typeId The type ID
   * @param pagination Optional pagination parameters
   * @returns Paginated files by type
   */
  async getFilesByType(accessToken: string, typeId: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}` : '';
      const response = await httpClient.get<HateoasResponse<FileDto>>(
        `${SERVER_API_BASE_URL}/by-type/${typeId}${searchQuery}`,
        headers
      );
      
      console.log('Get files by type response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getFilesByType error:', error);
      throw error;
    }
  }

  /**
   * Get files by folder
   * GET /api/v1/files/by-folder/{folderId}
   * @param accessToken The access token for authorization
   * @param folderId The folder ID
   * @param pagination Optional pagination parameters
   * @returns Paginated files by folder
   */
  async getFilesByFolder(accessToken: string, folderId: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}` : '';
      const response = await httpClient.get<HateoasResponse<FileDto>>(
        `${SERVER_API_BASE_URL}/by-folder/${folderId}${searchQuery}`,
        headers
      );
      console.log('Get files by folder response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getFilesByFolder error:', error);
      throw error;
    }
  }

  
  // =========================
  // FILE COMMENT OPERATIONS
  // =========================

  /**
   * Create a comment on a file
   * POST /api/v1/files/{fileId}/comments
   * @param accessToken The access token for authorization
   * @param fileId The file ID to comment on
   * @param commentData The comment request data
   * @returns Created comment
   */
  async createFileComment(accessToken: string, fileId: string, commentData: CreateFileCommentRequestDto): Promise<FileCommentDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<FileCommentDto>(
        `${SERVER_API_BASE_URL}/${fileId}/comments`,
        commentData,
        headers
      );
      
      console.log('Create file comment response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: createFileComment error:', error);
      throw error;
    }
  }

  /**
   * Reply to a comment
   * POST /api/v1/files/comments/{parentCommentId}/replies
   * @param accessToken The access token for authorization
   * @param parentCommentId The parent comment ID
   * @param replyData The reply request data
   * @returns Created reply
   */
  async replyToComment(accessToken: string, parentCommentId: string, replyData: CreateFileCommentRequestDto): Promise<FileCommentDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<FileCommentDto>(
        `${SERVER_API_BASE_URL}/comments/${parentCommentId}/replies`,
        replyData,
        headers
      );
      
      console.log('Reply to comment response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: replyToComment error:', error);
      throw error;
    }
  }

  /**
   * Get comments for a file
   * GET /api/v1/files/{fileId}/comments
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @param pagination Optional pagination parameters
   * @returns Paginated comments for the file
   */
  async getFileComments(accessToken: string, fileId: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileCommentDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = pagination ? 
        `?page=${pagination.page}&size=${pagination.size}&sortBy=${pagination.sortBy || 'createdAt'}&sortDir=${pagination.sortDir || 'desc'}` : 
        '';
      const response = await httpClient.get<HateoasResponse<FileCommentDto>>(
        `${SERVER_API_BASE_URL}/${fileId}/comments${searchQuery}`,
        headers
      );
      
      console.log('Get file comments response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getFileComments error:', error);
      throw error;
    }
  }

  /**
   * Get replies to a comment
   * GET /api/v1/files/comments/{commentId}/replies
   * @param accessToken The access token for authorization
   * @param commentId The comment ID
   * @param pagination Optional pagination parameters
   * @returns Paginated replies to the comment
   */
  async getCommentReplies(accessToken: string, commentId: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileCommentDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = pagination ? 
        `?page=${pagination.page}&size=${pagination.size}&sortBy=${pagination.sortBy || 'createdAt'}&sortDir=${pagination.sortDir || 'asc'}` : 
        '';
      const response = await httpClient.get<HateoasResponse<FileCommentDto>>(
        `${SERVER_API_BASE_URL}/comments/${commentId}/replies${searchQuery}`,
        headers
      );
      
      console.log('Get comment replies response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getCommentReplies error:', error);
      throw error;
    }
  }

  /**
   * Get a specific comment by ID
   * GET /api/v1/files/comments/{commentId}
   * @param accessToken The access token for authorization
   * @param commentId The comment ID
   * @returns Comment details
   */
  async getCommentById(accessToken: string, commentId: string): Promise<FileCommentDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<FileCommentDto>(
        `${SERVER_API_BASE_URL}/comments/${commentId}`,
        headers
      );
      
      console.log('Get comment by ID response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getCommentById error:', error);
      throw error;
    }
  }

  /**
   * Update a comment
   * PUT /api/v1/files/comments/{commentId}
   * @param accessToken The access token for authorization
   * @param commentId The comment ID
   * @param updateData The update request data
   * @returns Updated comment
   */
  async updateComment(accessToken: string, commentId: string, updateData: UpdateFileCommentRequestDto): Promise<FileCommentDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<FileCommentDto>(
        `${SERVER_API_BASE_URL}/comments/${commentId}`,
        updateData,
        headers
      );
      
      console.log('Update comment response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: updateComment error:', error);
      throw error;
    }
  }

  /**
   * Delete a comment
   * DELETE /api/v1/files/comments/{commentId}
   * @param accessToken The access token for authorization
   * @param commentId The comment ID
   */
  async deleteComment(accessToken: string, commentId: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete(
        `${SERVER_API_BASE_URL}/comments/${commentId}`,
        headers
      );
      
      console.log('Delete comment success for ID:', commentId);
    } catch (error) {
      console.error('FilesServerService: deleteComment error:', error);
      throw error;
    }
  }

  /**
   * Get user's comments
   * GET /api/v1/files/user/comments
   * @param accessToken The access token for authorization
   * @param pagination Optional pagination parameters
   * @returns Paginated user comments
   */
  async getUserComments(accessToken: string, pagination?: HateoasPagination): Promise<HateoasResponse<FileCommentDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const searchQuery = pagination ? 
        `?page=${pagination.page}&size=${pagination.size}&sortBy=${pagination.sortBy || 'createdAt'}&sortDir=${pagination.sortDir || 'desc'}` : 
        '';
      const response = await httpClient.get<HateoasResponse<FileCommentDto>>(
        `${SERVER_API_BASE_URL}/${SECTION_USER_COMMENTS}${searchQuery}`,
        headers
      );
      
      console.log('Get user comments response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: getUserComments error:', error);
      throw error;
    }
  }

  /**
   * Get comments count for a file
   * Convenience method to get just the comment count
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @returns Number of comments for the file
   */
  async getFileCommentsCount(accessToken: string, fileId: string): Promise<number> {
    try {
      const response = await this.getFileComments(accessToken, fileId, { page: 0, size: 1 });
      return response.page?.totalElements || 0;
    } catch (error) {
      console.error('FilesServerService: getFileCommentsCount error:', error);
      return 0;
    }
  }

  /**
   * Get replies count for a comment
   * Convenience method to get just the replies count
   * @param accessToken The access token for authorization
   * @param commentId The comment ID
   * @returns Number of replies for the comment
   */
  async getCommentRepliesCount(accessToken: string, commentId: string): Promise<number> {
    try {
      const response = await this.getCommentReplies(accessToken, commentId, { page: 0, size: 1 });
      return response.page?.totalElements || 0;
    } catch (error) {
      console.error('FilesServerService: getCommentRepliesCount error:', error);
      return 0;
    }
  }

  /**
   * Get all comments for a file with their replies (nested structure)
   * GET /api/v1/files/{fileId}/comments with replies expanded
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @param pagination Optional pagination parameters
   * @returns Paginated comments with nested replies
   */
  async getFileCommentsWithReplies(accessToken: string, fileId: string, pagination?: HateoasPagination): Promise<FileCommentDto[]> {
    try {
      // Get root comments first
      const commentsResponse = await this.getFileComments(accessToken, fileId, pagination);
      const comments = commentsResponse._embedded?.fileCommentDtoList || [];
      
      // For each comment, fetch its replies
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment: FileCommentDto) => {
          try {
            const repliesResponse = await this.getCommentReplies(accessToken, comment.id, { page: 0, size: 100 });
            return {
              ...comment,
              replies: repliesResponse._embedded?.fileCommentDtoList || []
            };
          } catch (error) {
            console.warn(`Failed to fetch replies for comment ${comment.id}:`, error);
            return {
              ...comment,
              replies: []
            };
          }
        })
      );
      
      return commentsWithReplies;
    } catch (error) {
      console.error('FilesServerService: getFileCommentsWithReplies error:', error);
      throw error;
    }
  }


  /**
   * Update file metadata only
   * PUT /api/v1/files/{id}/metadata
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @param updateRequest The metadata update request data
   * @returns Updated file details
   */
  async updateFileMetadata(accessToken: string, fileId: string, updateRequest: UpdateFileMetadataRequestDto): Promise<FileDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<FileDto>(
        `${SERVER_API_BASE_URL}/${fileId}/metadata`,
        updateRequest,
        headers
      );
      
      console.log('Update file metadata response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: updateFileMetadata error:', error);
      throw error;
    }
  }

  /**
   * Replace file content while preserving metadata
   * PUT /api/v1/files/{id}/content
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @param newFile The new file to upload
   * @param options Additional options for file replacement
   * @returns Updated file details
   */
  async replaceFileContent(
    accessToken: string, 
    fileId: string, 
    newFile: File, 
    options?: {
      customPath?: string;
      preserveOriginalFilename?: boolean;
      validateFileType?: boolean;
      metadata?: string;
    }
  ): Promise<FileDto> {
    try {
      const headers = this.getHeaders(accessToken, true);
      const formData = new FormData();
      formData.append('newFile', newFile);
      
      if (options?.customPath) formData.append('customPath', options.customPath);
      if (options?.preserveOriginalFilename !== undefined) formData.append('preserveOriginalFilename', options.preserveOriginalFilename.toString());
      if (options?.validateFileType !== undefined) formData.append('validateFileType', options.validateFileType.toString());
      if (options?.metadata) formData.append('metadata', options.metadata);

      const response = await httpClient.put<FileDto>(
        `${SERVER_API_BASE_URL}/${fileId}/content`,
        formData,
        headers
      );
      
      console.log('Replace file content response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: replaceFileContent error:', error);
      throw error;
    }
  }

  /**
   * Update file access type
   * PUT /api/v1/files/{id}/access-type
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @param accessType The new access type
   * @returns Updated file details
   */
  async updateFileAccessType(accessToken: string, fileId: string, accessType: string): Promise<FileDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<FileDto>(
        `${SERVER_API_BASE_URL}/${fileId}/access-type?accessType=${encodeURIComponent(accessType)}`,
        null,
        headers
      );
      
      console.log('Update file access type response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: updateFileAccessType error:', error);
      throw error;
    }
  }

  /**
   * Move file to a different folder
   * PUT /api/v1/files/{id}/move
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @param folderId The target folder ID (null to move to root)
   * @returns Updated file details
   */
  async moveFileToFolder(accessToken: string, fileId: string, folderId?: string): Promise<FileDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const url = folderId 
        ? `${SERVER_API_BASE_URL}/${fileId}/move?folderId=${encodeURIComponent(folderId)}`
        : `${SERVER_API_BASE_URL}/${fileId}/move`;
      
      const response = await httpClient.put<FileDto>(url, null, headers);
      
      console.log('Move file to folder response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: moveFileToFolder error:', error);
      throw error;
    }
  }

  /**
   * Update file type and category
   * PUT /api/v1/files/{id}/type-category
   * @param accessToken The access token for authorization
   * @param fileId The file ID
   * @param typeId The new type ID
   * @param categoryId The new category ID
   * @returns Updated file details
   */
  async updateFileTypeAndCategory(accessToken: string, fileId: string, typeId?: string, categoryId?: string): Promise<FileDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const params = new URLSearchParams();
      if (typeId) params.append('typeId', typeId);
      if (categoryId) params.append('categoryId', categoryId);
      
      const response = await httpClient.put<FileDto>(
        `${SERVER_API_BASE_URL}/${fileId}/type-category?${params.toString()}`,
        null,
        headers
      );
      
      console.log('Update file type and category response:', response);
      return response.data;
    } catch (error) {
      console.error('FilesServerService: updateFileTypeAndCategory error:', error);
      throw error;
    }
  }

}

// Export a default instance
export const filesServerService = new FilesServerService();
