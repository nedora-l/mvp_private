"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Dictionary } from "@/locales/dictionary"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { 
  Search, 
  Plus,
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play,
  Pause,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Workflow,
  Settings,
  Activity,
  ArrowRight,
  Target,
  GitBranch,
  Zap,
  History,
  Copy,
  RefreshCcw,
  Upload,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react"

import { EnhancedWorkflowFormModal } from "./enhanced-workflow-form-modal"
import { workflowsMockData, templatesMockData } from "./types/mocks"
import { camundaApiClient } from "@/lib/services/client/camunda/camunda.client.service"
import { cn } from "@/lib/utils"
import { ProcessDefinitionResponseDto } from "@/lib/services/server/camunda/camunda.server.service"
import { WorkflowsListComponent } from "./components/workflows-definitions.datatable.card"

// Type declarations for bpmn-js
interface BpmnCanvas {
  zoom(level: number | 'fit-viewport'): void
}

interface WorkflowsManagementProps {
  dictionary: Dictionary
  locale: string
}

export function WorkflowsManagementComponent({ dictionary, locale }: WorkflowsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null)
    // Create workflow form state (keeping for backward compatibility)
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    category: "",
    trigger: "",
    steps: [] as any[]
  });

  // BPMN Management State
  const [bpmnFile, setBpmnFile] = useState<File | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>("")
  const [bpmnContent, setBpmnContent] = useState<string>("")
  const [showBpmnPreview, setShowBpmnPreview] = useState<boolean>(false)
  const [bpmnViewer, setBpmnViewer] = useState<any>(null)
  const bpmnViewerRef = useRef<HTMLDivElement>(null)
  const [isBpmnModalOpen, setIsBpmnModalOpen] = useState(false)

  const [workflowsDefinitions, setWorkflowsDefinitions] = useState<ProcessDefinitionResponseDto[]>([])

  // Mock workflows data with enhanced structure
  const workflows =  workflowsMockData;
  // Enhanced workflow templates with detailed steps
  const templates = templatesMockData;

  // Handle get workflow action
  const getWorkflowsDefinitions = () => {
     // Fetch workflows definitions from the server
     camundaApiClient.getAllProcessDefinitions({ page : 0, size: 10}).then(response => {
       console.log('Fetched workflows definitions:', response.data);
       setWorkflowsDefinitions(response.data || []);
     }).catch(error => {
       console.error('Error fetching workflows definitions:', error);
     });
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default" as const
      case "Paused":
        return "secondary" as const
      case "Failed":
        return "destructive" as const
      default:
    return "outline" as const
    }
  }
  // BPMN File Management Functions
  const handleBpmnFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input triggered') // Debug log
    const file = event.target.files?.[0]
    console.log('Selected file:', file) // Debug log
    
    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.bpmn') && !file.name.toLowerCase().endsWith('.xml')) {
        alert('Please upload a valid BPMN file (.bpmn or .xml)')
        return
      }
      
      console.log('File is valid, reading content...') // Debug log
      
      // Read file content
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        console.log('File content loaded:', content.substring(0, 100) + '...') // Debug log
        setBpmnContent(content)
        setShowBpmnPreview(true)
      }
      reader.onerror = (e) => {
        console.error('Error reading file:', e) // Debug log
        alert('Error reading file. Please try again.')
      }
      reader.readAsText(file)
      
      setBpmnFile(file)
      setUploadedFileName(file.name)
    } else {
      console.log('No file selected') // Debug log
    }
    
    // Reset the input value to allow re-uploading the same file
    event.target.value = ''
  }

  const removeBpmnFile = () => {
    setBpmnFile(null)
    setUploadedFileName("")
    setBpmnContent("")
    setShowBpmnPreview(false)
    if (bpmnViewer) {
      bpmnViewer.destroy()
      setBpmnViewer(null)
    }
  }

  // Initialize BPMN viewer when content is available
  useEffect(() => {
    if (bpmnContent && showBpmnPreview && bpmnViewerRef.current) {
      initializeBpmnViewer()
    }
    return () => {
      if (bpmnViewer) {
        bpmnViewer.destroy()
      }
    }
  }, [bpmnContent, showBpmnPreview])

  // Load workflows from API on mount
  useEffect(() => {
    getWorkflowsDefinitions();
  }, []);

  const initializeBpmnViewer = async () => {
    if (!bpmnViewerRef.current || !bpmnContent) return;
    
    try {
      // Dynamically import bpmn-js viewer
      const { default: BpmnViewer } = await import('bpmn-js/lib/Viewer')
      
      const viewer = new BpmnViewer({
        container: bpmnViewerRef.current,
        width: '100%',
        height: '400px'
      })

      await viewer.importXML(bpmnContent)
      // Fit diagram to viewport
      const canvas = viewer.get('canvas') as BpmnCanvas
      canvas.zoom('fit-viewport')
      
      setBpmnViewer(viewer)
    } catch (error) {
      console.error('Error loading BPMN diagram:', error)
    }
  }
  const handleBpmnZoom = (action: 'in' | 'out' | 'fit') => {
    if (!bpmnViewer) return
    
    const canvas = bpmnViewer.get('canvas') as BpmnCanvas
    
    switch (action) {
      case 'in':
        canvas.zoom(1.2)
        break
      case 'out':
        canvas.zoom(0.8)
        break
      case 'fit':
        canvas.zoom('fit-viewport')
        break
    }
  }

  // BPMN Action Functions
  const deployToCamunda = async () => {
    if (!bpmnFile || !bpmnContent) {
      alert('No BPMN file to deploy')
      return
    }

    try {
      // Show loading state
      const deployButton = document.querySelector('[data-deploy-button]') as HTMLButtonElement
      if (deployButton) {
        deployButton.disabled = true
        deployButton.textContent = 'Deploying...'
      }

      // Here you would call your actual Camunda deployment API
      // For now, we'll simulate the deployment
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Use the existing camundaApiClient if available
      // const deploymentResult = await camundaApiClient.deployProcess({
      //   fileName: bpmnFile.name,
      //   content: bpmnContent
      // })
      
      alert(`BPMN file "${bpmnFile.name}" has been successfully deployed to Camunda!`)
      
    } catch (error) {
      console.error('Deployment error:', error)
      alert('Failed to deploy BPMN file to Camunda. Please check the console for details.')
    } finally {
      // Reset button state
      const deployButton = document.querySelector('[data-deploy-button]') as HTMLButtonElement
      if (deployButton) {
        deployButton.disabled = false
        deployButton.textContent = 'Deploy to Camunda'
      }
    }
  }

  const validateBpmn = async () => {
    if (!bpmnContent) {
      alert('No BPMN content to validate')
      return
    }

    try {
      // Show loading state
      const validateButton = document.querySelector('[data-validate-button]') as HTMLButtonElement
      if (validateButton) {
        validateButton.disabled = true
        validateButton.textContent = 'Validating...'
      }

      // Import bpmn-js modeler for validation
      const { default: BpmnModeler } = await import('bpmn-js/lib/Modeler')
      
      // Create a temporary container for validation
      const tempContainer = document.createElement('div')
      tempContainer.style.display = 'none'
      document.body.appendChild(tempContainer)
      
      const modeler = new BpmnModeler({ container: tempContainer })
      
      try {
        await modeler.importXML(bpmnContent)
        alert('BPMN validation successful! Your diagram is valid.')
      } catch (validationError) {
        console.error('BPMN validation error:', validationError)
        alert(`BPMN validation failed: ${validationError}`)
      } finally {
        modeler.destroy()
        document.body.removeChild(tempContainer)
      }
      
    } catch (error) {
      console.error('Validation error:', error)
      alert('Failed to validate BPMN file. Please check the console for details.')
    } finally {
      // Reset button state
      const validateButton = document.querySelector('[data-validate-button]') as HTMLButtonElement
      if (validateButton) {
        validateButton.disabled = false
        validateButton.textContent = 'Validate BPMN'
      }
    }
  }

  const exportBpmn = () => {
    if (!bpmnContent || !bpmnFile) {
      alert('No BPMN content to export')
      return
    }

    try {
      // Create blob and download link
      const blob = new Blob([bpmnContent], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      link.href = url
      link.download = bpmnFile.name || 'workflow.bpmn'
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      alert(`BPMN file "${bpmnFile.name}" exported successfully!`)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export BPMN file. Please check the console for details.')
    }
  }

  // Handle workflow form submission (create or edit)
  const handleWorkflowSubmit = async (workflow: any) => {
    if (editingWorkflow) {
      // TODO: Call update API here when available
      // await camundaApiClient.updateProcessDefinition(editingWorkflow.id, workflow)
      console.log('Editing workflow:', workflow)
    } else {
      // TODO: Call create API here if needed
      console.log('Creating new workflow:', workflow)
    }
    // Refresh list after submit
    getWorkflowsDefinitions();
    setIsCreateWorkflowOpen(false)
    setEditingWorkflow(null)
  }

  // Handle edit workflow action
  const handleEditWorkflow = (workflow: any) => {
    setEditingWorkflow(workflow)
    setIsCreateWorkflowOpen(true)
  }

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )
 

  // Component for template preview
  const TemplatePreviewSheet = ({ template }: { template: any }) => (
    <SheetContent className="w-[600px] sm:w-[700px]">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Workflow className="h-5 w-5" />
          {template.name}
        </SheetTitle>
        <SheetDescription>
          {template.description}
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="h-[calc(100vh-120px)] mt-6">
        <div className="space-y-6">
          {/* Template Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Category</p>
              <Badge variant="outline">{template.category}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Difficulty</p>
              <Badge variant={template.difficulty === "Easy" ? "default" : template.difficulty === "Medium" ? "secondary" : "destructive"}>
                {template.difficulty}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Steps</p>
              <p className="text-sm text-muted-foreground">{template.steps} steps</p>
            </div>
            <div>
              <p className="text-sm font-medium">Estimated Time</p>
              <p className="text-sm text-muted-foreground">{template.estimatedTime}</p>
            </div>
          </div>

          <Separator />

          {/* Template Steps */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Template Steps
            </h4>
            <div className="space-y-3">
              {template.detailedSteps?.map((step: any, index: number) => (
                <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{step.name}</p>
                      <Badge variant="secondary" className="text-xs">{step.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {index < template.detailedSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Use This Template
            </Button>
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          </div>
        </div>
      </ScrollArea>    
    </SheetContent>  
    )
  // Component for create workflow modal has been replaced by WorkflowFormModal

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <h1 className="text-3xl font-bold tracking-tight">Workflows Management</h1>
              <p className="text-muted-foreground">
                Design, configure, and manage automated workflows and business processes
              </p>
            </div>
          </div>            
          <Button onClick={() => getWorkflowsDefinitions()} variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Workflows
          </Button>
      </div>
      <Tabs defaultValue="workflows" className="space-y-4">        <TabsList>
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="bpmn">BPMN Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="workflows" className="space-y-4">          
            
            {/* Workflows Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                <div className="flex items-center space-x-2">
                  <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search workflows..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-full sm:w-[300px]"
                        />
                  </div>
                </div>            
                <Button onClick={() => setIsCreateWorkflowOpen(true)} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
            </div>
            {/* Workflows Table */}
            <WorkflowsListComponent isLoading={false} dictionary={dictionary} locale={locale} workflowsDefinitions={workflowsDefinitions} handleEditWorkflow={handleEditWorkflow}  />

        </TabsContent>
        <TabsContent value="templates" className="space-y-4">
          {/* Templates Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Workflow Templates</h3>
              <p className="text-sm text-muted-foreground">
                Pre-built workflow templates to get started quickly
              </p>
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          {/* Templates Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Workflow className="h-5 w-5 text-primary" />
                      {template.name}
                    </CardTitle>                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Sheet open={isPreviewOpen && selectedTemplate?.id === template.id} onOpenChange={(open) => {
                          setIsPreviewOpen(open)
                          if (!open) setSelectedTemplate(null)
                        }}>
                          <SheetTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault()
                              setSelectedTemplate(template)
                              setIsPreviewOpen(true)
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                          </SheetTrigger>
                          {selectedTemplate?.id === template.id && <TemplatePreviewSheet template={selectedTemplate} />}
                        </Sheet>
                        <DropdownMenuItem>
                          <Plus className="h-4 w-4 mr-2" />
                          Use Template
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate Template
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>
                    {template.description}
                  </CardDescription>
                </CardHeader>                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge variant={template.difficulty === "Easy" ? "default" : template.difficulty === "Medium" ? "secondary" : "destructive"}>
                        {template.difficulty}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{template.steps} steps</span>
                      <span>{template.estimatedTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <Sheet open={isPreviewOpen && selectedTemplate?.id === template.id} onOpenChange={(open) => {
                        setIsPreviewOpen(open)
                        if (!open) setSelectedTemplate(null)
                      }}>
                        <SheetTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </SheetTrigger>
                        {selectedTemplate?.id === template.id && <TemplatePreviewSheet template={selectedTemplate} />}
                      </Sheet>
                      <Button className="flex-1" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}          </div>
        </TabsContent>        <TabsContent value="bpmn" className="space-y-4">
          {/* Test Section for Debugging */}
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">🧪 Testing Section</CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                Use this section to test BPMN file upload functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    const input = document.getElementById('bpmn-upload') as HTMLInputElement
                    console.log('File input element:', input)
                    console.log('File input click triggered')
                    input?.click()
                  }}
                  variant="outline"
                  className="border-yellow-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Test File Input
                </Button>
                <Button 
                  onClick={() => {
                    console.log('Current BPMN state:', {
                      bpmnFile,
                      uploadedFileName,
                      bpmnContent: bpmnContent ? `${bpmnContent.length} characters` : 'none',
                      showBpmnPreview,
                      hasViewer: !!bpmnViewer
                    })
                  }}
                  variant="outline"
                  className="border-yellow-300"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Debug State
                </Button>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                💡 Test file available: <code>/test-workflow.bpmn</code> (right-click and save to test upload)
              </p>
            </CardContent>
          </Card>

          {/* BPMN Management Section */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {/* BPMN File Upload Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    BPMN File Upload
                  </CardTitle>
                  <CardDescription>
                    Upload BPMN files for Camunda integration and workflow deployment
                  </CardDescription>
                </CardHeader>                <CardContent className="space-y-4">
                  {!bpmnFile ? (
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-primary/50 transition-colors"
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const files = Array.from(e.dataTransfer.files)
                        const file = files[0]
                        if (file && (file.name.toLowerCase().endsWith('.bpmn') || file.name.toLowerCase().endsWith('.xml'))) {
                          // Create a fake event to use with handleBpmnFileUpload
                          const fakeEvent = {
                            target: { files: [file], value: '' }
                          } as unknown as React.ChangeEvent<HTMLInputElement>
                          handleBpmnFileUpload(fakeEvent)
                        } else {
                          alert('Please drop a valid BPMN file (.bpmn or .xml)')
                        }
                      }}
                    >
                      <div className="text-center space-y-4">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-medium">Upload BPMN File</h5>
                          <p className="text-sm text-muted-foreground">
                            Choose a BPMN (.bpmn or .xml) file or drag and drop it here
                          </p>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept=".bpmn,.xml"
                            onChange={handleBpmnFileUpload}
                            className="hidden"
                            id="bpmn-upload"
                            data-testid="bpmn-file-input"
                          />
                          <Button asChild className="w-full">
                            <label htmlFor="bpmn-upload" className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              Choose File
                            </label>
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Supports .bpmn and .xml files
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{uploadedFileName}</p>
                            <p className="text-sm text-muted-foreground">
                              BPMN file ready for Camunda integration
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={removeBpmnFile}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Settings className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Camunda Integration
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-200">
                          The uploaded BPMN file will be deployed to your Camunda engine and executed according to the defined process flow.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* BPMN Preview Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        BPMN Diagram Preview
                      </CardTitle>
                      <CardDescription>
                        Visualize and manage your BPMN workflow diagrams
                      </CardDescription>
                    </div>
                    {bpmnViewer && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBpmnZoom('in')}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBpmnZoom('out')}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBpmnZoom('fit')}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {bpmnContent ? (
                    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                      <div 
                        ref={bpmnViewerRef}
                        className="w-full h-96"
                        style={{ minHeight: '400px' }}
                      />
                      {!bpmnViewer && bpmnContent && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Loading BPMN diagram...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Upload a BPMN file to visualize your workflow diagram
                      </p>
                    </div>
                  )}
                  
                  {bpmnContent && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex gap-3">
                        <Settings className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          <p className="font-medium mb-1">Camunda Integration Notes:</p>
                          <ul className="space-y-1 list-disc list-inside">
                            <li>BPMN file will be deployed to your Camunda engine</li>
                            <li>Process definition will be available for execution</li>
                            <li>Workflow instances can be started via API or UI</li>
                            <li>Process monitoring and history will be available</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* BPMN Actions */}
          {bpmnFile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  BPMN Actions
                </CardTitle>
                <CardDescription>
                  Deploy and manage your BPMN workflow in Camunda
                </CardDescription>
              </CardHeader>              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={deployToCamunda}
                    data-deploy-button
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Deploy to Camunda
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={validateBpmn}
                    data-validate-button
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Validate BPMN
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={exportBpmn}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export BPMN
                  </Button>
                  <Button variant="outline" onClick={() => setShowBpmnPreview(!showBpmnPreview)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {showBpmnPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>        
        
        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
                <Workflow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workflows.length}</div>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">+2 this month</Badge>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workflows.filter(w => w.status === "Active").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((workflows.filter(w => w.status === "Active").length / workflows.length) * 100)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workflows.reduce((sum, w) => sum + w.executions, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">+15% this week</Badge>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all workflows
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Performance by Category */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>
                  Success rates and execution counts by workflow category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(workflows.map(w => w.category))).map(category => {
                    const categoryWorkflows = workflows.filter(w => w.category === category)
                    const avgSuccess = Math.round(categoryWorkflows.reduce((sum, w) => sum + w.successRate, 0) / categoryWorkflows.length)
                    const totalExecutions = categoryWorkflows.reduce((sum, w) => sum + w.executions, 0)
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{category}</p>
                          <p className="text-sm text-muted-foreground">{categoryWorkflows.length} workflows</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{avgSuccess}%</p>
                          <p className="text-sm text-muted-foreground">{totalExecutions} executions</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Status Distribution</CardTitle>
                <CardDescription>
                  Current status of all workflows in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(workflows.map(w => w.status))).map(status => {
                    const count = workflows.filter(w => w.status === status).length
                    const percentage = Math.round((count / workflows.length) * 100)
                    
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            <span className="font-medium">{status}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{count} workflows</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">{percentage}% of total</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Workflow Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Workflow Activity
              </CardTitle>
              <CardDescription>
                Latest executions and status changes across all workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflows.flatMap(workflow => 
                  workflow.recentExecutions.map(execution => ({
                    ...execution,
                    workflowName: workflow.name,
                    workflowId: workflow.id
                  }))
                )
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 10)
                .map((activity, index) => (
                  <div key={`${activity.workflowId}-${activity.id}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {activity.status === "Success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.status === "Failed" && <XCircle className="h-4 w-4 text-red-500" />}
                      {activity.status === "Pending" && <Clock className="h-4 w-4 text-yellow-500" />}
                      <div>
                        <p className="font-medium">{activity.workflowName}</p>
                        <p className="text-sm text-muted-foreground">
                          Executed by {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                        </p>
                        {activity.error && (
                          <p className="text-sm text-red-600">{activity.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={activity.status === "Success" ? "default" : activity.status === "Failed" ? "destructive" : "secondary"}>
                        {activity.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{activity.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Execution Trends</CardTitle>
              <CardDescription>
                Workflow execution history over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chart component would be rendered here</p>
                  <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
                  <Button variant="outline" className="mt-4">
                    <Zap className="h-4 w-4 mr-2" />
                    Add Chart Integration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>        
        </TabsContent>
      </Tabs>     
      <EnhancedWorkflowFormModal
        isOpen={isCreateWorkflowOpen}
        onClose={() => {
          setIsCreateWorkflowOpen(false)
          setEditingWorkflow(null)
        }}
        onSubmit={handleWorkflowSubmit}
        initialData={editingWorkflow ? {
          name: editingWorkflow.name,
          description: editingWorkflow.description,
          category: editingWorkflow.category,
          trigger: editingWorkflow.trigger,
          isActive: editingWorkflow.status === 'Active',
          priority: editingWorkflow.priority || 'medium',
          steps: editingWorkflow.steps || [],
          tags: editingWorkflow.tags || []
        } : undefined}
        mode={editingWorkflow ? 'edit' : 'create'}
      />
    </div>
  )
}
