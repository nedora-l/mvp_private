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
 * API route to upload files
 * @param request - NextRequest object
 * @returns NextResponse with uploaded files data or error
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
    //const file = formData.get('file') as File;
    const typeId = formData.get('typeId') as string;
    const folderId = formData.get('folderId') as string;
    const customPath = formData.get('customPath') as string;
    const metadata = formData.get('metadata') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { 
          status: 400,
          message: "No file(s) provided",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    // Validate file types and sizes
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];

    const maxFileSize = 50 * 1024 * 1024; // 50MB

     let uploadedFiles: FileDto[] = [];
    for (const file of files) {
      if (allowedTypes.includes(file.type) && file.size <= maxFileSize) {

        // Use the FilesServerService to upload the file
        const uploadRequest = {
          file,
          typeId: typeId || undefined,
          folderId: folderId || undefined,
          customPath: customPath || undefined,
          metadata: metadata || undefined
        };

        const uploadedFile = await filesServerService.uploadFile(token, uploadRequest);
        uploadedFiles.push(uploadedFile);
      }
    }

    const response: ApiResponse<FileDto[]> = {
      status: 201,
      message: "Files uploaded successfully",
      data: uploadedFiles,
      type: "RECORD_DETAILS"
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("File upload error:", error);
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
