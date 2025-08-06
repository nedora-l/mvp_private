"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  Settings,
  GitBranch,
  Edit,
  Save,
  Upload,
  FileText,
  CheckCircle,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  GripVertical,
  Copy,
  Play,
  Pause,
  Clock,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Database,
  Mail,
  Webhook,
  Calendar,
  Code,
  Zap
} from "lucide-react"
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Type declarations for bpmn-js
interface BpmnCanvas {
  zoom(level: number | 'fit-viewport'): void
}

interface WorkflowStep {
  id: string
  name: string
  type: string
  description: string
  config: {
    // Common configs
    enabled?: boolean
    timeout?: number
    retryAttempts?: number
    retryDelay?: number
    
    // Action configs
    action?: string
    parameters?: Record<string, any>
    
    // Condition configs
    condition?: string
    operator?: string
    value?: string
    
    // Integration configs
    serviceUrl?: string
    method?: string
    headers?: Record<string, string>
    body?: string
    
    // Notification configs
    recipients?: string[]
    subject?: string
    message?: string
    channel?: string
    
    // Delay configs
    duration?: number
    unit?: 'seconds' | 'minutes' | 'hours' | 'days'
    
    // Approval configs
    approvers?: string[]
    requiredApprovals?: number
    timeoutAction?: 'reject' | 'approve' | 'escalate'
  }
}

interface Workflow {
  id?: number
  name: string
  description: string
  category: string
  trigger: string
  steps: WorkflowStep[]
  bpmnFile?: File | null
  workflowType?: 'manual' | 'bpmn'
  status?: string
  version?: string
  createdBy?: string
  createdAt?: string
  isActive?: boolean
  priority?: 'low' | 'medium' | 'high' | 'critical'
  tags?: string[]
}

// Sortable step component for drag and drop
function SortableStep({ 
  step, 
  index, 
  onUpdate, 
  onRemove, 
  onDuplicate, 
  canRemove,
  stepTypes 
}: {
  step: WorkflowStep
  index: number
  onUpdate: (stepId: string, field: string, value: any) => void
  onRemove: (stepId: string) => void
  onDuplicate: (stepId: string) => void
  canRemove: boolean
  stepTypes: Array<{ value: string; label: string; description: string; icon: any }>
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isConfigExpanded, setIsConfigExpanded] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const stepTypeInfo = stepTypes.find(t => t.value === step.type)
  const StepIcon = stepTypeInfo?.icon || Settings

  return (
    <div ref={setNodeRef} style={style} className={`group ${isDragging ? 'z-50' : ''}`}>
      <Card className={`transition-all duration-200 ${isDragging ? 'shadow-lg border-primary' : 'hover:shadow-md'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <div 
              {...attributes} 
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted transition-colors"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            
            {/* Step Number */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">{index + 1}</span>
              </div>
            </div>
            
            {/* Step Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-0 h-auto"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <StepIcon className="h-4 w-4 text-primary" />
                <span className="font-medium truncate">
                  {step.name || `${stepTypeInfo?.label || 'Step'} ${index + 1}`}
                </span>
                {step.type && (
                  <Badge variant="secondary" className="text-xs">
                    {stepTypeInfo?.label}
                  </Badge>
                )}
              </div>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {step.description}
                </p>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(step.id)}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsConfigExpanded(!isConfigExpanded)}
                className="h-8 w-8 p-0"
              >
                <Settings className="h-3 w-3" />
              </Button>
              {canRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(step.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0 space-y-4">
            {/* Basic Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Step Name *</Label>
                <Input
                  placeholder="Enter step name"
                  value={step.name}
                  onChange={(e) => onUpdate(step.id, "name", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Step Type *</Label>
                <Select 
                  value={step.type} 
                  onValueChange={(value) => onUpdate(step.id, "type", value)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stepTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-3 w-3" />
                          <div>
                            <div className="font-medium text-sm">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                placeholder="Describe what this step does"
                value={step.description}
                onChange={(e) => onUpdate(step.id, "description", e.target.value)}
                rows={2}
                className="text-sm"
              />
            </div>

            {/* Advanced Configuration */}
            {isConfigExpanded && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium text-sm">Advanced Configuration</span>
                </div>
                
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-8">
                    <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                    <TabsTrigger value="execution" className="text-xs">Execution</TabsTrigger>
                    <TabsTrigger value="conditions" className="text-xs">Conditions</TabsTrigger>
                    <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Enabled</Label>
                        <Switch
                          checked={step.config.enabled !== false}
                          onCheckedChange={(checked) => onUpdate(step.id, "config", { ...step.config, enabled: checked })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Timeout (seconds)</Label>
                        <Input
                          type="number"
                          placeholder="300"
                          value={step.config.timeout || ''}
                          onChange={(e) => onUpdate(step.id, "config", { ...step.config, timeout: parseInt(e.target.value) || 300 })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="execution" className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Retry Attempts</Label>
                        <Input
                          type="number"
                          placeholder="3"
                          value={step.config.retryAttempts || ''}
                          onChange={(e) => onUpdate(step.id, "config", { ...step.config, retryAttempts: parseInt(e.target.value) || 3 })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Retry Delay (seconds)</Label>
                        <Input
                          type="number"
                          placeholder="5"
                          value={step.config.retryDelay || ''}
                          onChange={(e) => onUpdate(step.id, "config", { ...step.config, retryDelay: parseInt(e.target.value) || 5 })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="conditions" className="space-y-3 mt-3">
                    {renderStepSpecificConfig(step, onUpdate)}
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-3 mt-3">
                    <div className="text-xs text-muted-foreground">
                      Advanced configurations will be available in the next version.
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}

// Helper function to render step-specific configuration
function renderStepSpecificConfig(step: WorkflowStep, onUpdate: (stepId: string, field: string, value: any) => void) {
  switch (step.type) {
    case 'condition':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Condition Expression</Label>
            <Input
              placeholder="e.g., data.amount > 1000"
              value={step.config.condition || ''}
              onChange={(e) => onUpdate(step.id, "config", { ...step.config, condition: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Operator</Label>
              <Select 
                value={step.config.operator || ''} 
                onValueChange={(value) => onUpdate(step.id, "config", { ...step.config, operator: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="regex">Regex Match</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Value</Label>
              <Input
                placeholder="Comparison value"
                value={step.config.value || ''}
                onChange={(e) => onUpdate(step.id, "config", { ...step.config, value: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      )
    
    case 'action':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Action Type</Label>
            <Select 
              value={step.config.action || ''} 
              onValueChange={(value) => onUpdate(step.id, "config", { ...step.config, action: value })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create_record">Create Record</SelectItem>
                <SelectItem value="update_record">Update Record</SelectItem>
                <SelectItem value="delete_record">Delete Record</SelectItem>
                <SelectItem value="execute_script">Execute Script</SelectItem>
                <SelectItem value="send_request">Send HTTP Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Parameters (JSON)</Label>
            <Textarea
              placeholder='{"key": "value"}'
              value={step.config.parameters ? JSON.stringify(step.config.parameters, null, 2) : ''}
              onChange={(e) => {
                try {
                  const params = JSON.parse(e.target.value)
                  onUpdate(step.id, "config", { ...step.config, parameters: params })
                } catch {
                  // Handle invalid JSON gracefully
                }
              }}
              rows={3}
              className="text-sm font-mono"
            />
          </div>
        </div>
      )
    
    case 'integration':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Service URL</Label>
            <Input
              placeholder="https://api.example.com/endpoint"
              value={step.config.serviceUrl || ''}
              onChange={(e) => onUpdate(step.id, "config", { ...step.config, serviceUrl: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">HTTP Method</Label>
            <Select 
              value={step.config.method || 'GET'} 
              onValueChange={(value) => onUpdate(step.id, "config", { ...step.config, method: value })}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    
    case 'notification':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Recipients (comma-separated emails)</Label>
            <Input
              placeholder="user1@example.com, user2@example.com"
              value={step.config.recipients?.join(', ') || ''}
              onChange={(e) => onUpdate(step.id, "config", { 
                ...step.config, 
                recipients: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
              })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Subject</Label>
            <Input
              placeholder="Notification subject"
              value={step.config.subject || ''}
              onChange={(e) => onUpdate(step.id, "config", { ...step.config, subject: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Message</Label>
            <Textarea
              placeholder="Notification message"
              value={step.config.message || ''}
              onChange={(e) => onUpdate(step.id, "config", { ...step.config, message: e.target.value })}
              rows={3}
              className="text-sm"
            />
          </div>
        </div>
      )
    
    case 'delay':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Duration</Label>
              <Input
                type="number"
                placeholder="5"
                value={step.config.duration || ''}
                onChange={(e) => onUpdate(step.id, "config", { ...step.config, duration: parseInt(e.target.value) || 5 })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Unit</Label>
              <Select 
                value={step.config.unit || 'minutes'} 
                onValueChange={(value) => onUpdate(step.id, "config", { ...step.config, unit: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    
    case 'approval':
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Approvers (comma-separated emails)</Label>
            <Input
              placeholder="manager@example.com, admin@example.com"
              value={step.config.approvers?.join(', ') || ''}
              onChange={(e) => onUpdate(step.id, "config", { 
                ...step.config, 
                approvers: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
              })}
              className="h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Required Approvals</Label>
              <Input
                type="number"
                placeholder="1"
                value={step.config.requiredApprovals || ''}
                onChange={(e) => onUpdate(step.id, "config", { ...step.config, requiredApprovals: parseInt(e.target.value) || 1 })}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Timeout Action</Label>
              <Select 
                value={step.config.timeoutAction || 'reject'} 
                onValueChange={(value) => onUpdate(step.id, "config", { ...step.config, timeoutAction: value })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reject">Reject</SelectItem>
                  <SelectItem value="approve">Auto-approve</SelectItem>
                  <SelectItem value="escalate">Escalate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    
    default:
      return (
        <div className="text-xs text-muted-foreground">
          No specific configuration available for this step type.
        </div>
      )
  }
}

interface WorkflowFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  workflow?: Workflow | null
  onSubmit: (workflow: Workflow) => void
}

export function WorkflowFormModal({ 
  isOpen, 
  onOpenChange, 
  workflow = null, 
  onSubmit 
}: WorkflowFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Workflow>({
    name: "",
    description: "",
    category: "",
    trigger: "",
    steps: [],
    workflowType: 'manual',
    bpmnFile: null,
    isActive: true,
    priority: 'medium',
    tags: []
  })
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { 
      id: crypto.randomUUID(), 
      name: "", 
      type: "trigger", 
      description: "", 
      config: { enabled: true, timeout: 300 } 
    }
  ])
  const [uploadedFileName, setUploadedFileName] = useState<string>("")
  const [bpmnContent, setBpmnContent] = useState<string>("")
  const [activeStepId, setActiveStepId] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const bpmnViewerRef = useRef<HTMLDivElement>(null)
  const [bpmnViewer, setBpmnViewer] = useState<any>(null)
  const [showBpmnPreview, setShowBpmnPreview] = useState<boolean>(false)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const isEditing = workflow !== null;

  // Initialize form data when workflow prop changes
  useEffect(() => {
    if (workflow) {
      setFormData({
        ...workflow,
        workflowType: workflow.workflowType || 'manual',
        bpmnFile: workflow.bpmnFile || null,
        isActive: workflow.isActive !== false,
        priority: workflow.priority || 'medium',
        tags: workflow.tags || []
      })
      setWorkflowSteps(workflow.steps.map(step => ({
        ...step,
        id: step.id || crypto.randomUUID()
      })) || [
        { 
          id: crypto.randomUUID(), 
          name: "", 
          type: "trigger", 
          description: "", 
          config: { enabled: true, timeout: 300 } 
        }
      ])
      if (workflow.bpmnFile) {
        setUploadedFileName(workflow.bpmnFile.name)
      }
    } else {
      resetForm()
    }
  }, [workflow])

  const stepTypes = [
    { 
      value: "trigger", 
      label: "Trigger", 
      description: "Event that starts the workflow",
      icon: Zap
    },
    { 
      value: "condition", 
      label: "Condition", 
      description: "Logic check or decision point",
      icon: GitBranch
    },
    { 
      value: "action", 
      label: "Action", 
      description: "Task to be performed",
      icon: Play
    },
    { 
      value: "integration", 
      label: "Integration", 
      description: "Connect with external service",
      icon: Webhook
    },
    { 
      value: "notification", 
      label: "Notification", 
      description: "Send alerts or messages",
      icon: Mail
    },
    { 
      value: "delay", 
      label: "Delay", 
      description: "Wait for specified time",
      icon: Clock
    },
    { 
      value: "approval", 
      label: "Approval", 
      description: "Human approval step",
      icon: CheckCircle
    },
    { 
      value: "database", 
      label: "Database", 
      description: "Database operations",
      icon: Database
    },
    { 
      value: "script", 
      label: "Script", 
      description: "Execute custom code",
      icon: Code
    }
  ];

  const triggerTypes = [
    { value: "manual", label: "Manual Trigger", icon: Play },
    { value: "schedule", label: "Scheduled", icon: Calendar },
    { value: "webhook", label: "Webhook", icon: Webhook },
    { value: "file_upload", label: "File Upload", icon: Upload },
    { value: "email", label: "Email Received", icon: Mail },
    { value: "database", label: "Database Change", icon: Database },
    { value: "api_call", label: "API Call", icon: Code }
  ];

  const categories = [
    { value: "hr", label: "Human Resources", color: "bg-blue-100 text-blue-800" },
    { value: "finance", label: "Finance", color: "bg-green-100 text-green-800" },
    { value: "it", label: "Information Technology", color: "bg-purple-100 text-purple-800" },
    { value: "marketing", label: "Marketing", color: "bg-pink-100 text-pink-800" },
    { value: "support", label: "Customer Support", color: "bg-orange-100 text-orange-800" },
    { value: "operations", label: "Operations", color: "bg-gray-100 text-gray-800" },
    { value: "security", label: "Security", color: "bg-red-100 text-red-800" },
    { value: "compliance", label: "Compliance", color: "bg-yellow-100 text-yellow-800" },
    { value: "monitoring", label: "Monitoring", color: "bg-indigo-100 text-indigo-800" },
    { value: "reporting", label: "Reporting", color: "bg-teal-100 text-teal-800" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
    { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" }
  ];

  // Workflow step management functions
  const addWorkflowStep = () => {
    const newStep: WorkflowStep = {
      id: crypto.randomUUID(),
      name: "",
      type: "action",
      description: "",
      config: { enabled: true, timeout: 300, retryAttempts: 3, retryDelay: 5 }
    }
    setWorkflowSteps([...workflowSteps, newStep])
  }

  const updateWorkflowStep = (stepId: string, field: string, value: any) => {
    setWorkflowSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, [field]: value } : step
      )
    )
  }

  const removeWorkflowStep = (stepId: string) => {
    if (workflowSteps.length > 1) {
      setWorkflowSteps(prev => prev.filter(step => step.id !== stepId))
    }
  }

  const duplicateWorkflowStep = (stepId: string) => {
    const stepToDuplicate = workflowSteps.find(step => step.id === stepId)
    if (stepToDuplicate) {
      const duplicatedStep: WorkflowStep = {
        ...stepToDuplicate,
        id: crypto.randomUUID(),
        name: `${stepToDuplicate.name} (Copy)`
      }
      const stepIndex = workflowSteps.findIndex(step => step.id === stepId)
      const newSteps = [...workflowSteps]
      newSteps.splice(stepIndex + 1, 0, duplicatedStep)
      setWorkflowSteps(newSteps)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setWorkflowSteps((steps) => {
        const oldIndex = steps.findIndex((step) => step.id === active.id)
        const newIndex = steps.findIndex((step) => step.id === over.id)
        
        return arrayMove(steps, oldIndex, newIndex)
      })
    }
    
    setActiveStepId(null)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveStepId(event.active.id as string)
  }

  // Validation functions
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}
    
    switch (step) {
      case 1:
        if (!formData.name?.trim()) errors.name = "Workflow name is required"
        if (!formData.category) errors.category = "Category is required"
        if (!formData.trigger) errors.trigger = "Trigger type is required"
        break
      case 2:
        if (formData.workflowType === 'bpmn') {
          if (!formData.bpmnFile) errors.bpmnFile = "BPMN file is required"
        } else {
          if (workflowSteps.length === 0) {
            errors.steps = "At least one workflow step is required"
          } else {
            const invalidSteps = workflowSteps.filter(s => !s.name?.trim() || !s.type)
            if (invalidSteps.length > 0) {
              errors.steps = "All steps must have a name and type"
            }
          }
        }
        break
      case 3:
        // Final validation
        break
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const runWorkflowTest = async () => {
    setIsValidating(true)
    
    // Simulate workflow validation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsValidating(false)
    
    // Show success or error based on validation
    const isValid = Math.random() > 0.3 // 70% success rate for demo
    
    if (isValid) {
      setValidationErrors({})
    } else {
      setValidationErrors({
        test: "Workflow validation failed. Please check your step configurations."
      })
    }
    
    return isValid
  }

  const handleBpmnFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.bpmn') && !file.name.toLowerCase().endsWith('.xml')) {
        alert('Please upload a valid BPMN file (.bpmn or .xml)')
        return
      }
      
      // Read file content
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setBpmnContent(content)
      }
      reader.readAsText(file)
      
      setFormData(prev => ({ ...prev, bpmnFile: file }))
      setUploadedFileName(file.name)
    }
  }

  const removeBpmnFile = () => {
    setFormData(prev => ({ ...prev, bpmnFile: null }))
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
    }  }
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      trigger: "",
      steps: [],
      workflowType: 'manual',
      bpmnFile: null,
      isActive: true,
      priority: 'medium',
      tags: []
    })
    setWorkflowSteps([
      { 
        id: crypto.randomUUID(), 
        name: "", 
        type: "trigger", 
        description: "", 
        config: { enabled: true, timeout: 300 } 
      }
    ])
    setCurrentStep(1)
    setUploadedFileName("")
    setBpmnContent("")
    setShowBpmnPreview(false)
    setValidationErrors({})
    setActiveStepId(null)
    if (bpmnViewer) {
      bpmnViewer.destroy()
      setBpmnViewer(null)
    }
  }

  const handleSubmit = async () => {
    // Final validation
    if (!validateStep(currentStep)) {
      return
    }

    const workflowData: Workflow = {
      ...formData,
      steps: workflowSteps
    }

    onSubmit(workflowData)
    resetForm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const goToStep = (step: number) => {
    if (step <= currentStep || validateStep(currentStep)) {
      setCurrentStep(step)
    }
  }
  const getStepProgress = () => {
    return (currentStep / 4) * 100
  }

  const isStepValid = (step: number) => {
    return validateStep(step)
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw] sm:w-full overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/40">
        <DialogHeader className="border-b pb-4 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/90">
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit className="h-5 w-5" />
                Edit Workflow: {workflow?.name}
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Create New Workflow
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modify your existing workflow configuration and settings"
              : "Build a custom workflow to automate your business processes"
            }
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getStepProgress())}% Complete</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>        
        </DialogHeader>
          {/* Main Content Container with proper scrolling */}
        <div className="flex flex-col lg:flex-row min-h-0 flex-1 overflow-hidden">
          {/* Step Navigation Sidebar */}
          <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r pr-0 lg:pr-6 pb-4 lg:pb-0 space-y-4 flex-shrink-0">
            <ScrollArea className="h-full max-h-[200px] lg:max-h-[calc(95vh-300px)]">
              <div className="space-y-3">
              {[
                { 
                  step: 1, 
                  title: "Basic Info", 
                  description: "Name, category, trigger",
                  icon: Info
                },
                { 
                  step: 2, 
                  title: "Workflow Design", 
                  description: "Steps or BPMN file",
                  icon: GitBranch
                },
                { 
                  step: 3, 
                  title: "Configuration", 
                  description: "Advanced settings",
                  icon: Settings
                },
                { 
                  step: 4, 
                  title: "Review & Test", 
                  description: "Validate & create",
                  icon: CheckCircle
                }
              ].map(({ step, title, description, icon: Icon }) => (
                <div 
                  key={step}
                  className={`relative cursor-pointer rounded-lg p-3 transition-all ${
                    currentStep === step 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : currentStep > step
                      ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                      : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                  }`}
                  onClick={() => goToStep(step)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step 
                        ? 'bg-primary-foreground text-primary' 
                        : currentStep > step
                        ? 'bg-green-100 text-green-700'
                        : 'bg-background text-muted-foreground'
                    }`}>
                      {currentStep > step ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        step
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{title}</div>
                      <div className="text-xs opacity-75 truncate">{description}</div>
                    </div>
                    <Icon className="h-2 w-2 opacity-50" />
                  </div>
                  
                  {currentStep === step && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r" />
                  )}
                </div>
              ))}            </div>
            {/* Validation Errors Summary */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="mt-6 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300 text-sm font-medium mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Validation Issues
                </div>
                <div className="space-y-1">
                  {Object.values(validationErrors).map((error, index) => (
                    <div key={index} className="text-xs text-red-600 dark:text-red-400">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
            </ScrollArea>
          </div>
            {/* Main Content */}
          <div className="flex-1 pl-0 lg:pl-6 pt-4 lg:pt-0 min-w-0">
            <ScrollArea className="h-full max-h-[calc(95vh-300px)]">
              <div className="space-y-6 pr-2">{/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="workflow-name">Workflow Name *</Label>
                          <Input
                            id="workflow-name"
                            placeholder="Enter workflow name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className={validationErrors.name ? "border-red-500" : ""}
                          />
                          {validationErrors.name && (
                            <p className="text-xs text-red-500">{validationErrors.name}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="workflow-category">Category *</Label>
                          <Select 
                            value={formData.category} 
                            onValueChange={(value) => setFormData({...formData, category: value})}
                          >
                            <SelectTrigger className={validationErrors.category ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]}`} />
                                    {category.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {validationErrors.category && (
                            <p className="text-xs text-red-500">{validationErrors.category}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="workflow-priority">Priority</Label>
                          <Select 
                            value={formData.priority || 'medium'} 
                            onValueChange={(value) => setFormData({...formData, priority: value as any})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {priorityOptions.map(priority => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${priority.color.split(' ')[0]}`} />
                                    {priority.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="workflow-trigger">Trigger Type *</Label>
                          <Select 
                            value={formData.trigger} 
                            onValueChange={(value) => setFormData({...formData, trigger: value})}
                          >
                            <SelectTrigger className={validationErrors.trigger ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select trigger type" />
                            </SelectTrigger>
                            <SelectContent>
                              {triggerTypes.map(trigger => (
                                <SelectItem key={trigger.value} value={trigger.value}>
                                  <div className="flex items-center gap-2">
                                    <trigger.icon className="h-4 w-4" />
                                    {trigger.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {validationErrors.trigger && (
                            <p className="text-xs text-red-500">{validationErrors.trigger}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Active Workflow</Label>
                            <Switch
                              checked={formData.isActive !== false}
                              onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Inactive workflows can be created but won't execute automatically
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="workflow-tags">Tags (comma-separated)</Label>
                          <Input
                            id="workflow-tags"
                            placeholder="e.g., automation, finance, approval"
                            value={formData.tags?.join(', ') || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workflow-description">Description</Label>
                      <Textarea
                        id="workflow-description"
                        placeholder="Describe what this workflow does and its purpose"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                      />
                    </div>
                  </div>
                )}
            {/* Step 2: Workflow Steps */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Workflow Definition</h3>
                
                {/* Workflow Type Selection */}
                <div className="space-y-3">
                  <Label>Workflow Type *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card 
                      className={`p-4 cursor-pointer transition-all ${
                        formData.workflowType === 'manual' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, workflowType: 'manual' }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.workflowType === 'manual' 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground'
                        }`}>
                          {formData.workflowType === 'manual' && (
                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <GitBranch className="h-4 w-4" />
                            Manual Step Definition
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Build workflow by defining individual steps
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card 
                      className={`p-4 cursor-pointer transition-all ${
                        formData.workflowType === 'bpmn' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, workflowType: 'bpmn' }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.workflowType === 'bpmn' 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground'
                        }`}>
                          {formData.workflowType === 'bpmn' && (
                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            BPMN File Upload
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Upload existing BPMN file for Camunda integration
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Manual Step Definition */}
                {formData.workflowType === 'manual' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium">Define Workflow Steps</h4>
                      <Button onClick={addWorkflowStep} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Step
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {workflowSteps.map((step, index) => (
                        <Card key={step.id} className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium">{index + 1}</span>
                              </div>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label>Step Name *</Label>
                                  <Input
                                    placeholder="Enter step name"
                                    value={step.name}
                                    onChange={(e) => updateWorkflowStep(step.id, "name", e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>Step Type *</Label>
                                  <Select 
                                    value={step.type} 
                                    onValueChange={(value) => updateWorkflowStep(step.id, "type", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {stepTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                          <div>
                                            <div className="font-medium">{type.label}</div>
                                            <div className="text-xs text-muted-foreground">{type.description}</div>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  placeholder="Describe what this step does"
                                  value={step.description}
                                  onChange={(e) => updateWorkflowStep(step.id, "description", e.target.value)}
                                  rows={2}
                                />
                              </div>
                            </div>

                            {workflowSteps.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeWorkflowStep(step.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* BPMN File Upload */}
                {formData.workflowType === 'bpmn' && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium">Upload BPMN File</h4>
                    
                    {!formData.bpmnFile ? (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                        <div className="text-center space-y-4">
                          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h5 className="font-medium">Upload BPMN File</h5>
                            <p className="text-sm text-muted-foreground">
                              Choose a BPMN (.bpmn or .xml) file for Camunda integration
                            </p>
                          </div>
                          <div>
                            <input
                              type="file"
                              accept=".bpmn,.xml"
                              onChange={handleBpmnFileUpload}
                              className="hidden"
                              id="bpmn-upload"
                            />
                            <Button asChild>
                              <label htmlFor="bpmn-upload" className="cursor-pointer">
                                <Upload className="h-4 w-4 mr-2" />
                                Choose File
                              </label>
                            </Button>
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
                  </div>
                )}
              </div>
            )}            {/* Step 3: Review & Create */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Review & {isEditing ? 'Update' : 'Create'}</h3>
                
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Workflow Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm text-muted-foreground">{formData.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Category</p>
                          <Badge variant="outline">
                            {categories.find(c => c.value === formData.category)?.label}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Trigger</p>
                          <Badge variant="secondary">
                            {triggerTypes.find(t => t.value === formData.trigger)?.label}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Workflow Type</p>
                          <Badge variant={formData.workflowType === 'bpmn' ? 'default' : 'secondary'}>
                            {formData.workflowType === 'bpmn' ? 'BPMN File' : 'Manual Steps'}
                          </Badge>
                        </div>
                      </div>
                      {formData.description && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm text-muted-foreground">{formData.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Manual Workflow Steps Review */}
                    {formData.workflowType === 'manual' && (
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <GitBranch className="h-4 w-4" />
                          Workflow Steps ({workflowSteps.length} steps)
                        </h4>
                        <div className="space-y-2 mt-2">
                          {workflowSteps.map((step, index) => (
                            <div key={step.id} className="flex items-center gap-3 p-2 border rounded">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{step.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {stepTypes.find(t => t.value === step.type)?.label}
                                  </Badge>
                                </div>
                                {step.description && (
                                  <p className="text-xs text-muted-foreground">{step.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* BPMN File Review */}
                    {formData.workflowType === 'bpmn' && formData.bpmnFile && (
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          BPMN File Details
                        </h4>
                        <div className="mt-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-green-900 dark:text-green-100">
                                {uploadedFileName}
                              </p>
                              <p className="text-sm text-green-700 dark:text-green-300">
                                File size: {(formData.bpmnFile.size / 1024).toFixed(1)} KB
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-400">
                                Ready for Camunda deployment
                              </p>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>                        </div>
                        
                        {/* BPMN Preview Section */}
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              BPMN Diagram Preview
                            </h5>
                            <div className="flex gap-2">
                              {!showBpmnPreview ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setShowBpmnPreview(true)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Show Preview
                                </Button>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleBpmnZoom('in')}
                                    disabled={!bpmnViewer}
                                  >
                                    <ZoomIn className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleBpmnZoom('out')}
                                    disabled={!bpmnViewer}
                                  >
                                    <ZoomOut className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleBpmnZoom('fit')}
                                    disabled={!bpmnViewer}
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowBpmnPreview(false)}
                                  >
                                    Hide Preview
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {showBpmnPreview && (
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
                          )}
                          
                          {!showBpmnPreview && (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                              <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Click "Show Preview" to visualize your BPMN diagram
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
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
                      </div>
                    )}                  </div>
                </Card>
              </div>
            )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/90">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
          </div>            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Workflow' : 'Create Workflow'}
                </Button>
              )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
