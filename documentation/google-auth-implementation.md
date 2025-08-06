# Google OAuth2 Authentication Implementation

This document outlines the implementation of Google OAuth2 authentication in our DAWS application using Next.js and NextAuth.js.

## Architecture Overview

The authentication system uses:

- **Next.js**: For the application framework
- **NextAuth.js**: For handling OAuth authentication flows
- **Google OAuth2**: As the authentication provider

## Key Components

1. **auth.config.ts**: Configures NextAuth.js with Google provider settings
2. **NextAuthProvider**: Client component that wraps the app with SessionProvider
3. **GoogleLoginButton**: Component that handles Google sign-in
4. **auth-status-display.tsx**: Component that displays the current authentication status

## Integration Points

- **NextAuth Session**: Managed by NextAuth.js
- **App Auth Context**: Our custom context for auth state
- **Sync Mechanism**: The `nextauth-helpers.ts` bridges NextAuth session with our app's auth context

## Setup Requirements

1. **Environment Variables**:
   - `GOOGLE_CLIENT_ID`: OAuth client ID from Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: OAuth client secret from Google Cloud Console
   - `NEXTAUTH_URL`: Base URL of your application
   - `NEXTAUTH_SECRET`: Secret key for NextAuth.js

2. **Google Cloud Console Configuration**:
   - Create OAuth credentials (see `documentation/google-oauth-setup.md`)
   - Configure authorized redirect URIs
   - Enable necessary APIs

## Authentication Flow

1. User clicks the Google Sign-In button
2. NextAuth redirects to Google's authentication page
3. User authenticates with Google
4. Google redirects back to our application with an auth code
5. NextAuth exchanges the code for access tokens
6. Session is created and synchronized with app auth context
7. User is redirected to the specified callback URL

## Testing

Test the integration by:

1. Setting up environment variables
2. Running the application locally
3. Clicking the Google Sign-In button
4. Verifying that authentication works
5. Checking that user profile is correctly displayed

## Debugging

If the authentication doesn't work:

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure Google OAuth credentials are configured properly
4. Check that redirect URIs match exactly what's in Google Cloud Console
