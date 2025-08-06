import { type NextRequest, NextResponse } from "next/server"
import { FileDto } from "@/lib/interfaces/apis/files";
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
 * Upload multiple files
 * POST /api/v1/files/upload/multiple
 */
export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const typeId = formData.get('typeId') as string;
    const folderId = formData.get('folderId') as string;
    const customPath = formData.get('customPath') as string;
    const metadata = formData.get('metadata') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { 
          status: 400,
          message: "No files provided",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const uploadedFiles: FileDto[] = await filesServerService.uploadMultipleFiles(
      token,
      files,
      typeId || undefined,
      folderId || undefined,
      customPath || undefined,
      metadata || undefined
    );
    
    const response: ApiResponse<FileDto[]> = {
      status: 201,
      message: "Files uploaded successfully",
      data: uploadedFiles,
      type: "RECORD_LIST"
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Multiple file upload error:", error);
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
