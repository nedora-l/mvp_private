import { NextRequest, NextResponse } from 'next/server';
import { filesServerService } from '@/lib/services/server/files/files.server.service';

/**
 * Extract token from Authorization header
 */
function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Move file to a different folder
 * PUT /api/v1/files/[id]/move?folderId={folderId}
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No valid token found' }, 
        { status: 401 }
      );
    }

    const { id: fileId } = params;
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    // folderId is optional - if not provided, moves to root
    const updatedFile = await filesServerService.moveFileToFolder(token, fileId, folderId || undefined);
    
    return NextResponse.json({
      success: true,
      data: updatedFile,
      message: 'File moved successfully'
    });

  } catch (error) {
    console.error('Move file API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to move file' }, 
      { status: 500 }
    );
  }
}
