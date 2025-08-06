import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/lib/interfaces/apis/common";
import { projectsServerService } from "@/lib/services/server/projects/projects.server.service";
import { ProjectTypeDto, ProjectTypeRequestDto } from "@/lib/services/server/projects/projects.dtos";

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

    const projectTypeId = params.id;
    if (!projectTypeId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Project type ID is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const data: ProjectTypeDto = await projectsServerService.getProjectTypeById(token, projectTypeId);
    const response: ApiResponse<ProjectTypeDto> = {
      status: 200,
      message: "Success",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Project Type GET by ID error:", error);
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

    const projectTypeId = params.id;
    if (!projectTypeId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Project type ID is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const body = await request.json() as ProjectTypeRequestDto;

    // Validate required fields
    if (!body.title || !body.orgId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Project type title and organization ID are required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const data: ProjectTypeDto = await projectsServerService.updateProjectType(token, projectTypeId, body);
    const response: ApiResponse<ProjectTypeDto> = {
      status: 200,
      message: "Project type updated successfully",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Project Type PUT error:", error);
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

    const projectTypeId = params.id;
    if (!projectTypeId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Project type ID is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    await projectsServerService.deleteProjectType(token, projectTypeId);
    const response: ApiResponse<null> = {
      status: 200,
      message: "Project type deleted successfully",
      data: null,
      type: "SUCCESS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Project Type DELETE error:", error);
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
