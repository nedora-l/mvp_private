import { authService } from "@/lib/services"
import { type NextRequest, NextResponse } from "next/server"

// Check if we're in development mode
const isDevelopment = false; //process.env.NODE_ENV === 'development';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken, accessToken } = body
    console.debug("refreshToken API: Received form data:", { accessToken, refreshToken: '****' });
    if (!refreshToken || !accessToken) {
      console.debug("refreshToken API: Missing refreshToken or accessToken");
      return NextResponse.json({ error: "refreshToken and accessToken are required" }, { status: 400 })
    }
    console.debug("refreshToken API: Calling authService.refreshToken");
    try {
      const refreshResponse = await authService.refreshToken({
        refreshToken,
        accessToken,
      });
      console.debug("refreshToken API: Success response from authService:", 
        refreshResponse?.accessToken ? { 
          token: refreshResponse.accessToken.substring(0, 10) + '...',
          expiresIn: refreshResponse.expiresIn 
        } : 'No token in response');
    
      return NextResponse.json(
        refreshResponse,
        { status: 200 },
      )
    } catch (loginError) {
      console.error("Login API: authService.login failed:", loginError);
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
  } catch (error) {
    console.error("Login API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
