import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { 
  EmailTemplateStatistics,
  emailTemplateServerService 
} from '@/lib/services/server/email_templates';

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// GET /api/v1/admin/templates/emails/statistics - Get template statistics
export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const statistics = await emailTemplateServerService.getTemplateStatistics(token);
    
    const response: ApiResponse<EmailTemplateStatistics> = {
      status: 200,
      message: 'Email template statistics retrieved successfully',
      data: statistics,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Get Email Template Statistics error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to retrieve email template statistics', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
