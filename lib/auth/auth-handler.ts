import { signIn, signOut, getSession } from "next-auth/react"
import { authService } from "@/lib/services"
import { syncNextAuthWithAppAuth } from "./nextauth-helpers"
import { debugSession } from "./auth-debug"

/**
 * Handles Google sign-in with error handling
 * @param callbackUrl URL to redirect to after successful sign-in
 * @returns Promise that resolves to a boolean indicating success
 */
export async function signInWithGoogle(callbackUrl: string = "/auth/test"): Promise<boolean> {
  try {
    await signIn("google", { 
      callbackUrl, 
    })
    return true
  } catch (error) {
    console.error("Error signing in with Google:", error)
    return false
  }
}

/**
 * Handles credential-based sign-in with error handling
 * @param username Username
 * @param password Password
 * @param callbackUrl URL to redirect to after successful sign-in
 * @returns Promise that resolves to a boolean indicating success
 */
export async function signInWithCredentials(
  username: string,
  password: string,
  callbackUrl: string = "/app/dashboard"
): Promise<boolean> {
  try {
     await signIn("credentials", {
      username,
      password,
      callbackUrl,
    })
    return true
  } catch (error) {
    console.error("Error signing in with credentials:", error)
    return false
  }
}

/**
 * Handles sign-out with proper cleanup
 * @param callbackUrl URL to redirect to after sign-out
 */
export async function handleSignOut(callbackUrl: string = "/"): Promise<void> {
  try {
    // Clean up local auth state
    authService.clearStoredToken()
    
    // Use NextAuth sign out
    await signOut({ callbackUrl })
  } catch (error) {
    console.error("Error signing out:", error)
    // Fallback to direct navigation
    window.location.href = callbackUrl
  }
}

/**
 * Synchronizes the current session with the auth context
 * @returns Promise that resolves to a boolean indicating if sync was successful
 */
export async function syncCurrentSession(): Promise<boolean> {
  try {
    const session = await getSession()
    if (session) {
      syncNextAuthWithAppAuth(session)
      debugSession(session, "Session synced")
      return true
    }
    return false
  } catch (error) {
    console.error("Error syncing session:", error)
    return false
  }
}
