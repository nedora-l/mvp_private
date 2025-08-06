import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE, HateoasPagination } from "@/lib/interfaces/apis/common";
import { dynDBMetaDataServerService, MetaDataFieldDtoMin, MetaDataFieldDto, MetaDataFieldRequestDto, PaginationParams } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { HateoasContentResponse } from "@/lib/services/server";
import { extractToken } from "../../route";

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

    const { id } =  await params;
    const recordId = id;
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");
    const sortBy = url.searchParams.get("sortBy");
    const sortDirection = url.searchParams.get("sortDirection") as 'asc' | 'desc';

    console.log("Fetching fields for record ID:", recordId);
    console.log("Pagination params:", { page, size, sortBy, sortDirection });

    const pagination: PaginationParams = {
      page: Number(page) || 0,
      size: Number(size) || 10,
      sortBy: sortBy || 'id',
      sortDirection: sortDirection || 'desc'
    };

    const fieldsResponse: HateoasContentResponse<MetaDataFieldDtoMin> = await dynDBMetaDataServerService.getMetaDataRecordFields(token, recordId, pagination);
    console.log("Fields response:", fieldsResponse);

    const response: ApiResponse<HateoasContentResponse<MetaDataFieldDtoMin>> = {
      status: 200,
      message: "Success",
      data: fieldsResponse,
      type: ApiResponseTYPE.HATEOAS_RECORD_LIST
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get record fields error:", error);
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

    const { id: recordId } = params;
    const body = await request.json() as Omit<MetaDataFieldRequestDto, 'recordId'>;
    
    // Ensure recordId is set from the URL parameter
    const fieldRequest: MetaDataFieldRequestDto = {
      ...body,
      recordId
    };

    console.log("Creating field for record ID:", recordId, "with data:", fieldRequest);

    const createdField: MetaDataFieldDto = await dynDBMetaDataServerService.createMetaDataField(token, fieldRequest);
    console.log("Created field response:", createdField);

    const response: ApiResponse<MetaDataFieldDto> = {
      status: 201,
      message: "Field created successfully",
      data: createdField,
      type: ApiResponseTYPE.RECORD_DETAILS
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Create field error:", error);
    
    let errorMessage = "Internal server error";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        statusCode = 409; // Conflict
      } else if (error.message.includes('invalid') || error.message.includes('validation')) {
        statusCode = 400; // Bad Request
      } else if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        statusCode = 403; // Forbidden
      }
    }

    return NextResponse.json(
      { 
        status: statusCode,
        message: errorMessage,
        data: null,
        type: ApiResponseTYPE.ERROR
      }, 
      { status: statusCode }
    );
  }
}
