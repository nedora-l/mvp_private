"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isFromTrustedDomain, getCompanyFromEmail } from "@/lib/auth/email-verification"

interface EmailVerificationProps {
  trustedDomains?: string[]
}

export function EmailVerificationDisplay({ 
  trustedDomains = ['da-tech.ma'] 
}: EmailVerificationProps) {
  const { data: session, status } = useSession()
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [companyName, setCompanyName] = useState<string | null>(null)
  
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      // Verify if the email is from a trusted domain
      const verified = isFromTrustedDomain(session.user.email, trustedDomains)
      setIsVerified(verified)
      
      // Get the company name from the email
      if (verified) {
        setCompanyName(getCompanyFromEmail(session.user.email))
      }
    } else {
      setIsVerified(null)
      setCompanyName(null)
    }
  }, [session, status, trustedDomains])
  
  if (status === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>Checking verification status...</CardDescription>
        </CardHeader>
      </Card>
    )
  }
  
  if (status !== "authenticated" || !session?.user?.email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>Please sign in to verify your email</CardDescription>
        </CardHeader>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          Checking if your email is from a trusted organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Email:</span>
          <span>{session.user.email}</span>
          {isVerified !== null && (
            <Badge className={isVerified ? "bg-green-500" : "bg-red-500"}>
              {isVerified ? "Verified" : "Unverified"}
            </Badge>
          )}
        </div>
        
        {isVerified && companyName && (
          <div>
            <span className="font-medium">Organization:</span> {companyName}
          </div>
        )}
        
        {isVerified !== null && (
          <div className="text-sm mt-4">
            {isVerified ? (
              <p className="text-green-600">
                Your email has been verified as belonging to a trusted organization. 
                You have access to organization-specific features.
              </p>
            ) : (
              <p className="text-yellow-600">
                Your email is not from a trusted organization domain. Some features may be restricted.
                Trusted domains: {trustedDomains.join(', ')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
