/**
 * Utility functions for role-based access control
 */

import React, { Component  } from "react"

export type UserRole = 
  | 'ADMIN' 
  | 'ROLE_ADMIN'
  | 'FILES_MANAGER'
  | 'TEAM_MANAGER'
  | 'HR_MANAGER'
  | 'FINANCE_MANAGER'
  | 'PROJECT_MANAGER'
  | 'USER'
  | 'ROLE_USER'

export interface RolePermissions {
  canManageFiles: boolean
  canManageTeams: boolean
  canManageUsers: boolean
  canManageFinance: boolean
  canManageHR: boolean
  canManageProjects: boolean
  canAccessAdminPanel: boolean
  canViewAllDocuments: boolean
  canDeleteDocuments: boolean
  canShareDocuments: boolean
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(userRoles: string[] | undefined, requiredRoles: string | string[]): boolean {
  if (!userRoles || userRoles.length === 0) return false
  
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  
  return roles.some(role => 
    userRoles.includes(role) || 
    userRoles.includes(`ROLE_${role}`) ||
    // Admin users have access to everything
    userRoles.includes('ADMIN') ||
    userRoles.includes('ROLE_ADMIN')
  )
}

/**
 * Check if user has admin privileges
 */
export function isAdmin(userRoles: string[] | undefined): boolean {
  return hasRole(userRoles, ['ADMIN', 'ROLE_ADMIN'])
}

/**
 * Check if user can manage files
 */
export function canManageFiles(userRoles: string[] | undefined): boolean {
  return hasRole(userRoles, ['FILES_MANAGER', 'ADMIN'])
}

/**
 * Check if user can manage teams
 */
export function canManageTeams(userRoles: string[] | undefined): boolean {
  return hasRole(userRoles, ['TEAM_MANAGER', 'ADMIN'])
}

/**
 * Check if user can manage HR
 */
export function canManageHR(userRoles: string[] | undefined): boolean {
  return hasRole(userRoles, ['HR_MANAGER', 'ADMIN'])
}

/**
 * Check if user can manage finance
 */
export function canManageFinance(userRoles: string[] | undefined): boolean {
  return hasRole(userRoles, ['FINANCE_MANAGER', 'ADMIN'])
}

/**
 * Check if user can manage projects
 */
export function canManageProjects(userRoles: string[] | undefined): boolean {
  return hasRole(userRoles, ['PROJECT_MANAGER', 'TEAM_MANAGER', 'ADMIN'])
}

/**
 * Get all permissions for a user based on their roles
 */
export function getUserPermissions(userRoles: string[] | undefined): RolePermissions {
  return {
    canManageFiles: canManageFiles(userRoles),
    canManageTeams: canManageTeams(userRoles),
    canManageUsers: isAdmin(userRoles),
    canManageFinance: canManageFinance(userRoles),
    canManageHR: canManageHR(userRoles),
    canManageProjects: canManageProjects(userRoles),
    canAccessAdminPanel: isAdmin(userRoles),
    canViewAllDocuments: hasRole(userRoles, ['FILES_MANAGER', 'ADMIN']),
    canDeleteDocuments: hasRole(userRoles, ['FILES_MANAGER', 'ADMIN']),
    canShareDocuments: hasRole(userRoles, ['FILES_MANAGER', 'TEAM_MANAGER', 'ADMIN'])
  }
}

/**
 * Route-based role checking - matches the middleware logic
 */
export function canAccessRoute(pathname: string, userRoles: string[] | undefined): boolean {
  // Admin routes
  if (/^\/(en|fr|ar)\/app\/admin(?:\/.*)?$/.test(pathname) ||
      /^\/(en|fr|ar)\/app\/settings\/security(?:\/.*)?$/.test(pathname) ||
      /^\/(en|fr|ar)\/app\/settings\/users(?:\/.*)?$/.test(pathname)) {
    return isAdmin(userRoles)
  }
  
  // Files manager routes
  if (/^\/(en|fr|ar)\/app\/documents\/manage(?:\/.*)?$/.test(pathname) ||
      /^\/(en|fr|ar)\/app\/documents\/admin(?:\/.*)?$/.test(pathname)) {
    return canManageFiles(userRoles)
  }
  
  // Team manager routes
  if (/^\/(en|fr|ar)\/app\/teams\/manage(?:\/.*)?$/.test(pathname) ||
      /^\/(en|fr|ar)\/app\/projects\/manage(?:\/.*)?$/.test(pathname)) {
    return canManageTeams(userRoles)
  }
  
  // HR manager routes
  if (/^\/(en|fr|ar)\/app\/hr(?:\/.*)?$/.test(pathname) ||
      /^\/(en|fr|ar)\/app\/employees(?:\/.*)?$/.test(pathname)) {
    return canManageHR(userRoles)
  }
  
  // Finance manager routes
  if (/^\/(en|fr|ar)\/app\/finance(?:\/.*)?$/.test(pathname) ||
      /^\/(en|fr|ar)\/app\/accounting(?:\/.*)?$/.test(pathname)) {
    return canManageFinance(userRoles)
  }
  
  // Default: allow access if no specific role required
  return true
}

/**
 * Higher-order component for role-based component rendering
 */
export function withRole<T extends object>(
  Component: React.ComponentType<T>,
  requiredRoles: string | string[],
  fallback?: React.ComponentType<T> | React.ReactNode
) {
  return function WrappedComponent(props: T & { userRoles?: string[] }) {
    const { userRoles, ...componentProps } = props
    
    if (hasRole(userRoles, requiredRoles)) {
      return (<React.Component {...(componentProps as T)} />)
    }
    
    if (fallback) {
      if (React.isValidElement(fallback)) {
        return fallback
      }
      const FallbackComponent = fallback as React.ComponentType<T>
      return (<FallbackComponent {...(componentProps as T)} />)
    }
    
    return null
  }
}

/**
 * Hook for role-based access control
 */
export function useRoleAccess(userRoles: string[] | undefined) {
  const permissions = getUserPermissions(userRoles)
  
  return {
    hasRole: (requiredRoles: string | string[]) => hasRole(userRoles, requiredRoles),
    isAdmin: () => isAdmin(userRoles),
    canAccess: (pathname: string) => canAccessRoute(pathname, userRoles),
    permissions
  }
}
