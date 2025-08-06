/**
 * Auth Service
 * Handles authentication operations like login and logout
 */

import { ApiResponse } from '@/lib/interfaces/apis/common';
import { httpClient } from '../../utils/http-client';
import * as tokenStorage from './token-storage';

// For server-side token management - not persisted between requests
let serverSideToken: string | null = null;
let serverSideRefreshToken: string | null = null;
let serverSideUser: UserProfileMin | null = null;

// Check if we're in development mode
const isDevelopment = false; //process.env.NODE_ENV === 'development';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RefreshCredentials {
  refreshToken: string;
  accessToken: string;
}

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  phone: string;
  address: string;
  locale: string;
  role: string; // This is a comma-separated string from the API
  roles: string[]; // This is the parsed array version
  timeZone: string;
  title: string;
  departmentId: number;
  teamId: number | null;
  countryId: number;
  cityId: number;
}

export interface LoginResponse {
  error: string;
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
  user: ApiUser;
}

export interface AuthUser {
  username: string;
  isAuthenticated: boolean;
}

// API response wrapper format

export interface ApiPageable<T> {
  content: T;
  totalPages: number;
  totalElements: number;
}

// User profile data structure


export interface UserProfileMin {
  id: number;
  username: string;
  roles: string[] | string;
  firstName?: string;
  lastName?: string;
  email: string;
  locale?: string;
  profilePictureUrl?: string;
}

export interface UserProfile extends UserProfileMin {
  id: number;
  username: string;
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  locale?: string;
  timeZone?: string;
  createdAt?: string;
  fullName?: string;
  systemAdmin?: boolean;
  orgAdmin?: boolean;
  initials?: string;
}

export class AuthService {
  /**
   * Login user with username and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('AuthService: Login attempt with username:', credentials.username);
      // Fixed endpoint to match the actual API route
      const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
      console.log('response',response);
      console.log('AuthService: Login response status:', response.status, 'OK:', response.ok);
      // Log more details about the response data
      if (response.data) {
        console.log('AuthService: Response data received:', JSON.stringify(response.data));
      }
      if (!response.ok || !response.data.accessToken) {
        console.error('AuthService: Login failed with status:', response.status);
        throw new Error('Login failed: Invalid credentials or server error');
      }
      // Log the token (partially masked for security)
      const tokenPreview = response.data.accessToken.substring(0, 10) + '...' + 
        response.data.accessToken.substring(response.data.accessToken.length - 10);
      console.log('AuthService: Login successful, received token:', tokenPreview);
      
      // Store token
      this.storeToken(response.data.accessToken);
      this.storeRefreshToken(response.data.refreshToken);
      
      return response.data;
    } 
    catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  }

  
  async exchangeToken(credentials: RefreshCredentials): Promise<LoginResponse> {
    try {
      console.log('AuthService: exchangeToken attempt with refreshToken:', credentials.refreshToken);
      const headers = {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
        }
      };
      const response = await httpClient.post<LoginResponse>('/auth/exchange-token', credentials, headers);
      console.log('response',response);

      console.log('AuthService: exchange token response status:', response.status, 'OK:', response.ok);

      // Log more details about the response data
      if (response.data) {
        console.log('AuthService: Response data received:', JSON.stringify(response.data));
      }
      
      if (!response.ok || !response.data.accessToken) {
        console.error('AuthService: exchange token failed with status:', response.status);
        throw new Error('Token exchange failed: Invalid credentials or server error');
      }
      
      // Log the token (partially masked for security)
      const tokenPreview = response.data.accessToken.substring(0, 10) + '...' + 
        response.data.accessToken.substring(response.data.accessToken.length - 10);
      console.log('AuthService: Login successful, received token:', tokenPreview);
      
      // Store token
      this.storeToken(response.data.accessToken);
      this.storeRefreshToken(response.data.refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  }  /**
   * Exchange Google tokens for application tokens
   */
  async exchangeGoogleToken(refreshToken: string, accessToken: string): Promise<LoginResponse> {
    try {
      console.log('AuthService: exchangeGoogleToken attempt with Google tokens');
        // Build URL - absolute for server-side calls, relative for client-side
      let url = '/auth/exchange-token';
      if (typeof window === 'undefined') {
        // Server-side: construct absolute URL for backend API
        const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || process.env.DEFAULT_BASE_URL || 'https://da-workspace.da-tech.ma';
        url = `${baseUrl}${url}`;
        console.log('AuthService: Server-side call to backend:', url);
      } else {
        console.log('AuthService: Client-side call, using relative URL:', url);
      }

      // Match backend ExchangeTokenRequestDto format - only accessToken field
      const requestBody = { accessToken };
      
      // Make direct fetch call to handle server-side properly
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('AuthService: exchangeGoogleToken response status:', response.status, 'OK:', response.ok);

      let responseData;
      try {
        responseData = await response.json();
        console.log('AuthService: exchangeGoogleToken response data received');
      } catch (parseError) {
        console.error('AuthService: Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response format from backend');
      }
      
      if (!response.ok || !responseData.accessToken) {
        console.error('AuthService: exchangeGoogleToken failed with status:', response.status);
        throw new Error('Google token exchange failed: ' + (responseData?.error || 'Unknown error'));
      }
      
      // Log the token (partially masked for security)
      const tokenPreview = responseData.accessToken.substring(0, 10) + '...' + 
        responseData.accessToken.substring(responseData.accessToken.length - 10);
      console.log('AuthService: exchangeGoogleToken successful, received token:', tokenPreview);
      
      // Store token only on client-side
      if (typeof window !== 'undefined') {
        this.storeToken(responseData.accessToken);
        this.storeRefreshToken(responseData.refreshToken);
      }
      
      return responseData;
    } catch (error) {
      console.error('AuthService: exchangeGoogleToken error:', error);
      throw error;
    }
  }

  //RefreshCredentials
  /**
   * Refresh user with refresh token and access token
   */
  async refreshToken(credentials: RefreshCredentials): Promise<LoginResponse> {
    try {
      console.log('AuthService: Refresh token attempt with refreshToken:', credentials.refreshToken);
      const headers = {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json',
        }
      };
      const response = await httpClient.post<LoginResponse>('/auth/refresh-token', credentials, headers);
      console.log('response',response);

      console.log('AuthService: Refresh token response status:', response.status, 'OK:', response.ok);

      // Log more details about the response data
      if (response.data) {
        console.log('AuthService: Response data received:', JSON.stringify(response.data));
      }
      
      if (!response.ok || !response.data.accessToken) {
        console.error('AuthService: Refresh token failed with status:', response.status);
        throw new Error('Login failed: ' + (response.data?.error || 'Unknown error'));
      }
      
      // Log the token (partially masked for security)
      const tokenPreview = response.data.accessToken.substring(0, 10) + '...' + 
        response.data.accessToken.substring(response.data.accessToken.length - 10);
      console.log('AuthService: Login successful, received token:', tokenPreview);
      
      // Store token
      this.storeToken(response.data.accessToken);
      this.storeRefreshToken(response.data.refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * POST /api/auth/register
   */
  async registerUser(accessToken: string, registrationDto: any): Promise<string> {
    const headers = this.getHeaders(accessToken);
    const response = await httpClient.post<string>(
      '/api/auth/register',
      registrationDto,
      headers
    );
    return response.data;
  }

  /**
   * Forgot password
   * POST /api/auth/password/forgot
   */
  async forgotPassword(email: string): Promise<string> {
    // Set Content-Type to text/plain and send email as plain text
    const headers = { headers: { 'Content-Type': 'text/plain' } };
    const response = await httpClient.post<string>(
      '/auth/password/forgot',
      email,
      headers
    );
    return response.data;
  }

  /**
   * Reset password
   * POST /api/auth/password/reset/{token}
   */
  async resetPassword(token: string, newPassword: string): Promise<string> {
    const headers = this.getHeaders();
    const response = await httpClient.post<string>(
      `/api/auth/password/reset/${token}`,
      { newPassword },
      headers
    );
    return response.data;
  }

  /**
   * Change password
   * PUT /api/auth/password/change
   */
  async changePassword(accessToken: string, oldPassword: string, newPassword: string): Promise<string> {
    const headers = this.getHeaders(accessToken);
    const response = await httpClient.put<string>(
      '/api/auth/password/change',
      { oldPassword, newPassword },
      headers
    );
    return response.data;
  }

  /**
   * Validate password reset token
   * GET /api/auth/password/validate/{token}
   */
  async validatePasswordResetToken(token: string, email: string): Promise<string> {
    const headers = this.getHeaders();
    headers.headers['email'] = email;
    const response = await httpClient.get<string>(
      `/api/auth/password/validate/${token}`,
      headers
    );
    return response.data;
  }

  /**
   * Logout (API endpoint)
   * POST /api/auth/logout
   */
  async logoutApi(accessToken: string): Promise<string> {
    const headers = this.getHeaders(accessToken);
    const response = await httpClient.post<string>(
      '/api/auth/logout',
      undefined,
      headers
    );
    return response.data;
  }

  /**
   * Helper to build headers for API requests
   */
  getHeaders(accessToken?: string) {
    const headers: Record<string, string> = {};
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    headers['Content-Type'] = 'application/json';
    return { headers };
  }

  /**
   * Logout the current user
   */
  logout(): void {
    this.clearStoredToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const hasToken = !!this.getAccessToken();
    console.log('isAuthenticated check, token exists:', hasToken);
    return hasToken;
  }

  /**
   * Get current auth token
   * Works in both client and server environments
   */
  getAccessToken(): string | null {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Client-side: use localStorage via token storage
      return tokenStorage.getStoredToken();
    } else {
      // Server-side: use in-memory token
      return serverSideToken;
    }
  }

  /**
   * Get current auth token
   * Works in both client and server environments
   */
  getRefreshToken(): string | null {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Client-side: use localStorage via token storage
      return tokenStorage.getStoredToken();
    } else {
      // Server-side: use in-memory token
      return serverSideToken;
    }
  }

  /**
   * Store authentication token
   * Works in both client and server environments
   */
  storeToken(token: string): void {
    console.log('storeToken called with token');
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Client-side: use localStorage and cookies via token storage
      tokenStorage.storeToken(token);
    } else {
      // Server-side: store in memory
      serverSideToken = token;
    }
  }

  /**
   * Store authentication token
   * Works in both client and server environments
   */
  storeRefreshToken(token: string): void {
    console.log('storeRefreshToken called with token');
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Client-side: use localStorage and cookies via token storage
      tokenStorage.storeRefreshToken(token);
    } else {
      // Server-side: store in memory
      serverSideRefreshToken = token;
    }
  }


  storeUserProfileInfo(user: UserProfileMin): void {
    console.log('storeRefreshToken called with token');
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Client-side: use localStorage and cookies via token storage
      tokenStorage.storeUserProfileInfo(user);
    } else {
      // Server-side: store in memory
      serverSideUser = user;
    }
  }



  /**
   * Clear stored authentication token
   * Works in both client and server environments
   */
  clearStoredToken(): void {
    console.log('clearStoredToken called');
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Client-side: use localStorage and cookies via token storage
      tokenStorage.clearStoredToken();
    } else {
      // Server-side: clear in-memory token
      serverSideToken = null;
    }
  }

  /**
   * Get current user profile
   * This verifies if the JWT token is still valid
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      console.log('Fetching current user profile...');
      // Check if we have a token first
      if (!this.isAuthenticated()) {
        console.log('!isAuthenticated() returned false, no token found');
        return null;
      }

      const headers = {
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
          'Content-Type': 'application/json',
        }
      };
      console.log('headers:', headers);
   
      const response = await httpClient.get<ApiResponse<UserProfile>>('/api/users/me',headers);
      console.log('response:', response);

      if (!response.ok) {
        // If we get a 401 Unauthorized, the token is invalid or expired
        if (response.status === 401) {
          console.log('Unauthorized response, clearing token');
          //this.clearStoredToken();
        }
        return null;
      }
      // Extract the user profile data from the API response
      // Handle both direct response and nested ApiResponse format
      return response.data?.data  || null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Clear token on authentication errors
      if (error instanceof Error && error.message.includes('Unauthorized')) {
       // this.clearStoredToken();
      }
      return null;
    }
  }
}

// Export a default instance
export const authService = new AuthService();