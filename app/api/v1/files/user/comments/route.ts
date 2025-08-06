import { type NextRequest, NextResponse } from "next/server"
import { FileCommentDto } from "@/lib/interfaces/apis/files";
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
 * Get user's comments
 * GET /api/v1/files/user/comments
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

    // Extract pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDir = searchParams.get("sortDir") || "desc";
    
    const pagination = { page, size, sortBy, sortDir } as HateoasPagination;
    
    const commentsData: HateoasResponse<FileCommentDto> = await filesServerService.getUserComments(
      token, 
      pagination
    );
    
    const response: ApiResponse<HateoasResponse<FileCommentDto>> = {
      status: 200,
      message: "Success",
      data: commentsData,
      type: "PAGINATION"
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get user comments error:", error);
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
