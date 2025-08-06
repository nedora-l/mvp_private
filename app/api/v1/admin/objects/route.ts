import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE } from "@/lib/interfaces/apis/common";
import { ObjectDto } from "@/lib/services/client/admin/objects/objects.client.service";
import { dynDBMetaDataServerService, MetaDataRecordDto, MetaDataRecordRequestDto, PaginationParams } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { HateoasContentResponse } from "@/lib/services/server";

/*

// Mock custom objects data
export const MockData_customObjects:ObjectDto[] = [
    {
      id: '1',
      name: "Customer",
      apiName: "Customer__c",
      description: "Customer information and contact details",
      recordCount: 1247,
      fieldsCount: 15,
      relationshipsCount: 3,
      lastModified: "2 hours ago",
      isCustom: true,
      status: "Active"
    },
    {
      id: '2',
      name: "Product",
      apiName: "Product__c", 
      description: "Product catalog and inventory management",
      recordCount: 543,
      fieldsCount: 22,
      relationshipsCount: 5,
      lastModified: "1 day ago",
      isCustom: true,
      status: "Active"
    },
    {
      id: '3',
      name: "Project",
      apiName: "Project__c",
      description: "Project tracking and management",
      recordCount: 89,
      fieldsCount: 18,
      relationshipsCount: 4,
      lastModified: "3 hours ago",
      isCustom: true,
      status: "Active"
    },
    {
      id: '4',
      name: "Invoice",
      apiName: "Invoice__c",
      description: "Billing and invoice management",
      recordCount: 2156,
      fieldsCount: 12,
      relationshipsCount: 2,
      lastModified: "5 minutes ago",
      isCustom: true,
      status: "Active"
    },
    {
      id: '5',
      name: "User",
      apiName: "User",
      description: "System user accounts (Standard Object)",
      recordCount: 156,
      fieldsCount: 45,
      relationshipsCount: 8,
      lastModified: "Never",
      isCustom: false,
      status: "System"
    }
  ]
  
  // Mock fields for selected object
  export const  MockData_mockFields = [
    {
      id: 1,
      name: "Name",
      apiName: "Name",
      type: "Text",
      required: true,
      unique: false,
      description: "Customer full name"
    },
    {
      id: 2,
      name: "Email",
      apiName: "Email__c", 
      type: "Email",
      required: true,
      unique: true,
      description: "Primary email address"
    },
    {
      id: 3,
      name: "Phone",
      apiName: "Phone__c",
      type: "Phone",
      required: false,
      unique: false,
      description: "Primary contact number"
    },
    {
      id: 4,
      name: "Registration Date",
      apiName: "Registration_Date__c",
      type: "Date",
      required: true,
      unique: false,
      description: "Date when customer registered"
    },
    {
      id: 5,
      name: "Customer Type",
      apiName: "Customer_Type__c",
      type: "Picklist",
      required: true,
      unique: false,
      description: "Type of customer (Premium, Standard, Basic)"
    }
  ]

*/
  // Mock relationships
  export const  MockData_mockRelationships = [
    {
      id: 1,
      name: "Orders",
      type: "One-to-Many",
      relatedObject: "Order__c",
      description: "Customer orders"
    },
    {
      id: 2,
      name: "Account",
      type: "Many-to-One", 
      relatedObject: "Account__c",
      description: "Related account"
    },
    {
      id: 3,
      name: "Support Cases",
      type: "One-to-Many",
      relatedObject: "Case__c",
      description: "Customer support cases"
    }
  ]


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
    // If no token provided, return 401 Unauthorized
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }
    //get page and limit from query params
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");
    console.log("page:", page);
    console.log("size:", size);

    const pagination: PaginationParams = {
      page: Number(page) || 0,
      size: Number(size) || 10,
      sortBy: 'id',
      sortDirection: 'desc'
    };

    const hateoasResponse: HateoasContentResponse<MetaDataRecordDto> = await dynDBMetaDataServerService.getMetaDataRecords(token, pagination);
    console.log("HateoasResponse:", hateoasResponse);

    const apiData: MetaDataRecordDto[] = hateoasResponse.content;

    const data: MetaDataRecordDto[] = apiData  ;// [...apiData, ...mockDataConverted];

    // add mockData tp data
    console.log("data:", data);

    const response: ApiResponse<MetaDataRecordDto[]> = {
      status: 200,
      message: "Success",
      data: data,
      type: ApiResponseTYPE.RECORD_LIST
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(" error:", error);
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
    const body = await request.json() as MetaDataRecordRequestDto;
    console.log("Request body:", body);
    const response: MetaDataRecordDto = await dynDBMetaDataServerService.createMetaDataRecord(token, body);
    console.log("Created record response:", response);
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