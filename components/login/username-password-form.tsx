"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { Alert, AlertDescription } from "../ui/alert"
import { useAuth } from "@/components/contexts/auth-context"

interface UsernamePasswordFormProps {
  dictionary: any
  redirectPath?: string
  locale?: string // Add locale prop
}

export function UsernamePasswordForm({ dictionary, redirectPath = "/fr/app", locale = "fr" }: UsernamePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: true
  })
  const [error, setError] = useState<string | null>(null)
  // Remove the old login method since we're using NextAuth exclusively
  // const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null)
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate form
      if (!formData.username.trim()) {
        console.log("🔍 Form validation: Username is empty");
        setError(dictionary.errors?.usernameRequired || "Username is required")
        setIsLoading(false)
        return
      }
      
      if (!formData.password) {
        console.log("🔍 Form validation: Password is empty");
        setError(dictionary.errors?.passwordRequired || "Password is required")
        setIsLoading(false)
        return
      }      console.log("🚀 Form: Login attempt starting with username:", formData.username);
      
      // OPTION 1: Use NextAuth only (current approach)
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false, // Don't redirect automatically
      });
      
      console.log("📊 Form: NextAuth signIn result:", {
        ok: result?.ok,
        error: result?.error,
        status: result?.status,
        url: result?.url
      });
      
      if (result?.ok && !result?.error) {
        console.log("✅ Form: NextAuth login successful, redirecting to:", redirectPath);
        
        // Give NextAuth time to establish session before redirect
        setTimeout(() => {
          window.location.href = redirectPath
        }, 400);
      } else {
        console.warn("❌ Form: NextAuth login failed, error:", result?.error);
        setError(dictionary.errors?.invalidCredentials || "Invalid username or password")
      }
       
    } catch (error) {
      console.error("Form: Login error:", error);
      setError(
        dictionary.errors?.loginFailed || 
        "An error occurred during login. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="username">{dictionary.usernamePassword.username}</Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe@example.com"
          disabled={isLoading}
          className={error && error.includes("username") ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{dictionary.usernamePassword.password}</Label>
          <Link href={`/${locale}/auth/forgot-password`} className="text-sm text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-ring">
            {dictionary.usernamePassword.forgotPassword}
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading}
            className={error && error.includes("password") ? "border-destructive" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="rememberMe" 
            name="rememberMe" 
            checked={formData.rememberMe} 
            onCheckedChange={(checked) => {
              if (error) setError(null);
              setFormData(prev => ({...prev, rememberMe: Boolean(checked) }))
            }}
            className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <Label htmlFor="rememberMe" className="text-sm font-normal text-muted-foreground select-none cursor-pointer">
            {dictionary.usernamePassword.rememberMe || "Remember me"}
          </Label>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : dictionary.usernamePassword.signIn}
      </Button>
    </form>
  )
}