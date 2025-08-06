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
 * Update file type and category
 * PUT /api/v1/files/[id]/type-category?typeId={typeId}&categoryId={categoryId}
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
    const typeId = searchParams.get('typeId');
    const categoryId = searchParams.get('categoryId');

    // At least one parameter should be provided
    if (!typeId && !categoryId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'At least one of typeId or categoryId parameters is required' }, 
        { status: 400 }
      );
    }

    const updatedFile = await filesServerService.updateFileTypeAndCategory(
      token, 
      fileId, 
      typeId || undefined, 
      categoryId || undefined
    );
    
    return NextResponse.json({
      success: true,
      data: updatedFile,
      message: 'File type and category updated successfully'
    });

  } catch (error) {
    console.error('Update file type and category API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: error.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to update file type and category' }, 
      { status: 500 }
    );
  }
}
