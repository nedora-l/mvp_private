"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus,
  X,
  FileText,
  Code,
  Settings,
  Wand2,
  Monitor,
  Smartphone
} from "lucide-react"
import { Dictionary } from "@/locales/dictionary"
import { useToast } from "@/hooks/use-toast"
import { createEmailTemplate, extractEmailTemplateVariables } from "@/lib/services/client/admin/templates/emails"
import { CreateEmailTemplateRequest, EmailTemplateStatus } from "@/lib/services/server/email_templates/emailTemplate.dtos"

interface NewEmailTemplateFormProps {
  dictionary: Dictionary
  locale: string
}

interface TemplateVariable {
  name: string
  type: 'TEXT' | 'NUMBER' | 'EMAIL' | 'URL' | 'DATE' | 'BOOLEAN'
  required: boolean
  defaultValue?: string
  description?: string
}

const templateTypes = [
  { id: 'welcome', name: 'Welcome Email', description: 'For new user onboarding' },
  { id: 'password-reset', name: 'Password Reset', description: 'Password recovery emails' },
  { id: 'notification', name: 'Notification', description: 'System notifications' },
  { id: 'marketing', name: 'Marketing', description: 'Promotional emails' },
  { id: 'transactional', name: 'Transactional', description: 'Order confirmations, receipts' },
  { id: 'newsletter', name: 'Newsletter', description: 'Regular updates and news' },
  { id: 'custom', name: 'Custom', description: 'Build from scratch' }
]

const predefinedTemplates = {
  welcome: {
    subjectTemplate: "Welcome to {{company_name}}, {{user_name}}! 🎉",
    htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to {{company_name}}!</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">We're excited to have you on board</p>
    </div>
    
    <div style="padding: 30px 20px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello {{user_name}},</p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining {{company_name}}! We're thrilled to have you as part of our community.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboard_url}}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Get Started
            </a>
        </div>
        
        <p style="font-size: 16px; margin-top: 20px;">
            Best regards,<br>
            The {{company_name}} Team
        </p>
    </div>
</body>
</html>`,
    plainTextContent: `Welcome to {{company_name}}!

Hello {{user_name}},

Thank you for joining {{company_name}}! We're thrilled to have you as part of our community.

Get started: {{dashboard_url}}

Best regards,
The {{company_name}} Team`,
    variables: [
      { name: 'user_name', type: 'TEXT' as const, required: true, description: "User's full name" },
      { name: 'company_name', type: 'TEXT' as const, required: true, description: "Company name" },
      { name: 'dashboard_url', type: 'URL' as const, required: true, description: "Dashboard URL" }
    ]
  },
  'password-reset': {
    subjectTemplate: "Reset your {{company_name}} password",
    htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #f8f9fa; padding: 30px 20px; text-align: center; border-radius: 10px;">
        <h1 style="color: #495057; margin: 0; font-size: 24px;">Password Reset Request</h1>
    </div>
    
    <div style="padding: 30px 20px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello {{user_name}},</p>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your {{company_name}} account.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{reset_url}}" style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
            </a>
        </div>
        
        <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
            This link will expire in {{expiry_hours}} hours. If you didn't request this, please ignore this email.
        </p>
    </div>
</body>
</html>`,
    plainTextContent: `Password Reset Request

Hello {{user_name}},

We received a request to reset your password for your {{company_name}} account.

Reset your password: {{reset_url}}

This link will expire in {{expiry_hours}} hours. If you didn't request this, please ignore this email.`,
    variables: [
      { name: 'user_name', type: 'TEXT' as const, required: true, description: "User's full name" },
      { name: 'company_name', type: 'TEXT' as const, required: true, description: "Company name" },
      { name: 'reset_url', type: 'URL' as const, required: true, description: "Password reset URL" },
      { name: 'expiry_hours', type: 'NUMBER' as const, required: false, defaultValue: '24', description: "Link expiry in hours" }
    ]
  }
}

export function NewEmailTemplateForm({ dictionary, locale }: NewEmailTemplateFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedType, setSelectedType] = useState<string>('')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [isSaving, setIsSaving] = useState(false)
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState({
    variables: {} as Record<string, any>,
    previewHtml: '',
    previewText: '',
    previewSubject: ''
  })
  
  // Quick Actions state
  const [showHtmlView, setShowHtmlView] = useState(false)
  const [showFileImport, setShowFileImport] = useState(false)
  const [isAutoDetecting, setIsAutoDetecting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    category: "",
    language: "en",
    subjectTemplate: "",
    htmlContent: "",
    plainTextContent: "",
    status: "DRAFT" as const,
    isDefaultTemplate: false,
    tags: [] as string[],
    variables: [] as TemplateVariable[]
  })

  const [newTag, setNewTag] = useState("")
  const [newVariable, setNewVariable] = useState<TemplateVariable>({
    name: "",
    type: "TEXT",
    required: false,
    defaultValue: "",
    description: ""
  })

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    
    if (typeId !== 'custom' && predefinedTemplates[typeId as keyof typeof predefinedTemplates]) {
      const template = predefinedTemplates[typeId as keyof typeof predefinedTemplates]
      setFormData(prev => ({
        ...prev,
        category: typeId,
        subjectTemplate: template.subjectTemplate,
        htmlContent: template.htmlContent,
        plainTextContent: template.plainTextContent,
        variables: template.variables
      }))
    }
    
    setCurrentStep(2)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addVariable = () => {
    if (newVariable.name.trim()) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, { ...newVariable }]
      }))
      setNewVariable({
        name: "",
        type: "TEXT",
        required: false,
        defaultValue: "",
        description: ""
      })
    }
  }

  const removeVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }))
  }
  const handleSave = async () => {
    if (!formData.name || !formData.displayName || !formData.subjectTemplate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Display Name, Subject)",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSaving(true)
      
      const createRequest: CreateEmailTemplateRequest = {
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description,
        category: formData.category,
        subjectTemplate: formData.subjectTemplate,
        htmlContent: formData.htmlContent,
        plainTextContent: formData.plainTextContent,
        status: formData.status as EmailTemplateStatus,
        language: formData.language,
        tags: formData.tags,
        metadata: {
          createdFrom: 'form',
          templateType: selectedType || 'custom'
        }
      }

      const response = await createEmailTemplate(createRequest)
      
      if (response.data) {
        toast({
          title: "Success",
          description: "Email template created successfully"
        })
        
        // Navigate to the new template details page
        router.push(`/${locale}/admin/emails/${response.data.id}`)
      }
    } catch (error) {
      console.error('Failed to create template:', error)
      toast({
        title: "Error",
        description: "Failed to create email template",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }
  const handlePreview = async () => {
    try {
      // First extract variables from the current template content
      const response = await extractEmailTemplateVariables({
        subjectTemplate: formData.subjectTemplate || '',
        htmlContent: formData.htmlContent || '',
        plainTextContent: formData.plainTextContent || ''
      })
      
      if (response.data) {
        // Extract all variables from all sources
        const allVariables = [
          ...(response.data.subjectVariables || []),
          ...(response.data.htmlVariables || []),
          ...(response.data.plainTextVariables || [])
        ]
        
        // Remove duplicates
        const uniqueVariables = [...new Set(allVariables)]
        
        // Initialize preview variables with sample values
        const sampleVariables = uniqueVariables.reduce((acc: Record<string, any>, variable: string) => {
          // Provide sample values based on variable name
          if (variable.toLowerCase().includes('name')) {
            acc[variable] = 'John Doe'
          } else if (variable.toLowerCase().includes('email')) {
            acc[variable] = 'john.doe@example.com'
          } else if (variable.toLowerCase().includes('domain')) {
            acc[variable] = 'example.com'
          } else if (variable.toLowerCase().includes('date')) {
            acc[variable] = new Date().toLocaleDateString()
          } else if (variable.toLowerCase().includes('company')) {
            acc[variable] = 'Acme Corporation'
          } else {
            acc[variable] = `[${variable}]`
          }
          return acc
        }, {} as Record<string, any>)
        
        // Generate preview content by replacing variables
        let previewSubject = formData.subjectTemplate || ''
        let previewHtml = formData.htmlContent || ''
        let previewText = formData.plainTextContent || ''
        
        // Replace variables in subject, HTML, and text content
        uniqueVariables.forEach(variable => {
          const placeholder = `{{${variable}}}`
          const bracketPlaceholder = `[{{${variable}}}]`
          const value = sampleVariables[variable] || `[${variable}]`
          
          previewSubject = previewSubject.replace(new RegExp(placeholder, 'g'), value)
          previewSubject = previewSubject.replace(new RegExp(bracketPlaceholder, 'g'), value)
          
          previewHtml = previewHtml.replace(new RegExp(placeholder, 'g'), value)
          previewHtml = previewHtml.replace(new RegExp(bracketPlaceholder, 'g'), value)
          
          previewText = previewText.replace(new RegExp(placeholder, 'g'), value)
          previewText = previewText.replace(new RegExp(bracketPlaceholder, 'g'), value)
        })
        
        setPreviewData({
          variables: sampleVariables,
          previewHtml,
          previewText,
          previewSubject
        })
        
        setShowPreview(true)
      }
    } catch (error) {
      console.error('Failed to generate preview:', error)
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive"
      })
    }
  }

  // Auto-detect variables from template content
  const handleAutoDetectVariables = async () => {
    try {
      setIsAutoDetecting(true)
      
      const response = await extractEmailTemplateVariables({
        subjectTemplate: formData.subjectTemplate || '',
        htmlContent: formData.htmlContent || '',
        plainTextContent: formData.plainTextContent || ''
      })
      
      if (response.data) {
        // Extract all variables from all sources
        const allVariables = [
          ...(response.data.subjectVariables || []),
          ...(response.data.htmlVariables || []),
          ...(response.data.plainTextVariables || [])
        ]
        
        // Remove duplicates and create variable objects
        const uniqueVariables = [...new Set(allVariables)]
        const detectedVariables = uniqueVariables.map((variable: string) => ({
          name: variable,
          type: 'TEXT' as const,
          required: false,
          defaultValue: '',
          description: `Auto-detected variable: ${variable}`
        }))
        
        // Update form data with detected variables (merge with existing)
        setFormData(prev => {
          const existingNames = prev.variables.map(v => v.name)
          const newVariables = detectedVariables.filter(v => !existingNames.includes(v.name))
          
          return {
            ...prev,
            variables: [...prev.variables, ...newVariables]
          }
        })
        
        toast({
          title: "Success",
          description: `Detected ${detectedVariables.length} variables from your template`
        })
      }
    } catch (error) {
      console.error('Failed to auto-detect variables:', error)
      toast({
        title: "Error",
        description: "Failed to auto-detect variables",
        variant: "destructive"
      })
    } finally {
      setIsAutoDetecting(false)
    }
  }

  // Import template from file
  const handleImportFromFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.html,.txt,.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            
            if (file.name.endsWith('.json')) {
              // Try to parse as JSON template
              const parsed = JSON.parse(content)
              setFormData(prev => ({
                ...prev,
                name: parsed.name || prev.name,
                displayName: parsed.displayName || parsed.name || prev.displayName,
                description: parsed.description || prev.description,
                category: parsed.category || prev.category,
                subjectTemplate: parsed.subjectTemplate || parsed.subject || prev.subjectTemplate,
                htmlContent: parsed.htmlContent || parsed.html || prev.htmlContent,
                plainTextContent: parsed.plainTextContent || parsed.text || prev.plainTextContent
              }))
            } else if (file.name.endsWith('.html')) {
              // Import as HTML content
              setFormData(prev => ({
                ...prev,
                htmlContent: content
              }))
            } else {
              // Import as plain text content
              setFormData(prev => ({
                ...prev,
                plainTextContent: content
              }))
            }
            
            toast({
              title: "Success",
              description: `Template imported from ${file.name}`
            })
          } catch (error) {
            console.error('Failed to import file:', error)
            toast({
              title: "Error",
              description: "Failed to import file. Please check the file format.",
              variant: "destructive"
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  // View HTML content in a modal
  const handleViewHtml = () => {
    setShowHtmlView(true)
  }

  if (currentStep === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Choose Template Type</h2>
            <p className="text-muted-foreground">Select a starting point for your email template</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templateTypes.map((type) => (
            <Card 
              key={type.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Configure Template</h2>
            <p className="text-muted-foreground">Set up your email template details and content</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Creating...' : 'Create Template'}
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="welcome-email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name *</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                        placeholder="Welcome Email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Welcome email template for new users"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        placeholder="welcome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={formData.language} 
                        onValueChange={(value) => setFormData({...formData, language: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button variant="outline" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Template *</Label>
                    <Input
                      id="subject"
                      value={formData.subjectTemplate}
                      onChange={(e) => setFormData({...formData, subjectTemplate: e.target.value})}
                      placeholder="Welcome to {{company_name}}, {{user_name}}!"
                      required
                    />
                  </div>

                  <Tabs defaultValue="html" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="html">HTML Content</TabsTrigger>
                      <TabsTrigger value="text">Plain Text</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="html" className="space-y-2">
                      <Label>HTML Content</Label>
                      <Textarea
                        value={formData.htmlContent}
                        onChange={(e) => setFormData({...formData, htmlContent: e.target.value})}
                        rows={15}
                        className="font-mono text-sm"
                        placeholder="HTML email content with {{variables}}"
                      />
                    </TabsContent>
                    
                    <TabsContent value="text" className="space-y-2">
                      <Label>Plain Text Content</Label>
                      <Textarea
                        value={formData.plainTextContent}
                        onChange={(e) => setFormData({...formData, plainTextContent: e.target.value})}
                        rows={12}
                        className="font-mono text-sm"
                        placeholder="Plain text email content with {{variables}}"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="variables" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Template Variables</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Variables */}
                  <div className="space-y-2">
                    {formData.variables.map((variable, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {`{{${variable.name}}}`}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {variable.type}
                            </Badge>
                            {variable.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          {variable.description && (
                            <p className="text-sm text-muted-foreground">{variable.description}</p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeVariable(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Variable */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Add New Variable</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Variable Name</Label>
                        <Input
                          value={newVariable.name}
                          onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
                          placeholder="variable_name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select 
                          value={newVariable.type} 
                          onValueChange={(value: any) => setNewVariable({...newVariable, type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEXT">Text</SelectItem>
                            <SelectItem value="NUMBER">Number</SelectItem>
                            <SelectItem value="EMAIL">Email</SelectItem>
                            <SelectItem value="URL">URL</SelectItem>
                            <SelectItem value="DATE">Date</SelectItem>
                            <SelectItem value="BOOLEAN">Boolean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>Default Value</Label>
                        <Input
                          value={newVariable.defaultValue}
                          onChange={(e) => setNewVariable({...newVariable, defaultValue: e.target.value})}
                          placeholder="Optional default value"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={newVariable.description}
                          onChange={(e) => setNewVariable({...newVariable, description: e.target.value})}
                          placeholder="Variable description"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newVariable.required}
                          onCheckedChange={(checked) => setNewVariable({...newVariable, required: checked})}
                        />
                        <Label>Required</Label>
                      </div>
                      <Button onClick={addVariable}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variable
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Template Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: any) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="TESTING">Testing</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isDefaultTemplate}
                      onCheckedChange={(checked) => setFormData({...formData, isDefaultTemplate: checked})}
                    />
                    <Label>Set as default template for this category</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Template Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">
                {templateTypes.find(t => t.id === selectedType)?.name || 'Custom'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleAutoDetectVariables}
                disabled={isAutoDetecting}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isAutoDetecting ? 'Detecting...' : 'Auto-detect Variables'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleImportFromFile}
              >
                <FileText className="h-4 w-4 mr-2" />
                Import from File
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleViewHtml}
              >
                <Code className="h-4 w-4 mr-2" />
                View HTML
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Use { '{{variable_name}}' } syntax for dynamic content</p>
              <p>• Test your template with preview before saving</p>
              <p>• Add plain text version for better compatibility</p>
              <p>• Use descriptive variable names</p>
            </CardContent>          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Email Template Preview
            </DialogTitle>
            <DialogDescription>
              Preview how your email template will look with sample data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Preview Mode Toggle */}
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>

            {/* Subject Line */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subject Line</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="font-medium">{previewData.previewSubject || 'No subject'}</p>
              </div>
            </div>

            {/* Email Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email Content</Label>
              <div 
                className={`border rounded-md overflow-hidden ${
                  previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                }`}
              >
                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="html">HTML View</TabsTrigger>
                    <TabsTrigger value="text">Plain Text</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="html" className="p-0">
                    <div className="max-h-96 overflow-auto">
                      <iframe
                        srcDoc={previewData.previewHtml}
                        className={`w-full border-0 ${
                          previewMode === 'mobile' ? 'h-96' : 'h-96'
                        }`}
                        title="Email Preview"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="text" className="p-4">
                    <div className="max-h-96 overflow-auto">
                      <pre className="whitespace-pre-wrap text-sm">
                        {previewData.previewText || 'No plain text content'}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Variables Used */}
            {Object.keys(previewData.variables).length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sample Variables Used</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(previewData.variables).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="font-mono text-blue-600">{`{{${key}}}`}</span>
                      <span className="text-gray-600 truncate ml-2">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HTML View Modal */}
      <Dialog open={showHtmlView} onOpenChange={setShowHtmlView}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              HTML Source Code
            </DialogTitle>
            <DialogDescription>
              View and edit the HTML source code of your email template
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML Content</TabsTrigger>
                <TabsTrigger value="text">Plain Text</TabsTrigger>
                <TabsTrigger value="subject">Subject Template</TabsTrigger>
              </TabsList>
              
              <TabsContent value="html" className="space-y-2">
                <Label>HTML Content</Label>
                <Textarea
                  value={formData.htmlContent}
                  onChange={(e) => setFormData(prev => ({ ...prev, htmlContent: e.target.value }))}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Enter HTML content..."
                />
              </TabsContent>
              
              <TabsContent value="text" className="space-y-2">
                <Label>Plain Text Content</Label>
                <Textarea
                  value={formData.plainTextContent}
                  onChange={(e) => setFormData(prev => ({ ...prev, plainTextContent: e.target.value }))}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Enter plain text content..."
                />
              </TabsContent>
              
              <TabsContent value="subject" className="space-y-2">
                <Label>Subject Template</Label>
                <Textarea
                  value={formData.subjectTemplate}
                  onChange={(e) => setFormData(prev => ({ ...prev, subjectTemplate: e.target.value }))}
                  className="min-h-[100px] font-mono text-sm"
                  placeholder="Enter subject template..."
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHtmlView(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowHtmlView(false)
              toast({
                title: "Success",
                description: "HTML content updated"
              })
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
