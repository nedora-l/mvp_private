import { type NextRequest, NextResponse } from "next/server"
import { FileDto, UpdateFileRequestDto } from "@/lib/interfaces/apis/files";
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
 * Get file by ID
 * GET /api/v1/files/{id}
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

    const fileData: FileDto = await filesServerService.getFileById(token, params.id);
    const response: ApiResponse<FileDto> = {
      status: 200,
      message: "Success",
      data: fileData,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get file by ID error:", error);
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
 * Update file metadata
 * PUT /api/v1/files/{id}
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

    const updateRequest: UpdateFileRequestDto = await request.json();
    const updatedFile: FileDto = await filesServerService.updateFile(token, params.id, updateRequest);
    
    const response: ApiResponse<FileDto> = {
      status: 200,
      message: "File updated successfully",
      data: updatedFile,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Update file error:", error);
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
 * Delete file by ID
 * DELETE /api/v1/files/{id}
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

    await filesServerService.deleteFile(token, params.id);
    
    const response: ApiResponse<null> = {
      status: 200,
      message: "File deleted successfully",
      data: null,
      type: "SUCCESS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Delete file error:", error);
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
