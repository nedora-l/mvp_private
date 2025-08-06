"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dictionary } from "@/locales/dictionary"
import { Fingerprint, Lock, Mail } from "lucide-react"
import { UsernamePasswordForm } from "./username-password-form"
import { GoogleLoginButton } from "./google-login-button"

interface LoginFormProps {
  dictionary: Dictionary
  locale: string
  redirectPath?: string
}

export function LoginForm({ dictionary, locale, redirectPath = `/${locale}/app` }: LoginFormProps) {
  const [activeTab, setActiveTab] = useState<string>("username")
  
  // Use dictionary values if they exist, otherwise use fallbacks
  const dict = dictionary.login || {
    tabs: {
      username: "Username & Password",
      google: "Google",
      passkey: "Passkey"
    },
    usernamePassword: {
      username: "Username or Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      signIn: "Sign In",
      rememberMe: "Remember me"
    },
    google: {
      signInWithGoogle: "Sign in with Google"
    },
    passkey: {
      usePasskey: "Use passkey",
      instruction: "Click the button below to sign in with your passkey",
      noPasskeys: "Don't have a passkey?",
      createPasskey: "Create one now"
    }
  }
  
  return (
    <Card className="border shadow-lg">
      <CardContent className="p-0">
        <Tabs 
          defaultValue="username" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-b-none">
            <TabsTrigger value="username" className="flex items-center gap-2 py-3">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline-block">{dict.tabs.username}</span>
            </TabsTrigger>
            
            <TabsTrigger value="passkey" className="flex items-center gap-2 py-3">
              <Fingerprint className="h-4 w-4" />
              <span className="hidden sm:inline-block"> {dict.tabs.google} </span>
            </TabsTrigger>
          </TabsList>
          
          <div className="p-6">            
            <TabsContent value="username" className="m-0">
              <UsernamePasswordForm dictionary={dict} redirectPath={redirectPath} locale={locale} />
              <div className="flex justify-end mt-2">
                <a
                  href={`/${locale}/auth/forgot-password`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {dict.usernamePassword.forgotPassword}
                </a>
              </div>
            </TabsContent>
            
            <TabsContent value="passkey" className="m-0">
              <GoogleLoginButton locale={locale} dictionary={dict} redirectPath={redirectPath} />
              {/* Uncomment if you want to add passkey login*/}
              {/* <PasskeyLoginForm dictionary={dict} redirectPath={redirectPath} /> */}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}