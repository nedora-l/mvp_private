import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE } from "@/lib/interfaces/apis/common";
import { dynDBMetaDataServerService, MetaDataFieldDto, MetaDataFieldRequestDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { extractToken } from "../../../route";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; fieldId: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { fieldId } = params;
    const body = await request.json() as MetaDataFieldRequestDto;
    
    console.log("Updating field ID:", fieldId, "with data:", body);

    const updatedField: MetaDataFieldDto = await dynDBMetaDataServerService.updateMetaDataField(token, fieldId, body);
    console.log("Updated field response:", updatedField);

    const response: ApiResponse<MetaDataFieldDto> = {
      status: 200,
      message: "Field updated successfully",
      data: updatedField,
      type: ApiResponseTYPE.RECORD_DETAILS
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Update field error:", error);
    
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
