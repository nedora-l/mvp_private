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
 * GET /api/v1/projects/projects/[projectId]/attachments
 * Get project attachments by project ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
        return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
        );
    }
    

    const { projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
    const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : undefined;

    const paginationParams = {
      page,
      size
    };

    const result = await projectsServerService.getProjectAttachments(
      token,
      projectId,
      paginationParams
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`GET /api/v1/projects/projects/${params.projectId}/attachments error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project attachments' },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST /api/v1/projects/projects/[projectId]/attachments
 * Upload an attachment to a project
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
        return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
        );
    }
    const { projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const typeId = formData.get('typeId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    const uploadData = {
      file,
      title: title || undefined,
      description: description || undefined,
      typeId: typeId || undefined
    };

    // Note: This would need to be implemented in the server service
    // For now, we'll return an error indicating this feature is not yet implemented
    return NextResponse.json(
      { error: 'File upload feature not yet implemented in server service' },
      { status: 501 }
    );

    // When implemented, it would look like:
    // const result = await projectsServerService.uploadProjectAttachment(
    //   session.accessToken,
    //   projectId,
    //   uploadData
    // );
    // return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error(`POST /api/v1/projects/projects/${params.projectId}/attachments error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload attachment' },
      { status: error.status || 500 }
    );
  }
}
