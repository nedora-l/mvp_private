import { CreateChatSessionRequestDto,
  ChatSessionResponseDto,
  ChatSessionListItemDto,
  UpdateChatTitleRequestDto,
  AddMessageRequestDto,
  ChatMessageResponseDto,
  ChatMessageDto, } from "@/lib/interfaces/apis/chat";
import { getStoredToken } from "../../auth/token-storage";
import { ApiResponse, HateoasResponse } from "@/lib/interfaces/apis/common";

export const SERVER_API_BASE_URL = '/api/v1/chat'; 


/**
 * Fetches data from the API.
 * @param url The URL to fetch.
 * @param options The fetch options.
 * @returns The JSON response.
 * @throws Error if the fetch fails or the response is not ok.
 */
async function fetchData<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token =  getStoredToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    },
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
 * Client for interacting with the Chat API.
 */
export const chatApiClient = {
  /**
   * Creates a new chat session.
   * POST /api/v1/chats
   * @param request The request body.
   * @returns The created chat session.
   */
  createChatSession: (request: CreateChatSessionRequestDto): Promise<ApiResponse<ChatSessionResponseDto>> => {
    return fetchData<ApiResponse<ChatSessionResponseDto>>(SERVER_API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Gets all chat sessions for the authenticated user.
   * GET /api/v1/chats
   * @returns A list of chat session summaries.
   */
  getUserChatSessions: (): Promise<ApiResponse<HateoasResponse<ChatSessionListItemDto>>> => {
    return fetchData<ApiResponse<HateoasResponse<ChatSessionListItemDto>>>(SERVER_API_BASE_URL);
  },

  getUserChatSessionPages: ({page,size}: {page: number, size: number}): Promise<ApiResponse<HateoasResponse<ChatSessionListItemDto>>> => {
    return fetchData<ApiResponse<HateoasResponse<ChatSessionListItemDto>>>(`${SERVER_API_BASE_URL}?page=${page}&size=${size}`);
  },

  /**
   * Gets a specific chat session by ID.
   * GET /api/v1/chats/{chatId}
   * @param chatId The ID of the chat session.
   * @returns The chat session details.
   */
  getChatSessionById: (chatId: string): Promise<ApiResponse<ChatSessionResponseDto>> => {
    return fetchData<ApiResponse<ChatSessionResponseDto>>(`${SERVER_API_BASE_URL}/${chatId}`);
  },

  /**
   * Deletes a chat session.
   * DELETE /api/v1/chats/{chatId}
   * @param chatId The ID of the chat session.
   */
  deleteChatSession: (chatId: string): Promise<void> => {
    return fetchData<void>(`${SERVER_API_BASE_URL}/${chatId}`, { method: 'DELETE' });
  },

  /**
   * Updates the title of a chat session.
   * PUT /api/v1/chats/{chatId}/title
   * @param chatId The ID of the chat session.
   * @param request The request body.
   * @returns The updated chat session.
   */
  updateChatSessionTitle: (
    chatId: string,
    request: UpdateChatTitleRequestDto
  ): Promise<ChatSessionResponseDto> => {
    return fetchData<ChatSessionResponseDto>(`${SERVER_API_BASE_URL}/${chatId}/title`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },

  /**
   * Adds a new message to an existing chat session.
   * POST /api/v1/chats/{chatId}/messages
   * @param chatId The ID of the chat session.
   * @param request The request body.
   * @returns The created chat message.
   */
  addMessageToChat: (
    chatId: string,
    request: AddMessageRequestDto
  ): Promise<ApiResponse<ChatMessageResponseDto>> => {
    if(!request.chatSessionId) {
      request.chatSessionId = chatId;
    }
    return fetchData<ApiResponse<ChatMessageResponseDto>>(`${SERVER_API_BASE_URL}/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Adds a new message and streams the AI response (raw string chunks).
   * POST /api/v1/chats/{chatId}/messages/stream
   * @param chatId The ID of the chat session.
   * @param request The request body.
   * @returns An AsyncIterable<string> for the streamed response chunks.
   */
  streamMessageToChat: async function* (
    accessToken: string,
    chatId: string,
    request: AddMessageRequestDto
  ): AsyncIterable<string> {
    const response = await fetch(`${SERVER_API_BASE_URL}/${chatId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorData || response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        // SSE format: data: {json_payload}\n\n
        // Multiple events can be in a single chunk
        const chunkLines = decoder.decode(value, { stream: true }).split('\n');
        for (const line of chunkLines) {
          if (line.startsWith('data:')) {
            const jsonData = line.substring(5).trim();
            if (jsonData) {
                 // The endpoint /messages/stream returns Flux<String> which are raw strings,
                 // not JSON objects. So we directly yield the jsonData if it's not an empty string.
                yield jsonData;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },

  /**
   * Adds a new message and streams the AI response as ChatMessageDto objects.
   * POST /api/v1/chats/{chatId}/messages/rtstream
   * @param chatId The ID of the chat session.
   * @param request The request body.
   * @returns An AsyncIterable<ChatMessageDto> for the streamed response objects.
   */
  streamMessages: async function* (
    chatId: string,
    request: AddMessageRequestDto
  ): AsyncIterable<ChatMessageDto> {
    const response = await fetch(`${SERVER_API_BASE_URL}/${chatId}/messages/rtstream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorData || response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });

        // Process buffer line by line for SSE events
        let eolIndex;
        while ((eolIndex = buffer.indexOf('\n')) >= 0) {
          const line = buffer.substring(0, eolIndex).trim();
          buffer = buffer.substring(eolIndex + 1);

          if (line.startsWith('data:')) {
            const jsonData = line.substring(5).trim();
            if (jsonData) {
              try {
                yield JSON.parse(jsonData) as ChatMessageDto;
              } catch (e) {
                console.error('Failed to parse streamed JSON:', jsonData, e);
                // Decide how to handle parse errors: skip, throw, or yield an error object
              }
            }
          }
        }
      }
      // Process any remaining buffer content after the stream is finished
      if (buffer.trim().startsWith('data:')) {
        const jsonData = buffer.trim().substring(5).trim();
        if (jsonData) {
          try {
            yield JSON.parse(jsonData) as ChatMessageDto;
          } catch (e) {
            console.error('Failed to parse final streamed JSON:', jsonData, e);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};
 