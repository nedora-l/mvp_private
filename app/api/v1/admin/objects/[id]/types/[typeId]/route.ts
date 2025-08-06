import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE } from "@/lib/interfaces/apis/common";
import { dynDBMetaDataServerService, MetaDataRecordTypeDto, MetaDataRecordTypeRequestDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { extractToken } from "../../../route";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; typeId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { typeId } = params;
    console.log("Fetching record type details for ID:", typeId);

    const recordType: MetaDataRecordTypeDto = await dynDBMetaDataServerService.getMetaDataRecordType(token, typeId);
    console.log("Record type details response:", recordType);

    const response: ApiResponse<MetaDataRecordTypeDto> = {
      status: 200,
      message: "Success",
      data: recordType,
      type: ApiResponseTYPE.RECORD_DETAILS
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get record type details error:", error);
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
  { params }: { params: { id: string; typeId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { typeId } = params;
    const body = await request.json() as MetaDataRecordTypeRequestDto;
    
    console.log("Updating record type ID:", typeId, "with data:", body);

    const updatedRecordType: MetaDataRecordTypeDto = await dynDBMetaDataServerService.updateMetaDataRecordType(token, typeId, body);
    console.log("Updated record type response:", updatedRecordType);

    const response: ApiResponse<MetaDataRecordTypeDto> = {
      status: 200,
      message: "Record type updated successfully",
      data: updatedRecordType,
      type: ApiResponseTYPE.RECORD_DETAILS
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Update record type error:", error);
    
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
  { params }: { params: { id: string; typeId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { typeId } = params;
    console.log("Deleting record type ID:", typeId);

    await dynDBMetaDataServerService.deleteMetaDataRecordType(token, typeId);
    console.log("Record type deleted successfully");

    const response: ApiResponse<null> = {
      status: 200,
      message: "Record type deleted successfully",
      data: null,
      type: ApiResponseTYPE.RECORD_DETAILS
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Delete record type error:", error);
    
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
