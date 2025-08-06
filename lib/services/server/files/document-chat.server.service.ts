import { httpClient } from "@/lib/utils/http-client";


export const DOCUMENT_CHAT_API_BASE_URL = '/api/v1/document-chat';

// DTO representing a document reference in chat responses
export interface DocumentReference {
  fileName: string;
  documentId: string;
  excerpt: string;
  relevanceScore: number;
  pageNumber?: number;
  section?: string;
  metadata?: Record<string, any>;
  referenceId?: string; // e.g., [REF1], [REF2]
  contextualScore?: number;
  usedInResponse?: boolean;
}

// Internal DTO for holding document context and references during chat processing
export interface DocumentContextResult {
  context: string;
  references: DocumentReference[];
}

// Enhanced chat response DTO that includes document references
export interface DocumentChatResponse {
  message: string;
  references: DocumentReference[];
  conversationId: string;
  timestamp: string; // ISO string
  isDocumentChat: boolean;
  highlightedMessage?: string;
}

// Chat request DTO
export interface DocumentChatRequest {
  message: string;
  documentIds?: string[];
  similarityThreshold?: number;
  maxDocuments?: number;
  locale?: string;
  metadata?: Record<string, any>;
}

export class DocumentChatServerService {
  getHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async chatWithDocuments(
    accessToken: string,
    request: DocumentChatRequest,
    chatSessionId?: string
  ): Promise<DocumentChatResponse> {
    const url = chatSessionId
      ? `${DOCUMENT_CHAT_API_BASE_URL}/chat?chatSessionId=${chatSessionId}`
      : `${DOCUMENT_CHAT_API_BASE_URL}/chat`;
    const response = await httpClient.post<DocumentChatResponse>(url, request, { headers: this.getHeaders(accessToken) });
    return response.data;
  }

  async processDocument(accessToken: string, fileId: string): Promise<DocumentContextResult> {
    const response = await httpClient.post<DocumentContextResult>(
      `${DOCUMENT_CHAT_API_BASE_URL}/documents/${fileId}/process`,
      {},
      { headers: this.getHeaders(accessToken) }
    );
    return response.data;
  }

  async getProcessingStatus(accessToken: string, fileId: string): Promise<string> {
    const response = await httpClient.get<string>(
      `${DOCUMENT_CHAT_API_BASE_URL}/documents/${fileId}/status`,
      { headers: this.getHeaders(accessToken) }
    );
    return response.data;
  }

  async getProcessedDocuments(accessToken: string): Promise<DocumentReference[]> {
    const response = await httpClient.get<DocumentReference[]>(
      `${DOCUMENT_CHAT_API_BASE_URL}/documents`,
      { headers: this.getHeaders(accessToken) }
    );
    return response.data;
  }

  async removeDocument(accessToken: string, fileId: string): Promise<void> {
    await httpClient.delete(
      `${DOCUMENT_CHAT_API_BASE_URL}/documents/${fileId}`,
      { headers: this.getHeaders(accessToken) }
    );
  }

  async getPopularDocuments(accessToken: string): Promise<DocumentReference[]> {
    const response = await httpClient.get<DocumentReference[]>(
      `${DOCUMENT_CHAT_API_BASE_URL}/analytics/popular-documents`,
      { headers: this.getHeaders(accessToken) }
    );
    return response.data;
  }

  async getDocumentRelevanceScore(accessToken: string, documentId: string): Promise<number> {
    const response = await httpClient.get<number>(
      `${DOCUMENT_CHAT_API_BASE_URL}/documents/${documentId}/relevance-score`,
      { headers: this.getHeaders(accessToken) }
    );
    return response.data;
  }
}

export const documentChatServerService = new DocumentChatServerService();
