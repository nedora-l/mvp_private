import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE } from "@/lib/interfaces/apis/common";
import { dynDBMetaDataServerService, MetaDataRecordDto, MetaDataRecordRequestDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { extractToken } from "../route";

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

    const { id } = await params;
    console.log("Fetching record details for ID:", id);

    const record: MetaDataRecordDto = await dynDBMetaDataServerService.getMetaDataRecordDetails(token, id);
    console.log("Record details response:", record);

    const response: ApiResponse<MetaDataRecordDto> = {
      status: 200,
      message: "Success",
      data: record,
      type: ApiResponseTYPE.RECORD_DETAILS
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get record details error:", error);
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

    const { id } = params;
    const body = await request.json() as MetaDataRecordRequestDto;
    console.log("Updating record ID:", id, "with data:", body);

    const updatedRecord: MetaDataRecordDto = await dynDBMetaDataServerService.updateMetaDataRecord(token, id, body);
    console.log("Updated record response:", updatedRecord);

    const response: ApiResponse<MetaDataRecordDto> = {
      status: 200,
      message: "Record updated successfully",
      data: updatedRecord,
      type: ApiResponseTYPE.RECORD_DETAILS
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Update record error:", error);
    
    let errorMessage = "Internal server error";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('not found')) {
        statusCode = 404;
      } else if (error.message.includes('invalid') || error.message.includes('validation')) {
        statusCode = 400;
      } else if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        statusCode = 403;
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

    const { id } = params;
    console.log("Deleting record ID:", id);

    const result: string = await dynDBMetaDataServerService.deleteMetaDataRecord(token, id);
    console.log("Delete record response:", result);

    const response: ApiResponse<string> = {
      status: 200,
      message: "Record deleted successfully",
      data: result,
      type: ApiResponseTYPE.RECORD_DETAILS
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Delete record error:", error);
    
    let errorMessage = "Internal server error";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('not found')) {
        statusCode = 404;
      } else if (error.message.includes('cannot be deleted') || error.message.includes('dependency')) {
        statusCode = 409; // Conflict
      } else if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        statusCode = 403;
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
