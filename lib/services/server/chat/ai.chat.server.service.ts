import { httpClient } from "@/lib/utils/http-client";
import { CreateChatSessionRequestDto,
  ChatSessionResponseDto,
  ChatSessionListItemDto,
  UpdateChatTitleRequestDto,
  AddMessageRequestDto,
  ChatMessageResponseDto,
  ChatMessageDto, } from "@/lib/interfaces/apis/chat";
import { DEFAULT_BASE_URL } from "@/lib/constants/global";
import { HateoasResponse } from "@/lib/interfaces/apis";

export const SEREVER_API_BASE_URL = '/api/v1/chats'; 


export class AiChatServerService {

  getHeaders(accessToken: string) {
    return {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      };
  }

  /**
   * Creates a new chat session.
   * POST /api/v1/chats
   * @param request The request body.
   * @returns The created chat session.
   */
  async createChatSession( accessToken : string, request: CreateChatSessionRequestDto ): Promise<ChatSessionResponseDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<ChatSessionResponseDto>(`${SEREVER_API_BASE_URL}`, request, headers);
      return response.data;
    } catch (error) {
      console.error('AiChatServerService: createChatSession error:', error);
      throw error;
    }
  }


  /**
   * Gets all chat sessions for the authenticated user.
   * GET /api/v1/chats
   * @returns A list of chat session summaries.
   */
  async getUserChatSessions( accessToken : string ): Promise<HateoasResponse<ChatSessionListItemDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      console.log('headers:', headers);
      const response = await httpClient.get<HateoasResponse<ChatSessionListItemDto>>(`${SEREVER_API_BASE_URL}`,headers);
      console.log('response:', response);
      if (response.data) {
        console.log('Response data received:', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('AiChatServerService: getUserChatSessions error:', error);
      throw error;
    }
  }

  //{page,limit}: {page: number, limit: number}
  async getUserChatSessionPages(accessToken: string, { page, size }: { page: number; size: number }): Promise<HateoasResponse<ChatSessionListItemDto>> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.get<HateoasResponse<ChatSessionListItemDto>>(`${SEREVER_API_BASE_URL}?page=${page}&size=${size}`, headers);
      return response.data;
    } catch (error) {
      console.error('AiChatServerService: getUserChatSessionPages error:', error);
      throw error;
    }
  }

  /**
   * Gets a specific chat session by ID.
   * GET /api/v1/chats/{chatId}
   * @param chatId The ID of the chat session.
   * @returns The chat session details.
   */
  async getChatSessionById( accessToken : string, chatId: string ): Promise<ChatSessionResponseDto> {
    try {
      const headers = this.getHeaders(accessToken);
      // console.log('headers:', headers);
      const response = await httpClient.get<ChatSessionResponseDto>(`${SEREVER_API_BASE_URL}/${chatId}`, headers);
      // console.log('response:', response);
      // if (response.data) {
      //   console.log('Response data received:', JSON.stringify(response.data));
      // }
      return response.data;
    } catch (error) {
      console.error('AiChatServerService: getChatSessionById error:', error);
      throw error;
    }
  }

  /**
   * Deletes a chat session.
   * DELETE /api/v1/chats/{chatId}
   * @param accessToken The access token for authorization.
   * @param chatId The ID of the chat session.
   */
  async deleteChatSession(accessToken: string, chatId: string): Promise<void> {
    try {
      const headers = this.getHeaders(accessToken);
      await httpClient.delete<void>(`${SEREVER_API_BASE_URL}/${chatId}`, headers);
    } catch (error) {
      console.error('AiChatServerService: deleteChatSession error:', error);
      throw error;
    }
  }

  /**
   * Updates the title of a chat session.
   * PUT /api/v1/chats/{chatId}/title
   * @param accessToken The access token for authorization.
   * @param chatId The ID of the chat session.
   * @param request The request body.
   * @returns The updated chat session.
   */
  async updateChatSessionTitle(
    accessToken: string,
    chatId: string,
    request: UpdateChatTitleRequestDto
  ): Promise<ChatSessionResponseDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.put<ChatSessionResponseDto>(
        `${SEREVER_API_BASE_URL}/${chatId}/title`,
        request,
        headers
      );
      return response.data;
    } catch (error) {
      console.error('AiChatServerService: updateChatSessionTitle error:', error);
      throw error;
    }
  }

  /**
   * Adds a new message to an existing chat session.
   * POST /api/v1/chats/{chatId}/messages
   * @param accessToken The access token for authorization.
   * @param chatId The ID of the chat session.
   * @param request The request body.
   * @returns The created chat message.
   */
  async addMessageToChat(
    accessToken: string,
    chatId: string,
    request: AddMessageRequestDto
  ): Promise<ChatMessageResponseDto> {
    try {
      const headers = this.getHeaders(accessToken);
      const response = await httpClient.post<ChatMessageResponseDto>(
        `${SEREVER_API_BASE_URL}/${chatId}/messages`,
        request,
        headers
      );
      return response.data;
    } catch (error) {
      console.error('AiChatServerService: addMessageToChat error:', error);
      throw error;
    }
  }

  /**
   * Adds a new message and streams the AI response (raw string chunks).
   * POST /api/v1/chats/{chatId}/messages/stream
   * @param accessToken The access token for authorization.
   * @param chatId The ID of the chat session.
   * @param request The request body.
   * @returns An AsyncIterable<string> for the streamed response chunks.
   */
  async *streamMessageToChat(
    accessToken: string,
    chatId: string,
    request: AddMessageRequestDto
  ): AsyncIterable<string> {
    try {
      let baseUrl = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_BASE_URL;

      const response = await fetch(`${baseUrl}${SEREVER_API_BASE_URL}/${chatId}/messages/stream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunkLines = decoder.decode(value, { stream: true }).split('\\n');
        for (const line of chunkLines) {
          if (line.startsWith('data:')) {
            const jsonData = line.substring(5).trim();
            if (jsonData) {
              yield jsonData;
            }
          }
        }
      }
    } catch (error) {
      console.error('AiChatServerService: streamMessageToChat error:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  /**
   * Adds a new message and streams the AI response as ChatMessageDto objects.
   * POST /api/v1/chats/{chatId}/messages/rtstream
   * @param accessToken The access token for authorization.
   * @param chatId The ID of the chat session.
   * @param request The request body.
   * @returns An AsyncIterable<ChatMessageDto> for the streamed response objects.
   */
  async *streamMessages(
    accessToken: string,
    chatId: string,
    request: AddMessageRequestDto
  ): AsyncIterable<ChatMessageDto> {
    try {
      const response = await fetch(`${SEREVER_API_BASE_URL}/${chatId}/messages/rtstream`, {
        method: 'POST',
        headers: {
          ...(this.getHeaders(accessToken).headers),
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });

        let eolIndex;
        while ((eolIndex = buffer.indexOf('\\n')) >= 0) {
          const line = buffer.substring(0, eolIndex).trim();
          buffer = buffer.substring(eolIndex + 1);

          if (line.startsWith('data:')) {
            const jsonData = line.substring(5).trim();
            if (jsonData) {
              try {
                yield JSON.parse(jsonData) as ChatMessageDto;
              } catch (e) {
                console.error('AiChatServerService: Failed to parse streamed JSON:', jsonData, e);
                // Optionally, yield an error object or handle differently
              }
            }
          }
        }
      }
      // Process any remaining buffer content
      if (buffer.trim().startsWith('data:')) {
        const jsonData = buffer.trim().substring(5).trim();
        if (jsonData) {
          try {
            yield JSON.parse(jsonData) as ChatMessageDto;
          } catch (e) {
            console.error('AiChatServerService: Failed to parse final streamed JSON:', jsonData, e);
          }
        }
      }
    } catch (error) {
      console.error('AiChatServerService: streamMessages error:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}

// Export a default instance
export const aiChatServerService = new AiChatServerService();