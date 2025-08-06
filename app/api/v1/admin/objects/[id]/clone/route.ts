import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE } from "@/lib/interfaces/apis/common";
import { dynDBMetaDataServerService, MetaDataRecordDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { extractToken } from "../../route";

interface CloneRecordRequest {
  newApiName: string;
  newLabel: string;
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

    const { id: sourceRecordId } = params;
    const body = await request.json() as CloneRecordRequest;
    
    console.log("Cloning record ID:", sourceRecordId, "with data:", body);

    const clonedRecord: MetaDataRecordDto = await dynDBMetaDataServerService.cloneMetaDataRecord(
      token, 
      sourceRecordId, 
      body.newApiName, 
      body.newLabel
    );
    console.log("Cloned record response:", clonedRecord);

    const response: ApiResponse<MetaDataRecordDto> = {
      status: 201,
      message: "Record cloned successfully",
      data: clonedRecord,
      type: ApiResponseTYPE.RECORD_DETAILS
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Clone record error:", error);
    
    let errorMessage = "Internal server error";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('not found')) {
        statusCode = 404;
      } else if (error.message.includes('already exists') || error.message.includes('duplicate')) {
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
