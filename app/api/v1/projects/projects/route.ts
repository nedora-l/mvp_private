import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, HateoasResponse } from "@/lib/interfaces/apis/common";
import { projectsServerService } from "@/lib/services/server/projects/projects.server.service";
import { ProjectDto, ProjectRequestDto, ProjectPaginationParams } from "@/lib/services/server/projects/projects.dtos";
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

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    // Extract pagination parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;
    const size = searchParams.get("size") ? parseInt(searchParams.get("size")!, 10) : undefined;
    const sortBy = searchParams.get("sortBy") as ProjectPaginationParams['sortBy'] || undefined;
    const sortDirection = searchParams.get("sortDirection") as 'asc' | 'desc' || undefined;

    const paginationParams: ProjectPaginationParams = {
      query,
      page,
      size,
      sortBy,
      sortDirection
    };

    const data: ServerHateoasResponse<ProjectDto> = await projectsServerService.getProjects(token, paginationParams);
    const response: ApiResponse<ServerHateoasResponse<ProjectDto>> = {
      status: 200,
      message: "Success",
      data: data,
      type: "HATEOAS_RECORD_LIST"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Projects GET error:", error);
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

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const body = await request.json() as ProjectRequestDto;

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Project title is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const data: ProjectDto = await projectsServerService.createProject(token, body);
    const response: ApiResponse<ProjectDto> = {
      status: 201,
      message: "Project created successfully",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
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
