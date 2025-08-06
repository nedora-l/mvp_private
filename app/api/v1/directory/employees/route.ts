import { type NextRequest, NextResponse } from "next/server"
import { AppEmployee } from "@/lib/interfaces/apis/employee";
import { ApiResponse, HateoasPagination, HateoasResponse } from "@/lib/interfaces/apis/common";
import { directoryServerService } from "@/lib/services/server/directory/directory.server.service";
import { UserProfile } from "@/lib/services";
import { organizationServerService } from "@/lib/services/server/org/organization.server.service";

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
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "0", 0);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const params = { query, page, size}  as HateoasPagination ;
    const employeesData  = await directoryServerService.getEmployees(token, params);

    console.log("Employees data:", employeesData);
    const response: ApiResponse<HateoasResponse<AppEmployee>> = {
      status: 200,
      message: "Success",
      data: employeesData,
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
    const body = await request.json();
    const { username, email, password, firstName, lastName } = body;

    // Basic validation
    if (!username || !email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const orgResponse = await organizationServerService.createUser({
      username,
      email,
      password,
      firstName,
      lastName
    }, token);
    console.log("orgResponse", orgResponse);

    if (!orgResponse ) {
      return NextResponse.json(
        { message: "User registration failed" },
        { status: 500 }
      );
    }

    
    console.log("User registration successful:", orgResponse);

    // Create a mock employee response
    const newEmployee: UserProfile = {
      id: 1,
      firstName : firstName,
      lastName: lastName,
      username,
      email,
      title: "New Employee", 
      phone : "",
      roles: ["employee"],
    };

    const response: ApiResponse<UserProfile> = {
      status: 201,
      message: "User created successfully",
      data: newEmployee,
      type: "RECORD_CREATED"
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("User registration error:", error);
    return NextResponse.json(
      { 
        status: 500,
        message: "Internal server error",
        data: null,
        type: "ERROR"
      }, 
      { status: 500 }
    );
  }
}
