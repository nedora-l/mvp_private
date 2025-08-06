import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/lib/interfaces/apis/common";
import { projectsServerService } from "@/lib/services/server/projects/projects.server.service";
import { ProjectDto, ProjectRequestDto } from "@/lib/services/server/projects/projects.dtos";

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
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const projectId = params.id;
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

    const data: ProjectDto = await projectsServerService.getProjectById(token, projectId);
    const response: ApiResponse<ProjectDto> = {
      status: 200,
      message: "Success",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Project GET by ID error:", error);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const projectId = params.id;
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

    const data: ProjectDto = await projectsServerService.updateProject(token, projectId, body);
    const response: ApiResponse<ProjectDto> = {
      status: 200,
      message: "Project updated successfully",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Project PUT error:", error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const projectId = params.id;
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

    await projectsServerService.deleteProject(token, projectId);
    const response: ApiResponse<null> = {
      status: 200,
      message: "Project deleted successfully",
      data: null,
      type: "SUCCESS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Project DELETE error:", error);
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
