import { type NextRequest, NextResponse } from "next/server"
import { FileCommentDto, UpdateFileCommentRequestDto } from "@/lib/interfaces/apis/files";
import { ApiResponse } from "@/lib/interfaces/apis/common";
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
 * Get a specific comment by ID
 * GET /api/v1/files/comments/{id}
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

    const commentData: FileCommentDto = await filesServerService.getCommentById(token, params.id);
    
    const response: ApiResponse<FileCommentDto> = {
      status: 200,
      message: "Success",
      data: commentData,
      type: "RECORD_DETAILS"
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get comment by ID error:", error);
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
 * Update a comment
 * PUT /api/v1/files/comments/{id}
 */
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

    const updateData: UpdateFileCommentRequestDto = await request.json();
    
    const updatedComment: FileCommentDto = await filesServerService.updateComment(
      token, 
      params.id, 
      updateData
    );
    
    const response: ApiResponse<FileCommentDto> = {
      status: 200,
      message: "Comment updated successfully",
      data: updatedComment,
      type: "RECORD_DETAILS"
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Update comment error:", error);
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
 * Delete a comment
 * DELETE /api/v1/files/comments/{id}
 */
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

    await filesServerService.deleteComment(token, params.id);
    
    const response: ApiResponse<null> = {
      status: 200,
      message: "Comment deleted successfully",
      data: null,
      type: "RECORD_DETAILS"
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Delete comment error:", error);
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
