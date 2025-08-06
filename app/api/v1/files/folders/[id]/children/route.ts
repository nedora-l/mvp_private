import { type NextRequest, NextResponse } from "next/server"
import { FileFolderDto } from "@/lib/interfaces/apis/files";
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
 * Get child folders
 * GET /api/v1/files/folders/{id}/children
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

    const childFolders: FileFolderDto[] = await filesServerService.getChildFolders(token, params.id);
    const response: ApiResponse<FileFolderDto[]> = {
      status: 200,
      message: "Success",
      data: childFolders,
      type: "RECORD_LIST"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get child folders error:", error);
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
