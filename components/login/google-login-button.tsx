"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { signInWithGoogle } from "@/lib/auth/auth-handler"
import { useAuth } from "../contexts/auth-context"

interface GoogleLoginButtonProps {
  dictionary: any;
  locale?: string;
  redirectPath?: string
}

export function GoogleLoginButton({ dictionary, locale="fr", redirectPath = "/fr/app" }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {currentLoggedUser } = useAuth();
  const { data: session, status } = useSession();
  const currentUser = session?.user || null ;

  console.log("🔄 LoadingPage: Session sync effect triggered", status);
  
  // If the user is already authenticated, redirect them
  useEffect(() => {
    if ((currentUser != null || currentLoggedUser != null)) {
      router.push(`/${locale}/app`);
    }
  }, [session, status, router, redirectPath])

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Use the auth handler for Google sign-in
      await signInWithGoogle(redirectPath);
    } catch (error) {
      console.error("Google login failed:", error)
      setError("Failed to sign in with Google. Please try again.")
      setIsLoading(false)
    }
  }
  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      {error && (
        <div className="w-full max-w-xs bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <Button
        variant="outline"
        size="lg"
        className="flex items-center gap-3 w-full max-w-xs"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        <span>{isLoading ? "Connecting..." : dictionary.google.signInWithGoogle}</span>
      </Button>
      
      <p className="text-sm text-muted-foreground max-w-xs text-center">
        {
        locale === "fr" 
        ?
        "En continuant avec Google, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité." : 
        locale === "ar" 
        ?
        "عند المتابعة باستخدام Google، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا." :
        "By continuing with Google, you agree to our Terms of Service and Privacy Policy."
        }
      </p>
    </div>
  )
}