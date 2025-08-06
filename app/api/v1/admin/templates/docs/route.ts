import { NextRequest, NextResponse } from 'next/server'; 
import { ApiResponse, HateoasPagination } from '@/lib/interfaces/apis/common';
import { 
  dynDocumentServerService, 
  PaginatedDocumentTemplatesResponse, 
  CreateDocumentTemplateRequest, 
  UpdateDocumentTemplateRequest, 
  DocumentTemplateDto
} from '@/lib/services/server/dyn_document/dynDocument.server.service';

export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    // Extract search parameters from URL
    const { searchParams } = new URL(request.url);
    const params: HateoasPagination = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 0,
      size: searchParams.get('size') ? parseInt(searchParams.get('size')!) : 10,
      sortBy: searchParams.get('sortBy') || undefined,
      sortDir: (searchParams.get('sortDir') as 'asc' | 'desc') || undefined,
      query: searchParams.get('searchTerm') || undefined,
    };
    const apiResponse = await dynDocumentServerService.getAllTemplates(token, params);
    const response: ApiResponse<DocumentTemplateDto[]> = {
      status: 200,
      message: 'Document templates retrieved successfully',
      data: apiResponse,
      type: 'COLLECTION',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Email Templates API error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Internal server error', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const body: CreateDocumentTemplateRequest = await request.json();
    // Basic validation
    if (!body.name || !body.displayName || !body.content || !body.format || !body.status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const created = await dynDocumentServerService.createTemplate(token, body);
    return NextResponse.json({ status: 201, message: 'Template created', data: created, type: 'ITEM' }, { status: 201 });
  } catch (error) {
    console.error('Create Template API error:', error);
    return NextResponse.json({ status: 500, message: 'Internal server error', data: null, type: 'ERROR' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Missing template ID' }, { status: 400 });
    }
    const body: UpdateDocumentTemplateRequest = await request.json();
    const updated = await dynDocumentServerService.updateTemplate(token, Number(id), body);
    return NextResponse.json({ status: 200, message: 'Template updated', data: updated, type: 'ITEM' }, { status: 200 });
  } catch (error) {
    console.error('Update Template API error:', error);
    return NextResponse.json({ status: 500, message: 'Internal server error', data: null, type: 'ERROR' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Missing template ID' }, { status: 400 });
    }
    const deleted = await dynDocumentServerService.deleteTemplate(token, Number(id));
    return NextResponse.json({ status: 200, message: 'Template deleted', data: deleted, type: 'ITEM' }, { status: 200 });
  } catch (error) {
    console.error('Delete Template API error:', error);
    return NextResponse.json({ status: 500, message: 'Internal server error', data: null, type: 'ERROR' }, { status: 500 });
  }
}
