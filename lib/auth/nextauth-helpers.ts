
import { Session } from "next-auth"
import { authService } from "@/lib/services"
import { UserProfileMin } from "@/lib/services/auth/auth-service"

/**
 * Synchronizes the NextAuth session with the application's auth service
 * This helps bridge the gap between NextAuth and your custom auth context
 */
export function syncNextAuthWithAppAuth(session: Session | null): void {
  if (!session || !session.user) {
    console.log("No NextAuth session to sync")
    return
  }

  try {
    // Store auth tokens from NextAuth session
    if (session.user.accessToken) {
      authService.storeToken(session.user.accessToken)
    }
    
    if (session.user.refreshToken) {
      authService.storeRefreshToken(session.user.refreshToken)
    }
    
    // Create a user profile from session data if it exists
    if (session.user.username || session.user.firstName) {
      const userProfile: UserProfileMin = {
        id: parseInt(session.user.id || "0"),
        username: session.user.username || session.user.name || "",
        email: session.user.email || "",
        roles: session.user.roles || [],
        firstName: session.user.firstName || session.user.name?.split(" ")[0] || "",
        lastName: session.user.lastName || session.user.name?.split(" ").slice(1).join(" ") || "",
        locale: session.user.locale || "en",
        profilePictureUrl: session.user.profilePictureUrl || session.user.image || undefined
      }
      
      authService.storeUserProfileInfo(userProfile)
    }
    
    console.log("NextAuth session synced with auth service")
  } catch (error) {
    console.error("Error syncing NextAuth session with auth service:", error)
  }
}

/**
 * Gets user profile info from NextAuth session
 */
export function getUserProfileFromSession(session: Session | null): UserProfileMin | null {
  if (!session?.user) {
    return null
  }
  
  try {
    return {
      id: parseInt(session.user.id || "0"),
      username: session.user.username || session.user.name || "",
      email: session.user.email || "",
      roles: session.user.roles || [],
      firstName: session.user.firstName || session.user.name?.split(" ")[0] || "",
      lastName: session.user.lastName || session.user.name?.split(" ").slice(1).join(" ") || "",
      locale: session.user.locale || "en",
      profilePictureUrl: session.user.profilePictureUrl || session.user.image || undefined
    }
  } catch (error) {
    console.error("Error creating user profile from session:", error)
    return null
  }
}

/**
 * Gets complete user data from NextAuth session
 * Returns the full user object with all API fields
 */
export function getCompleteUserFromSession(session: Session | null) {
  if (!session?.user) {
    return null
  }
  
  return {
    // Basic info
    id: session.user.id,
    username: session.user.username,
    email: session.user.email,
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    name: session.user.name,
    // Profile
    profilePictureUrl: session.user.profilePictureUrl,
    image: session.user.image,
    phone: session.user.phone,
    address: session.user.address,
    title: session.user.title,
    // Localization
    locale: session.user.locale,
    timeZone: session.user.timeZone,
    // Authorization
    role: session.user.role,
    roles: session.user.roles,
    // Organization
    departmentId: session.user.departmentId,
    teamId: session.user.teamId,
    countryId: session.user.countryId,
    cityId: session.user.cityId,
    // Auth tokens
    accessToken: session.user.accessToken,
    refreshToken: session.user.refreshToken,
    tokenType: session.user.tokenType,
    provider: session.user.provider,
  }
}
