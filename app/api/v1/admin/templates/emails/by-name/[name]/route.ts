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

// GET /api/v1/admin/templates/emails/by-name/[name] - Get template by name
export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const resolvedParams = await params;
    const templateName = decodeURIComponent(resolvedParams.name);
    
    const template = await emailTemplateServerService.getTemplateByName(token, templateName);
    
    const response: ApiResponse<EmailTemplateDto> = {
      status: 200,
      message: `Email template '${templateName}' retrieved successfully`,
      data: template,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Get Email Template by Name error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to retrieve email template by name', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
