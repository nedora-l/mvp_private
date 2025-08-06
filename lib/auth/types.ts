import "next-auth"
import { JWT } from "next-auth/jwt"

// Properly extend NextAuth types with our comprehensive user properties from API
declare module "next-auth" {
  interface Session {
    user: {
      // Basic NextAuth fields
      id: string
      name?: string
      email?: string
      image?: string
      // Auth tokens
      accessToken?: string
      refreshToken?: string
      tokenType?: string
      provider?: string
      // Complete user data from API
      username?: string
      firstName?: string
      lastName?: string
      profilePictureUrl?: string
      phone?: string
      address?: string
      locale?: string
      role?: string
      roles?: string[]
      timeZone?: string
      title?: string
      departmentId?: number
      teamId?: number | null
      countryId?: number
      cityId?: number
    }
  }

  interface User {
    id: string
    name?: string
    email?: string
    image?: string
    // Auth tokens
    accessToken?: string
    refreshToken?: string
    tokenType?: string
    // Complete user data from API
    username?: string
    firstName?: string
    lastName?: string
    profilePictureUrl?: string
    phone?: string
    address?: string
    locale?: string
    role?: string
    roles?: string[]
    timeZone?: string
    title?: string
    departmentId?: number
    teamId?: number | null
    countryId?: number
    cityId?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // Auth tokens and expiry
    accessToken?: string
    refreshToken?: string
    tokenType?: string
    accessTokenExpires?: number
    provider?: string
    // Basic user info
    id?: string
    email?: string
    name?: string
    image?: string
    // Complete user data from API
    username?: string
    firstName?: string
    lastName?: string
    profilePictureUrl?: string
    phone?: string
    address?: string
    locale?: string
    role?: string
    roles?: string[]
    timeZone?: string
    title?: string
    departmentId?: number
    teamId?: number | null
    countryId?: number
    cityId?: number
    // Error handling
    error?: string
  }
}
