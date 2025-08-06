import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE } from "@/lib/interfaces/apis/common";
import { ObjectDto } from "@/lib/services/client/admin/objects/objects.client.service";
import { dynDBMetaDataServerService, MetaDataRecordDto, MetaDataRecordRequestDto, PaginationParams } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { HateoasContentResponse } from "@/lib/services/server";
import { dynDBOqlServerService, OqlExecutionResult, OqlQueryDto } from "@/lib/services/server/dynamicdb/dyn.db.oql.server.service";
 
/**
 * Extract token from Authorization header
 */
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); 
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }
    const body = await request.json() as OqlQueryDto;
    console.log("Request body:", body);
    const response: OqlExecutionResult = await dynDBOqlServerService.executeOqlQuery(token, body.query);
    console.log("Created record response:", response);
    
    // Convert Map to plain object for JSON serialization
    const serializedResponse = {
      ...response,
      records: Object.fromEntries(response.records) // Convert Map to Object
    };
    console.log("Serialized response:", serializedResponse);

    return NextResponse.json(serializedResponse, { status: 201 });
  } catch (error) {
    console.error("Create process definition error:", error);
    // Handle specific error types
    let errorMessage = "Internal server error";
    let statusCode = 500;
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check for specific error patterns to set appropriate status codes
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
        type: "ERROR"
      }, 
      { status: statusCode }
    );
  }
}