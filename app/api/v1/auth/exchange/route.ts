import { authService } from "@/lib/services"
import { type NextRequest, NextResponse } from "next/server"

// Check if we're in development mode

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accessToken, refreshToken } = body
    console.debug("Exchange API: Received Google tokens for exchange:", { 
      hasAccessToken: !!accessToken, 
      hasRefreshToken: !!refreshToken 
    });
    
    if (!accessToken || !refreshToken) {
      console.debug("Exchange API: Missing accessToken or refreshToken");
      return NextResponse.json({ error: "Access token and refresh token are required" }, { status: 400 })
    }
    
    console.debug("Exchange API: Calling authService.exchangeGoogleToken");
    try {
      // Use exchangeGoogleToken method which is designed for Google token exchange
      const loginResponse = await authService.exchangeGoogleToken(refreshToken, accessToken);
      
      console.debug("Exchange API: Success response from authService:", 
        loginResponse?.accessToken ? { 
          token: loginResponse.accessToken.substring(0, 10) + '...',
          expiresIn: loginResponse.expiresIn 
        } : 'No token in response');
    
      return NextResponse.json(
        loginResponse,
        { status: 200 },
      )
    } catch (loginError) {
      console.error("Exchange API: authService.exchangeGoogleToken failed:", loginError);
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
  } catch (error) {
    console.error("Exchange API: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
