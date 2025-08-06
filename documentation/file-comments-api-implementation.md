# File Comments API Implementation

## Overview
This document describes the implementation of the file comments system for the DAWS application. The system provides comprehensive comment functionality for files, including creating, reading, updating, deleting comments, and managing nested replies.

## API Endpoints

### File Comments
- `GET /api/v1/files/{fileId}/comments` - Get comments for a file (paginated)
- `POST /api/v1/files/{fileId}/comments` - Create a comment on a file
- `GET /api/v1/files/{fileId}/comments/with-replies` - Get comments with nested replies (optimized)

### Individual Comment Operations
- `GET /api/v1/files/comments/{commentId}` - Get a specific comment by ID
- `PUT /api/v1/files/comments/{commentId}` - Update a comment
- `DELETE /api/v1/files/comments/{commentId}` - Delete a comment

### Comment Replies
- `GET /api/v1/files/comments/{commentId}/replies` - Get replies to a comment (paginated)
- `POST /api/v1/files/comments/{commentId}/replies` - Reply to a comment

### User Comments
- `GET /api/v1/files/user/comments` - Get user's comments across all files (paginated)

## Client Service Methods

The `filesApiClient` has been extended with the following comment-related methods:

### Basic Comment Operations
- `getFileComments(fileId, pagination?)` - Get comments for a file
- `createFileComment(fileId, commentData)` - Create a comment
- `getCommentById(commentId)` - Get specific comment
- `updateComment(commentId, updateData)` - Update a comment
- `deleteComment(commentId)` - Delete a comment

### Reply Operations  
- `getCommentReplies(commentId, pagination?)` - Get replies to a comment
- `replyToComment(parentCommentId, replyData)` - Reply to a comment

### User Comments
- `getUserComments(pagination?)` - Get user's comments

### Utility Methods
- `getFileCommentsCount(fileId)` - Get comment count for a file
- `getCommentRepliesCount(commentId)` - Get reply count for a comment
- `getFileCommentsWithReplies(fileId, pagination?)` - Get comments with nested replies (client-side)
- `getFileCommentsWithRepliesOptimized(fileId, pagination?)` - Get comments with nested replies (server-optimized)

## Data Transfer Objects (DTOs)

### FileCommentDto
```typescript
interface FileCommentDto {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  fileId: string;
  parentCommentId?: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  likesCount?: number;
  repliesCount?: number;
  replies?: FileCommentDto[]; // For nested comments
  // Additional metadata fields
}
```

### CreateFileCommentRequestDto
```typescript
interface CreateFileCommentRequestDto {
  content: string;
  parentCommentId?: string; // For replies
  metadata?: Record<string, any>;
}
```

### UpdateFileCommentRequestDto
```typescript
interface UpdateFileCommentRequestDto {
  content: string;
  metadata?: Record<string, any>;
}
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Pagination
Most list endpoints support pagination with the following parameters:
- `page` - Page number (0-based, default: 0)
- `size` - Page size (default: 10)
- `sortBy` - Sort field (default: 'createdAt')
- `sortDir` - Sort direction: 'asc' or 'desc' (default: varies by endpoint)

## Error Handling
All endpoints return standardized error responses:
```typescript
{
  status: number;
  message: string;
  data: null;
  type: "ERROR";
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (for POST operations)
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Usage Examples

### Creating a Comment
```typescript
const commentData = {
  content: "This is a great document!"
};

const response = await filesApiClient.createFileComment("file-123", commentData);
console.log("Created comment:", response.data);
```

### Getting Comments with Replies
```typescript
const comments = await filesApiClient.getFileCommentsWithRepliesOptimized("file-123", {
  page: 0,
  size: 20,
  sortBy: "createdAt",
  sortDir: "desc"
});
console.log("Comments with replies:", comments.data);
```

### Replying to a Comment
```typescript
const replyData = {
  content: "I agree with your comment!"
};

const response = await filesApiClient.replyToComment("comment-456", replyData);
console.log("Created reply:", response.data);
```

## Security Considerations
- All operations are authenticated
- Users can only modify their own comments
- File access permissions are enforced for comment operations
- Input validation is performed on all comment content

## Server Service Integration
The client service integrates with the existing `FilesServerService` which handles:
- Upstream API communication
- Token management  
- Error handling and logging
- Response data transformation

## Files Structure
```
app/api/v1/files/
├── [id]/
│   └── comments/
│       ├── route.ts                    # File comments endpoints
│       └── with-replies/
│           └── route.ts                # Optimized comments with replies
├── comments/
│   └── [id]/
│       ├── route.ts                    # Individual comment operations
│       └── replies/
│           └── route.ts                # Comment replies
└── user/
    └── comments/
        └── route.ts                    # User comments

lib/services/
├── server/files/
│   └── files.server.service.ts        # Server service (already implemented)
└── client/files/
    └── files.client.service.ts        # Client service (updated)
```

## Next Steps
1. Test the API endpoints with actual data
2. Implement comment validation rules
3. Add comment moderation features if needed
4. Implement real-time comment updates using WebSockets
5. Add comment analytics and reporting
6. Implement comment search functionality
