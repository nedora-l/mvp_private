import { NextRequest, NextResponse } from 'next/server';
import { projectsServerService } from '@/lib/services/server/projects/projects.server.service';
import { auth } from '@/auth';
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
/**
 * GET /api/v1/projects/projects/[projectId]/attachments/[attachmentId]
 * Get project attachment details by project ID and attachment ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; attachmentId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
        return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
        );
    }
    
    const { projectId, attachmentId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    if (!attachmentId) {
      return NextResponse.json(
        { error: 'Attachment ID is required' },
        { status: 400 }
      );
    }

    const result = await projectsServerService.getProjectAttachmentById(
      token,
      projectId,
      attachmentId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`GET /api/v1/projects/projects/${params.projectId}/attachments/${params.attachmentId} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project attachment' },
      { status: error.status || 500 }
    );
  }
}

/**
 * DELETE /api/v1/projects/projects/[projectId]/attachments/[attachmentId]
 * Delete a project attachment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; attachmentId: string } }
) {
  try {
    
    const token = extractToken(request);
    if (!token) {
        return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
        );
    }

    const { projectId, attachmentId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    if (!attachmentId) {
      return NextResponse.json(
        { error: 'Attachment ID is required' },
        { status: 400 }
      );
    }

    // Note: This would need to be implemented in the server service
    // For now, we'll return an error indicating this feature is not yet implemented
    return NextResponse.json(
      { error: 'Delete attachment feature not yet implemented in server service' },
      { status: 501 }
    );

    // When implemented, it would look like:
    // await projectsServerService.deleteProjectAttachment(
    //   session.accessToken,
    //   projectId,
    //   attachmentId
    // );
    // return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error(`DELETE /api/v1/projects/projects/${params.projectId}/attachments/${params.attachmentId} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete attachment' },
      { status: error.status || 500 }
    );
  }
}
