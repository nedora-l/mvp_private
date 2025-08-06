import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE } from "@/lib/interfaces/apis/common";
import { dynDBMetaDataServerService, MetaDataFieldTypeDto, PaginationParams } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { HateoasContentResponse } from "@/lib/services/server";
import { extractToken } from "../../route";

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");
    const sortBy = url.searchParams.get("sortBy");
    const sortDirection = url.searchParams.get("sortDirection") as 'asc' | 'desc';

    console.log("Fetching metadata field types");

    const pagination: PaginationParams = {
      page: Number(page) || 0,
      size: Number(size) || 10,
      sortBy: sortBy || 'id',
      sortDirection: sortDirection || 'desc'
    };

    const fieldTypesResponse: HateoasContentResponse<MetaDataFieldTypeDto> = await dynDBMetaDataServerService.getMetaDataFieldTypes(token, pagination);
    console.log("Field types response:", fieldTypesResponse);

    const response: ApiResponse<HateoasContentResponse<MetaDataFieldTypeDto>> = {
      status: 200,
      message: "Success",
      data: fieldTypesResponse,
      type: ApiResponseTYPE.HATEOAS_RECORD_LIST
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get field types error:", error);
    return NextResponse.json(
      { 
        status: 500,
        message: "Internal server error",
        data: null,
        type: ApiResponseTYPE.ERROR
      }, 
      { status: 500 }
    );
  }
}
