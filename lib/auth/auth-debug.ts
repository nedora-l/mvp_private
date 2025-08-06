import { Session } from "next-auth"

/**
 * Utility for debugging authentication issues
 * Safely logs authentication information without revealing sensitive data
 */
export function debugSession(session: Session | null, prefix = "Session"): void {
  if (!session) {
    console.log(`${prefix}: No session found`)
    return
  }
  
  try {
    // Safe version of the session object for logging
    const safeSession = {
      expires: session.expires,
      user: {
        id: session.user?.id,
        name: session.user?.name,
        email: session.user?.email ? `${session.user.email.substring(0, 3)}...${session.user.email.split('@')[1]}` : null,
        provider: session.user?.provider,
        hasAccessToken: !!session.user?.accessToken,
        hasRefreshToken: !!session.user?.refreshToken,
      }
    }
    
    console.log(`${prefix}:`, safeSession)
  } catch (error) {
    console.error(`Error debugging session:`, error)
  }
}

/**
 * Utility to test if NextAuth is properly configured
 * Returns an object with issues if any are found
 */
export function testNextAuthConfig(): Record<string, boolean | string> {
  const issues: Record<string, boolean | string> = {
    hasIssues: false
  }
  
  // Check for required environment variables
  if (!process.env.NEXTAUTH_SECRET) {
    issues.hasIssues = true
    issues.missingNextAuthSecret = "NEXTAUTH_SECRET environment variable is missing"
  }
  
  if (!process.env.NEXTAUTH_URL && typeof window === 'undefined') {
    issues.hasIssues = true
    issues.missingNextAuthUrl = "NEXTAUTH_URL environment variable is missing"
  }
  
  if (!process.env.GOOGLE_CLIENT_ID) {
    issues.hasIssues = true
    issues.missingGoogleClientId = "GOOGLE_CLIENT_ID environment variable is missing"
  }
  
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    issues.hasIssues = true
    issues.missingGoogleClientSecret = "GOOGLE_CLIENT_SECRET environment variable is missing"
  }
  
  return issues
}
