// c:\Users\T.Rachid\dev\java\api-store\smart-store-apis\documentation\nextjs\libraries\chat\chatApi.dtos.ts

/**
 * Role of the message sender.
 */
export enum MessageRole {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
  SYSTEM = "SYSTEM", // Assuming SYSTEM role might be used
}

/**
 * DTO for creating a new chat session.
 * POST /api/v1/chats
 */
export interface CreateChatSessionRequestDto {
  initialMessage: string;
}

/**
 * DTO for representing a chat message.
 */
export interface ChatMessageResponseDto {
  id: string;
  role: MessageRole | string; // Allow string for flexibility if new roles are added on the backend
  content: string;
  contentMd?: string;
  suggestions?: string[]; // Optional suggestions for the message
  timestamp: string; // ISO 8601 date-time string
}

/**
 * DTO for representing a chat message with chatSessionId, potentially for streaming.
 * Used in POST /api/v1/chats/{chatId}/messages/rtstream
 */
export interface ChatMessageDto extends ChatMessageResponseDto {
  chatSessionId?: string; // Optional as it might not always be present depending on context
}

/**
 * DTO for the full response of a chat session, including messages.
 * GET /api/v1/chats/{chatId}
 * POST /api/v1/chats
 * PUT /api/v1/chats/{chatId}/title
 */
export interface ChatSessionResponseDto {
  id: string;
  userId: number | string; // Assuming userId can be number or string based on your Java Long
  title: string;
  createdAt: string; // ISO 8601 date-time string
  updatedAt: string; // ISO 8601 date-time string
  messages: ChatMessageResponseDto[];
}

/**
 * DTO for listing chat sessions (summary).
 * GET /api/v1/chats
 */
export interface ChatSessionListItemDto {
  id: string;
  userId: number | string;
  title: string;
  createdAt: string; // ISO 8601 date-time string
  updatedAt: string; // ISO 8601 date-time string
  lastMessageSnippet?: string;
}

/**
 * DTO for updating the title of a chat session.
 * PUT /api/v1/chats/{chatId}/title
 */
export interface UpdateChatTitleRequestDto {
  title: string;
}

/**
 * DTO for adding a new message to a chat session.
 * POST /api/v1/chats/{chatId}/messages
 * POST /api/v1/chats/{chatId}/messages/stream
 * POST /api/v1/chats/{chatId}/messages/rtstream
 */
export interface AddMessageRequestDto {
  chatSessionId?: string;
  content: string;
}
