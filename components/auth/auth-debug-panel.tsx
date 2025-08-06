"use client"

import { useSession } from "next-auth/react"
import { useAuth } from "@/components/contexts/auth-context"
import { useState } from "react"

export function AuthDebugPanel() {
  const { data: session, status } = useSession()
  const { accessToken, currentLoggedUser, isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  if (process.env.NODE_ENV !== 'development') {
    return null // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-20 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
      >
        🔍 Auth Debug
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
          <h3 className="font-bold mb-3 text-gray-900">Authentication Debug Info</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-gray-700">NextAuth Session:</h4>
              <div className="bg-gray-50 p-2 rounded">
                <div>Status: <span className="font-mono">{status}</span></div>
                <div>Has Session: <span className="font-mono">{!!session ? '✅' : '❌'}</span></div>
                {session && (
                  <>
                    <div>User ID: <span className="font-mono">{session.user?.id || 'N/A'}</span></div>
                    <div>Email: <span className="font-mono">{session.user?.email || 'N/A'}</span></div>
                    <div>Provider: <span className="font-mono">{session.user?.provider || 'N/A'}</span></div>
                    <div>Has Access Token: <span className="font-mono">{!!session.user?.accessToken ? '✅' : '❌'}</span></div>
                    <div>Has Refresh Token: <span className="font-mono">{!!session.user?.refreshToken ? '✅' : '❌'}</span></div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">Custom Auth Context:</h4>
              <div className="bg-gray-50 p-2 rounded">
                <div>Is Authenticated: <span className="font-mono">{isAuthenticated ? '✅' : '❌'}</span></div>
                <div>Has Access Token: <span className="font-mono">{!!accessToken ? '✅' : '❌'}</span></div>
                <div>Has User: <span className="font-mono">{!!currentLoggedUser ? '✅' : '❌'}</span></div>
                {currentLoggedUser && (
                  <>
                    <div>Username: <span className="font-mono">{currentLoggedUser.username}</span></div>
                    <div>Email: <span className="font-mono">{currentLoggedUser.email}</span></div>
                    <div>User ID: <span className="font-mono">{currentLoggedUser.id}</span></div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">Token Info:</h4>
              <div className="bg-gray-50 p-2 rounded">
                {accessToken ? (
                  <div>Token Preview: <span className="font-mono text-xs">{accessToken.substring(0, 20)}...</span></div>
                ) : (
                  <div>No access token</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">Sync Status:</h4>
              <div className="bg-gray-50 p-2 rounded">
                <div>NextAuth & Custom Match: 
                  <span className="font-mono ml-1">
                    {(!!session && isAuthenticated) || (!session && !isAuthenticated) ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
