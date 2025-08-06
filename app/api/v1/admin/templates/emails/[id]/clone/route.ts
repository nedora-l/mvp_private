import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { 
  EmailTemplateDto,
  CloneTemplateRequest,
  emailTemplateServerService 
} from '@/lib/services/server/email_templates';

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// POST /api/v1/admin/templates/emails/[id]/clone - Clone template
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const resolvedParams = await params;
    const templateId = parseInt(resolvedParams.id);
    
    if (isNaN(templateId)) {
      return NextResponse.json({ 
        status: 400, 
        message: 'Invalid template ID', 
        data: null, 
        type: 'ERROR' 
      }, { status: 400 });
    }

    // Get clone parameters from query string or request body
    const { searchParams } = new URL(request.url);
    const cloneRequest: CloneTemplateRequest = {
      newName: searchParams.get('newName') || '',
      newDisplayName: searchParams.get('newDisplayName') || undefined,
    };

    // If no query params, try to get from body
    if (!cloneRequest.newName) {
      const body = await request.json();
      cloneRequest.newName = body.newName;
      cloneRequest.newDisplayName = body.newDisplayName;
    }

    if (!cloneRequest.newName) {
      return NextResponse.json({ 
        status: 400, 
        message: 'newName is required for cloning', 
        data: null, 
        type: 'ERROR' 
      }, { status: 400 });
    }
    
    const clonedTemplate = await emailTemplateServerService.cloneTemplate(token, templateId, cloneRequest);
    
    const response: ApiResponse<EmailTemplateDto> = {
      status: 201,
      message: 'Email template cloned successfully',
      data: clonedTemplate,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Clone Email Template error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to clone email template', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
