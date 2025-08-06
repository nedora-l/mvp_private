# NextJS Auth Cheatsheet for AI Agents

A concise guide for AI agents to implement and manage NextJS Auth with JWT from an external API and OAuth2 multi-auth providers.

## Table of Contents

1. [Setup](#setup)
2. [JWT Auth from External API](#jwt-auth-from-external-api)
3. [OAuth2 Integration](#oauth2-integration)
4. [Session & Token Management](#session--token-management)
5. [Using Tokens](#using-tokens)
6. [Security Tips](#security-tips)
7. [Error Handling](#error-handling)

---

## Setup

- **Install NextAuth.js**:

  ```bash
  npm install next-auth
  ```

- **Configuration File**: Create `/pages/api/auth/[...nextauth].js`.

---

## JWT Auth from External API

### Configuration

- Use `CredentialsProvider` to authenticate via an external API.
- Example:

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
        async authorize(credentials) {
          const res = await fetch('https://your-api.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });
          const data = await res.json();
          if (res.ok && data.accessToken) {
            return {
              id: data.userId,
              name: data.username,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiresAt: data.expiresAt,
            };
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

### Token Refresh

- Refresh `accessToken` when nearing expiry (e.g., <1 hour).
- Example in `jwt` callback:

  ```javascript
  async jwt({ token }) {
    const now = Date.now();
    if (token.expiresAt && now > token.expiresAt - 3600000) {
      const res = await fetch('https://your-api.com/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      });
      const data = await res.json();
      if (res.ok) {
        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken;
        token.expiresAt = data.expiresAt;
      } else {
        token.error = 'RefreshAccessTokenError';
      }
    }
    return token;
  }
  ```

---

## OAuth2 Integration

- Add OAuth2 providers (e.g., Google) alongside JWT.
- Example:

  ```javascript
  import GoogleProvider from 'next-auth/providers/google';

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({ /* JWT config */ }),
  ],
  ```

- Standardize session data:

  ```javascript
  async session({ session, token }) {
    session.accessToken = token.accessToken;
    if (token.provider === 'credentials') {
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
    }
    return session;
  }
  ```

---

## Session & Token Management

- **JWT Callback**: Persist tokens across requests.
- **Session Callback**: Expose tokens to client/server.
- **Strategy**: Use JWT sessions (stateless) for external API auth.

---

## Using Tokens

### Client-Side

- Access via `useSession`:

  ```javascript
  import { useSession } from 'next-auth/react';

  const { data: session } = useSession();
  const fetchData = async () => {
    const res = await fetch('https://your-api.com/protected', {
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    });
    const data = await res.json();
    console.log(data);
  };
  ```

### Server-Side

- Use `getServerSession`:

  ```javascript
  import { getServerSession } from 'next-auth/next';
  import authOptions from '../pages/api/auth/[...nextauth]';

  export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });
    const data = await fetch('https://your-api.com/protected', {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }).then(res => res.json());
    res.json(data);
  }
  ```

---

## Security Tips

- Store `refreshToken` in HttpOnly cookies.
- Validate tokens server-side.
- Use NextAuth.js default encryption (A256GCM).

---

## Error Handling

- **401**: Trigger token refresh or redirect to login.
- **Refresh Failure**: Sign out user:

  ```javascript
  if (session?.error === 'RefreshAccessTokenError') {
    signOut();
  }
  ```

---

This cheatsheet equips AI agents with a clear, actionable guide for NextJS Auth integration, balancing JWT and OAuth2 workflows.
