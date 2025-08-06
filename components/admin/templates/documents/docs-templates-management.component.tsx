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

 
import { DocumentTemplateDto } from "@/lib/services/server/dyn_document/dynDocument.server.service"
import { getAllDocumentsTemplates } from "@/lib/services/client/admin/templates/documents/docs.templates.client.service"

interface DocsTemplatesManagementProps {
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

export function DocsTemplatesManagement({ dictionary, locale }: DocsTemplatesManagementProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<DocumentTemplateDto[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  //const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  //const [selectedTemplates, setSelectedTemplates] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Load templates and categories
  useEffect(() => {
    loadTemplates()
  }, [currentPage, searchTerm])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const response = await getAllDocumentsTemplates({
        page: currentPage,
        size: 10,
        query: searchTerm || undefined,
        sortBy: 'updatedAt',
        sortDir: 'desc'
      })
      
      if (response.data) {
        setTemplates(response.data || [])
        setTotalPages(response.page?.totalPages || 0)
        setTotalElements(response.page?.totalElements || 0)
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

  // Filter templates based on search and filters (for client-side filtering if needed)
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === "" || 
                         template.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })


  const handleDelete = async (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }
    
    try {
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
 
 
  const handleCreateNew = () => {
    router.push(`/${locale}/admin/documents/new`)
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await Promise.all([loadTemplates()])
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
    router.push(`/${locale}/admin/documents/${templateId}`)
  }

  const handleEditTemplate = (templateId: number) => {
    router.push(`/${locale}/admin/documents/${templateId}?edit=true`)
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
      
        </div>        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>            
            <TableBody>
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
                  </TableRow>
                ))
              ) : 
              filteredTemplates.length === 0 ? (
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
                         
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {template.category || 'General'}
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
                  <TableCell>{  'EN'}</TableCell>
                  <TableCell>
                                          {template.format === 'HTML' ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          HTML
                          </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          Text
                        </Badge>
                      )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        by {  'System'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-0 bg-gradient-to-br from-white via-blue-50 to-purple-50">
                        <DropdownMenuItem onClick={() => handleViewTemplate(template.id || 0)} className="group">
                          <Eye className="h-4 w-4 mr-2 text-blue-600 group-hover:text-blue-800" />
                          <span className="font-medium text-blue-700 group-hover:text-blue-900">Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTemplate(template.id || 0)} className="group">
                          <Edit className="h-4 w-4 mr-2 text-purple-600 group-hover:text-purple-800" />
                          <span className="font-medium text-purple-700 group-hover:text-purple-900">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/${locale}/admin/documents/${template.id}/builder`)} className="group">
                          <Activity className="h-4 w-4 mr-2 text-green-600 group-hover:text-green-800" />
                          <span className="font-medium text-green-700 group-hover:text-green-900">Builder</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log(template)} className="group">
                          <Copy className="h-4 w-4 mr-2 text-gray-500 group-hover:text-gray-700" />
                          <span className="font-medium text-gray-700 group-hover:text-gray-900">Clone</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {template.status === 'ACTIVE' ? (
                          <DropdownMenuItem onClick={() => console.log(template.id || 0, 'INACTIVE')} className="group">
                            <Settings className="h-4 w-4 mr-2 text-yellow-600 group-hover:text-yellow-800" />
                            <span className="font-medium text-yellow-700 group-hover:text-yellow-900">Deactivate</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => console.log(template.id || 0, 'ACTIVE')} className="group">
                            <Settings className="h-4 w-4 mr-2 text-green-600 group-hover:text-green-800" />
                            <span className="font-medium text-green-700 group-hover:text-green-900">Activate</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 font-semibold group hover:bg-red-50 hover:text-red-800"
                          onClick={() => handleDelete(template.id || 0)}
                        >
                          <Trash className="h-4 w-4 mr-2 text-red-500 group-hover:text-red-800" />
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
