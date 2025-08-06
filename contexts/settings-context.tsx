"use client"

import { createContext, useContext, useEffect, useState } from "react"

export interface UserSettings {
  avatar: string
  fullName: string
  email: string
  phone: string
  timezone: string
  language: string
  currency: string
  dateFormat: string
  fontSize: number
  theme: "light" | "dark" | "system"
  layout: "default" | "compact" | "expanded"
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    accountActivity: boolean
    newFeatures: boolean
    marketing: boolean
    frequency: "real-time" | "daily" | "weekly"
    quietHoursStart: string
    quietHoursEnd: string
  }
  privacy: {
    analyticsSharing: boolean
    personalizedAds: boolean
    visibility: "public" | "private"
    dataRetention: "6-months" | "1-year" | "2-years" | "indefinite"
  }
  currentRole: string // Current user role
  currentDepartment: string // Current department
  currentApp: string // Current app
  currentLocale: string // Current locale
  currentTheme: "light" | "dark" | "system" // Current theme
  currentFontSize: number // Current font size
  currentLayout: "default" | "compact" | "expanded" // Current layout
  currentDateFormat: string // Current date format
  currentCurrency: string // Current currency
  currentTimezone: string // Current timezone
  currentLanguage: string // Current language
}

const defaultSettings: UserSettings = {
  avatar: "/logo/avatar.svg",
  fullName: "Rachid Demo",
  email: "rachid.demo@example.com",
  phone: "00000000",
  timezone: "utc",
  language: "fr",
  currency: "mad",
  dateFormat: "mm-dd-yyyy",
  fontSize: 16,
  theme: "system",
  layout: "default",
  notifications: {
    email: true,
    push: true,
    sms: false,
    accountActivity: true,
    newFeatures: true,
    marketing: false,
    frequency: "real-time",
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  },
  privacy: {
    analyticsSharing: true,
    personalizedAds: false,
    visibility: "public",
    dataRetention: "1-year",
  },
  currentRole: "admin", // Default role
  currentDepartment: "admin", // Default department
  currentApp: "dashboard", // Default app
  currentLocale: "fr", // Default locale
  currentTheme: "light", // Default theme
  currentFontSize: 16, // Default font size
  currentLayout: "default", // Default layout
  currentDateFormat: "mm-dd-yyyy", // Default date format
  currentCurrency: "mad", // Default currency
  currentTimezone: "utc", // Default timezone
  currentLanguage: "fr", // Default language
}

interface SettingsContextType {
  settings: UserSettings
  isSettingsLoaded: boolean // <-- Add this
  updateSettings: (newSettings: Partial<UserSettings>) => void
  updateNotificationSettings: (settings: Partial<UserSettings["notifications"]>) => void
  updatePrivacySettings: (settings: Partial<UserSettings["privacy"]>) => void
  setCurrentDepartment: (department: string) => void // Add setter for department
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false)

  useEffect(() => {
    // This effect runs only on the client after initial render
    try {
      const storedSettings = localStorage.getItem("userSettings")
      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) })
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error)
    }
    setIsSettingsLoaded(true) // Signal that settings are loaded
  }, [])

  useEffect(() => {
    // This effect saves settings to localStorage whenever they change, but only after they have been loaded.
    if (isSettingsLoaded) {
      localStorage.setItem("userSettings", JSON.stringify(settings))
    }
  }, [settings, isSettingsLoaded])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const updateNotificationSettings = (notificationSettings: Partial<UserSettings["notifications"]>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...notificationSettings },
    }))
  }

  const updatePrivacySettings = (privacySettings: Partial<UserSettings["privacy"]>) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, ...privacySettings },
    }))
  }

  // Add setter for department
  const setCurrentDepartment = (department: string) => {
    setSettings((prev) => ({ ...prev, currentDepartment: department }))
  }

  const value = {
    settings,
    isSettingsLoaded,
    updateSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    setCurrentDepartment,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
