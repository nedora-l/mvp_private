import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { 
  EmailTemplateDto,
  emailTemplateServerService 
} from '@/lib/services/server/email_templates';

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// POST /api/v1/admin/templates/emails/[id]/deactivate - Deactivate template
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

    const deactivatedTemplate = await emailTemplateServerService.deactivateTemplate(token, templateId);
    
    const response: ApiResponse<EmailTemplateDto> = {
      status: 200,
      message: 'Email template deactivated successfully',
      data: deactivatedTemplate,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Deactivate Email Template error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to deactivate email template', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
