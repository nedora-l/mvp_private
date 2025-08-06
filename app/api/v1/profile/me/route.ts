import { NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/services"
import { cookies } from 'next/headers'

/**
 * Get current user profile API route
 * Acts as a proxy between client components and authService
 */
export async function GET(req: NextRequest) {
  try {
    // Check for authentication token in the request headers
    const authHeader = req.headers.get('authorization')
    
    // Try to get token from cookie as fallback if not in headers
    let token: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token from header
      token = authHeader.split(' ')[1]
      console.log('Token found in authorization header')
    } else {
      // Try to get token from cookie as fallback
      const cookieStore = await cookies()
      token = cookieStore.get('app-auth-token')?.value || null
      if (token) {
        console.log('Token found in cookie')
      } else {
        console.log('No valid authorization found in headers or cookies')
        return NextResponse.json(
          { error: "Unauthorized", message: "Authentication required" },
          { status: 401 }
        )
      }
    }

    // If no token is present, return unauthorized
    if (!token) {
      console.log('No token found')
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      )
    }
    console.log('Token found:', token.substring(0, 5) + '...' + token.substring(token.length - 5))

    // Store the token temporarily for the getCurrentUser call
    authService.storeToken(token)
    
    try {
      // Call the service to get the current user profile
      const profile = await authService.getCurrentUser()
      
      // If no profile is returned, the token might be invalid
      if (!profile) {
        console.log('No profile returned from auth service')
        return NextResponse.json(
          { error: "Unauthorized", message: "Invalid or expired token" },
          { status: 401 }
        )
      }
      
      return NextResponse.json(profile)
    } finally {
      // Clear the token after the request to avoid side effects
      // This is critical for server-side code to prevent token leakage
      //authService.clearStoredToken()
    }
  } catch (error) {
    console.error("Error in get current user profile API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    )
  }
}