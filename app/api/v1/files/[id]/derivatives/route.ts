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
 * Get derivative files
 * GET /api/v1/files/{id}/derivatives
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

    const derivativeFiles: FileDto[] = await filesServerService.getDerivativeFiles(token, params.id);
    const response: ApiResponse<FileDto[]> = {
      status: 200,
      message: "Success",
      data: derivativeFiles,
      type: "RECORD_LIST"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get derivative files error:", error);
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
 * Create derivative file
 * POST /api/v1/files/{id}/derivatives
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const pageNumberStr = formData.get('pageNumber') as string;
    const pageNumber = pageNumberStr ? parseInt(pageNumberStr) : undefined;

    if (!file) {
      return NextResponse.json(
        { 
          status: 400,
          message: "No file provided",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Category is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    const derivativeFile: FileDto = await filesServerService.createDerivativeFile(
      token, 
      params.id, 
      file, 
      category, 
      pageNumber
    );
    
    const response: ApiResponse<FileDto> = {
      status: 201,
      message: "Derivative file created successfully",
      data: derivativeFile,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Create derivative file error:", error);
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
