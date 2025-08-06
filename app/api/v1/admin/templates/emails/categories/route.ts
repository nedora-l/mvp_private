import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { 
  emailTemplateServerService 
} from '@/lib/services/server/email_templates';

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// GET /api/v1/admin/templates/emails/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const categories = await emailTemplateServerService.getAllCategories(token);
    
    const response: ApiResponse<string[]> = {
      status: 200,
      message: 'Email template categories retrieved successfully',
      data: categories,
      type: 'COLLECTION',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Get Email Template Categories error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to retrieve email template categories', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
