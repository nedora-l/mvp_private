/**
 * Auth API Client
 * Client-side utility functions for interacting with auth-related API endpoints
 */

import type { LoginResponse, UserProfile } from "@/lib/services/auth/auth-service";
import { getStoredToken } from "@/lib/services/auth/token-storage";

/**
 * Get the current user's profile
 * @returns The user profile data
 */
export async function getCurrentUser(): Promise<UserProfile> {
  // Get the stored token and add it to the Authorization header
  const token = getStoredToken(); // TODO : verify if this is the right place to call this function
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add auth header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Build absolute URL for server-side or relative for client-side
  let url = '/api/v1/profile/me';
  
  // Check if we're running on the server side
  if (typeof window === 'undefined') {
    // Server-side: construct absolute URL
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    url = `${baseUrl}/api/v1/profile/me`;
  }
  
  const response = await fetch(url, {
    headers
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Authentication required');
    }
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user profile');
  }

  return response.json();
}


/**
 * Get the current user's profile
 * @returns The user profile data
 */
export async function getLoginToken(username: string, password: string): Promise<LoginResponse> {
  console.debug("auth-api: Login attempt with username:", username);
  
  try {
    // Create absolute URL for server-side calls (NextAuth credentials provider)
    const baseUrl = process.env.NEXTAUTH_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const loginUrl = `${baseUrl}/api/v1/auth/login`;
    
    console.debug("auth-api: Making request to:", loginUrl);
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    
    console.debug("auth-api: Login response status:", response.status, "ok:", response.ok);
    
    // Make sure we can parse response even if it's not JSON
    let responseData;
    try {
      responseData = await response.json();
      console.log("auth-api: Response data:", responseData);
    } catch (parseError) {
      console.error("auth-api: Failed to parse response as JSON:", parseError);
      throw new Error('Invalid response format from server');
    }
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("auth-api: Authentication failed (401)");
        throw new Error('Unauthorized: Authentication required');
      }
      console.error("auth-api: Login failed with error:", responseData.error);
      throw new Error(responseData.error || 'Failed to authenticate');
    }

    return responseData;
  } catch (error) {
    console.error("auth-api: Login request error:", error);
    throw error;
  }
}

export async function refreshLoginToken(refreshToken: string, accessToken: string): Promise<LoginResponse> {
  console.debug("auth-api: Refresh token attempt with refreshToken:", refreshToken);
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    // Add auth header if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }    // Build absolute URL for server-side or relative for client-side
    let url = '/api/v1/auth/refresh-token';
    
    // Check if we're running on the server side
    if (typeof window === 'undefined') {
      // Server-side: construct absolute URL
      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      url = `${baseUrl}/api/v1/auth/refresh-token`;
      console.debug("auth-api: Server-side request, using absolute URL:", url);
    } else {
      console.debug("auth-api: Client-side request, using relative URL:", url);
    }
    
    // Using absolute path to ensure it hits the Next.js API route
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        refreshToken,
        accessToken,
      }),
    });
    
    console.debug("auth-api: refresh response status:", response.status, "ok:", response.ok);
    
    // Make sure we can parse response even if it's not JSON
    let responseData;
    try {
      responseData = await response.json();
      console.log("auth-api: Response data:", responseData);
    } catch (parseError) {
      console.error("auth-api: Failed to parse response as JSON:", parseError);
      throw new Error('Invalid response format from server');
    }
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error("auth-api: Authentication failed (401)");
        throw new Error('Unauthorized: Authentication required');
      }
      console.error("auth-api: Login failed with error:", responseData.error);
      throw new Error(responseData.error || 'Failed to authenticate');
    }
    return responseData;
  } catch (error) {
    console.error("auth-api: Login request error:", error);
    throw error;
  }
}

/**
 * Auth API Client
 * Client-side utility functions for interacting with auth-related API endpoints
 */
export async function exchangeGoogleToken(refreshToken: string, accessToken: string): Promise<LoginResponse> {
  console.debug("auth-api: exchangeGoogleToken attempt with refreshToken:", refreshToken);
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    // Add auth header if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
       // Build absolute URL for server-side or relative for client-side
    let url = '/api/v1/auth/exchange';
    
    // Check if we're running on the server side
    if (typeof window === 'undefined') {
      // Server-side: construct absolute URL
      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      url = `${baseUrl}/api/v1/auth/exchange`;
      console.debug("auth-api: Server-side request, using absolute URL:", url);
    } else {
      console.debug("auth-api: Client-side request, using relative URL:", url);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        refreshToken,
        accessToken,
      }),
    });
    console.debug("auth-api: exchangeGoogleToken response status:", response.status, "ok:", response.ok);

    console.debug("auth-api: refresh response status:", response.status, "ok:", response.ok);
    console.log("Response data:", response);
    // Make sure we can parse response even if it's not JSON
    let responseData;
    try {
      responseData = await response.json();
      console.log("auth-api: Response data:", responseData);
    } catch (parseError) {
      console.error("auth-api: Failed to parse response as JSON:", parseError);
      throw new Error('Invalid response format from server');
    }
    if (!response.ok) {
      if (response.status === 401) {
        console.error("auth-api: Authentication failed (401)");
        throw new Error('Unauthorized: Authentication required');
      }
      console.error("auth-api: Login failed with error:", responseData.error);
      throw new Error(responseData.error || 'Failed to authenticate');
    }
    return responseData;
  } catch (error) {
    console.error("auth-api: Login request error:", error);
    throw error;
  }
}

/**
 * Forgot password
 * POST /api/v1/auth/forgot-password
 */
export async function forgotPassword(email: string): Promise<{ ok: boolean; error?: string }> {
  const url = "/api/v1/auth/forgot-password";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to request password reset");
  return data;
}

/**
 * Reset password
 * POST /api/v1/auth/reset-password
 */
export async function resetPassword(token: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const url = "/api/v1/auth/reset-password";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to reset password");
  return data;
}

/**
 * Change password
 * PUT /api/v1/auth/change-password
 */
export async function changePassword(oldPassword: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  const token = getStoredToken();
  const url = "/api/v1/auth/change-password";
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to change password");
  return data;
}

/**
 * Validate password reset token
 * GET /api/v1/auth/validate-password-reset?token=...&email=...
 */
export async function validatePasswordResetToken(token: string, email: string): Promise<{ ok: boolean; error?: string }> {
  const url = `/api/v1/auth/validate-password-reset?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  const response = await fetch(url, { method: "GET" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to validate reset token");
  return data;
}