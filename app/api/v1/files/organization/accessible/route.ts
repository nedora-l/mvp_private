import { type NextRequest, NextResponse } from "next/server"
import { FileDto } from "@/lib/interfaces/apis/files";
import { ApiResponse, HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis/common";
import { filesServerService } from "@/lib/services/server/files/files.server.service";

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
 * Get organization accessible files with folder filtering
 * GET /api/v1/files/organization/accessible
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

    console.log("Get organization accessible files request:", request.url);
    const { searchParams } = new URL(request.url);
    console.log("Get organization accessible files search params:", searchParams.toString());

    // Extract folder IDs from query parameters
    const folderIds = searchParams.getAll("folderIds").filter(id => id.trim() !== "");

    console.log("Get organization accessible files folder IDs:", folderIds);
    // Extract includeNoFolder flag
    const includeNoFolderParam = searchParams.get("includeNoFolder");
    const includeNoFolder = includeNoFolderParam ? includeNoFolderParam === "true" : undefined;
    console.log("Get organization accessible files includeNoFolder:", includeNoFolder);
    // Extract pagination parameters
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortDir: "asc" | "desc" = searchParams.get("sortDir") === "desc" ? "desc" : "asc";

    const pagination: HateoasPagination = { page, size, sortBy, sortDir };
    console.log("Get organization accessible files pagination:", pagination);

    // Fetch accessible files with optional folder filtering
    console.log("Fetching organization accessible files...");
    const accessibleFiles: HateoasResponse<FileDto> = await filesServerService.getOrganizationAccessibleFiles(
      token, 
      folderIds.length > 0 ? folderIds : undefined,
      includeNoFolder,
      pagination
    );
    console.log("Fetched organization accessible files:", accessibleFiles);
    const response: ApiResponse<HateoasResponse<FileDto>> = {
      status: 200,
      message: "Success",
      data: accessibleFiles,
      type: "RECORD_DETAILS"
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get organization accessible files error:", error);
    return NextResponse.json(
      { 
        status: 500, 
        message: "Internal server error", 
        error: error instanceof Error ? error.message : "Unknown error",
        type: "ERROR"
      },
      { status: 500 }
    );
  }
}
