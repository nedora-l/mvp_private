import { type NextRequest, NextResponse } from "next/server"
import { CreateFileFolderRequestDto, FileFolderDto, FilesHateosDataListNames } from "@/lib/interfaces/apis/files";
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
 * API route to get folders and files
 * @param request - NextRequest object
 * @returns NextResponse with folders and files data or error
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

    // extract params : query, page, size
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "0", 0);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const params = { query, page, size}  as HateoasPagination ;
    const foldersData: HateoasResponse<FileFolderDto> = await filesServerService.getFoldersFiles(token, params);
    const response: ApiResponse<HateoasResponse<FileFolderDto>> = {
      status: 200,
      message: "Success",
      data: foldersData,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Folders files error:", error);

    const mockData = {
      _embedded: {
      [FilesHateosDataListNames.folder]: [
        {
        id: "1",
        organizationId: "org-123",
        parentFolderId: null,
        parentFolderTitle: null,
        title: "Folder 1",
        path: "/Folder 1",
        description: "Mock folder 1 description",
        updatedAt: new Date().toISOString(),
        fileCount: 5,
        subFolders: []
        },
        {
        id: "2",
        organizationId: "org-123",
        parentFolderId: null,
        parentFolderTitle: null,
        title: "Folder 2",
        path: "/Folder 2",
        description: "Mock folder 2 description",
        updatedAt: new Date().toISOString(),
        fileCount: 3,
        subFolders: []
        }
      ]
      },
      _links: {},
      page: {
      size: 10,
      totalElements: 100,
      totalPages: 10,
      number: 0
      }
    } as HateoasResponse<FileFolderDto>;

    const response: ApiResponse<HateoasResponse<FileFolderDto>> = {
      status: 200,
      message: "Success",
      data: mockData,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(
      response, 
      { status: 200 }
    );
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


// API POST to create folder (createNewFolder( accessToken : string , folderData: CreateFileFolderRequestDto))

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }
    const folderData: CreateFileFolderRequestDto = await request.json();
    const newFolder: FileFolderDto = await filesServerService.createNewFolder(token, folderData);
    const response: ApiResponse<FileFolderDto> = {
      status: 201,
      message: "Folder created successfully",
      data: newFolder,
      type: "RECORD_DETAILS"
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Create folder error:", error);
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