import { NextRequest, NextResponse } from 'next/server';
import { projectsServerService } from '@/lib/services/server/projects/projects.server.service';
import { ProjectRequestDto } from '@/lib/services/server/projects/projects.dtos';

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
 * GET /api/v1/projects/projects/[projectId]
 * Get project details by ID
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

    const result = await projectsServerService.getProjectById(
      token,
      projectId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`GET /api/v1/projects/projects/${params.projectId} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project' },
      { status: error.status || 500 }
    );
  }
}

/**
 * PUT /api/v1/projects/projects/[projectId]
 * Update an existing project
 */
export async function PUT(
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

    const projectData: ProjectRequestDto = await request.json();

    // Basic validation
    if (!projectData.title?.trim()) {
      return NextResponse.json(
        { error: 'Project title is required' },
        { status: 400 }
      );
    }

    const result = await projectsServerService.updateProject(
      token,
      projectId,
      projectData
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`PUT /api/v1/projects/projects/${params.projectId} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: error.status || 500 }
    );
  }
}

/**
 * DELETE /api/v1/projects/projects/[projectId]
 * Delete a project
 */
export async function DELETE(
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

    await projectsServerService.deleteProject(
      token,
      projectId
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`DELETE /api/v1/projects/projects/${params.projectId} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: error.status || 500 }
    );
  }
}
