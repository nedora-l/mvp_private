"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Copy, 
  Download,
  Upload,
  Mail,
  FileText,
  Calendar,
  User,
  Tag,
  Activity,
  Settings,
  Code,
  Monitor,
  Smartphone,
  Globe,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"
import { Dictionary } from "@/locales/dictionary"
import { useToast } from "@/hooks/use-toast"
import {
  getEmailTemplateById,
  updateEmailTemplate,
  activateEmailTemplate,
  deactivateEmailTemplate,
  setEmailTemplateAsDefault,
  previewEmailTemplate,
  cloneEmailTemplate,
  extractEmailTemplateVariables
} from "@/lib/services/client/admin/templates/emails"
import { 
  EmailTemplateDto, 
  EmailTemplateStatus, 
  UpdateEmailTemplateRequest,
  EmailTemplateVariableDto 
} from "@/lib/services/server/email_templates/emailTemplate.dtos"

interface EmailTemplateDetailViewProps {
  templateId: string
  dictionary: Dictionary
  locale: string
}

interface TemplateVariable {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description?: string
}

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  DRAFT: "bg-yellow-100 text-yellow-800 border-yellow-200",
  INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
  ARCHIVED: "bg-red-100 text-red-800 border-red-200",
  TESTING: "bg-blue-100 text-blue-800 border-blue-200"
}

export function EmailTemplateDetailView({ templateId, dictionary, locale }: EmailTemplateDetailViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [template, setTemplate] = useState<EmailTemplateDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState<UpdateEmailTemplateRequest>({
    id: 0,
    name: '',
    displayName: '',
    description: '',
    category: '',
    language: '',
    subjectTemplate: '',
    htmlContent: '',
    plainTextContent: '',
    metadata: {}
  })
  
  const [previewData, setPreviewData] = useState({
    variables: {} as Record<string, any>,
    previewHtml: '',
    previewText: '',
    previewSubject: ''
  })
  const [showPreview, setShowPreview] = useState(false)
  const [extractedVariables, setExtractedVariables] = useState<TemplateVariable[]>([])
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')

  // Load template data
  useEffect(() => {
    loadTemplate()
  }, [templateId])

  const loadTemplate = async () => {
    try {
      setLoading(true)
      const response = await getEmailTemplateById(parseInt(templateId))
      
      if (response.data) {
        setTemplate(response.data)
        setEditForm({
          id: response.data.id || 0,
          name: response.data.name || '',
          displayName: response.data.displayName || '',
          description: response.data.description || '',
          category: response.data.category || '',
          language: response.data.language || 'en',
          subjectTemplate: response.data.subjectTemplate || '',
          htmlContent: response.data.htmlContent || '',
          plainTextContent: response.data.plainTextContent || '',
          metadata: response.data.metadata || {}
        })
        
        // Extract variables from the template
        extractVariables(response.data)
      }
    } catch (error) {
      console.error('Failed to load template:', error)
      toast({
        title: "Error",
        description: "Failed to load email template",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const extractVariables = async (templateData: EmailTemplateDto) => {
    try {
      const response = await extractEmailTemplateVariables({
        subjectTemplate: templateData.subjectTemplate || '',
        htmlContent: templateData.htmlContent || '',
        plainTextContent: templateData.plainTextContent || ''
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
        setExtractedVariables(uniqueVariables.map((v: string) => ({
          name: v,
          type: 'TEXT',
          required: false,
          description: `Variable: ${v}`
        })))
        
        // Initialize preview variables with empty values
        const initialVars = uniqueVariables.reduce((acc: Record<string, any>, v: string) => {
          acc[v] = ''
          return acc
        }, {} as Record<string, any>)
        setPreviewData(prev => ({ ...prev, variables: initialVars }))
      }
    } catch (error) {
      console.error('Failed to extract variables:', error)
    }
  }

  const handleSave = async () => {
    if (!template) return
    
    try {
      setSaving(true)
      await updateEmailTemplate(template.id || 0, editForm)
      
      toast({
        title: "Success",
        description: "Template updated successfully"
      })
      
      // Reload template to get updated data
      await loadTemplate()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update template:', error)
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: EmailTemplateStatus) => {
    if (!template) return
    
    try {
      if (newStatus === EmailTemplateStatus.ACTIVE) {
        await activateEmailTemplate(template.id || 0)
      } else {
        await deactivateEmailTemplate(template.id || 0)
      }
      
      toast({
        title: "Success",
        description: `Template ${newStatus === EmailTemplateStatus.ACTIVE ? 'activated' : 'deactivated'} successfully`
      })
      
      // Reload template
      await loadTemplate()
    } catch (error) {
      console.error('Failed to change template status:', error)
      toast({
        title: "Error",
        description: "Failed to change template status",
        variant: "destructive"
      })
    }
  }

  const handleSetDefault = async () => {
    if (!template) return
    
    try {
      await setEmailTemplateAsDefault(template.id || 0)
      toast({
        title: "Success",
        description: "Template set as default successfully"
      })
      
      // Reload template
      await loadTemplate()
    } catch (error) {
      console.error('Failed to set as default:', error)
      toast({
        title: "Error",
        description: "Failed to set template as default",
        variant: "destructive"
      })
    }
  }

  const handleClone = async () => {
    if (!template) return
    
    try {
      const cloneName = `${template.name}-copy-${Date.now()}`
      const cloneDisplayName = `${template.displayName} (Copy)`
      
      const response = await cloneEmailTemplate(template.id || 0, {
        newName: cloneName,
        newDisplayName: cloneDisplayName
      })
      
      toast({
        title: "Success",
        description: "Template cloned successfully"
      })
      
      // Navigate to the new template
      if (response.data?.id) {
        router.push(`/${locale}/admin/emails/${response.data.id}`)
      }
    } catch (error) {
      console.error('Failed to clone template:', error)
      toast({
        title: "Error",
        description: "Failed to clone template",
        variant: "destructive"
      })
    }
  }

  const generatePreview = async () => {
    if (!template) return
    
    try {
      const response = await previewEmailTemplate(template.id || 0, previewData.variables)
        if (response.data) {
        setPreviewData(prev => ({
          ...prev,
          previewHtml: response.data!.htmlContent || '',
          previewText: response.data!.plainTextContent || '',
          previewSubject: response.data!.subject || ''
        }))
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Template not found</h3>
          <p className="text-muted-foreground">The requested email template could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{template.displayName}</h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={statusColors[template.status as keyof typeof statusColors]}>
            {template.status}
          </Badge>
          {template.isDefaultTemplate && (
            <Badge variant="secondary">Default</Badge>
          )}
          <Button variant="outline" size="sm" onClick={handleClone}>
            <Copy className="h-4 w-4 mr-2" />
            Clone
          </Button>
          <Button variant="outline" size="sm" onClick={generatePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Content */}
          <Card>
            <CardHeader>
              <CardTitle>Template Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="text">Plain Text</TabsTrigger>
                  <TabsTrigger value="subject">Subject</TabsTrigger>
                </TabsList>
                
                <TabsContent value="html" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="html-content">HTML Content</Label>
                    {isEditing ? (
                      <Textarea
                        id="html-content"
                        value={editForm.htmlContent}
                        onChange={(e) => setEditForm(prev => ({ ...prev, htmlContent: e.target.value }))}
                        placeholder="Enter HTML content..."
                        className="min-h-[300px] font-mono text-sm"
                      />
                    ) : (
                      <div className="border rounded-md p-4 min-h-[300px] bg-muted/20">
                        <code className="text-sm whitespace-pre-wrap break-words">
                          {template.htmlContent || 'No HTML content'}
                        </code>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text-content">Plain Text Content</Label>
                    {isEditing ? (
                      <Textarea
                        id="text-content"
                        value={editForm.plainTextContent}
                        onChange={(e) => setEditForm(prev => ({ ...prev, plainTextContent: e.target.value }))}
                        placeholder="Enter plain text content..."
                        className="min-h-[300px]"
                      />
                    ) : (
                      <div className="border rounded-md p-4 min-h-[300px] bg-muted/20">
                        <pre className="text-sm whitespace-pre-wrap break-words">
                          {template.plainTextContent || 'No plain text content'}
                        </pre>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="subject" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject-template">Subject Template</Label>
                    {isEditing ? (
                      <Input
                        id="subject-template"
                        value={editForm.subjectTemplate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, subjectTemplate: e.target.value }))}
                        placeholder="Enter subject template..."
                      />
                    ) : (
                      <div className="border rounded-md p-4 bg-muted/20">
                        <span className="text-sm">
                          {template.subjectTemplate || 'No subject template'}
                        </span>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Template Settings */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Template description..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={editForm.language} onValueChange={(value) => setEditForm(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{template.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{template.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Language:</span>
                  <span className="font-medium">{template.language || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium">{template.version || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="font-medium">
                    {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleStatusChange(template.status === EmailTemplateStatus.ACTIVE ? EmailTemplateStatus.INACTIVE : EmailTemplateStatus.ACTIVE)}
                >
                  {template.status === EmailTemplateStatus.ACTIVE ? 'Deactivate' : 'Activate'}
                </Button>
                
                {!template.isDefaultTemplate && (
                  <Button variant="outline" size="sm" className="w-full" onClick={handleSetDefault}>
                    Set as Default
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Variables */}
          <Card>
            <CardHeader>
              <CardTitle>Template Variables</CardTitle>
            </CardHeader>
            <CardContent>
              {extractedVariables.length > 0 ? (
                <div className="space-y-2">
                  {extractedVariables.map((variable, index) => (
                    <div key={index} className="flex items-center justify-between text-sm border rounded p-2">
                      <span className="font-mono">{variable.name}</span>
                      <Badge variant="secondary" className="text-xs">{variable.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No variables found in this template.</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full" onClick={generatePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview Template
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={handleClone}>
                <Copy className="h-4 w-4 mr-2" />
                Clone Template
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              Preview how your template will look when sent to recipients
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Preview Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preview Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {extractedVariables.map((variable, index) => (
                    <div key={index} className="space-y-1">
                      <Label htmlFor={`var-${variable.name}`} className="text-xs">
                        {variable.name}
                      </Label>                      <Input
                        id={`var-${variable.name}`}
                        value={previewData.variables[variable.name] || ''}
                        onChange={(e) => setPreviewData(prev => ({
                          ...prev,
                          variables: { ...prev.variables, [variable.name]: e.target.value }
                        }))}
                        placeholder={`Enter ${variable.name}`}
                      />
                    </div>
                  ))}
                </div>
                <Button size="sm" onClick={generatePreview} className="mt-4">
                  Update Preview
                </Button>
              </CardContent>
            </Card>

            {/* Preview Content */}
            <Tabs defaultValue="html" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="html">HTML Preview</TabsTrigger>
                  <TabsTrigger value="text">Text Preview</TabsTrigger>
                  <TabsTrigger value="subject">Subject</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                    className={previewMode === 'desktop' ? 'bg-muted' : ''}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                    className={previewMode === 'mobile' ? 'bg-muted' : ''}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="html">
                <div className={`border rounded-lg overflow-hidden ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                  <div 
                    className="p-4 bg-white"
                    dangerouslySetInnerHTML={{ __html: previewData.previewHtml }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="text">
                <div className="border rounded-lg p-4 bg-muted/20">
                  <pre className="text-sm whitespace-pre-wrap">
                    {previewData.previewText || 'No text content to preview'}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="subject">
                <div className="border rounded-lg p-4 bg-muted/20">
                  <span className="text-sm font-medium">
                    {previewData.previewSubject || 'No subject to preview'}
                  </span>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
