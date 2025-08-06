import { NextRequest, NextResponse } from 'next/server'; 
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { 
  CreateEmailTemplateRequest, 
  EmailTemplateDto, 
  EmailTemplateSearchParams,
  PaginatedEmailTemplatesResponse,
  emailTemplateServerService 
} from '@/lib/services/server/email_templates';

function extractToken(req: NextRequest): string | null {
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
    const params: EmailTemplateSearchParams = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 0,
      size: searchParams.get('size') ? parseInt(searchParams.get('size')!) : 10,
      sortBy: searchParams.get('sortBy') || undefined,
      sortDir: (searchParams.get('sortDir') as 'asc' | 'desc') || undefined,
      status: searchParams.get('status') as any || undefined,
      category: searchParams.get('category') || undefined,
      searchTerm: searchParams.get('searchTerm') || undefined,
    };

    const apiResponse = await emailTemplateServerService.getAllTemplates(token, params);
    
    const response: ApiResponse<PaginatedEmailTemplatesResponse> = {
      status: 200,
      message: 'Email templates retrieved successfully',
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
    console.log('Creating new Email Template...');

    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const body: CreateEmailTemplateRequest = await request.json();
    console.log('Email Template body:', body);

    const newTemplate = await emailTemplateServerService.createTemplate(token, body);
    
    const response: ApiResponse<EmailTemplateDto> = {
      status: 201,
      message: 'Email Template created successfully',
      data: newTemplate,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Create Email Template error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to create Email Template', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
