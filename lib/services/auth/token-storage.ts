/**
 * Token storage utility for managing authentication tokens
 * Provides functions for storing, retrieving, and clearing tokens
 */
import { REFRESH_TOKEN_STORAGE_KEY, TOKEN_STORAGE_KEY } from "@/lib/constants/global";
import { UserProfileMin } from "./auth-service";

 
export const STORAGE_KEY_USER_ID = "currentUserId";
export const STORAGE_KEY_USER_USERNAME = "currentUserUsername";
export const STORAGE_KEY_USER_EMAIL = "currentUserEmail";
export const STORAGE_KEY_USER_FIRSTNAME = "currentUserFirstname";
export const STORAGE_KEY_USER_LASTNAME = "currentUserLastname";
export const STORAGE_KEY_USER_PROFILE_PIC = "currentUserProfilePic";

/**
 * Retrieve the stored authentication token
 */
export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    // First try localStorage
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    console.log(`token`, token);
    
    if (token) return token;
    
    // Fallback to cookie if not in localStorage
    const cookies = document.cookie.split(';');
    console.log(`cookies`, cookies);
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(TOKEN_STORAGE_KEY + '=')) {
        return cookie.substring(TOKEN_STORAGE_KEY.length + 1);
      }
    }
  }
  return null;
}

/**
 * Store the authentication token
 * 
 * This implementation stores the token in both localStorage and cookies
 * to make it accessible from both client and server contexts
 */
export function storeToken(token: string): void {
  if (typeof window !== 'undefined') {
    // Client-side: Store in localStorage for client access
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    
    // Also store in a cookie for server access
    // Set cookie with path=/, secure flag, SameSite=Strict, and 10 hour expiry
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + 10 * 60 * 60 * 1000); // 10 hours
    
    document.cookie = `${TOKEN_STORAGE_KEY}=${token}; path=/; ${location.protocol === 'https:' ? 'secure;' : ''} SameSite=Strict; expires=${expiryDate.toUTCString()}`;
    
    console.log('Token stored in both localStorage and cookie');
  }
}

/**
 * Retrieve the stored authentication token
 */
export function getStoredRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    // First try localStorage
    const token = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (token) return token;
    // Fallback to cookie if not in localStorage
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(REFRESH_TOKEN_STORAGE_KEY + '=')) {
        return cookie.substring(REFRESH_TOKEN_STORAGE_KEY.length + 1);
      }
    }
  }
  return null;
}

export function storeRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    // Client-side: Store in localStorage for client access
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
    
    // Also store in a cookie for server access
    // Set cookie with path=/, secure flag, SameSite=Strict, and 10 hour expiry
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + 10 * 60 * 60 * 1000); // 10 hours
    
    document.cookie = `${REFRESH_TOKEN_STORAGE_KEY}=${token}; path=/; ${location.protocol === 'https:' ? 'secure;' : ''} SameSite=Strict; expires=${expiryDate.toUTCString()}`;
    
    console.log('Token stored in both localStorage and cookie');
  }
}


export function getUserProfileInfo(): UserProfileMin | null {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem(STORAGE_KEY_USER_ID);
    if (!userId) return null;

    const userUsername = localStorage.getItem(STORAGE_KEY_USER_USERNAME);
    const userEmail = localStorage.getItem(STORAGE_KEY_USER_EMAIL);
    const userFirstname = localStorage.getItem(STORAGE_KEY_USER_FIRSTNAME);
    const userLastname = localStorage.getItem(STORAGE_KEY_USER_LASTNAME);
    const userProfilePic = localStorage.getItem(STORAGE_KEY_USER_PROFILE_PIC);
    if (!userUsername || !userEmail  || !userProfilePic) return null;
    console.log('user ',userId, userUsername, userEmail, userProfilePic);
    
    return  {
        id: parseInt(userId),
        username: userUsername,
        email: userEmail,
        firstName: userFirstname,
        lastName: userLastname,
        profilePictureUrl: userProfilePic,
      } as UserProfileMin;
    };
    
    console.log('user stored in  localStorage');
    return null;
}

export function storeUserProfileInfo(user: UserProfileMin): void {
  if (typeof window !== 'undefined') {
    // Client-side: Store in localStorage for client access
    localStorage.setItem(STORAGE_KEY_USER_ID, user.id.toString());
    localStorage.setItem(STORAGE_KEY_USER_USERNAME, user.username);
    localStorage.setItem(STORAGE_KEY_USER_EMAIL, user.email);
    localStorage.setItem(STORAGE_KEY_USER_FIRSTNAME, user.firstName || '');
    localStorage.setItem(STORAGE_KEY_USER_LASTNAME, user.lastName || '');
    localStorage.setItem(STORAGE_KEY_USER_PROFILE_PIC, user.profilePictureUrl || '/logo/avatar.svg');
    console.log('user stored in  localStorage');
  }
}

/**
 * Clear the stored authentication token
 */
export function clearStoredToken(): void {
  if (typeof window !== 'undefined') {
    // Clear from localStorage
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    
    // Clear from cookies
    document.cookie = `${TOKEN_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    console.log('Token cleared from both localStorage and cookie');
  }
}

/**
 * Check if a token is stored
 */
export function hasStoredToken(): boolean {
  return !!getStoredToken();
}