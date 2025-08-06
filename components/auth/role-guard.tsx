"use client"

import { useSession } from "next-auth/react"
import { hasRole, getUserPermissions } from "@/lib/utils/role-utils"
import { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  requiredRoles: string | string[]
  fallback?: ReactNode
  requireAll?: boolean // If true, user must have ALL roles, not just one
}

/**
 * Component that conditionally renders children based on user roles
 * 
 * @param children - Content to render if user has required roles
 * @param requiredRoles - Single role or array of roles required
 * @param fallback - Content to render if user doesn't have required roles
 * @param requireAll - If true, user must have ALL roles (default: false - user needs ANY role)
 */
export function RoleGuard({ 
  children, 
  requiredRoles, 
  fallback = null, 
  requireAll = false 
}: RoleGuardProps) {
  const { data: session } = useSession()
  const userRoles = session?.user?.roles as string[] | undefined

  if (!session || !userRoles) {
    return <>{fallback}</>
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  
  let hasAccess: boolean
  
  if (requireAll) {
    // User must have ALL specified roles
    hasAccess = roles.every(role => hasRole(userRoles, role))
  } else {
    // User must have ANY of the specified roles
    hasAccess = hasRole(userRoles, roles)
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

interface AdminGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Component that only renders children for admin users
 */
export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  return (
    <RoleGuard requiredRoles={['ADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

interface PermissionGuardProps {
  children: ReactNode
  permission: keyof ReturnType<typeof getUserPermissions>
  fallback?: ReactNode
}

/**
 * Component that conditionally renders children based on specific permissions
 */
export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
  const { data: session } = useSession()
  const userRoles = session?.user?.roles as string[] | undefined
  const permissions = getUserPermissions(userRoles)

  return permissions[permission] ? <>{children}</> : <>{fallback}</>
}

interface RoleBasedMenuItemProps {
  children: ReactNode
  requiredRoles: string | string[]
  className?: string
}

/**
 * Menu item component that only renders for users with required roles
 */
export function RoleBasedMenuItem({ 
  children, 
  requiredRoles, 
  className = "" 
}: RoleBasedMenuItemProps) {
  return (
    <RoleGuard requiredRoles={requiredRoles}>
      <div className={className}>
        {children}
      </div>
    </RoleGuard>
  )
}

/**
 * Hook to get role-based information for the current user
 */
export function useUserRole() {
  const { data: session } = useSession()
  const userRoles = session?.user?.roles as string[] | undefined
  const permissions = getUserPermissions(userRoles)

  return {
    roles: userRoles || [],
    permissions,
    hasRole: (role: string | string[]) => hasRole(userRoles, role),
    isAdmin: () => hasRole(userRoles, ['ADMIN']),
    canManageFiles: () => permissions.canManageFiles,
    canManageTeams: () => permissions.canManageTeams,
    canManageUsers: () => permissions.canManageUsers,
    canManageFinance: () => permissions.canManageFinance,
    canManageHR: () => permissions.canManageHR,
    canManageProjects: () => permissions.canManageProjects,
    canAccessAdminPanel: () => permissions.canAccessAdminPanel
  }
}
