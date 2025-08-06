import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { 
  ExtractVariablesRequest,
  ExtractVariablesResponse,
  emailTemplateServerService 
} from '@/lib/services/server/email_templates';

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// POST /api/v1/admin/templates/emails/extract-variables - Extract variables from template content
export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const content: ExtractVariablesRequest = await request.json();
    
    const extractedVariables = await emailTemplateServerService.extractVariables(token, content);
    
    const response: ApiResponse<ExtractVariablesResponse> = {
      status: 200,
      message: 'Variables extracted successfully',
      data: extractedVariables,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Extract Variables error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to extract variables', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
