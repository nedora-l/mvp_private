import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, HateoasResponse } from "@/lib/interfaces/apis/common";
import { organizationServerService } from "@/lib/services/server/org/organization.server.service";
import { OrganizationPinnedDocumentDto } from "@/lib/interfaces/apis";

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

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const organizationId = parseInt(searchParams.get("organizationId") || "0");
    
    if (!organizationId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Organization ID is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const body = await request.json() as OrganizationPinnedDocumentDto;

    const data: OrganizationPinnedDocumentDto = await organizationServerService.createOrganizationPinnedDocument(organizationId, body, token);
    const response: ApiResponse<OrganizationPinnedDocumentDto> = {
      status: 201,
      message: "Success",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Organization pinned document create error:", error);
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

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const organizationId = parseInt(searchParams.get("organizationId") || "0");
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    
    if (!organizationId) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Organization ID is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const data: HateoasResponse<OrganizationPinnedDocumentDto> = await organizationServerService.getOrganizationPinnedDocuments(organizationId, token);
    const response: ApiResponse<HateoasResponse<OrganizationPinnedDocumentDto>> = {
      status: 200,
      message: "Success",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Organization pinned documents error:", error);
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
