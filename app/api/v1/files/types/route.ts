import { type NextRequest, NextResponse } from "next/server"
import { FileTypeDto, CreateFileTypeRequestDto } from "@/lib/interfaces/apis/files";
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
 * Get all file types
 * GET /api/v1/files/types
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const params = page >= 0 && size > 0 ? { page, size } as HateoasPagination : undefined;
    
    const types: HateoasResponse<FileTypeDto> = await filesServerService.getAllFileTypes(token, params);
    
    const response: ApiResponse<HateoasResponse<FileTypeDto>> = {
      status: 200,
      message: "Success",
      data: types,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get file types error:", error);
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
 * Create file type
 * POST /api/v1/files/types
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

    const typeData: CreateFileTypeRequestDto = await request.json();
    const createdType: FileTypeDto = await filesServerService.createFileType(token, typeData);
    
    const response: ApiResponse<FileTypeDto> = {
      status: 201,
      message: "Type created successfully",
      data: createdType,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Create file type error:", error);
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
