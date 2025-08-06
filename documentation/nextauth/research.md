# Key Points

- Research suggests NextJS authentication can integrate JWT from external APIs using NextAuth.js, handling `accessToken`, `refreshToken`, and `expiresAt`.
- It seems likely that OAuth2 can be used alongside JWT as a multi-auth provider with NextAuth.js.
- The evidence leans toward using callbacks in NextAuth.js for token refresh and session management, but complexity may arise with external APIs.

## Overview of NextJS Auth

NextJS, a React framework, uses authentication to verify user identity, manage sessions, and control access. NextAuth.js is a popular library for this, supporting OAuth2 and custom JWT authentication from external APIs. It handles session management with JWT or database sessions, making it flexible for various setups.

### Integrating JWT Auth from External API

To integrate JWT auth from an external API (e.g., a Java-based server) with `accessToken`, `refreshToken`, and `expiresAt`, use NextAuth.js with a CredentialsProvider:

- Configure it to call the external API for login, retrieving tokens.
- Use callbacks to store and manage these tokens in sessions, ensuring `expiresAt` is checked for refresh.
- For token refresh, the jwt callback can detect expiration and use `refreshToken` to get new tokens, updating the session.

### Using OAuth2 Alongside JWT

For multi-auth, add OAuth2 providers (e.g., Google, GitHub) to NextAuth.js alongside the CredentialsProvider. Each provider manages its tokens, and callbacks can standardize session data, allowing users to log in via either method.

---

### Survey Note: Detailed Explanation of NextJS Auth and Integration

NextJS, a React-based framework known for server-side rendering (SSR) and static site generation (SSG), requires robust authentication mechanisms to verify user identity, manage sessions, and control access to routes and data. Authentication in NextJS can be implemented in various ways, but one of the most comprehensive solutions is using **NextAuth.js** (now part of Auth.js), a full-stack authentication library designed specifically for NextJS and serverless environments. This survey note explores how NextJS Auth works, focusing on integrating JWT authentication from an external API with `accessToken`, `refreshToken`, and `expiresAt`, and using OAuth2 alongside it as a multi-auth provider.

#### Understanding NextJS Authentication

Authentication in NextJS involves three key concepts:

- **Authentication**: Verifying if the user is who they claim to be, typically through credentials like username/password or OAuth2 flows.
- **Session Management**: Tracking the user's authenticated state across requests, ensuring continuity between client and server-side interactions.
- **Authorization**: Determining what routes and data the user can access based on their identity.

NextAuth.js simplifies these processes by providing:

- Built-in support for numerous OAuth2 providers (e.g., Google, GitHub, Twitter).
- Custom credential providers for integrating with external APIs, such as a Java-based server-side application issuing JWT tokens.
- Flexible session management options, including JSON Web Tokens (JWT) for stateless sessions or database sessions for stateful management.
- Callbacks for customizing authentication flows, such as handling external tokens or integrating with external databases/APIs.

The library is particularly suited for NextJS due to its support for both client-side rendering (CSR) and server-side rendering (SSR), ensuring seamless authentication across different deployment models (e.g., custom servers, static sites, serverless).

#### Integrating JWT Auth from an External API

The user's requirement to integrate JWT authentication from an external API, specifically with `accessToken`, `refreshToken`, and `expiresAt`, involves leveraging NextAuth.js's flexibility. The external API, likely a Java-based server, issues these tokens upon successful authentication, and NextJS needs to manage them for subsequent API calls and session validation.

##### Step-by-Step Integration

1. **Set Up NextAuth.js with CredentialsProvider**:
   - Use the **CredentialsProvider** to handle authentication with the external API. This provider allows custom login flows where you can call the external API's login endpoint.
   - In the `authorize` function, make a POST request to the external API (e.g., `https://your-external-api.com/login`) with user credentials, expecting a response with `accessToken`, `refreshToken`, and `expiresAt`.

   Example configuration:

   ```javascript
   import NextAuth from 'next-auth';
   import CredentialsProvider from 'next-auth/providers/credentials';

   export default NextAuth({
     providers: [
       CredentialsProvider({
         name: 'Credentials',
         credentials: {
           username: { label: 'Username', type: 'text' },
           password: { label: 'Password', type: 'password' },
         },
         async authorize(credentials, req) {
           const response = await fetch('https://your-external-api.com/login', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(credentials),
           });
           const data = await response.json();
           if (response.ok && data.accessToken && data.refreshToken && data.expiresAt) {
             return { id: data.userId, name: data.username, accessToken: data.accessToken, refreshToken: data.refreshToken, expiresAt: data.expiresAt };
           }
           return null;
         },
       }),
     ],
     callbacks: {
       async jwt({ token, user }) {
         if (user) {
           token.accessToken = user.accessToken;
           token.refreshToken = user.refreshToken;
           token.expiresAt = user.expiresAt;
         }
         return token;
       },
       async session({ session, token }) {
         session.accessToken = token.accessToken;
         session.refreshToken = token.refreshToken;
         session.expiresAt = token.expiresAt;
         return session;
       },
     },
   });
   ```

   This setup ensures that upon successful login, the tokens are stored in the session, accessible via `useSession` on the client-side or `getServerSession` on the server-side.

2. **Handle Token Refresh**:
   - The external API provides `accessToken`, `refreshToken`, and `expiresAt`, where `expiresAt` indicates when the `accessToken` expires. To maintain a seamless user experience, you need to refresh the `accessToken` before it expires using the `refreshToken`.
   - Use the **jwt callback** in NextAuth.js to manage token rotation. This callback is triggered when the JWT is created (at sign-in) or updated (when the session is accessed). Check if the `accessToken` is expired or close to expiring (e.g., within 1 hour of `expiresAt`), and if so, call the external API's refresh endpoint to get new tokens.

   Example of token refresh in the jwt callback:

   ```javascript
   callbacks: {
     async jwt({ token, user }) {
       const now = Date.now();
       const expiresAt = token.expiresAt ? new Date(token.expiresAt).getTime() : null;
       if (user) {
         token.accessToken = user.accessToken;
         token.refreshToken = user.refreshToken;
         token.expiresAt = user.expiresAt;
       } else if (expiresAt && now > expiresAt - 3600000) { // Refresh if less than 1 hour left
         try {
           const response = await fetch('https://your-external-api.com/refresh', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ refreshToken: token.refreshToken }),
           });
           const data = await response.json();
           if (response.ok) {
             token.accessToken = data.accessToken;
             token.refreshToken = data.refreshToken;
             token.expiresAt = data.expiresAt;
           } else {
             throw new Error('Token refresh failed');
           }
         } catch (error) {
           console.error('Token refresh failed:', error);
           // Handle error, e.g., sign out user
           return { ...token, error: 'RefreshAccessTokenError' };
         }
       }
       return token;
     },
     async session({ session, token }) {
       session.accessToken = token.accessToken;
       session.refreshToken = token.refreshToken;
       session.expiresAt = token.expiresAt;
       if (token.error) {
         session.error = token.error;
       }
       return session;
     },
   },
   ```

   - The jwt callback ensures tokens are refreshed automatically when accessed, leveraging the `refreshToken` to maintain session validity. For client-side, set a `refetchInterval` dynamically based on `expiresAt` (e.g., 23 hours 30 minutes before expiry) to trigger session updates, as seen in implementations like [this tutorial](https://dev.to/mabaranowski/nextjs-authentication-jwt-refresh-token-rotation-with-nextauthjs-5696).

3. **Use Tokens for API Calls**:
   - On the client-side, use the `useSession` hook from NextAuth.js to access the session, which includes `accessToken`. For API calls to the external API, include the `accessToken` in the `Authorization` header (e.g., `Bearer ${session.accessToken}`).
   - For server-side API routes, use `getServerSession` to access the session and extract `accessToken` for making requests. Example:

   ```javascript
   import { getServerSession } from 'next-auth/next';
   import authOptions from '../pages/api/auth/[...nextauth]';

   export default async function handler(req, res) {
     const session = await getServerSession(req, res, authOptions);
     if (!session) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     const response = await fetch('https://your-external-api.com/protected', {
       headers: { Authorization: `Bearer ${session.accessToken}` },
     });
     const data = await response.json();
     res.json(data);
   }
   ```

   - If the external API returns a 401 (Unauthorized), it indicates the `accessToken` is expired. In such cases, the jwt callback should have already refreshed it, but for edge cases, consider implementing a proxy API route in NextJS to handle token refresh and retry the request.

#### Using OAuth2 Alongside JWT as a Multi-Auth Provider

To support multiple authentication methods, such as JWT from the external API and OAuth2 providers (e.g., Google, GitHub), NextAuth.js allows adding multiple providers. This creates a multi-auth provider system where users can choose their preferred login method.

1. **Add OAuth2 Providers**:
   - Configure OAuth2 providers alongside the CredentialsProvider. For example, add GoogleProvider:

   ```javascript
   import GoogleProvider from 'next-auth/providers/google';

   export default NextAuth({
     providers: [
       GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       }),
       // ... CredentialsProvider as above
     ],
     // ... callbacks
   });
   ```

   - Each OAuth2 provider handles its authentication flow, issuing its own access tokens and refresh tokens, managed automatically by NextAuth.js.

2. **Handle Multi-Provider Sessions**:
   - NextAuth.js automatically manages sessions for multiple providers. The session object will include provider-specific data, such as `accessToken` for OAuth2 or the JWT tokens for CredentialsProvider.
   - Use the session callback to standardize the session format if needed, ensuring consistency across providers. Example:

   ```javascript
   callbacks: {
     async session({ session, token }) {
       if (token.provider === 'google') {
         session.accessToken = token.accessToken; // From Google
       } else if (token.provider === 'credentials') {
         session.accessToken = token.accessToken; // From external API
         session.refreshToken = token.refreshToken;
         session.expiresAt = token.expiresAt;
       }
       return session;
     },
   },
   ```

   - Users can log in via either the external API (JWT) or OAuth2 providers, with NextAuth.js handling the session and token management for each.

#### Detailed Considerations

- **Security**: Ensure sensitive tokens (e.g., `refreshToken`) are stored securely. NextAuth.js uses encrypted JWTs by default (since v4, with A256GCM), but for external API tokens, consider using HttpOnly cookies to mitigate XSS risks. Always validate tokens on the server-side to prevent tampering.
- **Token Refresh Timing**: The jwt callback should refresh tokens within a safe window (e.g., 1 hour before expiry) to avoid race conditions. Implement a buffer (e.g., 30 minutes) for edge cases, as seen in [this implementation](https://dev.to/mabaranowski/nextjs-authentication-jwt-refresh-token-rotation-with-nextauthjs-5696).
- **Error Handling**: If token refresh fails (e.g., `refreshToken` is invalid), set an error (e.g., "RefreshAccessTokenError") in the jwt callback and handle it client-side by signing out the user, potentially redirecting to the login page.
- **Server-Side Rendering**: For SSR, ensure `getServerSession` triggers session updates. If tokens expire during SSR, consider explicit checks in API routes to handle refresh, though the jwt callback should handle most cases.

#### Comparative Analysis: JWT vs. Database Sessions

NextAuth.js offers two session types:

- **JWT Sessions**: Stateless, stored in an encrypted cookie, faster and scalable, suitable for external token management. However, updating tokens (e.g., after refresh) requires issuing a new JWT, which can be complex.
- **Database Sessions**: Stateful, stored in a database (e.g., via adapters like Prisma, MongoDB), easier to update for token refresh but requires database overhead.

For external JWT auth, JWT sessions are preferred due to their alignment with token-based flows, but database sessions can be used for enhanced security, storing tokens in the database and updating them via custom API routes.

#### Example Workflow Table

Below is a table summarizing the workflow for JWT auth integration:

| **Step**                     | **Action**                                                                 | **Details**                                      |
|------------------------------|---------------------------------------------------------------------------|-------------------------------------------------|
| 1. Login                     | User submits credentials via CredentialsProvider | Calls external API, gets `accessToken`, `refreshToken`, `expiresAt` |
| 2. Store Tokens              | Use jwt callback to store in session             | Includes tokens in JWT for client-side access   |
| 3. Token Refresh             | Check `expiresAt` in jwt callback               | Refreshes token if within 1 hour of expiry      |
| 4. API Calls                 | Use `accessToken` in headers                    | Client-side via `useSession`, server-side via `getServerSession` |
| 5. Error Handling            | Handle 401 or refresh failures                  | Sign out user, redirect to login if refresh fails |

#### Using OAuth2 with Multi-Auth

For OAuth2, NextAuth.js supports providers like Google, GitHub, and more, each with its token management. The multi-auth setup ensures users can choose between JWT (external API) and OAuth2, with sessions standardized via callbacks. This is particularly useful for applications requiring flexible login options, enhancing user experience.

#### Conclusion

Research suggests that NextJS Auth, particularly via NextAuth.js, can effectively integrate JWT authentication from an external API, handling `accessToken`, `refreshToken`, and `expiresAt` using callbacks for token management and refresh. It seems likely that OAuth2 can be used alongside as a multi-auth provider, with each method managed separately but unified under NextAuth.js's session system. The evidence leans toward this approach being robust, though complexity may arise with external API integrations, requiring careful handling of token refresh and security.

For further details, refer to the official documentation and community examples, such as [this tutorial on refresh token rotation](https://next-auth.js.org/v3/tutorials/refresh-token-rotation) and [this implementation guide](https://dev.to/mabaranowski/nextjs-authentication-jwt-refresh-token-rotation-with-nextauthjs-5696).

### Key Citations

- [Options configuration for NextAuth.js](https://next-auth.js.org/configuration/options)
- [Next.js Authentication with JWT Refresh Token Rotation](https://dev.to/mabaranowski/nextjs-authentication-jwt-refresh-token-rotation-with-nextauthjs-5696)
- [Refresh Token Rotation tutorial for NextAuth.js](https://next-auth.js.org/v3/tutorials/refresh-token-rotation)
- [Implementing JWT refresh token with NextAuth](https://codingwithsaleem.medium.com/implement-jwt-refresh-token-with-nextauth-46ab73148eb9)
- [NextJS with full-stack authorization based on JWT](https://medium.com/vmlyrpoland-tech/nextjs-with-full-stack-authorization-based-on-jwt-and-external-api-e9977f9fdd5e)
- [Next.js Authentication with External API Guide](https://medium.com/@alexprivate2323/next-js-authentication-with-external-api-guide-tutorial-b3cc90c37019)
- [Auth.js reference for Next.js](https://authjs.dev/reference/nextjs)
- [Frequently Asked Questions for NextAuth.js](https://next-auth.js.org/faq)
