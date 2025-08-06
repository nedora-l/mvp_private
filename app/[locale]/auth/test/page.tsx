"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { syncNextAuthWithAppAuth } from "@/lib/auth/nextauth-helpers"
import { SessionDebug } from "@/components/debug/session-debug"

export default function AuthTestPage() {
  const { data: session, status } = useSession()
  const [syncError, setSyncError] = useState<string | null>(null)

  // Sync NextAuth session with our app auth context when session changes
  useEffect(() => {
    if (session && status === "authenticated") {
      try {
        syncNextAuthWithAppAuth(session)
        setSyncError(null)
      } catch (err) {
        console.error("Error syncing session:", err)
        setSyncError("Failed to sync authentication state")
      }
    }
  }, [session, status])

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p>Status: <span className="font-mono">{status}</span></p>
                <p>Authenticated: {session ? "✅ Yes" : "❌ No"}</p>
                {syncError && (
                  <p className="text-red-500">Sync Error: {syncError}</p>
                )}
              </div>
              <div className="space-x-2">
                {!session ? (
                  <>
                    <Button onClick={() => signIn("credentials")}>
                      Sign in with Credentials
                    </Button>
                    <Button onClick={() => signIn("google")}>
                      Sign in with Google
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => signOut()}>
                    Sign out
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {session && (
          <SessionDebug />
        )}
      </div>
    </div>
  )
}
        {/* Email Verification Display <CardHeader>
            <CardTitle>OAuth Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {syncError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{syncError}</p>
              </div>
            )}
          
            {status === "loading" ? (
              <p>Loading authentication session...</p>
            ) : status === "authenticated" && session ? (
              <>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex items-center space-x-3">
                    {session.user?.image && (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        className="h-12 w-12 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{session.user?.name || "Unknown User"}</h3>
                      <p className="text-sm text-muted-foreground">{session.user?.email || "No email"}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p><strong>Provider:</strong> {session.user?.provider || "unknown"}</p>
                    <p><strong>ID:</strong> {session.user?.id || "unknown"}</p>
                    <p><strong>AccessToken:</strong> {session.user?.accessToken ? 
                      `${session.user.accessToken.substring(0, 20)}...` : 'None'}</p>
                  </div>
                </div>

                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => signOut({ callbackUrl: "/auth/test" })}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-center">You are not signed in</p>
                
                <Button 
                  variant="default" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => signIn("google", { callbackUrl: "/auth/test" })}
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
                  Sign in with Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => signIn("credentials", { 
                    callbackUrl: "/auth/test",
                    username: "admin",
                    password: "admin" 
                  })}
                >
                  Sign in with Credentials (admin/admin)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/ * Email Verification Display * /}
        <EmailVerificationDisplay trustedDomains={['da-tech.ma', 'gmail.com']} />
      </div>
    </div>
  )
}
*/}
          