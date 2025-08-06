import { authService } from "@/lib/services"

/**
 * Cleans up any session-related data when a session ends
 * This function should be called when signing out or when sessions expire
 */
export function cleanupSession(): void {
  try {
    // Clear tokens from storage
    authService.clearStoredToken()
    
    // Clear any other session-related data here
    console.log("Session data cleaned up successfully")
  } catch (error) {
    console.error("Error cleaning up session data:", error)
  }
}
