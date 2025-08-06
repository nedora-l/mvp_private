import { NextRequest, NextResponse } from 'next/server';
import { dynDataOqlServerService } from '@/lib/services/server/dyn_data/dynDataOql.server.service';

/**
 * Extract token from Authorization header
 */
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No valid token found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Query is required' },
        { status: 400 }
      );
    }

    console.log('OQL Execute API: POST request with query:', query);

    const data = await dynDataOqlServerService.executeOqlQuery(token, query);

    return NextResponse.json({
      success: true,
      data,
      message: 'OQL query executed successfully'
    });

  } catch (error) {
    console.error('OQL Execute API: POST error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to execute OQL query'
      },
      { status: 500 }
    );
  }
}
