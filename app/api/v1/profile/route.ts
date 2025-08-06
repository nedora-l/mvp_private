import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { ApiResponse, UserProfile } from "@/lib/services";
 
/**
 * Extract token from Authorization header
 */
function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Decode JWT token payload (simplified for mock purposes)
 */
function decodeToken(token: string): { sub: string } | null {
  try {
    // Get the payload part (second segment) of the JWT
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the base64-encoded payload
    const payload = Buffer.from(parts[1], 'base64').toString();
    return JSON.parse(payload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * GET endpoint to retrieve the current user's profile
 * Used to verify if JWT is valid and get user information
 */
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
    
    // Decode token to get username
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    
    const username = decodedToken.sub;
    
    // In a real implementation, you would fetch the user profile from a database
    // Mock implementation for demonstration purposes
     const mockProfile: UserProfile = {
      id: 1,
      username: username,
      title: username === "admin" ? "Mr" : "Ms",
      firstName: username === "admin" ? "Rachid" : "Jane",
      lastName: username === "admin" ? "Taryaoui" : "Doe",
      email: username === "admin" ? "rachid.taryaoui@da-tech.ma" : "jane.doe@example.com",
      roles: "ROLE_ADMIN,ROLE_USER",
      phone: "+212651378713",
      locale: "fr_FR",
      timeZone: "Africa/Casablanca",
      createdAt: "2024-11-27T22:56:53",
      fullName: username === "admin" ? "Taryaoui Rachid" : "Jane Doe",
      systemAdmin: username === "admin",
      orgAdmin: username === "admin",
      initials: username === "admin" ? "TR" : "JD"
    };
    
    // Create API response in the expected format
    const response: ApiResponse<UserProfile> = {
      status: 200,
      message: "Success",
      data: mockProfile,
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