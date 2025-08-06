"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService, UserProfileMin } from "@/lib/services/auth/auth-service"
import { getLoginToken } from "@/lib/api/auth-api"
import { useSession, signIn, signOut } from "next-auth/react"
import { syncNextAuthWithAppAuth } from "@/lib/auth/nextauth-helpers"

//TODO : Add a type for the token
interface AuthContextType {
  accessToken: string | null
  refreshToken: string | null
  currentLoggedUser: UserProfileMin | null
  setAccessToken: (token: string | null) => void
  setRefreshToken: (token: string | null) => void
  setCurrentLoggedUser: (user: UserProfileMin | null) => void
  isAuthenticated: boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children, initialToken = null }: { children: ReactNode; initialToken?: string | null }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(initialToken)
  const [refreshToken, setRefreshTokenState] = useState<string | null>(initialToken)
  const [isLoading, setIsLoading] = useState(false)
  const [currentLoggedUser, setCurrentLoggedUserState] = useState<UserProfileMin | null>(null)
  
  // Use NextAuth session
  const { data: session, status } = useSession()
  
  // Sync NextAuth session with our auth context
  useEffect(() => {
    console.log("🔄 Auth Context: Session sync effect triggered", {
      hasSession: !!session,
      sessionStatus: status,
      hasAccessToken: !!session?.user?.accessToken
    });
    
    if (session && session.user) {
      console.log("🔗 NextAuth session found, syncing with auth context:", {
        userId: session.user.id,
        email: session.user.email,
        provider: session.user.provider,
        hasAccessToken: !!session.user.accessToken,
        hasRefreshToken: !!session.user.refreshToken
      });
      
      // Set tokens from NextAuth session
      if (session.user.accessToken) {
        console.log("📥 Setting accessToken from NextAuth session");
        setAccessTokenState(session.user.accessToken)
      }
      
      if (session.user.refreshToken) {
        console.log("📥 Setting refreshToken from NextAuth session");
        setRefreshTokenState(session.user.refreshToken)
      }
      
      // Create user profile from session using all API fields
      if (session.user.id) {
        const userProfile: UserProfileMin = {
          id: parseInt(session.user.id) || 0,
          username: session.user.username || session.user.name || "",
          email: session.user.email || "",
          roles: session.user.roles || [],
          firstName: session.user.firstName || session.user.name?.split(" ")[0] || "",
          lastName: session.user.lastName || session.user.name?.split(" ").slice(1).join(" ") || "",
          locale: session.user.locale || "en",
          profilePictureUrl: session.user.profilePictureUrl || session.user.image || undefined
        };
        
        console.log("👤 Setting user profile from NextAuth session:", userProfile);
        setCurrentLoggedUserState(userProfile);
      }
      
      // Sync with our auth service
      console.log("🔄 Syncing NextAuth session with AuthService...");
      syncNextAuthWithAppAuth(session)
    } else if (status === "unauthenticated") {
      console.log("🚪 NextAuth session unauthenticated, clearing auth context");
      setAccessTokenState(null);
      setRefreshTokenState(null);
      setCurrentLoggedUserState(null);
    }
  }, [session, status])
  
  // Load token from the AuthService on mount (fallback)
  useEffect(() => {
    console.log("🔍 Auth Context: Checking for stored tokens", {
      hasSession: !!session,
      hasAccessToken: !!accessToken,
      sessionStatus: status
    });
    
    if (status === "loading") {
      console.log("⏳ NextAuth session still loading, waiting...");
      return;
    }
    
    if (!session && !accessToken) {
      console.log("🗂️ No NextAuth session, checking AuthService for stored token...");
      const storedToken = authService.getAccessToken();
      if (storedToken) {
        console.log("✅ Found stored token from auth service:", storedToken.substring(0, 10) + "...");
        setAccessTokenState(storedToken)
        
        // Also check for stored user profile
         authService.getCurrentUser().then((storedUser) => {
          if (storedUser) {
            console.log("👤 Found stored user profile:", storedUser.username);
            setCurrentLoggedUserState(storedUser);
          }
         }).catch((error) => {
          console.error("Error fetching current user from AuthService:", error);
        });
      } else {
        console.log("❌ No stored token found in AuthService");
      }
    }
  }, [session, accessToken, status])

  // Update the stored token when it changes
  const setAccessToken = (newToken: string | null) => {
    console.log("setToken:", newToken)
    setAccessTokenState(newToken)
    if (newToken) {
      authService.storeToken(newToken)
    } else {
      authService.clearStoredToken()
    }
  }

  // Update the stored token when it changes
  const setRefreshToken = (newToken: string | null) => {
    console.log("setToken:", newToken)
    setRefreshTokenState(newToken)
    if (newToken) {
      authService.storeRefreshToken(newToken)
    } else {
      authService.clearStoredToken()
    }
  }

  // Update the stored token when it changes
  const setCurrentLoggedUser = (newUser: UserProfileMin | null) => {
    console.log("setCurrentUser:", newUser)
    setCurrentLoggedUserState(newUser)
    if (newUser) {
      authService.storeUserProfileInfo(newUser);
    }  
  }

  const logout = () => {
    console.log("🚪 Auth Context logout called - using NextAuth signOut");
    // Clear local state first
    setAccessTokenState(null)
    setRefreshTokenState(null)
    setCurrentLoggedUserState(null)
    authService.logout()
    
    // Then sign out with NextAuth with proper redirect
    signOut({ 
      callbackUrl: '/auth/login',
      redirect: true 
    })
  }

  const value = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    currentLoggedUser: currentLoggedUser,
    setRefreshToken,
    setAccessToken,
    setCurrentLoggedUser,
    isAuthenticated: !!accessToken || !!session?.user,
    logout,
    isLoading,
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // For our demo, we'll provide a mock token instead of throwing an error
    return {
      accessToken: null,
      refreshToken: null,
      currentLoggedUser: null,
      setAccessToken: () => {},
      setRefreshToken: () => {},
      setCurrentLoggedUser: () => {},
      isAuthenticated: false,
      logout: () => {},
      isLoading: false,
    }
  }
  return context
}
