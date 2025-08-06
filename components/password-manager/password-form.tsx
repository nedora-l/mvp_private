"use client"

import React, { useState } from "react"
import { Dictionary } from "@/locales/dictionary"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  User, Key, Globe, Link, FileText, 
  Star, Building, Mail, Github, Lock, 
  Facebook, CreditCard, ShoppingBag, Briefcase, 
  Twitch, Shield, Info, Plus, AlertCircle,
  Check, X
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { generatePassword } from "./password-generator"

// Password validation schema
const passwordFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).or(z.string().length(0)),
  platform: z.string(),
  category: z.string(),
  notes: z.string().optional(),
  isFavorite: z.boolean().default(false),
});

// Helper for password strength calculation
const calculatePasswordStrength = (password: string): { 
  strength: "weak" | "medium" | "strong", 
  score: number, 
  feedback: string[] 
} => {
  // Default return values
  let strength: "weak" | "medium" | "strong" = "weak";
  let score = 0;
  const feedback: string[] = [];
  
  // Basic checks
  if (password.length === 0) {
    return { strength, score, feedback: ["Please enter a password"] };
  }
  
  // Length check
  if (password.length < 8) {
    feedback.push("Password is too short");
  } else {
    score += 20;
  }
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 20;
  else feedback.push("Add uppercase letters");
  
  if (/[a-z]/.test(password)) score += 15;
  else feedback.push("Add lowercase letters");
  
  if (/[0-9]/.test(password)) score += 15;
  else feedback.push("Add numbers");
  
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  else feedback.push("Add special characters");
  
  // Length bonus
  if (password.length > 12) score += 10;
  
  // Determine strength based on score
  if (score >= 80) strength = "strong";
  else if (score >= 50) strength = "medium";
  
  // Cap the score at 100
  score = Math.min(score, 100);
  
  return { strength, score, feedback };
};

// Platform options for the select field
const platformOptions = [
  { value: "email", label: "Email Provider", icon: <Mail className="h-4 w-4 mr-2" /> },
  { value: "company", label: "Company Account", icon: <Building className="h-4 w-4 mr-2" /> },
  { value: "bank", label: "Banking", icon: <CreditCard className="h-4 w-4 mr-2" /> },
  { value: "github", label: "GitHub", icon: <Github className="h-4 w-4 mr-2" /> },
  { value: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4 mr-2" /> },
  { value: "gmail", label: "Gmail", icon: <Mail className="h-4 w-4 mr-2" /> },
  { value: "amazon", label: "Amazon", icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
  { value: "work", label: "Work Account", icon: <Briefcase className="h-4 w-4 mr-2" /> },
  { value: "website", label: "Website", icon: <Globe className="h-4 w-4 mr-2" /> },
  { value: "other", label: "Other", icon: <Key className="h-4 w-4 mr-2" /> },
];

// Category options for the select field
const categoryOptions = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "finance", label: "Finance" },
  { value: "social", label: "Social Media" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

// Color mapping for password strength
const strengthColors = {
  weak: {
    color: "text-red-500",
    bg: "bg-red-500",
    light: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  },
  medium: {
    color: "text-yellow-500", 
    bg: "bg-yellow-500",
    light: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  },
  strong: {
    color: "text-green-500",
    bg: "bg-green-500",
    light: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  }
};

interface PasswordFormProps {
  dictionary: Dictionary;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: z.infer<typeof passwordFormSchema> & { strength: string }) => void;
  editData?: (z.infer<typeof passwordFormSchema> & { strength?: string }) | null;
}

export function PasswordForm({
  dictionary,
  isOpen,
  onClose,
  onSave,
  editData
}: PasswordFormProps) {
  const dict = dictionary.passwordManager;
  const [passwordStrength, setPasswordStrength] = useState(editData?.strength || "weak");
  const [strengthScore, setStrengthScore] = useState(0);
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  
  // Initialize form with default values or edit data
  const form = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: editData || {
      title: "",
      username: "",
      password: "",
      website: "",
      platform: "other",
      category: "personal",
      notes: "",
      isFavorite: false,
    },
  });
  
  // Watch password field for real-time strength calculation
  const watchPassword = form.watch("password");
  
  // Evaluate password strength whenever it changes
  React.useEffect(() => {
    const { strength, score, feedback } = calculatePasswordStrength(watchPassword);
    setPasswordStrength(strength);
    setStrengthScore(score);
    setFeedbacks(feedback);
  }, [watchPassword]);
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof passwordFormSchema>) => {
    // Add the calculated strength to the data
    const fullData = { ...data, strength: passwordStrength };
    onSave(fullData);
    
    toast({
      title: editData ? "Password updated" : "Password saved",
      description: editData 
        ? "Your password has been updated successfully." 
        : "Your password has been saved securely.",
    });
    
    onClose();
  };
  
  // Generate a random strong password
  const handleGeneratePassword = () => {
    const newPassword = generatePassword({
      length: 16,
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: true
    });
    
    form.setValue("password", newPassword);
    
    // Trigger evaluation of the new password
    const { strength, score, feedback } = calculatePasswordStrength(newPassword);
    setPasswordStrength(strength);
    setStrengthScore(score);
    setFeedbacks(feedback);
  };
  
  // Auto-fill website URL from platform selection
  const handlePlatformChange = (platform: string) => {
    const currentWebsite = form.getValues("website");
    
    // Only suggest a URL if the website field is empty or user hasn't modified it
    if (!currentWebsite) {
      const platformUrl: Record<string, string> = {
        github: "https://github.com",
        gmail: "https://mail.google.com",
        facebook: "https://facebook.com",
        amazon: "https://amazon.com",
      };
      
      if (platformUrl[platform]) {
        form.setValue("website", platformUrl[platform]);
      }
    }
  };
  
  // Auto-suggest title based on platform and username
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    const platform = form.getValues("platform");
    const currentTitle = form.getValues("title");
    
    // Only auto-suggest if title is empty or hasn't been modified
    if (!currentTitle || currentTitle === "") {
      const platformLabel = platformOptions.find(p => p.value === platform)?.label || "Account";
      
      if (username) {
        form.setValue("title", `${platformLabel} (${username})`);
      }
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            {editData ? "Edit Password" : "Add New Password"}
          </DialogTitle>
          <DialogDescription>
            {editData 
              ? "Update your stored password details below." 
              : "Fill in the details below to securely save your password."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Title field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Work Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Username field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Username/Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="username@example.com" 
                        className="pl-9" 
                        {...field} 
                        onChange={e => {
                          field.onChange(e);
                          handleUsernameChange(e);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Password field with generator */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>
                      Password <span className="text-destructive">*</span>
                    </FormLabel>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 gap-1 text-xs"
                      onClick={handleGeneratePassword}
                    >
                      <Shield className="h-3.5 w-3.5" />
                      Generate Strong Password
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="••••••••••••" 
                        className="pl-9 font-mono"
                        autoComplete="new-password"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  
                  {/* Password strength indicator */}
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>Strength:</span>
                        <span className={`font-medium capitalize ${strengthColors[passwordStrength].color}`}>
                          {passwordStrength}
                        </span>
                      </div>
                      <span className="text-muted-foreground">{strengthScore}%</span>
                    </div>
                    <Progress 
                      value={strengthScore} 
                      className="h-2" 
                      indicatorClassName={strengthColors[passwordStrength].bg}
                    />
                    
                    {/* Feedback messages */}
                    {feedbacks.length > 0 && (
                      <div className="space-y-1 text-xs mt-1">
                        {feedbacks.map((item, index) => (
                          <div key={index} className="flex items-start gap-1 text-muted-foreground">
                            <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-yellow-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Strong password feedback */}
                    {passwordStrength === "strong" && (
                      <div className="flex items-start gap-1 text-xs text-green-600 dark:text-green-400">
                        <Check className="h-3.5 w-3.5 mt-0.5" />
                        <span>This is a strong password</span>
                      </div>
                    )}
                  </div>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Website field */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Website URL <span className="text-muted-foreground text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="https://example.com" 
                          className="pl-9"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Platform field */}
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Platform <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handlePlatformChange(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {platformOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              {option.icon}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Category field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Notes field */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Notes <span className="text-muted-foreground text-xs">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add notes about this account..." 
                      className="resize-none h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Favorite toggle */}
            <FormField
              control={form.control}
              name="isFavorite"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      Mark as favorite
                    </FormLabel>
                    <FormDescription>
                      Add this password to your favorites for quick access
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editData ? "Update Password" : "Save Password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}