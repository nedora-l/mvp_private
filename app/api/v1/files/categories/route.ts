import { type NextRequest, NextResponse } from "next/server"
import { FileCategoryDto, CreateFileCategoryRequestDto } from "@/lib/interfaces/apis/files";
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
 * Get all file categories
 * GET /api/v1/files/categories
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
    
    const categories: HateoasResponse<FileCategoryDto> = await filesServerService.getAllFileCategories(token, params);
    
    const response: ApiResponse<HateoasResponse<FileCategoryDto>> = {
      status: 200,
      message: "Success",
      data: categories,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get file categories error:", error);
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
 * Create file category
 * POST /api/v1/files/categories
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

    const categoryData: CreateFileCategoryRequestDto = await request.json();
    const createdCategory: FileCategoryDto = await filesServerService.createFileCategory(token, categoryData);
    
    const response: ApiResponse<FileCategoryDto> = {
      status: 201,
      message: "Category created successfully",
      data: createdCategory,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Create file category error:", error);
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
