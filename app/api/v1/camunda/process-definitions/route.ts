import { type NextRequest, NextResponse } from "next/server"
import { AppEmployee } from "@/lib/interfaces/apis/employee";
import { ApiResponse, HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis/common";
import { directoryServerService } from "@/lib/services/server/directory/directory.server.service";
import { camundaServerService, ProcessDefinitionsResponse, CreateProcessDefinitionRequestDto, DeploymentResponseDto } from "@/lib/services/server/camunda/camunda.server.service";

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
    // const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "0", 0);
    const size = parseInt(searchParams.get("size") || "10", 10);
    // const params = { query, page, size}  as HateoasPagination ;
    const data:ProcessDefinitionsResponse  = await camundaServerService.getAllProcessDefinitions(token,page, size);
    const response: ApiResponse<ProcessDefinitionsResponse> = {
      status: 200,
      message: "Success",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { 
        status: 500,
        message: "Internal server error",
        data: null,
        type: "ERROR"
      }, 
      { status: 500 }    );
  }
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

    // Parse the request body
    let requestData: CreateProcessDefinitionRequestDto;
    let bpmnFile: File | undefined;

    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle multipart form data (with file upload)
      const formData = await request.formData();
      
      // Extract the process definition data
      const processDataString = formData.get('processData') as string;
      if (!processDataString) {
        return NextResponse.json(
          { 
            status: 400,
            message: "Process definition data is required",
            data: null,
            type: "ERROR"
          }, 
          { status: 400 }
        );
      }
      
      try {
        requestData = JSON.parse(processDataString) as CreateProcessDefinitionRequestDto;
      } catch (error) {
        return NextResponse.json(
          { 
            status: 400,
            message: "Invalid JSON in process definition data",
            data: null,
            type: "ERROR"
          }, 
          { status: 400 }
        );
      }

      // Extract the BPMN file if present
      const fileEntry = formData.get('bpmnFile') as File;
      if (fileEntry) {
        bpmnFile = fileEntry;
      }
    } else {
      // Handle JSON request body
      try {
        requestData = await request.json() as CreateProcessDefinitionRequestDto;
      } catch (error) {
        return NextResponse.json(
          { 
            status: 400,
            message: "Invalid JSON in request body",
            data: null,
            type: "ERROR"
          }, 
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!requestData.processKey) {
      return NextResponse.json(
        { 
          status: 400,
          message: "Process key is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    if (!requestData.bpmnXml && !bpmnFile) {
      return NextResponse.json(
        { 
          status: 400,
          message: "BPMN XML content or BPMN file is required",
          data: null,
          type: "ERROR"
        }, 
        { status: 400 }
      );
    }

    // Call the server service to create the process definition
    const data: DeploymentResponseDto = await camundaServerService.createProcessDefinition(
      token,
      requestData,
      bpmnFile
    );

    const response: ApiResponse<DeploymentResponseDto> = {
      status: 201,
      message: "Process definition created successfully",
      data: data,
      type: "RECORD_DETAILS"
    };

    return NextResponse.json(response, { status: 201 });
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