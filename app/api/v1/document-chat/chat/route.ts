import { NextRequest, NextResponse } from 'next/server';
import { documentChatServerService, DocumentChatRequest } from '@/lib/services/server/files/document-chat.server.service';

/**
 * Extract token from Authorization header
 */
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

export async function POST(req: NextRequest) {
  const token = extractToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const chatSessionId = req.nextUrl.searchParams.get('chatSessionId') || undefined;
    const chatRequest: DocumentChatRequest = body;
    const response = await documentChatServerService.chatWithDocuments(token, chatRequest, chatSessionId);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to chat with document' }, { status: 500 });
  }
}
