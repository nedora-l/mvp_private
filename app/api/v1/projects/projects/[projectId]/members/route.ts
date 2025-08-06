import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, HateoasResponse } from "@/lib/interfaces/apis/common";
import { projectsServerService } from "@/lib/services/server/projects/projects.server.service";
import { ProjectMemberDto, AddProjectMemberRequestDto, ProjectMemberPaginationParams } from "@/lib/services/server/projects/projects.dtos";
import { HateoasResponse as ServerHateoasResponse } from "@/lib/services/server/index";

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

    const projectId = params.projectId;
    if (!projectId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Project ID is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    // Extract pagination parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;
    const size = searchParams.get("size") ? parseInt(searchParams.get("size")!, 10) : undefined;
    const sortBy = searchParams.get("sortBy") as ProjectMemberPaginationParams['sortBy'] || undefined;
    const sortDirection = searchParams.get("sortDirection") as 'asc' | 'desc' || undefined;

    const paginationParams: ProjectMemberPaginationParams = {
      query,
      page,
      size,
      sortBy,
      sortDirection
    };

    const data: ServerHateoasResponse<ProjectMemberDto> = await projectsServerService.getProjectMembers(token, projectId, paginationParams);
    const response: ApiResponse<ServerHateoasResponse<ProjectMemberDto>> = {
      status: 200,
      message: "Success",
      data: data,
      type: "HATEOAS_RECORD_LIST"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Project Members GET error:", error);
    return NextResponse.json(
      { 
        status: 500,
        message: "Internal server error",
        data: null,
        type: "ERROR"
      }, 
      { status: 500 }
    );
  }
}

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

    const projectId = params.projectId;
    if (!projectId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Project ID is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const body = await request.json() as AddProjectMemberRequestDto;

    // Validate required fields
    if (!body.memberId || !body.roleId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Member ID and role ID are required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const data: ProjectMemberDto = await projectsServerService.addProjectMember(token, projectId, body);
    const response: ApiResponse<ProjectMemberDto> = {
      status: 201,
      message: "Project member added successfully",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Project Members POST error:", error);
    return NextResponse.json(
      { 
        status: 500,
        message: "Internal server error",
        data: null,
        type: "ERROR"
      }, 
      { status: 500 }
    );
  }
}
