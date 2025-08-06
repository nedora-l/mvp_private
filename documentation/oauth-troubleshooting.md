# OAuth Integration Troubleshooting Guide

If you encounter issues with the OAuth integration, follow this troubleshooting guide to diagnose and fix common problems.

## Common Errors

### "Function.prototype.apply was called on #< Object >" Error

This error often occurs due to incompatible versions of NextAuth dependencies, incorrect provider configuration, or type mismatches.

**Solution:**

1. Verify environment variables:

    ```.env
    NEXTAUTH_URL=https://localhost:3000
    NEXTAUTH_SECRET=<secure-random-value>
    GOOGLE_CLIENT_ID=<your-google-client-id>
    GOOGLE_CLIENT_SECRET=<your-google-client-secret>
    ```

2. Check your NextAuth configuration in `auth.config.ts`:
   - Ensure proper callback functions are defined
   - Verify that your provider configuration is correct
   - Add debug mode for development

3. Inspect your NextAuth route handler:
   - Make sure you're passing the full configuration
   - Add `trustHost: true` to avoid cross-origin issues
   - Add proper error handling

4. Simplify session refresh settings:
   - Set `refetchInterval: 0` to avoid concurrent requests
   - Disable `refetchOnWindowFocus` during debugging

## Callback URL Issues

If you see "redirect_uri_mismatch" errors in the Google OAuth flow:

1. Verify the exact redirect URI in Google Cloud Console matches:
   - Should be: `https://localhost:3000/api/auth/callback/google`
   - Match protocol (http/https), port, and path exactly

2. Use the auth-debug.ts utilities to verify configuration.

## Session Synchronization Issues

If the NextAuth session isn't properly syncing with your custom auth context:

1. Use the `syncCurrentSession()` function from `auth-handler.ts`
2. Wrap session operations in try/catch blocks
3. Check browser console for errors during session operations

## CORS or Cross-Origin Issues

If you're seeing CORS errors with the OAuth flow:

1. Ensure `NEXTAUTH_URL` matches your actual application URL
2. Add `trustHost: true` in your NextAuth configuration
3. For local development with HTTPS, add proper security exceptions

## Next Steps for Authentication Issues

1. Clear browser storage:
   - Clear cookies, localStorage, and sessionStorage
   - Restart your browser
   - Try the authentication flow again

2. Use incognito/private browsing mode:
   - This eliminates cached session data or cookies
   - Helps isolate potential browser extension issues

3. Check server logs:
   - Enable debug mode in NextAuth
   - Review server-side console output for error details

4. Test with minimal configuration:
   - Temporarily disable custom callbacks
   - Focus on getting basic authentication working before adding customizations

Remember to use the debugging utilities in `lib/auth/auth-debug.ts` to help identify the source of the problems.
