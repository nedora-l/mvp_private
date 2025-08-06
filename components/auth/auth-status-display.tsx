"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { syncNextAuthWithAppAuth } from "@/lib/auth/nextauth-helpers"
import { useAuth } from "@/components/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function AuthStatusDisplay() {
  const { data: session, status } = useSession()
  const { currentLoggedUser } = useAuth()
  const [error, setError] = useState<string | null>(null)
  
  // Sync NextAuth session with app auth context
  useEffect(() => {
    if (session && status === "authenticated") {
      try {
        syncNextAuthWithAppAuth(session)
      } catch (err) {
        console.error("Error syncing session:", err)
        setError("Failed to sync authentication state")
      }
    }
  }, [session, status])
  
  if (status === "loading") {
    return <p>Loading authentication status...</p>
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {status === "authenticated" && session ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "User"} 
                  className="h-12 w-12 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{session.user?.name || "Unknown User"}</p>
                <p className="text-sm text-muted-foreground">{session.user?.email || "No email"}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm"><strong>Authentication method:</strong> {session.user?.provider || "Unknown"}</p>
              <p className="text-sm"><strong>Session status:</strong> Active</p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p>You are not currently signed in.</p>
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => window.location.href = "/auth/login"}
            >
              Sign In
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
