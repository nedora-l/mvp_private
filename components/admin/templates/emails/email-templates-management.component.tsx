"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy, 
  Trash,
  Download,
  Upload,
  Mail,
  FileText,
  Calendar,
  User,
  Tag,
  Activity,
  Settings,
  RefreshCw
} from "lucide-react"

import { Dictionary } from "@/locales/dictionary"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

import {
  getAllEmailTemplates,
  deleteEmailTemplate,
  activateEmailTemplate,
  deactivateEmailTemplate,
  setEmailTemplateAsDefault,
  cloneEmailTemplate,
  bulkActionEmailTemplates,
  getAllEmailTemplateCategories
} from "@/lib/services/client/admin/templates/emails"
import { EmailTemplateDto, EmailTemplateStatus } from "@/lib/services/server/email_templates"

interface EmailTemplatesManagementProps {
  dictionary: Dictionary
  locale: string
}

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  DRAFT: "bg-yellow-100 text-yellow-800 border-yellow-200",
  INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
  ARCHIVED: "bg-red-100 text-red-800 border-red-200",
  TESTING: "bg-blue-100 text-blue-800 border-blue-200"
}

export function EmailTemplatesManagement({ dictionary, locale }: EmailTemplatesManagementProps) {
  const router = useRouter()
  const { toast } = useToast()
    const [templates, setTemplates] = useState<EmailTemplateDto[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Load templates and categories
  useEffect(() => {
    loadTemplates()
    loadCategories()
  }, [currentPage, statusFilter, categoryFilter, searchTerm])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const response = await getAllEmailTemplates({
        page: currentPage,
        size: 10,
        status: statusFilter !== "all" ? statusFilter as EmailTemplateStatus : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        searchTerm: searchTerm || undefined,
        sortBy: 'updatedAt',
        sortDir: 'desc'
      })
      
      if (response.data) {
        setTemplates(response.data._embedded?.emailTemplateDtoList || [])
        setTotalPages(response.data.totalPages || 0)
        setTotalElements(response.data.totalElements || 0)
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
      toast({
        title: "Error",
        description: "Failed to load email templates",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await getAllEmailTemplateCategories()
      if (response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  // Filter templates based on search and filters (for client-side filtering if needed)
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === "" || 
                         template.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleStatusChange = async (templateId: number, newStatus: EmailTemplateStatus) => {
    try {
      if (newStatus === 'ACTIVE') {
        await activateEmailTemplate(templateId)
        toast({
          title: "Success",
          description: "Template activated successfully"
        })
      } else {
        await deactivateEmailTemplate(templateId)
        toast({
          title: "Success",
          description: "Template deactivated successfully"
        })
      }
      
      // Reload templates to reflect changes
      loadTemplates()
    } catch (error) {
      console.error('Failed to change template status:', error)
      toast({
        title: "Error",
        description: "Failed to change template status",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }
    
    try {
      await deleteEmailTemplate(templateId)
      toast({
        title: "Success",
        description: "Template deleted successfully"
      })
      
      // Reload templates to reflect changes
      loadTemplates()
    } catch (error) {
      console.error('Failed to delete template:', error)
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      })
    }
  }

  const handleClone = async (template: EmailTemplateDto) => {
    try {
      const cloneName = `${template.name}-copy-${Date.now()}`
      const cloneDisplayName = `${template.displayName} (Copy)`
      
      await cloneEmailTemplate(template.id || 0, {
        newName: cloneName,
        newDisplayName: cloneDisplayName
      })
      
      toast({
        title: "Success",
        description: "Template cloned successfully"
      })
      
      // Reload templates to reflect changes
      loadTemplates()
    } catch (error) {
      console.error('Failed to clone template:', error)
      toast({
        title: "Error",
        description: "Failed to clone template",
        variant: "destructive"
      })
    }
  }

  const handleSetDefault = async (templateId: number) => {
    try {
      await setEmailTemplateAsDefault(templateId)
      toast({
        title: "Success",
        description: "Template set as default successfully"
      })
      
      // Reload templates to reflect changes
      loadTemplates()
    } catch (error) {
      console.error('Failed to set template as default:', error)
      toast({
        title: "Error",
        description: "Failed to set template as default",
        variant: "destructive"
      })
    }
  }

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedTemplates.length === 0) {
      toast({
        title: "Warning",
        description: "Please select templates first",
        variant: "destructive"
      })
      return
    }

    if (action === 'delete' && !confirm(`Are you sure you want to delete ${selectedTemplates.length} templates?`)) {
      return
    }

    try {
      await bulkActionEmailTemplates({
        action,
        templateIds: selectedTemplates
      })
      
      toast({
        title: "Success",
        description: `Templates ${action}d successfully`
      })
      
      // Clear selection and reload
      setSelectedTemplates([])
      loadTemplates()
    } catch (error) {
      console.error(`Failed to ${action} templates:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} templates`,
        variant: "destructive"
      })
    }
  }
  const handleCreateNew = () => {
    router.push(`/${locale}/admin/emails/new`)
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await Promise.all([loadTemplates(), loadCategories()])
      toast({
        title: "Success",
        description: "Templates list refreshed successfully"
      })
    } catch (error) {
      console.error('Failed to refresh templates:', error)
      toast({
        title: "Error",
        description: "Failed to refresh templates list",
        variant: "destructive"
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleViewTemplate = (templateId: number) => {
    router.push(`/${locale}/admin/emails/${templateId}`)
  }

  const handleEditTemplate = (templateId: number) => {
    router.push(`/${locale}/admin/emails/${templateId}?edit=true`)
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="TESTING">Testing</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>        </div>        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => t.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Template categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => t.status === 'DRAFT').length}
            </div>
            <p className="text-xs text-muted-foreground">In development</p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Version</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))
              ) : filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Mail className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No email templates found</p>
                      <Button variant="outline" onClick={handleCreateNew}>
                        Create your first template
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{template.displayName}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                      <div className="flex gap-1 mt-1">
                        {template.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        )) || []}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {template.category?.charAt(0).toUpperCase() + template.category?.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={statusColors[template.status as keyof typeof statusColors] || statusColors.DRAFT}
                    >
                      {template.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{template.language?.toUpperCase() || 'EN'}</TableCell>
                  <TableCell>
                    {template.isDefaultTemplate && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        by {template.updatedBy || 'System'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>v{template.version || 1}</TableCell>
                  <TableCell className="text-right">                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleViewTemplate(template.id || 0)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTemplate(template.id || 0)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleClone(template)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Clone
                        </DropdownMenuItem>
                        {!template.isDefaultTemplate && (
                          <DropdownMenuItem onClick={() => handleSetDefault(template.id || 0)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {template.status === 'ACTIVE' ? (
                          <DropdownMenuItem onClick={() => handleStatusChange(template.id || 0, 'INACTIVE' as EmailTemplateStatus)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleStatusChange(template.id || 0, 'ACTIVE' as EmailTemplateStatus)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(template.id || 0)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage * 10) + 1} to {Math.min((currentPage + 1) * 10, totalElements)} of {totalElements} templates
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = currentPage < 3 ? i : currentPage - 2 + i
                    if (page >= totalPages) return null
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page + 1}
                      </Button>
                    )
                  })}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/**
 * 
    
    e.preventDefault()
    // Here you would typically call your API to create the template
    console.log("Creating template:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="welcome-email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
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
              placeholder="Welcome email for new users"
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
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
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="onboarding, user-journey"
            />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Template</Label>
            <Input
              id="subject"
              value={formData.subjectTemplate}
              onChange={(e) => setFormData({...formData, subjectTemplate: e.target.value})}
              placeholder="Welcome to {{company_name}}, {{user_name}}!"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="htmlContent">HTML Content</Label>
            <Textarea
              id="htmlContent"
              value={formData.htmlContent}
              onChange={(e) => setFormData({...formData, htmlContent: e.target.value})}
              placeholder="<h1>Welcome {{user_name}}!</h1>"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plainTextContent">Plain Text Content</Label>
            <Textarea
              id="plainTextContent"
              value={formData.plainTextContent}
              onChange={(e) => setFormData({...formData, plainTextContent: e.target.value})}
              placeholder="Welcome {{user_name}}!"
              rows={4}
            />
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Create Template
        </Button>
      </DialogFooter>
    </form>
  )
}


 */