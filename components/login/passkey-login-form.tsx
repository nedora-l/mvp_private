"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Fingerprint } from "lucide-react"

interface PasskeyLoginFormProps {
  dictionary: any
  redirectPath?: string
}

export function PasskeyLoginForm({ dictionary, redirectPath = "/fr/app" }: PasskeyLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePasskeyAuth = async () => {
    setIsLoading(true)
    
    try {
      // In a real implementation, this would use the WebAuthn API for passkey authentication
      // For example: navigator.credentials.get() with publicKey options
      
      // Simulate passkey verification
      console.log("Passkey authentication initiated")
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demonstration - in a real app, WebAuthn would handle verification
      window.location.href = redirectPath
    } catch (error) {
      console.error("Passkey authentication failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePasskey = () => {
    // In a real implementation, this would use the WebAuthn API to create a new passkey
    // For example: navigator.credentials.create() with publicKey options
    console.log("Passkey creation initiated")
    alert("In a real implementation, this would open the passkey creation flow.")
  }

  return (
    <div className="flex flex-col items-center space-y-6 py-2">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {dictionary.passkey.instruction}
        </p>
      </div>
      
      <Button
        size="lg"
        className="flex items-center gap-3 w-full max-w-xs"
        onClick={handlePasskeyAuth}
        disabled={isLoading}
      >
        <Fingerprint className="h-5 w-5" />
        <span>
          {isLoading ? "Verifying..." : dictionary.passkey.usePasskey}
        </span>
      </Button>
      
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          {dictionary.passkey.noPasskeys}
        </p>
        <Button 
          variant="link" 
          className="text-xs p-0 h-auto"
          onClick={handleCreatePasskey}
        >
          {dictionary.passkey.createPasskey}
        </Button>
      </div>
    </div>
  )
}