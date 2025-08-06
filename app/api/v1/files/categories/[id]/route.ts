import { type NextRequest, NextResponse } from "next/server"
import { FileCategoryDto, UpdateFileCategoryRequestDto } from "@/lib/interfaces/apis/files";
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
 * Get file category by ID
 * GET /api/v1/files/categories/{id}
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

    const category: FileCategoryDto = await filesServerService.getFileCategoryById(token, params.id);
    const response: ApiResponse<FileCategoryDto> = {
      status: 200,
      message: "Success",
      data: category,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get file category by ID error:", error);
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
 * Update file category
 * PUT /api/v1/files/categories/{id}
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

    const updateRequest: UpdateFileCategoryRequestDto = await request.json();
    const updatedCategory: FileCategoryDto = await filesServerService.updateFileCategory(token, params.id, updateRequest);
    
    const response: ApiResponse<FileCategoryDto> = {
      status: 200,
      message: "Category updated successfully",
      data: updatedCategory,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Update file category error:", error);
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
 * Delete file category
 * DELETE /api/v1/files/categories/{id}
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

    await filesServerService.deleteFileCategory(token, params.id);
    
    const response: ApiResponse<null> = {
      status: 200,
      message: "Category deleted successfully",
      data: null,
      type: "SUCCESS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Delete file category error:", error);
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
