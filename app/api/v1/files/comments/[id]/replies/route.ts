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
 * Get replies to a comment
 * GET /api/v1/files/comments/{id}/replies
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
    const sortDir = searchParams.get("sortDir") || "asc";
    
    const pagination = { page, size, sortBy, sortDir } as HateoasPagination;
    
    const repliesData: HateoasResponse<FileCommentDto> = await filesServerService.getCommentReplies(
      token, 
      params.id, 
      pagination
    );
    
    const response: ApiResponse<HateoasResponse<FileCommentDto>> = {
      status: 200,
      message: "Success",
      data: repliesData,
      type: "PAGINATION"
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get comment replies error:", error);
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
 * Reply to a comment
 * POST /api/v1/files/comments/{id}/replies
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

    const replyData: CreateFileCommentRequestDto = await request.json();
    
    const createdReply: FileCommentDto = await filesServerService.replyToComment(
      token, 
      params.id, 
      replyData
    );
    
    const response: ApiResponse<FileCommentDto> = {
      status: 201,
      message: "Reply created successfully",
      data: createdReply,
      type: "RECORD_DETAILS"
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Create reply error:", error);
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
