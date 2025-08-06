import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE } from "@/lib/interfaces/apis/common";
import { dynDBMetaDataServerService, MetaDataRecordTypeDto, MetaDataRecordTypeRequestDto, PaginationParams } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
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

    const { id: recordId } = params;
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");
    const sortBy = url.searchParams.get("sortBy");
    const sortDirection = url.searchParams.get("sortDirection") as 'asc' | 'desc';

    console.log("Fetching record types for record ID:", recordId);

    const pagination: PaginationParams = {
      page: Number(page) || 0,
      size: Number(size) || 10,
      sortBy: sortBy || 'id',
      sortDirection: sortDirection || 'desc'
    };

    const recordTypesResponse: HateoasContentResponse<MetaDataRecordTypeDto> = await dynDBMetaDataServerService.getMetaDataRecordTypes(token, recordId, pagination);
    console.log("Record types response:", recordTypesResponse);

    const response: ApiResponse<HateoasContentResponse<MetaDataRecordTypeDto>> = {
      status: 200,
      message: "Success",
      data: recordTypesResponse,
      type: ApiResponseTYPE.HATEOAS_RECORD_LIST
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get record types error:", error);
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
    const body = await request.json() as Omit<MetaDataRecordTypeRequestDto, 'recordId'>;
    
    // Ensure recordId is set from the URL parameter
    const recordTypeRequest: MetaDataRecordTypeRequestDto = {
      ...body,
      recordId
    };

    console.log("Creating record type for record ID:", recordId, "with data:", recordTypeRequest);

    const createdRecordType: MetaDataRecordTypeDto = await dynDBMetaDataServerService.createMetaDataRecordType(token, recordTypeRequest);
    console.log("Created record type response:", createdRecordType);

    const response: ApiResponse<MetaDataRecordTypeDto> = {
      status: 201,
      message: "Record type created successfully",
      data: createdRecordType,
      type: ApiResponseTYPE.RECORD_DETAILS
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Create record type error:", error);
    
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
