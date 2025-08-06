import { NextRequest, NextResponse } from 'next/server';
import { 
  dynDocumentServerService, 
  DocumentTemplateDto, 
  UpdateDocumentTemplateRequest 
} from '@/lib/services/server/dyn_document/dynDocument.server.service';

export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: 'Missing or invalid template ID' }, { status: 400 });
    }
    const template = await dynDocumentServerService.getTemplateById(token, id);
    return NextResponse.json({ status: 200, message: 'Template retrieved', data: template, type: 'ITEM' }, { status: 200 });
  } catch (error) {
    console.error('Get Template API error:', error);
    return NextResponse.json({ status: 500, message: 'Internal server error', data: null, type: 'ERROR' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: 'Missing or invalid template ID' }, { status: 400 });
    }
    const body: UpdateDocumentTemplateRequest = await request.json();
    const updated = await dynDocumentServerService.updateTemplate(token, id, body);
    return NextResponse.json({ status: 200, message: 'Template updated', data: updated, type: 'ITEM' }, { status: 200 });
  } catch (error) {
    console.error('Update Template API error:', error);
    return NextResponse.json({ status: 500, message: 'Internal server error', data: null, type: 'ERROR' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: 'Missing or invalid template ID' }, { status: 400 });
    }
    const deleted = await dynDocumentServerService.deleteTemplate(token, id);
    return NextResponse.json({ status: 200, message: 'Template deleted', data: deleted, type: 'ITEM' }, { status: 200 });
  } catch (error) {
    console.error('Delete Template API error:', error);
    return NextResponse.json({ status: 500, message: 'Internal server error', data: null, type: 'ERROR' }, { status: 500 });
  }
}
