import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { 
  EmailTemplateDto, 
  UpdateEmailTemplateRequest,
  emailTemplateServerService 
} from '@/lib/services/server/email_templates';

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// GET /api/v1/admin/templates/emails/[id] - Get template by ID
export async function GET(
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

    const template = await emailTemplateServerService.getTemplateById(token, templateId);
    
    const response: ApiResponse<EmailTemplateDto> = {
      status: 200,
      message: 'Email template retrieved successfully',
      data: template,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Get Email Template error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to retrieve email template', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}

// PUT /api/v1/admin/templates/emails/[id] - Update template
export async function PUT(
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

    const body: UpdateEmailTemplateRequest = await request.json();
    body.id = templateId; // Ensure ID is set

    const updatedTemplate = await emailTemplateServerService.updateTemplate(token, templateId, body);
    
    const response: ApiResponse<EmailTemplateDto> = {
      status: 200,
      message: 'Email template updated successfully',
      data: updatedTemplate,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Update Email Template error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to update email template', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}

// DELETE /api/v1/admin/templates/emails/[id] - Delete template
export async function DELETE(
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

    const result = await emailTemplateServerService.deleteTemplate(token, templateId);
    
    const response: ApiResponse<{ message: string }> = {
      status: 200,
      message: 'Email template deleted successfully',
      data: result,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Delete Email Template error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to delete email template', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
