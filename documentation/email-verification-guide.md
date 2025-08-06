# Email Verification with Google OAuth

This document explains how to use Google OAuth to verify email ownership, particularly for organizational emails (like `@da-tech.ma`).

## Overview

The main advantage of using Google OAuth for email verification is that Google has already verified the user's email address through its own authentication process. When a user signs in with Google, we receive their verified email address, which we can trust as authentic.

This is particularly useful for verifying organizational emails, as only users with legitimate access to that email address can authenticate through Google with it.

## Implementation Components

Our implementation consists of several key components:

1. **Google OAuth Provider Configuration**: Set up in `auth.config.ts`
2. **Email Verification Utilities**: Functions in `lib/auth/email-verification.ts`
3. **Email Verification Display Component**: UI in `components/auth/email-verification-display.tsx`
4. **Authentication Test Page**: For testing at `/auth/test`
5. **Session Synchronization**: Methods in `lib/auth/nextauth-helpers.ts`
6. **Error Handling**: Dedicated error page and robust error management

## How It Works

1. **Authentication Flow**:
   - User clicks "Sign in with Google" button
   - Google's OAuth screen appears, asking for permission
   - User authenticates with their Google account
   - Google returns verified email information
   - NextAuth creates a session with this information
   - Our system synchronizes this with the custom auth context

2. **Email Domain Verification**:
   - Our utilities check if the email's domain matches trusted domains
   - For organization validation, we verify if the email ends with `@da-tech.ma`
   - The verification status is displayed to the user

3. **Access Control**:
   - Based on email verification status, you can:
     - Allow/deny access to certain pages or features
     - Show different UI components
     - Apply specific business rules

## Verification Levels

We can implement multiple levels of verification:

1. **Basic Email Verification**: User has a valid email (implicit with Google OAuth)
2. **Domain Verification**: User has an email from a trusted domain
3. **Organization Verification**: User is part of your organization

## Troubleshooting Authentication Issues

If you encounter issues with the OAuth integration:

1. **Check Browser Console**: Look for specific error messages
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Check Google Cloud Console**: Make sure redirect URIs are configured correctly
4. **Session State**: Clear browser storage and cookies if you've made changes
5. **Debug Tools**: Use the auth debugging utilities in `lib/auth/auth-debug.ts`

## Usage Examples

### Verifying Email Domain

```typescript
import { isFromTrustedDomain } from "@/lib/auth/email-verification"

// Check if user's email is from a trusted domain
const isVerified = isFromTrustedDomain(user.email, ['da-tech.ma'])

if (isVerified) {
  // Allow access to organization-specific features
} else {
  // Restrict access or show limited features
}
```

### Displaying Verification Status

```tsx
// In your page or component
import { EmailVerificationDisplay } from "@/components/auth/email-verification-display"

export default function ProfilePage() {
  return (
    <div>
      {/* Other profile components */}
      <EmailVerificationDisplay trustedDomains={['da-tech.ma']} />
    </div>
  )
}
```

## Security Considerations

- Google OAuth provides strong guarantees about email ownership
- The email verification is only as trustworthy as the OAuth provider
- For organization-specific access, consider additional verification methods for sensitive operations

## Testing

You can test the email verification by:

1. Going to `/auth/test` in your application
2. Signing in with different Google accounts (personal vs. organizational)
3. Observing the verification status shown in the UI
