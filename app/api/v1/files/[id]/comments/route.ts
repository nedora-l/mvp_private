import { type NextRequest, NextResponse } from "next/server"
import { FileCommentDto, CreateFileCommentRequestDto } from "@/lib/interfaces/apis/files";
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
 * Get comments for a file
 * GET /api/v1/files/{id}/comments
 */
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

    // Extract pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDir = searchParams.get("sortDir") || "desc";
    
    const pagination = { page, size, sortBy, sortDir } as HateoasPagination;
    
    const commentsData: HateoasResponse<FileCommentDto> = await filesServerService.getFileComments(
      token, 
      params.id, 
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
    console.error("Get file comments error:", error);
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

/**
 * Create a comment on a file
 * POST /api/v1/files/{id}/comments
 */
export async function POST(
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

    const commentData: CreateFileCommentRequestDto = await request.json();
    
    const createdComment: FileCommentDto = await filesServerService.createFileComment(
      token, 
      params.id, 
      commentData
    );
    
    const response: ApiResponse<FileCommentDto> = {
      status: 201,
      message: "Comment created successfully",
      data: createdComment,
      type: "RECORD_DETAILS"
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Create file comment error:", error);
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
