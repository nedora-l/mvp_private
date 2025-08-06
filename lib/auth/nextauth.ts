import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { getLoginToken } from "@/lib/api/auth-api"
import { authService } from "@/lib/services"
import { authConfig } from "@/auth.config"

/**
 * NextAuth v5 configuration optimized for the DAWS application
 * This file exports the handlers for the API route and the auth function
 */
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig)
