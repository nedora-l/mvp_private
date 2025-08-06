"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthErrorPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AuthErrorPage({ params }: AuthErrorPageProps) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="container mx-auto py-10">Loading...</div>}>
      <AuthErrorContent params={resolvedParams} />
    </Suspense>
  )
}

function AuthErrorContent({ params }: { params: { locale: string } }) {
  const searchParams = useSearchParams()
  const [errorType, setErrorType] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("An authentication error occurred")
  
  useEffect(() => {
    // Get error from URL
    const error = searchParams.get("error")
    setErrorType(error)
    
    // Set appropriate error message based on the error type
    if (error === "Configuration") {
      setErrorMessage("There is a problem with the server configuration. Contact your administrator.")
    } else if (error === "AccessDenied") {
      setErrorMessage("You do not have access to this resource.")
    } else if (error === "Verification") {
      setErrorMessage("The token has expired or has already been used.")
    } else if (error === "OAuthSignin") {
      setErrorMessage("Error in the OAuth signin process. Please try again.")
    } else if (error === "OAuthCallback") {
      setErrorMessage("Error in the OAuth callback process. Please try again.")
    } else if (error === "OAuthCreateAccount") {
      setErrorMessage("Error creating OAuth account. Please try again.")
    } else if (error === "EmailCreateAccount") {
      setErrorMessage("Error creating email account. Please try again.")
    } else if (error === "Callback") {
      setErrorMessage("Error in the callback handler. Please try again.")
    } else if (error === "Default") {
      setErrorMessage("An unspecified authentication error occurred. Please try again.")
    }
  }, [searchParams])
  
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">{errorType || "Error"}</p>
            <p>{errorMessage}</p>
          </div>
            <div className="flex justify-between">
            <Button asChild variant="outline">
              <Link href={`/${params.locale}/auth/login`}>Back to Login</Link>
            </Button>
            
            <Button asChild>
              <Link href={`/${params.locale}`}>Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
