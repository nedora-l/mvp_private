import { getStoredToken } from "../../auth/token-storage";
import { ApiResponse, HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis/common";
import { AppDepartment, AppEmployee, AppTeam } from "@/lib/interfaces/apis";
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
  UpdateFileCommentRequestDto
} from "@/lib/interfaces/apis/files";

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

/**
 * Fetches data from the API with support for multipart uploads.
 * @param url The URL to fetch.
 * @param options The fetch options.
 * @param isMultipart Whether this is a multipart request (for file uploads).
 * @returns The JSON response.
 * @throws Error if the fetch fails or the response is not ok.
 */
async function fetchData<T>(url: string, options: RequestInit = {}, isMultipart: boolean = false): Promise<T> {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {}),
  };
  
  // Don't set Content-Type for multipart requests to let the browser set it with boundary
  if (!isMultipart) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
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
 * Client for interacting with the  Files & Folders API.
 */
export const filesApiClient = {
  /**
   * Search files.
   * GET /api/v1/files/search
   * @returns A paginated list of files.
   */
  searchFiles: (pagination: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileDto>>> => {
    return fetchData<ApiResponse<HateoasResponse<FileDto>>>(`${SERVER_API_BASE_URL}/${SECTION_SEARCH}?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}`);
  },

  /**
   * Gets user files.
   * GET /api/v1/files/user
   * @returns A paginated list of user files.
   */
  getUserFiles: (pagination: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileDto>>> => {
    return fetchData<ApiResponse<HateoasResponse<FileDto>>>(`${SERVER_API_BASE_URL}/${SECTION_USER}?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}`);
  },

  /**
   * Gets recent files.
   * GET /api/v1/files/recent
   * @returns A list of recent files.
   */
  getRecentFiles: (pagination: HateoasPagination): Promise<ApiResponse<FileDto[]>> => {
    return fetchData<ApiResponse<FileDto[]>>(`${SERVER_API_BASE_URL}/${SECTION_RECENT}?page=${pagination.page || 0}&size=${pagination.size || 25}&query=${pagination.query || ''}`);
  },

  /**
   * Gets folders files.
   * GET /api/v1/files/folders
   * @returns A paginated list of folders and files.
   */
  getFoldersFiles: (pagination: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileFolderDto>>> => {
    return fetchData<ApiResponse<HateoasResponse<FileFolderDto>>>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS}?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}`);
  },


  /**
   * Creates a new folder.
   * POST /api/v1/files/folders
   * @param folderData The data for the new folder.
   * @returns The created folder.
   */
  createNewFolder: (accessToken: string, folderData: CreateFileFolderRequestDto): Promise<FileFolderDto> => {
    return fetchData<FileFolderDto>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(folderData),
    });
  },

  
  /**
   * Search folders files.
   * GET /api/v1/files/folders/search
   * @returns A paginated list of searched folders and files.
   */
  searchFoldersFiles: (pagination: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileFolderDto>>> => {
    return fetchData<ApiResponse<HateoasResponse<FileFolderDto>>>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS_SEARCH}?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}`);
  },

  /**
   * Gets all Root Folders.
   * GET /api/v1/files/folders/root
   * @returns A list of root folders.
   */
  getRootFolders: (pagination: HateoasPagination): Promise<ApiResponse<FileFolderDto[]>> => {
    return fetchData<ApiResponse<FileFolderDto[]>>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS_ROOT}?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}`);
  },

  /**
   * Search folders.
   * GET /api/v1/files/folders/search
   * @returns A paginated list of searched folders.
   */
  searchFolders: (pagination: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileFolderDto>>> => {
    return fetchData<ApiResponse<HateoasResponse<FileFolderDto>>>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS_SEARCH}?page=${pagination.page}&size=${pagination.size}&query=${pagination.query}`);
  },

  /**
   * Get recent files with limit parameter
   * GET /api/v1/files/recent?limit={limit}
   * @param limit The maximum number of recent files to return
   * @returns Array of recent files
   */
  getRecentFilesWithLimit: (limit: number = 10): Promise<ApiResponse<FileDto[]>> => {
    return fetchData<ApiResponse<FileDto[]>>(`${SERVER_API_BASE_URL}/${SECTION_RECENT}?limit=${limit}`);
  },

  /**
   * Upload a file with multipart form data
   * POST /api/v1/files/upload
   * @param uploadRequest The upload request containing file and optional parameters
   * @returns The uploaded file details
   */
  uploadFile: (uploadRequest: FileUploadRequestDto): Promise<ApiResponse<FileDto>> => {
    const formData = new FormData();
    formData.append('file', uploadRequest.file);
    
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

    return fetchData<ApiResponse<FileDto>>(`${SERVER_API_BASE_URL}/${SECTION_UPLOAD}`, {
      method: 'POST',
      body: formData,
    }, true);
  },

  /**
   * Upload multiple files
   * POST /api/v1/files/upload/multiple
   * @param files Array of files to upload
   * @param typeId Optional type ID
   * @param folderId Optional folder ID
   * @param customPath Optional custom path
   * @param metadata Optional metadata
   * @returns Array of uploaded file details
   */
  uploadMultipleFiles: (
    files: File[], 
    typeId?: string, 
    folderId?: string, 
    customPath?: string, 
    metadata?: string
  ): Promise<ApiResponse<FileDto[]>> => {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
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

    return fetchData<ApiResponse<FileDto[]>>(`${SERVER_API_BASE_URL}/${SECTION_UPLOAD}/multiple`, {
      method: 'POST',
      body: formData,
    }, true);
  },

  /**
   * Get organization files
   * GET /api/v1/files/organization
   * @param pagination Optional pagination parameters
   * @returns Paginated organization files
   */
  getOrganizationFiles: (pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileDto>>> => {
    const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}&query=${pagination.query || ''}&sortBy=${pagination.sortBy || 'createdAt'}&sortDir=${pagination.sortDir || 'desc'}` : '';
    return fetchData<ApiResponse<HateoasResponse<FileDto>>>(`${SERVER_API_BASE_URL}/${SECTION_ORGANIZATION}${searchQuery}`);
  },

  /**
   * Get organization accessible files with folder filtering
   * GET /api/v1/files/organization/accessible
   * @param folderIds Optional array of folder IDs to filter by
   * @param includeNoFolder Optional flag to include files with no folder assignment
   * @param pagination Optional pagination parameters
   * @returns Paginated organization accessible files
   */
  getOrganizationAccessibleFiles: (
    folderIds?: string[], 
    includeNoFolder?: boolean,
    pagination?: HateoasPagination
  ): Promise<ApiResponse<HateoasResponse<FileDto>>> => {
    const params = new URLSearchParams();
    
    // Add folder IDs if provided
    if (folderIds && folderIds.length > 0) {
      folderIds.forEach(id => params.append('folderIds', id));
    }
    
    // Add includeNoFolder flag if provided
    if (includeNoFolder !== undefined) {
      params.append('includeNoFolder', includeNoFolder.toString());
    }
    
    // Add pagination parameters
    if (pagination) {
      if (pagination.page !== undefined) params.append('page', pagination.page.toString());
      if (pagination.size !== undefined) params.append('size', pagination.size.toString());
      if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination.sortDir) params.append('sortDir', pagination.sortDir);
    }
    
    const queryString = params.toString();
    const url = `${SERVER_API_BASE_URL}/${SECTION_ORGANIZATION}/accessible${queryString ? `?${queryString}` : ''}`;
    return fetchData<ApiResponse<HateoasResponse<FileDto>>>(url);
  },

  /**
   * Get file by ID
   * GET /api/v1/files/{id}
   * @param fileId The file ID
   * @returns File details
   */
  getFileById: (fileId: string): Promise<ApiResponse<FileDto>> => {
    return fetchData<ApiResponse<FileDto>>(`${SERVER_API_BASE_URL}/${fileId}`);
  },

  /**
   * Get file download url by ID
   * GET /api/v1/files/{id}
   * @param fileId The file ID
   * @returns File details
   */
  getFileDownloadUrlById: (fileId: string): Promise<string> => {
    const res = fetchData<ApiResponse<FileDto>>(`${SERVER_API_BASE_URL}/${fileId}`);
    return res.then(response => response.data?.downloadUrl || '#');
  },
  /**
   * Update file metadata
   * PUT /api/v1/files/{id}
   * @param fileId The file ID
   * @param updateRequest The update request data
   * @returns Updated file details
   */
  updateFile: (fileId: string, updateRequest: UpdateFileRequestDto): Promise<ApiResponse<FileDto>> => {
    return fetchData<ApiResponse<FileDto>>(`${SERVER_API_BASE_URL}/${fileId}`, {
      method: 'PUT',
      body: JSON.stringify(updateRequest),
    });
  },

  /**
   * Delete file by ID
   * DELETE /api/v1/files/{id}
   * @param fileId The file ID
   */
  deleteFile: (fileId: string): Promise<void> => {
    return fetchData<void>(`${SERVER_API_BASE_URL}/${fileId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Delete file and all derivatives
   * DELETE /api/v1/files/{id}/with-derivatives
   * @param fileId The file ID
   */
  deleteFileWithDerivatives: (fileId: string): Promise<void> => {
    return fetchData<void>(`${SERVER_API_BASE_URL}/${fileId}/with-derivatives`, {
      method: 'DELETE',
    });
  },

  /**
   * Get file download URL
   * GET /api/v1/files/{id}/download-url
   * @param fileId The file ID
   * @returns Download URL response
   */
  getFileDownloadUrl: (fileId: string): Promise<ApiResponse<FileDownloadUrlResponseDto>> => {
    return fetchData<ApiResponse<FileDownloadUrlResponseDto>>(`${SERVER_API_BASE_URL}/${fileId}/download-url`);
  },

  /**
   * Get temporary download URL
   * GET /api/v1/files/{id}/temp-download-url
   * @param fileId The file ID
   * @returns Temporary download URL response
   */
  getTemporaryDownloadUrl: (fileId: string): Promise<ApiResponse<FileDownloadUrlResponseDto>> => {
    return fetchData<ApiResponse<FileDownloadUrlResponseDto>>(`${SERVER_API_BASE_URL}/${fileId}/temp-download-url`);
  },

  /**
   * Get derivative files
   * GET /api/v1/files/{id}/derivatives
   * @param fileId The parent file ID
   * @returns Array of derivative files
   */
  getDerivativeFiles: (fileId: string): Promise<ApiResponse<FileDto[]>> => {
    return fetchData<ApiResponse<FileDto[]>>(`${SERVER_API_BASE_URL}/${fileId}/derivatives`);
  },

  /**
   * Create derivative file
   * POST /api/v1/files/{id}/derivatives
   * @param parentFileId The parent file ID
   * @param file The derivative file to upload
   * @param category The derivative category
   * @param pageNumber Optional page number for derivatives
   * @returns The created derivative file
   */
  createDerivativeFile: (
    parentFileId: string, 
    file: File, 
    category: string, 
    pageNumber?: number
  ): Promise<ApiResponse<FileDto>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (pageNumber !== undefined) {
      formData.append('pageNumber', pageNumber.toString());
    }

    return fetchData<ApiResponse<FileDto>>(`${SERVER_API_BASE_URL}/${parentFileId}/derivatives`, {
      method: 'POST',
      body: formData,
    }, true);
  },

  // =========================
  // FILE CATEGORY OPERATIONS
  // =========================

  /**
   * Create file category
   * POST /api/v1/files/categories
   * @param categoryData The category data
   * @returns Created category
   */
  createFileCategory: (categoryData: CreateFileCategoryRequestDto): Promise<ApiResponse<FileCategoryDto>> => {
    return fetchData<ApiResponse<FileCategoryDto>>(`${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  /**
   * Get all file categories
   * GET /api/v1/files/categories
   * @param pagination Optional pagination parameters
   * @returns Paginated file categories
   */
  getAllFileCategories: (pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileCategoryDto>>> => {
    const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}` : '';
    return fetchData<ApiResponse<HateoasResponse<FileCategoryDto>>>(`${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}${searchQuery}`);
  },

  /**
   * Get file category by ID
   * GET /api/v1/files/categories/{id}
   * @param categoryId The category ID
   * @returns File category details
   */
  getFileCategoryById: (categoryId: string): Promise<ApiResponse<FileCategoryDto>> => {
    return fetchData<ApiResponse<FileCategoryDto>>(`${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}/${categoryId}`);
  },

  /**
   * Update file category
   * PUT /api/v1/files/categories/{id}
   * @param categoryId The category ID
   * @param updateRequest The update request data
   * @returns Updated file category
   */
  updateFileCategory: (categoryId: string, updateRequest: UpdateFileCategoryRequestDto): Promise<ApiResponse<FileCategoryDto>> => {
    return fetchData<ApiResponse<FileCategoryDto>>(`${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(updateRequest),
    });
  },

  /**
   * Delete file category
   * DELETE /api/v1/files/categories/{id}
   * @param categoryId The category ID
   */
  deleteFileCategory: (categoryId: string): Promise<void> => {
    return fetchData<void>(`${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}/${categoryId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Search file categories
   * GET /api/v1/files/categories/search
   * @param query Search query
   * @param pagination Optional pagination parameters
   * @returns Paginated search results
   */
  searchFileCategories: (query: string, pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileCategoryDto>>> => {
    const searchQuery = `?query=${encodeURIComponent(query)}${pagination ? `&page=${pagination.page}&size=${pagination.size}` : ''}`;
    return fetchData<ApiResponse<HateoasResponse<FileCategoryDto>>>(`${SERVER_API_BASE_URL}/${SECTION_CATEGORIES}/search${searchQuery}`);
  },

  // =========================
  // FILE TYPE OPERATIONS
  // =========================

  /**
   * Create file type
   * POST /api/v1/files/types
   * @param typeData The type data
   * @returns Created file type
   */
  createFileType: (typeData: CreateFileTypeRequestDto): Promise<ApiResponse<FileTypeDto>> => {
    return fetchData<ApiResponse<FileTypeDto>>(`${SERVER_API_BASE_URL}/${SECTION_TYPES}`, {
      method: 'POST',
      body: JSON.stringify(typeData),
    });
  },

  /**
   * Get all file types
   * GET /api/v1/files/types
   * @param pagination Optional pagination parameters
   * @returns Paginated file types
   */
  getAllFileTypes: (pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileTypeDto>>> => {
    const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}` : '';
    return fetchData<ApiResponse<HateoasResponse<FileTypeDto>>>(`${SERVER_API_BASE_URL}/${SECTION_TYPES}${searchQuery}`);
  },

  /**
   * Get file type by ID
   * GET /api/v1/files/types/{id}
   * @param typeId The type ID
   * @returns File type details
   */
  getFileTypeById: (typeId: string): Promise<ApiResponse<FileTypeDto>> => {
    return fetchData<ApiResponse<FileTypeDto>>(`${SERVER_API_BASE_URL}/${SECTION_TYPES}/${typeId}`);
  },

  /**
   * Update file type
   * PUT /api/v1/files/types/{id}
   * @param typeId The type ID
   * @param updateRequest The update request data
   * @returns Updated file type
   */
  updateFileType: (typeId: string, updateRequest: UpdateFileTypeRequestDto): Promise<ApiResponse<FileTypeDto>> => {
    return fetchData<ApiResponse<FileTypeDto>>(`${SERVER_API_BASE_URL}/${SECTION_TYPES}/${typeId}`, {
      method: 'PUT',
      body: JSON.stringify(updateRequest),
    });
  },

  /**
   * Delete file type
   * DELETE /api/v1/files/types/{id}
   * @param typeId The type ID
   */
  deleteFileType: (typeId: string): Promise<void> => {
    return fetchData<void>(`${SERVER_API_BASE_URL}/${SECTION_TYPES}/${typeId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Search file types
   * GET /api/v1/files/types/search
   * @param query Search query
   * @param pagination Optional pagination parameters
   * @returns Paginated search results
   */
  searchFileTypes: (query: string, pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileTypeDto>>> => {
    const searchQuery = `?query=${encodeURIComponent(query)}${pagination ? `&page=${pagination.page}&size=${pagination.size}` : ''}`;
    return fetchData<ApiResponse<HateoasResponse<FileTypeDto>>>(`${SERVER_API_BASE_URL}/${SECTION_TYPES}/search${searchQuery}`);
  },

  // =========================
  // ADDITIONAL FOLDER OPERATIONS
  // =========================

  /**
   * Get file folder by ID
   * GET /api/v1/files/folders/{id}
   * @param folderId The folder ID
   * @returns File folder details
   */
  getFileFolderById: (folderId: string): Promise<ApiResponse<FileFolderDto>> => {
    return fetchData<ApiResponse<FileFolderDto>>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS}/${folderId}`);
  },

  /**
   * Update file folder
   * PUT /api/v1/files/folders/{id}
   * @param folderId The folder ID
   * @param updateRequest The update request data
   * @returns Updated file folder
   */
  updateFileFolder: (folderId: string, updateRequest: UpdateFileFolderRequestDto): Promise<ApiResponse<FileFolderDto>> => {
    return fetchData<ApiResponse<FileFolderDto>>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS}/${folderId}`, {
      method: 'PUT',
      body: JSON.stringify(updateRequest),
    });
  },

  /**
   * Delete file folder
   * DELETE /api/v1/files/folders/{id}
   * @param folderId The folder ID
   */
  deleteFileFolder: (folderId: string): Promise<void> => {
    return fetchData<void>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS}/${folderId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get child folders
   * GET /api/v1/files/folders/{id}/children
   * @param parentFolderId The parent folder ID
   * @returns Array of child folders
   */
  getChildFolders: (parentFolderId: string): Promise<ApiResponse<FileFolderDto[]>> => {
    return fetchData<ApiResponse<FileFolderDto[]>>(`${SERVER_API_BASE_URL}/${SECTION_FOLDERS}/${parentFolderId}/children`);
  },

  // =========================
  // ADVANCED FILTERING
  // =========================

  /**
   * Get files by category
   * GET /api/v1/files/by-category/{categoryId}
   * @param categoryId The category ID
   * @param pagination Optional pagination parameters
   * @returns Paginated files by category
   */
  getFilesByCategory: (categoryId: string, pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileDto>>> => {
    const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}` : '';
    return fetchData<ApiResponse<HateoasResponse<FileDto>>>(`${SERVER_API_BASE_URL}/by-category/${categoryId}${searchQuery}`);
  },

  /**
   * Get files by type
   * GET /api/v1/files/by-type/{typeId}
   * @param typeId The type ID
   * @param pagination Optional pagination parameters
   * @returns Paginated files by type
   */
  getFilesByType: (typeId: string, pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileDto>>> => {
    const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}` : '';
    return fetchData<ApiResponse<HateoasResponse<FileDto>>>(`${SERVER_API_BASE_URL}/by-type/${typeId}${searchQuery}`);
  },

  /**
   * Get files by folder
   * GET /api/v1/files/by-folder/{folderId}
   * @param folderId The folder ID
   * @param pagination Optional pagination parameters
   * @returns Paginated files by folder
   */
  getFilesByFolder: (folderId: string, pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileDto>>> => {
    const searchQuery = pagination ? `?page=${pagination.page}&size=${pagination.size}` : '';
    return fetchData<ApiResponse<HateoasResponse<FileDto>>>(`${SERVER_API_BASE_URL}/by-folder/${folderId}${searchQuery}`);
  },

  // =========================
  // FILE COMMENT OPERATIONS
  // =========================

  /**
   * Get comments for a file
   * GET /api/v1/files/{fileId}/comments
   * @param fileId The file ID
   * @param pagination Optional pagination parameters
   * @returns Paginated comments for the file
   */
  getFileComments: (fileId: string, pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileCommentDto>>> => {
    const searchQuery = pagination ? 
      `?page=${pagination.page}&size=${pagination.size}&sortBy=${pagination.sortBy || 'createdAt'}&sortDir=${pagination.sortDir || 'desc'}` : 
      '';
    return fetchData<ApiResponse<HateoasResponse<FileCommentDto>>>(`${SERVER_API_BASE_URL}/${fileId}/comments${searchQuery}`);
  },

  /**
   * Create a comment on a file
   * POST /api/v1/files/{fileId}/comments
   * @param fileId The file ID to comment on
   * @param commentData The comment request data
   * @returns Created comment
   */
  createFileComment: (fileId: string, commentData: CreateFileCommentRequestDto): Promise<ApiResponse<FileCommentDto>> => {
    return fetchData<ApiResponse<FileCommentDto>>(`${SERVER_API_BASE_URL}/${fileId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  /**
   * Get a specific comment by ID
   * GET /api/v1/files/comments/{commentId}
   * @param commentId The comment ID
   * @returns Comment details
   */
  getCommentById: (commentId: string): Promise<ApiResponse<FileCommentDto>> => {
    return fetchData<ApiResponse<FileCommentDto>>(`${SERVER_API_BASE_URL}/comments/${commentId}`);
  },

  /**
   * Update a comment
   * PUT /api/v1/files/comments/{commentId}
   * @param commentId The comment ID
   * @param updateData The update request data
   * @returns Updated comment
   */
  updateComment: (commentId: string, updateData: UpdateFileCommentRequestDto): Promise<ApiResponse<FileCommentDto>> => {
    return fetchData<ApiResponse<FileCommentDto>>(`${SERVER_API_BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Delete a comment
   * DELETE /api/v1/files/comments/{commentId}
   * @param commentId The comment ID
   */
  deleteComment: (commentId: string): Promise<ApiResponse<null>> => {
    return fetchData<ApiResponse<null>>(`${SERVER_API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get replies to a comment
   * GET /api/v1/files/comments/{commentId}/replies
   * @param commentId The comment ID
   * @param pagination Optional pagination parameters
   * @returns Paginated replies to the comment
   */
  getCommentReplies: (commentId: string, pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileCommentDto>>> => {
    const searchQuery = pagination ? 
      `?page=${pagination.page}&size=${pagination.size}&sortBy=${pagination.sortBy || 'createdAt'}&sortDir=${pagination.sortDir || 'asc'}` : 
      '';
    return fetchData<ApiResponse<HateoasResponse<FileCommentDto>>>(`${SERVER_API_BASE_URL}/comments/${commentId}/replies${searchQuery}`);
  },

  /**
   * Reply to a comment
   * POST /api/v1/files/comments/{parentCommentId}/replies
   * @param parentCommentId The parent comment ID
   * @param replyData The reply request data
   * @returns Created reply
   */
  replyToComment: (parentCommentId: string, replyData: CreateFileCommentRequestDto): Promise<ApiResponse<FileCommentDto>> => {
    return fetchData<ApiResponse<FileCommentDto>>(`${SERVER_API_BASE_URL}/comments/${parentCommentId}/replies`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  },

  /**
   * Get user's comments
   * GET /api/v1/files/user/comments
   * @param pagination Optional pagination parameters
   * @returns Paginated user comments
   */
  getUserComments: (pagination?: HateoasPagination): Promise<ApiResponse<HateoasResponse<FileCommentDto>>> => {
    const searchQuery = pagination ? 
      `?page=${pagination.page}&size=${pagination.size}&sortBy=${pagination.sortBy || 'createdAt'}&sortDir=${pagination.sortDir || 'desc'}` : 
      '';
    return fetchData<ApiResponse<HateoasResponse<FileCommentDto>>>(`${SERVER_API_BASE_URL}/${SECTION_USER_COMMENTS}${searchQuery}`);
  },

  /**
   * Get comments count for a file
   * Convenience method to get just the comment count
   * @param fileId The file ID
   * @returns Number of comments for the file
   */
  getFileCommentsCount: async (fileId: string): Promise<number> => {
    try {
      const response = await fetchData<ApiResponse<HateoasResponse<FileCommentDto>>>(`${SERVER_API_BASE_URL}/${fileId}/comments?page=0&size=1`);
      return response.data?.page?.totalElements || 0;
    } catch (error) {
      console.error('Error getting file comments count:', error);
      return 0;
    }
  },

  /**
   * Get replies count for a comment
   * Convenience method to get just the replies count
   * @param commentId The comment ID
   * @returns Number of replies for the comment
   */
  getCommentRepliesCount: async (commentId: string): Promise<number> => {
    try {
      const response = await fetchData<ApiResponse<HateoasResponse<FileCommentDto>>>(`${SERVER_API_BASE_URL}/comments/${commentId}/replies?page=0&size=1`);
      return response.data?.page?.totalElements || 0;
    } catch (error) {
      console.error('Error getting comment replies count:', error);
      return 0;
    }
  },

  /**
   * Get all comments for a file with their replies (nested structure)
   * This method fetches comments and their replies in a single call
   * @param fileId The file ID
   * @param pagination Optional pagination parameters for root comments
   * @returns Comments with nested replies
   */
  getFileCommentsWithReplies: async (fileId: string, pagination?: HateoasPagination): Promise<FileCommentDto[]> => {
    try {
      // Get root comments first
      const commentsResponse = await fetchData<ApiResponse<HateoasResponse<FileCommentDto>>>(`${SERVER_API_BASE_URL}/${fileId}/comments${pagination ? `?page=${pagination.page}&size=${pagination.size}&sortBy=${pagination.sortBy || 'createdAt'}&sortDir=${pagination.sortDir || 'desc'}` : ''}`);
      const comments = commentsResponse.data?._embedded?.fileCommentDtoList || [];
      
      // For each comment, fetch its replies
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment: FileCommentDto) => {
          try {
            const repliesResponse = await fetchData<ApiResponse<HateoasResponse<FileCommentDto>>>(`${SERVER_API_BASE_URL}/comments/${comment.id}/replies?page=0&size=100`);
            return {
              ...comment,
              replies: repliesResponse.data?._embedded?.fileCommentDtoList || []
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
      console.error('Error getting file comments with replies:', error);
      throw error;
    }
  },

  /**
   * Get all comments for a file with their replies (server-side optimized)
   * GET /api/v1/files/{fileId}/comments/with-replies
   * @param fileId The file ID
   * @param pagination Optional pagination parameters
   * @returns Comments with nested replies (server-optimized)
   */
  getFileCommentsWithRepliesOptimized: (fileId: string, pagination?: HateoasPagination): Promise<ApiResponse<FileCommentDto[]>> => {
    const searchQuery = pagination ? 
      `?page=${pagination.page}&size=${pagination.size}&sortBy=${pagination.sortBy || 'createdAt'}&sortDir=${pagination.sortDir || 'desc'}` : 
      '';
    return fetchData<ApiResponse<FileCommentDto[]>>(`${SERVER_API_BASE_URL}/${fileId}/comments/with-replies${searchQuery}`);
  },

  /**
   * Update file access type
   * PUT /api/v1/files/{fileId}/access-type
   * @param fileId The file ID
   * @param accessType The new access type
   * @returns Updated file details
   */
  updateFileAccessType: (fileId: string, accessType: string): Promise<ApiResponse<FileDto>> => {
    return fetchData<ApiResponse<FileDto>>(`${SERVER_API_BASE_URL}/${fileId}/access-type?accessType=${encodeURIComponent(accessType)}`, {
      method: 'PUT',
    });
  },

  /**
   * Move file to a different folder
   * PUT /api/v1/files/{fileId}/move
   * @param fileId The file ID
   * @param folderId The target folder ID (optional, null to move to root)
   * @returns Updated file details
   */
  moveFileToFolder: (fileId: string, folderId?: string): Promise<ApiResponse<FileDto>> => {
    const url = folderId 
      ? `${SERVER_API_BASE_URL}/${fileId}/move?folderId=${encodeURIComponent(folderId)}`
      : `${SERVER_API_BASE_URL}/${fileId}/move`;
    return fetchData<ApiResponse<FileDto>>(url, {
      method: 'PUT',
    });
  },

  /**
   * Update file type and category
   * PUT /api/v1/files/{fileId}/type-category
   * @param fileId The file ID
   * @param typeId The new type ID (optional)
   * @param categoryId The new category ID (optional)
   * @returns Updated file details
   */
  updateFileTypeAndCategory: (fileId: string, typeId?: string, categoryId?: string): Promise<ApiResponse<FileDto>> => {
    const params = new URLSearchParams();
    if (typeId) params.append('typeId', typeId);
    if (categoryId) params.append('categoryId', categoryId);
    
    return fetchData<ApiResponse<FileDto>>(`${SERVER_API_BASE_URL}/${fileId}/type-category?${params.toString()}`, {
      method: 'PUT',
    });
  },

autoDownloadFileById: (fileId: string)  => {
    filesApiClient.getFileDownloadUrlById(fileId)
      .then((response) => {
        console.log('File fetched:', response);
        // if response is  a valid URL, download it
        if (response) {
          const link = document.createElement('a');
          link.href = response;
          link.download = '';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((error) => {
        console.error('Error fetching file:', error);
      });
  }, 


};
