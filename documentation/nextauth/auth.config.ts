import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { getLoginToken, refreshLoginToken, exchangeGoogleToken } from "./lib/api/auth-api"

export const DEFAULT_EXPIRES_IN = 30000000 // 5 hours in milliseconds
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", 
  },
  callbacks: {
    async jwt({ token, user , account }) {
      // If user is signing in for the first time, initialize token
      if(token.accessToken && token.refreshToken && token.googleAccessToken && token.googleRefreshToken) {
        console.log("JWT Callback - googleAccessToken:", token, "User:", user, "Account:", account);
        // Use Google's actual tokens from the account object
        const refreshedTokens = await exchangeGoogleToken(
          token.refreshToken, 
          token.accessToken
        );
        
        console.log("JWT Callback - exchangeGoogleToken:", refreshedTokens);

        if (refreshedTokens.accessToken) {
          return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken,
            accessTokenExpires: Date.now() + (refreshedTokens.expiresIn * 1000),
            googleAccessToken: account?.access_token,
            googleRefreshToken: account?.refresh_token,
            id: refreshedTokens.user?.id || user?.id,
            email: refreshedTokens.user?.email || user?.email,
            lastName: refreshedTokens.user?.lastName,
            firstName: refreshedTokens.user?.firstName,
            name: (refreshedTokens.user?.firstName + " " + refreshedTokens.user?.lastName) || user?.name,
            image: refreshedTokens.user?.profilePictureUrl || user?.image,
            provider: "google"
          } as any
        }
      }
      // Handle Google OAuth flow
      if (account?.provider === "google" && account.access_token && user) {
        try {
          console.log("Using Google tokens:", {
            access_token: account.access_token?.substring(0, 10) + "...",
            refresh_token: account.refresh_token?.substring(0, 10) + "..."
          });

          // Use Google's actual tokens from the account object
          const refreshedTokens = await exchangeGoogleToken(
            account.refresh_token || '', // Use Google's refresh_token
            account.access_token        // Use Google's access_token
          );
          
          console.log("JWT Callback - refreshedTokens:", refreshedTokens);

          if (refreshedTokens.accessToken) {
            return {
              ...token,
              accessToken: refreshedTokens.accessToken,
              refreshToken: refreshedTokens.refreshToken,
              accessTokenExpires: Date.now() + (refreshedTokens.expiresIn * 1000),
              googleAccessToken: account.access_token,
              googleRefreshToken: account.refresh_token,
              id: refreshedTokens.user?.id || user?.id,
              email: refreshedTokens.user?.email || user?.email,
              lastName: refreshedTokens.user?.lastName,
              firstName: refreshedTokens.user?.firstName,
              name: (refreshedTokens.user?.firstName + " " + refreshedTokens.user?.lastName) || user?.name,
              image: refreshedTokens.user?.profilePictureUrl || user?.image,
              provider: "google"
            } as any
          }
        } catch (error) {
          console.error("Google token exchange failed:", error)
          return { ...token, error: "GoogleExchangeError" }
        }
      }
      // Handle credentials provider sign-in
      if (account && user && account.provider === "credentials") {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = token.exp;
        token.accessTokenExpires = Date.now() + (DEFAULT_EXPIRES_IN as number * 1000);
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.provider = account.provider;
      }
      // Check if token needs refresh (only if we have a valid session)
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      // Refresh token logic
      if (!token.refreshToken) {
        console.error("No refresh token available");
        return { ...token, error: "RefreshError" };
      }
      try {
        const refreshedTokens = await refreshLoginToken(
          String(token.refreshToken), 
          String(token.accessToken)
        )
        return {
          ...token,
          accessToken: refreshedTokens.accessToken,
          accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
          refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
        } as any;
      } catch (error) {
        console.error("Error refreshing access token", error);
        return { ...token, error: "RefreshError" };
      }
      return token;
    },
    async session({ session, token }) {
      session.user.provider = token.provider;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.email = token.email || "";
      session.user.name = token.name || "";
      session.user.image = token.image || "";
      return session;
    },
    authorized({ auth, request }) {
      return !!auth?.user
    },
  },
  providers: [
    GoogleProvider({
      name: "google",
      id: "google",
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }
        try {
          const result = await getLoginToken(String(credentials.username), String(credentials.password))
          if (result.accessToken) {
            const absoluteExpiresAt = Date.now() + result.expiresIn * 1000;
            return {
              id: String(result.user?.id || "unknown"),
              name: String(result.user?.username || credentials.username),
              email: String(result.user?.email || ""),
              image: String(result.user?.profilePictureUrl || "/logo/avatar.svg"),
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              expiresAt: absoluteExpiresAt,
            }
          }
          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  trustHost: true,
}
