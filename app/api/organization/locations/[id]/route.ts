import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/lib/interfaces/apis/common";
import { organizationServerService } from "@/lib/services/server/org/organization.server.service";
import { OrganizationLocationDto } from "@/lib/interfaces/apis";

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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Invalid ID parameter",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const data: OrganizationLocationDto = await organizationServerService.getOrganizationLocationById(id, token);
    const response: ApiResponse<OrganizationLocationDto> = {
      status: 200,
      message: "Success",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Organization location error:", error);
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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Invalid ID parameter",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const body = await request.json() as OrganizationLocationDto;

    const data: OrganizationLocationDto = await organizationServerService.updateOrganizationLocation(id, body, token);
    const response: ApiResponse<OrganizationLocationDto> = {
      status: 200,
      message: "Success",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Organization location update error:", error);
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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Invalid ID parameter",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    await organizationServerService.deleteOrganizationLocation(id, token);
    const response: ApiResponse<null> = {
      status: 200,
      message: "Success",
      data: null,
      type: "SUCCESS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Organization location delete error:", error);
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
