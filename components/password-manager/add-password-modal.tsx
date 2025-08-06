"use client"

import { useState } from "react"
import { Dictionary } from "@/locales/dictionary"
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Key, Shuffle, Check, X, EyeOff, Eye } from "lucide-react"

// Import locally with relative path to avoid TypeScript issues
import { PasswordStrengthMeter } from "@/components/password-manager/password-strength-meter"
import { generateSecurePassword } from "./password-security-utils"

export interface AddPasswordModalProps {
  dictionary: Dictionary
  onAddPassword: (passwordData: any) => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddPasswordModal({ 
  dictionary, 
  onAddPassword,
  isOpen,
  onOpenChange
}: AddPasswordModalProps) {
  const dict = dictionary.passwordManager
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    website: "",
    category: "personal",
    notes: "",
    platform: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ""
  })
  const [activeTab, setActiveTab] = useState("manual")

  // Calculate password strength when password changes
  const updatePasswordStrength = (password: string) => {
    // Simple password strength calculation for demo purposes
    // In a real app, you'd use a library like zxcvbn
    let score = 0
    let feedback = dict.security.weak

    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score >= 4) feedback = dict.security.overall
    else if (score >= 2) feedback = dict.security.issues

    setPasswordStrength({ score, feedback })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === "password") {
      updatePasswordStrength(value)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword(16)
    setFormData(prev => ({ ...prev, password: newPassword }))
    updatePasswordStrength(newPassword)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddPassword({
      ...formData,
      id: Date.now().toString(),
      isFavorite: false,
      lastUpdated: new Date().toISOString(),
      strength: passwordStrength.score >= 4 ? "strong" : passwordStrength.score >= 2 ? "medium" : "weak"
    })
    // Reset form
    setFormData({
      title: "",
      username: "",
      password: "",
      website: "",
      category: "personal",
      notes: "",
      platform: ""
    })
    setPasswordStrength({ score: 0, feedback: "" })
    setActiveTab("manual")
  }

  const categories = [
    { id: "work", label: dict.categories.work },
    { id: "personal", label: dict.categories.personal },
    { id: "finance", label: dict.categories.finance },
    { id: "social", label: dict.categories.social },
    { id: "shopping", label: dict.categories.shopping },
    { id: "entertainment", label: dict.categories.entertainment }
  ]

  const platforms = [
    { id: "github", label: "GitHub" },
    { id: "gmail", label: "Gmail" },
    { id: "company", label: "Company" },
    { id: "bank", label: "Bank" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "salesforce", label: "Salesforce" },
    { id: "amazon", label: "Amazon" },
    { id: "slack", label: "Slack" },
    { id: "facebook", label: "Facebook" },
    { id: "other", label: dict.categories.other }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dict.newPassword}</DialogTitle>
          <DialogDescription>
            {dict.description}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="manual">{dictionary.actions.create}</TabsTrigger>
            <TabsTrigger value="scan">Scan Credentials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{dict.credentials.title}</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">{dict.credentials.website}</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    value={formData.website} 
                    onChange={handleInputChange} 
                    placeholder="example.com" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{dict.credentials.username}</Label>
                  <Input 
                    id="username" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => handleSelectChange("platform", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{dict.credentials.password}</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGeneratePassword}
                    className="h-7 gap-1 text-xs"
                  >
                    <Shuffle className="h-3 w-3" />
                    {dict.actions.generate}
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      required 
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? dict.actions.hide : dict.actions.reveal}
                      </span>
                    </Button>
                  </div>
                </div>
                
                <PasswordStrengthMeter 
                  score={passwordStrength.score} 
                  feedback={passwordStrength.feedback} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">{dict.credentials.category}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">{dict.credentials.notes}</Label>
                <Input 
                  id="notes" 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleInputChange} 
                />
              </div>
            
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
                  <X className="mr-2 h-4 w-4" />
                  {dictionary.actions.cancel}
                </Button>
                <Button type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  {dictionary.actions.save}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="scan" className="space-y-4">
            <div className="bg-muted/50 p-8 rounded-lg flex flex-col items-center justify-center text-center space-y-3">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Key className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium">Scan Instructions</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {dict.description}
              </p>
              <Button className="mt-2">
                Start Scan
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}