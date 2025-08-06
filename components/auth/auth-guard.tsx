"use client"

import { useAuth } from "@/components/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, ReactNode } from "react"

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * Client-side authentication guard for components that need auth data
 * 
 * Usage:
 * <AuthGuard>
 *   <YourProtectedComponent />
 * </AuthGuard>
 * 
 * With custom redirect:
 * <AuthGuard redirectTo="/custom-login">
 *   <YourProtectedComponent />
 * </AuthGuard>
 * 
 * With fallback content instead of redirect:
 * <AuthGuard fallback={<p>Please login to view this content</p>}>
 *   <YourProtectedComponent />
 * </AuthGuard>
 */
export function AuthGuard({ 
  children, 
  fallback, 
  redirectTo 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if:
    // 1. Not loading (initial auth check complete)
    // 2. Not authenticated
    // 3. A redirect path is provided
    if (!isLoading && !isAuthenticated && redirectTo) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  // Show loading state
  if (isLoading) {
    return fallback || <div>Loading...</div>
  }

  // If not authenticated and not redirecting, show fallback content
  if (!isAuthenticated) {
    return fallback || null
  }

  // If authenticated, render the children
  return <>{children}</>
}