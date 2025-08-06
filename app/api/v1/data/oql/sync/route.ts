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

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No valid token found' },
        { status: 401 }
      );
    }

    console.log('OQL Sync API: GET request to sync knowledge graph');

    const data = await dynDataOqlServerService.syncGraph(token);

    return NextResponse.json({
      success: true,
      data,
      message: 'Knowledge graph synced successfully'
    });

  } catch (error) {
    console.error('OQL Sync API: GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to sync knowledge graph'
      },
      { status: 500 }
    );
  }
}
