import { type NextRequest, NextResponse } from "next/server"
import { FileDto } from "@/lib/interfaces/apis/files";
import { ApiResponse, HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis/common";
import { filesServerService } from "@/lib/services/server/files/files.server.service";
import { organizationServerService } from "@/lib/services/server/org/organization.server.service";
import { OrganizationDto } from "@/lib/interfaces/apis";

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

    // extract params : query, page, size
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "0", 0);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const filesData: OrganizationDto = await organizationServerService.getOrg(token);
    const response: ApiResponse<OrganizationDto> = {
      status: 200,
      message: "Success",
      data: filesData,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Files error:", error);
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
