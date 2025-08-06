import { NextRequest, NextResponse } from 'next/server';
import { projectsServerService } from '@/lib/services/server/projects/projects.server.service';
import { auth } from '@/auth';
import { ProjectRoleRequestDto } from '@/lib/services/server/projects/projects.dtos';
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
 * GET /api/v1/projects/project-roles/[roleId]
 * Get project role details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
        return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
        );
    }


    const { roleId } = params;

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      );
    }

    const result = await projectsServerService.getProjectRoleById(
      token,
      roleId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`GET /api/v1/projects/project-roles/${params.roleId} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project role' },
      { status: error.status || 500 }
    );
  }
}

/**
 * PUT /api/v1/projects/project-roles/[roleId]
 * Update an existing project role
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
     const token = extractToken(request);
    if (!token) {
        return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
        );
    }
    const { roleId } = params;

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      );
    }

    const projectRoleData: ProjectRoleRequestDto = await request.json();

    // Basic validation
    if (!projectRoleData.title?.trim()) {
      return NextResponse.json(
        { error: 'Project role title is required' },
        { status: 400 }
      );
    }

    const result = await projectsServerService.updateProjectRole(
      token,
      roleId,
      projectRoleData
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`PUT /api/v1/projects/project-roles/${params.roleId} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update project role' },
      { status: error.status || 500 }
    );
  }
}

/**
 * DELETE /api/v1/projects/project-roles/[roleId]
 * Delete a project role
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
        return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
        );
    }
    const { roleId } = params;

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      );
    }

    await projectsServerService.deleteProjectRole(
      token,
      roleId
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`DELETE /api/v1/projects/project-roles/${params.roleId} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete project role' },
      { status: error.status || 500 }
    );
  }
}
