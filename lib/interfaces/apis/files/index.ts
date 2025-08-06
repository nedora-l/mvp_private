import { HateoasResponse } from '@/lib/services/server';
import { HateoasPagination  } from '../common';

export * from './common';

export interface FileDto {
id?: string;
accessType?: string;
organizationId: string;
createdById?: string;
createdByUsername?: string;
createdByAvatar?: string;
createdByName?: string;
typeId?: string | null;
typeTitle?: string | null;
categoryId?: string | null;
categoryTitle?: string | null;
createdAt: string;
filePath?: string;
bucketName?: string | null;
objectName?: string | null;
filePublicUrl?: string | null;
expiresAt?: string | null;
fileMetadata?: string;
parentFileId?: string | null;
pageNumber?: number | null;
derivativeCategory?: string | null;
fullStoragePath?: string;
downloadUrl?: string | null;
fileSize?: number | null;
contentType?: string | null;
originalFilename?: string | null;
}

export interface FileFolderDto {
id?: string;
organizationId: string;
parentFolderId?: string | null;
parentFolderTitle?: string | null;
title: string;
path?: string;
description?: string;
updatedAt?: string | null;
fileCount?: number;
subFolders?: FileFolderDto[];
}

// File Category DTOs
export interface FileCategoryDto {
  id?: string;
  organizationId: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFileCategoryRequestDto {
  title: string;
  description?: string;
}

export interface UpdateFileCategoryRequestDto {
  title?: string;
  description?: string;
}

// File Type DTOs
export interface FileTypeDto {
  id?: string;
  organizationId: string;
  name: string;
  description?: string;
  mimeTypes?: string[];
  maxFileSize?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFileTypeRequestDto {
  name: string;
  description?: string;
  mimeTypes?: string[];
  maxFileSize?: number;
}

export interface UpdateFileTypeRequestDto {
  name?: string;
  description?: string;
  mimeTypes?: string[];
  maxFileSize?: number;
}

// File Request DTOs
export interface UpdateFileRequestDto {
  fileMetadata?: string;
  typeId?: string;
  categoryId?: string;
  customPath?: string;
  parentFolderId?: string;
}

export interface CreateFileFolderRequestDto {
    parentFolderId?: string;
    title: string;
    description?: string;
    path?: string;
}

export interface UpdateFileFolderRequestDto {
  title?: string;
  description?: string;
  parentFolderId?: string;
  path?: string;
}

export interface FileUploadRequestDto {
    file: File;
    typeId?: string;
    folderId?: string;
    customPath?: string;
    metadata?: string;
}

// Response DTOs for file operations
export interface FileDownloadUrlResponseDto {
  downloadUrl: string;
  expiresAt?: string;
}

// Additional pagination and filter interfaces
export interface FileFilterDto {
  categoryId?: string;
  typeId?: string;
  folderId?: string;
  dateFrom?: string;
  dateTo?: string;
  fileSize?: number;
  contentType?: string;
}

// =========================
// FILE COMMENT DTOs
// =========================

/**
 * File Comment DTO - represents a comment on a file
 */
export interface FileCommentDto {
  id: string;
  content: string;
  fileId: string;
  fileName?: string;
  parentCommentId?: string;
  createdByUsername: string,
  createdByName: string,
  createdByAvatar: string,
  updatedById: null,
  updatedByUsername: null,
  
  organization: {
    id: number;
    name: string;
  };
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  isDeleted: boolean;
  
  // Optional nested replies (for convenience methods)
  replies?: FileCommentDto[];
  
  // HATEOAS links
  _links?: {
    self?: { href: string };
    file?: { href: string };
    replies?: { href: string };
    parent?: { href: string };
  };
}

/**
 * Create File Comment Request DTO
 */
export interface CreateFileCommentRequestDto {
  fileId: string;
  content: string;
  parentCommentId?: string;
}

/**
 * Update File Comment Request DTO
 */
export interface UpdateFileCommentRequestDto {
  content: string;
}

/**
 * File Comment Response with HATEOAS support
 */
export interface FileCommentResponse  {
  _embedded?: {
    fileCommentDtoList?: FileCommentDto[];
  };_links: {
      self: { href: string };
      first?: { href: string };
      prev?: { href: string };
      next?: { href: string };
      last?: { href: string };
    };
    page?: HateoasPagination;
}

/**
 * Extended FileCommentDto with additional UI properties
 */
export interface FileCommentWithReplies extends FileCommentDto {
  replies: FileCommentDto[];
  repliesCount: number;
  isExpanded?: boolean;
  isEditing?: boolean;
  isReplying?: boolean;
}

/**
 * Comment statistics for a file
 */
export interface FileCommentStats {
  fileId: string;
  totalComments: number;
  totalReplies: number;
  lastCommentAt?: string;
  mostRecentComment?: {
    id: string;
    content: string;
    createdBy: string;
    createdAt: string;
  };
}

/**
 * Comment thread structure for nested display
 */
export interface CommentThread {
  rootComment: FileCommentDto;
  replies: FileCommentDto[];
  totalReplies: number;
  hasMoreReplies: boolean;
}

/**
 * Pagination parameters specific to comments
 */
export interface CommentPagination extends HateoasPagination {
  sortBy?: 'createdAt' | 'updatedAt' | 'content';
  sortDir?: 'asc' | 'desc';
  includeReplies?: boolean;
}

/**
 * Comment search/filter parameters
 */
export interface CommentSearchParams {
  fileId?: string;
  userId?: number;
  organizationId?: number;
  content?: string;
  dateFrom?: string;
  dateTo?: string;
  includeDeleted?: boolean;
  parentCommentId?: string;
}

/**
 * Bulk comment operations request
 */
export interface BulkCommentOperationRequest {
  commentIds: string[];
  operation: 'delete' | 'restore' | 'archive';
  reason?: string;
}

/**
 * Comment moderation DTO
 */
export interface CommentModerationDto {
  commentId: string;
  action: 'approve' | 'reject' | 'flag' | 'delete';
  reason?: string;
  moderatorNote?: string;
}

/**
 * Comment notification DTO
 */
export interface CommentNotificationDto {
  id: string;
  type: 'new_comment' | 'reply' | 'mention' | 'like';
  commentId: string;
  fileId: string;
  fileName: string;
  fromUser: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  toUser: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Comment activity summary
 */
export interface CommentActivitySummary {
  userId: number;
  totalComments: number;
  totalReplies: number;
  filesCommentedOn: number;
  mostActiveFile?: {
    id: string;
    name: string;
    commentCount: number;
  };
  recentActivity: {
    commentsThisWeek: number;
    commentsThisMonth: number;
    lastCommentAt?: string;
  };
}

/**
 * File with comment metadata
 */
export interface FileWithCommentMetadata extends FileDto {
  commentStats: {
    totalComments: number;
    totalReplies: number;
    lastCommentAt?: string;
    hasUnreadComments?: boolean;
    userCommentCount: number;
  };
  recentComments?: FileCommentDto[];
}

// =========================
// UPDATED EXISTING DTOs TO INCLUDE COMMENTS
// =========================

/**
 * Extended FileDto with comment information
 */
export interface ExtendedFileDto extends FileDto {
  // Add comment-related fields to existing FileDto
  commentsEnabled?: boolean;
  commentCount?: number;
  lastCommentAt?: string;
  hasUnreadComments?: boolean;
  
  // Optional embedded comments for detailed views
  recentComments?: FileCommentDto[];
  
  // Comment permissions for current user
  canComment?: boolean;
  canModerateComments?: boolean;
}

/**
 * File list item with comment summary
 */
export interface FileListItemDto extends FileDto {
  commentSummary?: {
    count: number;
    lastCommentAt?: string;
    hasUnread?: boolean;
  };
}

// =========================
// API RESPONSE TYPES
// =========================

/**
 * API Response wrapper for single comment
 */
export interface ApiCommentResponse {
  success: boolean;
  data: FileCommentDto;
  message?: string;
  timestamp: string;
}

/**
 * API Response wrapper for comment list
 */
export interface ApiCommentListResponse {
  success: boolean;
  data: HateoasResponse<FileCommentDto>;
  message?: string;
  timestamp: string;
}

/**
 * API Response wrapper for comment operations
 */
export interface ApiCommentOperationResponse {
  success: boolean;
  message: string;
  commentId?: string;
  timestamp: string;
}

/**
 * Error response for comment operations
 */
export interface CommentErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  timestamp: string;
}

// =========================
// FORM INTERFACES
// =========================

/**
 * Form data for creating a new comment
 */
export interface CommentFormData {
  content: string;
  parentCommentId?: string;
  attachments?: File[];
  mentions?: number[]; // User IDs mentioned in the comment
}

/**
 * Form validation errors for comments
 */
export interface CommentFormErrors {
  content?: string;
  general?: string;
}

/**
 * Comment form state
 */
export interface CommentFormState {
  data: CommentFormData;
  errors: CommentFormErrors;
  isSubmitting: boolean;
  isValid: boolean;
}

// =========================
// UI STATE INTERFACES
// =========================

/**
 * Comment component state
 */
export interface CommentComponentState {
  comments: FileCommentDto[];
  loading: boolean;
  error?: string;
  hasMore: boolean;
  currentPage: number;
  sortBy: 'createdAt' | 'updatedAt';
  sortDir: 'asc' | 'desc';
  filter: CommentSearchParams;
  selectedComments: string[];
  replyingTo?: string;
  editingComment?: string;
}

/**
 * Comment thread state for nested views
 */
export interface CommentThreadState {
  rootComments: FileCommentDto[];
  expandedThreads: Set<string>;
  loadingReplies: Set<string>;
  replyForms: Map<string, CommentFormState>;
  editForms: Map<string, CommentFormState>;
}

/**
 * Comment preferences/settings
 */
export interface CommentPreferences {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  autoExpandReplies: boolean;
  defaultSortOrder: 'newest' | 'oldest';
  commentsPerPage: number;
  showUserAvatars: boolean;
  enableMentions: boolean;
}


export interface UpdateFileRequestDto {
  // Basic metadata fields
  typeId?: string;
  categoryId?: string;
  folderId?: string;
  expiresAt?: string; // ISO date string
  metadata?: string;
  accessType?: FileAccessType;
  originalFilename?: string;
  
  // For derivative files
  parentFileId?: string;
  pageNumber?: number;
  derivativeCategory?: string;
  
  // For file content replacement
  newFile?: File;
  replaceContent?: boolean;
  
  // Custom path update
  customPath?: string;
  
  // Validation flags
  validateFileType?: boolean;
  preserveOriginalPath?: boolean;
}

export interface UpdateFileMetadataRequestDto {
  typeId?: string;
  categoryId?: string;
  folderId?: string;
  accessType?: FileAccessType;
  metadata?: string;
  originalFilename?: string;
  
  // For derivative files
  parentFileId?: string;
  pageNumber?: number;
  derivativeCategory?: string;
}

export interface ReplaceFileContentRequestDto {
  newFile: File;
  customPath?: string;
  preserveOriginalFilename?: boolean;
  validateFileType?: boolean;
  metadata?: string; // Optional additional metadata for the replacement
}

export interface UpdateFileExpirationRequestDto {
  expiresAt?: string; // ISO date string
  removeExpiration?: boolean; // Set to true to remove expiration
}

export interface RenameFileRequestDto {
  newFilename: string;
  updateStoragePath?: boolean; // Whether to update the storage path as well
}

export interface UpdateFileCustomMetadataRequestDto {
  customMetadata?: Record<string, any>;
  replaceExisting?: boolean; // If true, replace all metadata; if false, merge
  keysToRemove?: string[]; // Keys to remove from metadata
}

export interface UpdateFileDerivativeRequestDto {
  parentFileId?: string;
  pageNumber?: number;
  derivativeCategory?: string;
  unlinkFromParent?: boolean; // Set to true to make this a standalone file
}

export interface BulkFileUpdateRequestDto {
  fileIds: string[];
  operation: 'move' | 'change_access' | 'change_type' | 'delete' | 'archive' | 'rename' | 'update_expiration';
  
  // For move operation
  targetFolderId?: string;
  
  // For change access operation
  accessType?: string;
  
  // For change type operation
  typeId?: string;
  
  // For category change
  categoryId?: string;
  
  // General metadata update
  metadata?: string;
  
  // For archive operation
  archive?: boolean;
  
  // For rename operation
  filenamePrefix?: string;
  filenameSuffix?: string;
  
  // For expiration update
  expiresAt?: string; // ISO date string
  removeExpiration?: boolean;
}

// Response interfaces
export interface FileUpdateResponse {
  success: boolean;
  data?: FileDto;
  error?: string;
}

export interface BulkFileUpdateResponse {
  success: boolean;
  data?: FileDto[];
  error?: string;
  failedFiles?: string[]; // IDs of files that failed to update
}

// File access control types
export enum FileAccessType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  INTERNAL = 'INTERNAL'
}