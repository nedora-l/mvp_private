# Setting up Google OAuth Credentials

Follow these steps to create Google OAuth credentials for your application:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Select "Web application" as the application type
6. Set a name for your OAuth client
7. Add authorized JavaScript origins:
   - For development: `http://localhost:3000` or `https://localhost:3000` if using HTTPS
   - For production: Your domain (e.g., `https://yourdomain.com`)
8. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google` or `https://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
9. Click "Create"
10. Save the Client ID and Client Secret provided by Google

## Environment Variables Setup

Create or update your `.env.local` file with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=https://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-at-least-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

For the `NEXTAUTH_SECRET`, you should generate a secure random string. You can use this command in your terminal:

```bash
openssl rand -base64 32
```

## Verifying Your Configuration

Make sure that the redirect URI in your Google Cloud Console matches exactly what NextAuth expects:

1. The default NextAuth callback URL is: `/api/auth/callback/google`
2. This should be appended to your base URL: `http://localhost:3000/api/auth/callback/google`
3. If you see errors about "redirect_uri_mismatch", double-check that the URIs match exactly

## OAuth Scopes

By default, the Google provider requests the following scopes:

- `openid` - Required for OpenID Connect flows
- `profile` - Get basic profile information
- `email` - Get email address

These scopes should be sufficient for using Google for email verification purposes.

## Troubleshooting Common Issues

If you encounter the "Function.prototype.apply was called on #<Object>" error:

1. Check that your NextAuth configuration has proper callbacks for JWT and Session
2. Ensure you have the correct environment variables set
3. Verify that the session provider is properly set up in your application
4. Try clearing browser cookies and localStorage if you've made significant changes

## Testing Your Configuration

After setting up your Google OAuth credentials:

1. Add the Client ID and Client Secret to your `.env.local` file
2. Run your application
3. Navigate to the login page or test page
4. Click "Sign in with Google"
5. You should be redirected to Google's authentication page
6. After successful authentication, you should be redirected back to your application

These credentials will be used in your application's environment variables to authenticate with Google's OAuth service.
