import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { getLoginToken, refreshLoginToken } from "./lib/api/auth-api"
import { AuthService } from "./lib/services/auth/auth-service"

export const DEFAULT_EXPIRES_IN = 30000000 // 5 hours in milliseconds
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", 
  },
  callbacks: {
    async jwt({ token, user, account }) {

      // Initial sign-in with Google OAuth
      if (account?.provider === "google" && account.access_token && user) {
        try {
          console.log("🟢 Initial Google OAuth - Using Google tokens");
          // Use AuthService directly instead of HTTP request to avoid URL issues
          const authService = new AuthService();
          const exchangeResult = await authService.exchangeGoogleToken(
            account.refresh_token || '',
            account.access_token
          );
          
          console.log("✅ JWT Callback - Initial Google exchange successful");
          const tokenExpiry =  (Date.now() + (DEFAULT_EXPIRES_IN * 1000));
        
          const newToken = {
            ...token,
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            accessToken: exchangeResult.accessToken,
            refreshToken: exchangeResult.refreshToken,
            tokenType: exchangeResult.tokenType,
            accessTokenExpires: tokenExpiry,
            id: String(exchangeResult.user?.id || user?.id),
            email: exchangeResult.user?.email || user?.email,
            name: `${exchangeResult.user?.firstName} ${exchangeResult.user?.lastName}` || user?.name,
            image: exchangeResult.user?.profilePictureUrl || user?.image,
            // Complete user data from API
            username: exchangeResult.user?.username,
            firstName: exchangeResult.user?.firstName,
            lastName: exchangeResult.user?.lastName,
            profilePictureUrl: exchangeResult.user?.profilePictureUrl,
            phone: exchangeResult.user?.phone,
            address: exchangeResult.user?.address,
            locale: exchangeResult.user?.locale,
            role: exchangeResult.user?.role,
            roles: exchangeResult.user?.roles,
            timeZone: exchangeResult.user?.timeZone,
            title: exchangeResult.user?.title,
            departmentId: exchangeResult.user?.departmentId,
            teamId: exchangeResult.user?.teamId,
            countryId: exchangeResult.user?.countryId,
            cityId: exchangeResult.user?.cityId,
            provider: account.provider
          };
          return newToken;
        } catch (error) {
          console.error("❌ Google token exchange failed:", error)
          return { ...token, error: "GoogleExchangeError" }
        }
      }
      
      // Handle credentials provider sign-in (FIXED)
      if (account && user && account.provider === "credentials") {
        
        // Use the actual expiry time from the backend instead of hardcoded value
        const tokenExpiry = Date.now() + (DEFAULT_EXPIRES_IN * 1000);
        
        const newToken = {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          tokenType: user.tokenType,
          accessTokenExpires: tokenExpiry,
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          // Complete user data from API
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePictureUrl: user.profilePictureUrl,
          phone: user.phone,
          address: user.address,
          locale: user.locale,
          role: user.role,
          roles: user.roles,
          timeZone: user.timeZone,
          title: user.title,
          departmentId: user.departmentId,
          teamId: user.teamId,
          countryId: user.countryId,
          cityId: user.cityId,
          provider: account.provider
        };
        
        return newToken;
      }

      // For subsequent calls, check if token is still valid
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        
        return token;
      }

      // Only attempt refresh if we have app tokens and they're expired
      if (token.accessToken && token.refreshToken && token.accessTokenExpires && 
          Date.now() >= (token.accessTokenExpires as number) && !account) {
        console.log("🔄 Token expired, attempting refresh");
        try {
          // Use application refresh token to get new application tokens
          const refreshedTokens = await refreshLoginToken(
            String(token.refreshToken), 
            String(token.accessToken)
          );
          
          console.log("✅ Token refresh successful");
          return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
            refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
          } as any;
        } catch (error) {
          console.error("❌ Error refreshing access token", error);
          return { ...token, error: "RefreshError" };
        }
      }

      // Return token as-is for other cases
      console.log("📤 Returning token as-is");
      return token;
    },
    async session({ session, token }) {
      console.log("🏠 Session Callback called with:", {
        hasSession: !!session,
        hasToken: !!token,
        tokenError: token.error,
        tokenId: token.id
      });
      
      // Handle token errors
      if (token.error) {
        console.error("❌ Token has error:", token.error);
        // You might want to sign out the user here
        return session;
      }
      
      // Properly map token data to session to match API response structure
      session.user = {
        ...session.user,
        // Basic identifiers
        id: String(token.id || token.sub || ""),
        email: String(token.email || ""),
        name: String(token.name || ""),
        image: String(token.image || token.profilePictureUrl || ""),
        
        // Auth provider info
        provider: String(token.provider || ""),
        accessToken: String(token.accessToken || ""),
        refreshToken: String(token.refreshToken || ""),
        tokenType: String(token.tokenType || "Bearer"),
        
        // Complete user data from API (matching your LoginResponse.user structure)
        username: String(token.username || ""),
        firstName: String(token.firstName || ""),
        lastName: String(token.lastName || ""),
        profilePictureUrl: String(token.profilePictureUrl || token.image || ""),
        phone: String(token.phone || ""),
        address: String(token.address || ""),
        locale: String(token.locale || ""),
        role: String(token.role || ""), // This is the comma-separated string from API
        roles: token.roles || [], // This is the parsed array
        timeZone: String(token.timeZone || ""),
        title: String(token.title || ""),
        departmentId: token.departmentId ? Number(token.departmentId) : undefined,
        teamId: token.teamId ? Number(token.teamId) : null,
        countryId: token.countryId ? Number(token.countryId) : undefined,
        cityId: token.cityId ? Number(token.cityId) : undefined,
      }
  
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
          response_type: "code",
          scope: "openid email profile",
        },
      },
      // Explicitly configure PKCE to false for server-side flow
      checks: ["state"],
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        
        if (!credentials?.username || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null
        }
        
        try {
          console.log("🌐 Calling getLoginToken API...");
          const result = await getLoginToken(String(credentials.username), String(credentials.password))
          
          
          if (result.accessToken) {
            const absoluteExpiresAt = Date.now() + result.expiresIn * 1000;
            
            const userObject = {
              id: String(result.user?.id || "unknown"),
              name: `${result.user?.firstName || ""} ${result.user?.lastName || ""}`.trim() || String(result.user?.username || credentials.username),
              email: String(result.user?.email || ""),
              image: String(result.user?.profilePictureUrl || "/logo/avatar.svg"),
              // Auth tokens
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              tokenType: result.tokenType,
              expiresAt: absoluteExpiresAt,
              // Complete user data from API
              username: result.user?.username,
              firstName: result.user?.firstName,
              lastName: result.user?.lastName,
              profilePictureUrl: result.user?.profilePictureUrl,
              phone: result.user?.phone,
              address: result.user?.address,
              locale: result.user?.locale,
              role: result.user?.role,
              roles: result.user?.roles,
              timeZone: result.user?.timeZone,
              title: result.user?.title,
              departmentId: result.user?.departmentId,
              teamId: result.user?.teamId,
              countryId: result.user?.countryId,
              cityId: result.user?.cityId,
            };
            
            return userObject;
          }
          
          console.log("❌ No access token in response");
          return null
        } catch (error) {
          console.error("❌ Credentials Provider auth error:", error)
          return null
        }
      },
    }),
  ],
  trustHost: true,
}
