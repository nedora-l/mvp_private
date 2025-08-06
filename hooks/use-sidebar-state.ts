"use client"

import { useState, useEffect, useCallback } from 'react'

// Constants for localStorage keys
const SIDEBAR_STORAGE_KEY = "daws-sidebar-state"
const MOBILE_SIDEBAR_STORAGE_KEY = "daws-mobile-sidebar-state"

export interface SidebarState {
  isCollapsed: boolean
  isMobileOpen: boolean
  isLoaded: boolean
}

export interface SidebarActions {
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
}

export function useSidebarState(initialCompact: boolean = false): SidebarState & SidebarActions {
  const [isCollapsed, setIsCollapsed] = useState(initialCompact)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const loadSidebarState = () => {
      try {
        const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY)
        const savedMobileState = localStorage.getItem(MOBILE_SIDEBAR_STORAGE_KEY)
        
        if (savedState !== null) {
          setIsCollapsed(JSON.parse(savedState))
        }
        
        if (savedMobileState !== null) {
          setIsMobileOpen(JSON.parse(savedMobileState))
        }
      } catch (error) {
        console.warn("Failed to load sidebar state from localStorage:", error)
        // Fallback to default values if localStorage is not available
        setIsCollapsed(initialCompact)
        setIsMobileOpen(false)
      } finally {
        setIsLoaded(true)
      }
    }

    // Only load state on client-side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      loadSidebarState()
    } else {
      setIsLoaded(true)
    }
  }, [initialCompact])

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isCollapsed))
      } catch (error) {
        console.warn("Failed to save sidebar state to localStorage:", error)
      }
    }
  }, [isCollapsed, isLoaded])

  // Save mobile sidebar state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(MOBILE_SIDEBAR_STORAGE_KEY, JSON.stringify(isMobileOpen))
      } catch (error) {
        console.warn("Failed to save mobile sidebar state to localStorage:", error)
      }
    }
  }, [isMobileOpen, isLoaded])

  // Action handlers
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev)
  }, [])

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen(prev => !prev)
  }, [])

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed)
  }, [])

  const setMobileSidebarOpen = useCallback((open: boolean) => {
    setIsMobileOpen(open)
  }, [])

  return {
    isCollapsed,
    isMobileOpen,
    isLoaded,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    setSidebarCollapsed,
    setMobileSidebarOpen,
  }
}

// Utility functions for direct localStorage access (useful for SSR)
export const getSavedSidebarState = (): { isCollapsed: boolean; isMobileOpen: boolean } => {
  if (typeof window === 'undefined') {
    return { isCollapsed: false, isMobileOpen: false }
  }

  try {
    const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    const savedMobileState = localStorage.getItem(MOBILE_SIDEBAR_STORAGE_KEY)

    return {
      isCollapsed: savedState ? JSON.parse(savedState) : false,
      isMobileOpen: savedMobileState ? JSON.parse(savedMobileState) : false,
    }
  } catch (error) {
    console.warn("Failed to get saved sidebar state:", error)
    return { isCollapsed: false, isMobileOpen: false }
  }
}

export const clearSidebarState = (): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(SIDEBAR_STORAGE_KEY)
    localStorage.removeItem(MOBILE_SIDEBAR_STORAGE_KEY)
  } catch (error) {
    console.warn("Failed to clear sidebar state:", error)
  }
}
