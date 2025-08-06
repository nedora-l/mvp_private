/**
 * Centralized route permissions configuration
 * This file defines which routes require which roles
 */

export interface RoutePermission {
  pattern: RegExp
  roles: string[]
  description: string
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Admin-only routes
  {
    pattern: /^\/(en|fr|ar)\/app\/admin(?:\/.*)?$/,
    roles: ['ADMIN'],
    description: 'Admin panel access'
  },
  {
    pattern: /^\/(en|fr|ar)\/apps\/security(?:\/.*)?$/,
    roles: ['ADMIN'],
    description: 'Security settings'
  },
  {
    pattern: /^\/(en|fr|ar)\/app\/settings\/users(?:\/.*)?$/,
    roles: ['USER', 'ADMIN'],
    description: 'User management'
  },
  {
    pattern: /^\/(en|fr|ar)\/app\/settings\/system(?:\/.*)?$/,
    roles: ['USER', 'ADMIN'],
    description: 'System settings'
  },
  
]

/**
 * Get required roles for a given pathname
 */
export function getRequiredRoles(pathname: string): string[] | null {
  const permission = ROUTE_PERMISSIONS.find(p => p.pattern.test(pathname))
  return permission ? permission.roles : null
}

/**
 * Check if user has required role for a pathname
 */
export function hasRequiredRole(userRoles: string[] | undefined, requiredRoles: string[]): boolean {
  if (!userRoles || userRoles.length === 0) return false
  
  // Check if user has any of the required roles
  return requiredRoles.some(role => 
    userRoles.includes(role) || 
    userRoles.includes(`ROLE_${role}`) ||
    userRoles.includes('ADMIN') ||
    userRoles.includes('ROLE_ADMIN')
  )
}

/**
 * Get all routes that a user can access
 */
export function getAccessibleRoutes(userRoles: string[] | undefined): RoutePermission[] {
  if (!userRoles) return []
  
  return ROUTE_PERMISSIONS.filter(permission => 
    hasRequiredRole(userRoles, permission.roles)
  )
}

/**
 * Get routes that require a specific role
 */
export function getRoutesByRole(role: string): RoutePermission[] {
  return ROUTE_PERMISSIONS.filter(permission => 
    permission.roles.includes(role)
  )
}

/**
 * Development helper: Log all route permissions
 */
export function logRoutePermissions() {
  console.table(ROUTE_PERMISSIONS.map(p => ({
    pattern: p.pattern.toString(),
    roles: p.roles.join(', '),
    description: p.description
  })))
}
