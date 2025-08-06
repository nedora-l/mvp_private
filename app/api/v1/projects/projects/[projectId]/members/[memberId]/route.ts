import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/lib/interfaces/apis/common";
import { projectsServerService } from "@/lib/services/server/projects/projects.server.service";
import { ProjectMemberDto } from "@/lib/services/server/projects/projects.dtos";

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
  { params }: { params: { projectId: string; memberId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { projectId, memberId } = params;
    if (!projectId || !memberId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Project ID and member ID are required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const data: ProjectMemberDto = await projectsServerService.getProjectMemberById(token, projectId, memberId);
    const response: ApiResponse<ProjectMemberDto> = {
      status: 200,
      message: "Success",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Project Member GET by ID error:", error);
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
  { params }: { params: { projectId: string; memberId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { projectId, memberId } = params;
    if (!projectId || !memberId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Project ID and member ID are required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    await projectsServerService.removeProjectMember(token, projectId, memberId);
    const response: ApiResponse<null> = {
      status: 200,
      message: "Project member removed successfully",
      data: null,
      type: "SUCCESS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Project Member DELETE error:", error);
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
