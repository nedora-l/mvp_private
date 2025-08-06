import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { 
  BulkActionRequest,
  emailTemplateServerService 
} from '@/lib/services/server/email_templates';

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// POST /api/v1/admin/templates/emails/bulk-action - Perform bulk operations
export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const bulkRequest: BulkActionRequest = await request.json();
    
    // Validate bulk request
    if (!bulkRequest.action || !bulkRequest.templateIds || bulkRequest.templateIds.length === 0) {
      return NextResponse.json({ 
        status: 400, 
        message: 'Invalid bulk action request. Action and templateIds are required.', 
        data: null, 
        type: 'ERROR' 
      }, { status: 400 });
    }

    if (!['activate', 'deactivate', 'delete'].includes(bulkRequest.action)) {
      return NextResponse.json({ 
        status: 400, 
        message: 'Invalid action. Must be one of: activate, deactivate, delete', 
        data: null, 
        type: 'ERROR' 
      }, { status: 400 });
    }
    
    const result = await emailTemplateServerService.bulkAction(token, bulkRequest);
    
    const response: ApiResponse<{ message: string }> = {
      status: 200,
      message: `Bulk ${bulkRequest.action} operation completed successfully`,
      data: result,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Bulk Action error:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'Failed to perform bulk action', 
      data: null, 
      type: 'ERROR' 
    }, { status: 500 });
  }
}
