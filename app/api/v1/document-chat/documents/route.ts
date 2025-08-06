import { NextRequest, NextResponse } from 'next/server';
import { documentChatServerService } from '@/lib/services/server/files/document-chat.server.service';

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

export async function GET(req: NextRequest) {
  const token = extractToken(req);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const docs = await documentChatServerService.getProcessedDocuments(token);
    return NextResponse.json(docs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to get processed documents' }, { status: 500 });
  }
}
