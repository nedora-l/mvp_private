import { type NextRequest, NextResponse } from "next/server"
import { FileDto } from "@/lib/interfaces/apis/files";
import { ApiResponse, HateoasPagination } from "@/lib/interfaces/apis/common";
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

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }    // extract params : query, page, size, limit
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "0", 0);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const limitParam = searchParams.get("limit");
    
    let filesData: FileDto[];
    if (limitParam) {
      // Use the limit-based method when limit parameter is provided
      const limit = parseInt(limitParam, 10);
      filesData = await filesServerService.getRecentFilesWithLimit(token, limit);
    } else {
      // Use the pagination-based method
      const params = { query, page, size} as HateoasPagination;
      filesData = await filesServerService.getRecentFiles(token, params);
    }
    const response: ApiResponse<FileDto[]> = {
      status: 200,
      message: "Success",
      data: filesData,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Recent files error:", error);
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
