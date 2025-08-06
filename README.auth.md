# Auth implementation

## High-Level Overview of Authentication Implementation

Our authentication system uses NextAuth.js v5, supporting both Google OAuth and custom credentials-based login. It is designed for flexibility, security, and easy integration with custom backend APIs. Key features include:

- **Providers**: Google OAuth (with offline access and PKCE disabled for server-side flow) and Credentials (username/password).
- **Session Management**: Sessions are mapped to a comprehensive user object, including roles, profile info, and tokens, matching backend API structure.
- **JWT Handling**: Custom logic for token expiry, refresh, and error handling. Tokens are refreshed automatically when expired, using backend endpoints.
- **Role-Based Access**: Middleware enforces authentication and role-based access for protected routes, with locale-aware redirects.
- **Token Storage**: Tokens are stored in both cookies and localStorage for client/server access. Utilities are provided for storing, retrieving, and clearing tokens and user profiles.
- **Session Sync**: Utilities sync NextAuth sessions with custom app context, bridging NextAuth and your own auth logic.
- **Debugging & Cleanup**: Helpers for debugging sessions and cleaning up on sign-out or session expiry.

### Main Files Involved

- `auth.config.ts`: NextAuth configuration, providers, callbacks, and custom logic.
- `auth.ts` / `lib/auth/nextauth.ts`: NextAuth initialization and exports.
- `middleware.ts`: Route protection and locale handling.
- `lib/services/auth/auth-service.ts`: API calls for login, token exchange, registration, etc.
- `lib/services/auth/token-storage.ts`: Token and user profile storage utilities.
- `lib/auth/auth-handler.ts`, `lib/auth/session-cleanup.ts`, `lib/auth/nextauth-helpers.ts`: Session sync, sign-in/out handlers, and cleanup utilities.
- `lib/auth/types.ts`: Type extensions for NextAuth user/session/JWT objects.

---

## How to Copy This Authentication Implementation to Another Next.js Project

1. **Copy Core Files**:
   - `auth.config.ts`, `auth.ts` (or `lib/auth/nextauth.ts`), `middleware.ts`
   - All files in `lib/services/auth/` and `lib/auth/` related to session, token, and handlers
   - `lib/auth/types.ts` for type extensions

2. **Install Dependencies**:
   - `next-auth` (v5)
   - Any required providers (e.g., `@next-auth/google-provider`)
   - Ensure your backend API endpoints match those expected by `auth-service.ts`

3. **Environment Variables**:
   - Set up `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and any custom API URLs

4. **Update Middleware**:
   - Adjust `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`, and role logic as needed for your app

5. **Integrate with Your App**:
   - Use exported `signIn`, `signOut`, and session sync utilities in your UI/components
   - Update API endpoints and user profile mapping if your backend differs

6. **Test & Debug**:
   - Use provided debug utilities to verify session and token handling
   - Check role-based access and redirects

---

**Tip:** Review and adapt the API calls, user profile structure, and role logic to fit your backend and business requirements. The implementation is modular and can be extended for additional providers or custom flows.
