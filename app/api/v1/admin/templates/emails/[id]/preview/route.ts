import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { 
  EmailTemplatePreviewResponse,
  emailTemplateServerService 
} from '@/lib/services/server/email_templates';

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// POST /api/v1/admin/templates/emails/[id]/preview - Preview template with variables
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

    const variables: Record<string, any> = await request.json();
    
    const preview = await emailTemplateServerService.previewTemplate(token, templateId, variables);
    
    const response: ApiResponse<EmailTemplatePreviewResponse> = {
      status: 200,
      message: 'Email template preview generated successfully',
      data: preview,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Preview Email Template error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to generate email template preview', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
