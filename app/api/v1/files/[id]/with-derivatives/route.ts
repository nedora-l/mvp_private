import { type NextRequest, NextResponse } from "next/server"
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
 * Delete file with derivatives
 * DELETE /api/v1/files/{id}/with-derivatives
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

    await filesServerService.deleteFileWithDerivatives(token, params.id);
    
    const response: ApiResponse<null> = {
      status: 200,
      message: "File and derivatives deleted successfully",
      data: null,
      type: "SUCCESS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Delete file with derivatives error:", error);
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
