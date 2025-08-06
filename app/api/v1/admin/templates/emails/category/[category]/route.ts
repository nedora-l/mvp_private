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

// GET /api/v1/admin/templates/emails/category/[category] - Get templates by category
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const resolvedParams = await params;
    const category = decodeURIComponent(resolvedParams.category);
    
    const templates = await emailTemplateServerService.getTemplatesByCategory(token, category);
    
    const response: ApiResponse<EmailTemplateDto[]> = {
      status: 200,
      message: `Email templates for category '${category}' retrieved successfully`,
      data: templates,
      type: 'COLLECTION',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Get Email Templates by Category error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to retrieve email templates by category', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
