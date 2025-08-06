"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Fingerprint, 
  KeyRound, 
  Smartphone, 
  Copy, 
  Eye, 
  EyeOff,
  LockKeyhole,
  ShieldCheck
} from "lucide-react"

// Verification types for the mock security verification process
export type VerificationType = "password" | "passkey" | "mfa"

// Interface for the password verification dialog props
interface PasswordVerificationDialogProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (success: boolean) => void
  verificationType: VerificationType
  dictionary: any
  actionType: "view" | "copy"
}

// A mock function to simulate the validation of user credentials
const mockValidateCredentials = (
  input: string, 
  verificationType: VerificationType
): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      switch (verificationType) {
        case "password":
          // Accept any input that is at least 4 characters for demo
          resolve(input.length >= 4)
          break
        case "passkey":
          // For demo, always succeed with passkey after delay
          resolve(true)
          break
        case "mfa":
          // For MFA, check if it's a 6-digit code
          resolve(/^\d{6}$/.test(input))
          break
        default:
          resolve(false)
      }
    }, 800) // Simulate network delay
  })
}

// Function to generate a secure password
export const generateSecurePassword = (length: number = 16): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?'
  
  // Combine all character sets
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars
  
  // Ensure at least one of each type is included
  let password = 
    getRandomChar(uppercaseChars) +
    getRandomChar(lowercaseChars) +
    getRandomChar(numberChars) +
    getRandomChar(specialChars)
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += getRandomChar(allChars)
  }
  
  // Shuffle the password to randomize the character positions
  return shuffleString(password)
}

// Helper function to get a random character from a string
const getRandomChar = (characters: string): string => {
  return characters.charAt(Math.floor(Math.random() * characters.length))
}

// Helper function to shuffle a string
const shuffleString = (str: string): string => {
  const arr = str.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}

// Password Verification Dialog Component
export const PasswordVerificationDialog = ({
  isOpen,
  onClose,
  onVerify,
  verificationType,
  dictionary,
  actionType
}: PasswordVerificationDialogProps) => {
  const [verificationValue, setVerificationValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const dict = dictionary.passwordManager
  
  const handleVerify = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const isValid = await mockValidateCredentials(verificationValue, verificationType)
      
      if (isValid) {
        onVerify(true)
        onClose()
      } else {
        setError(
          verificationType === "password" 
            ? "Incorrect password. Please try again." 
            : verificationType === "passkey" 
              ? "Passkey verification failed." 
              : "Invalid verification code. Please try again."
        )
        onVerify(false)
      }
    } catch (err) {
      setError("An error occurred during verification.")
      onVerify(false)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {actionType === "view" 
              ? "Verify to View Password" 
              : "Verify to Copy Password"}
          </DialogTitle>
          <DialogDescription>
            {verificationType === "password" && "Please enter your master password to continue."}
            {verificationType === "passkey" && "Please authenticate with your passkey."}
            {verificationType === "mfa" && "Please enter the 6-digit code from your authenticator app."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {verificationType === "password" && (
            <div className="grid gap-2">
              <Label htmlFor="master-password" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Master Password
              </Label>
              <Input
                id="master-password"
                type="password"
                placeholder="Enter your master password"
                value={verificationValue}
                onChange={(e) => setVerificationValue(e.target.value)}
                className="col-span-3"
                autoComplete="current-password"
              />
            </div>
          )}
          
          {verificationType === "passkey" && (
            <div className="flex flex-col items-center justify-center py-4 gap-3">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Fingerprint className="h-8 w-8 text-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground max-w-xs">
                Use your fingerprint, face recognition, or security key to verify your identity.
              </p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => handleVerify()}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Authenticate with Passkey"}
              </Button>
            </div>
          )}
          
          {verificationType === "mfa" && (
            <div className="grid gap-2">
              <Label htmlFor="mfa-code" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> Authentication Code
              </Label>
              <Input
                id="mfa-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationValue}
                onChange={(e) => setVerificationValue(e.target.value)}
                className="col-span-3"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          )}
          
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          {verificationType !== "passkey" && (
            <Button onClick={handleVerify} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Function to mock password reveal with security verification
export const usePasswordReveal = (dictionary: any) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false)
  const [verificationType, setVerificationType] = useState<VerificationType>("password")
  
  // Decide which verification method to use (for demo purposes, randomize it)
  const selectRandomVerificationType = (): VerificationType => {
    const types: VerificationType[] = ["password", "passkey", "mfa"]
    return types[Math.floor(Math.random() * types.length)]
  }
  
  // Function to trigger password reveal
  const revealPassword = () => {
    if (isPasswordVisible) {
      // If already visible, just hide it
      setIsPasswordVisible(false)
      return
    }
    
    // Choose verification type
    const verType = selectRandomVerificationType()
    setVerificationType(verType)
    setIsVerificationDialogOpen(true)
  }
  
  // Handle verification result
  const handleVerification = (success: boolean) => {
    if (success) {
      setIsPasswordVisible(true)
      toast({
        title: "Password revealed",
        description: "Password is now visible. It will be hidden when you close this page.",
        variant: "default",
      })
    }
  }
  
  // Create a mock password revealing component
  const PasswordRevealButton = ({ password }: { password: string }) => (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
        onClick={revealPassword}
      >
        {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        <span className="sr-only">
          {isPasswordVisible ? dictionary.passwordManager.actions.hide : dictionary.passwordManager.actions.reveal}
        </span>
      </Button>
      
      <PasswordVerificationDialog
        isOpen={isVerificationDialogOpen}
        onClose={() => setIsVerificationDialogOpen(false)}
        onVerify={handleVerification}
        verificationType={verificationType}
        dictionary={dictionary}
        actionType="view"
      />
    </>
  )
  
  // Return both the state and components
  return {
    isPasswordVisible,
    PasswordRevealButton,
    revealPassword,
  }
}

// Function to mock password copy with security verification
export const usePasswordCopy = (dictionary: any) => {
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false)
  const [verificationType, setVerificationType] = useState<VerificationType>("password")
  
  // Decide which verification method to use (for demo purposes, randomize it)
  const selectRandomVerificationType = (): VerificationType => {
    const types: VerificationType[] = ["password", "passkey", "mfa"]
    return types[Math.floor(Math.random() * types.length)]
  }
  
  // Function to copy password to clipboard after verification
  const copyPasswordToClipboard = (password: string) => {
    // Choose verification type
    const verType = selectRandomVerificationType()
    setVerificationType(verType)
    setIsVerificationDialogOpen(true)
  }
  
  // Handle verification result
  const handleVerification = (success: boolean, password: string) => {
    if (success) {
      // Copy to clipboard
      navigator.clipboard.writeText(password)
        .then(() => {
          toast({
            title: "Password copied",
            description: "Password has been copied to your clipboard.",
            variant: "default",
          })
        })
        .catch(() => {
          toast({
            title: "Copy failed",
            description: "Failed to copy password to clipboard.",
            variant: "destructive",
          })
        })
    }
  }
  
  // Create a mock password copy component
  const PasswordCopyButton = ({ password }: { password: string }) => (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
        onClick={() => copyPasswordToClipboard(password)}
      >
        <Copy className="h-4 w-4" />
        <span className="sr-only">
          {dictionary.passwordManager.actions.copy}
        </span>
      </Button>
      
      <PasswordVerificationDialog
        isOpen={isVerificationDialogOpen}
        onClose={() => setIsVerificationDialogOpen(false)}
        onVerify={(success) => handleVerification(success, password)}
        verificationType={verificationType}
        dictionary={dictionary}
        actionType="copy"
      />
    </>
  )
  
  // Return both the state and components
  return {
    PasswordCopyButton,
    copyPasswordToClipboard,
  }
}