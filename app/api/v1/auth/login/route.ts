import { authService } from "@/lib/services"
import { type NextRequest, NextResponse } from "next/server"

// Check if we're in development mode

export async function POST(request: NextRequest) {
  console.log("🔴 LOGIN API: Request received");
  
  try {
    const body = await request.json()
    const { username, password } = body
    console.log("📥 Login API: Received form data:", { 
      username, 
      password: password ? '****' : 'undefined',
      hasUsername: !!username,
      hasPassword: !!password
    });
    
    if (!username || !password) {
      console.log("❌ Login API: Missing username or password");
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }
    
    console.log("🔄 Login API: Calling authService.login...");
    try {
      const loginResponse = await authService.login({
        username,
        password,
      });
      
      console.log("📊 Login API: authService response:", {
        hasAccessToken: !!loginResponse?.accessToken,
        hasRefreshToken: !!loginResponse?.refreshToken,
        hasUser: !!loginResponse?.user,
        expiresIn: loginResponse?.expiresIn,
        userId: loginResponse?.user?.id,
        userEmail: loginResponse?.user?.email
      });
    
      if (loginResponse?.accessToken) {
        console.log("✅ Login API: Success - returning response");
        return NextResponse.json(
          loginResponse,
          { status: 200 },
        )
      } else {
        console.log("❌ Login API: No access token in response");
        return NextResponse.json({ error: "Authentication failed - no token" }, { status: 401 });
      }
    } catch (loginError) {
      console.error("❌ Login API: authService.login failed:", loginError);
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
  } catch (error) {
    console.error("💥 Login API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
