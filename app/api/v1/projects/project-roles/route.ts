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
 * GET /api/v1/projects/project-roles
 * Get paginated list of project roles
 */
export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
        return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
        );
    }


    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
    const size = searchParams.get('size') ? parseInt(searchParams.get('size')!) : undefined;
    const sortBy = searchParams.get('sortBy') as any;
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc' | undefined;
    const query = searchParams.get('query') || undefined;

    const paginationParams = {
      page,
      size,
      sortBy,
      sortDirection,
      query
    };

    const result = await projectsServerService.getProjectRoles(
      token,
      paginationParams
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('GET /api/v1/projects/project-roles error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project roles' },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST /api/v1/projects/project-roles
 * Create a new project role
 */
export async function POST(request: NextRequest) {
  try {
     const token = extractToken(request);
    if (!token) {
        return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
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

    const result = await projectsServerService.createProjectRole(
      token,
      projectRoleData
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/v1/projects/project-roles error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project role' },
      { status: error.status || 500 }
    );
  }
}
