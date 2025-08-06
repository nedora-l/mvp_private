"use client"

import { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
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
  Clock,
  User,
  Mail,
  AlertCircle,
  Sparkles,
  Workflow,
  Target,
  X,
  Info,
  GripVertical
} from "lucide-react"

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { CreateProcessDefinitionRequestDto, TriggerType, WorkflowCategory } from "@/lib/services/server/camunda/camunda.server.service"
import { camundaApiClient } from "@/lib/services/client/camunda/camunda.client.service"

interface WorkflowStep {
  id: string
  name: string
  type: 'action' | 'condition' | 'delay' | 'notification'
  description: string
  config: Record<string, any>
  position: { x: number; y: number }
}

interface WorkflowFormData {
  name: string
  description: string
  category: WorkflowCategory;
  trigger: TriggerType;
  isActive: boolean
  priority: 'low' | 'medium' | 'high'
  steps: WorkflowStep[]
  tags: string[]
}

interface EnhancedWorkflowFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (workflow: WorkflowFormData) => void
  initialData?: Partial<WorkflowFormData>
  mode: 'create' | 'edit'
}

const stepTypes = [
  { value: 'action', label: 'Action', icon: Target, color: 'blue' },
  { value: 'condition', label: 'Condition', icon: GitBranch, color: 'purple' },
  { value: 'delay', label: 'Delay', icon: Clock, color: 'orange' },
  { value: 'notification', label: 'Notification', icon: Mail, color: 'green' },
]
const triggerOptions = [
  { value: "MANUAL", label: 'Manual Trigger' },
  { value: "SCHEDULE", label: 'Scheduled' },
  { value: "WEBHOOK", label: 'Webhook' },
  { value: "EVENT", label: 'System Event' },
  { value: "APPROVAL", label: 'Approval Request' },
]

const categoryOptions = [
  { value: WorkflowCategory.HR_PROCESSES, label: 'Human Resources' },
  { value: WorkflowCategory.FINANCIAL, label: 'Finance' },
  { value: WorkflowCategory.COMPLIANCE, label: 'IT Operations' },
  { value: WorkflowCategory.ORDER_MANAGEMENT, label: 'Sales & Marketing' },
  { value: WorkflowCategory.INTEGRATION, label: 'Operations' },
  { value: "OTHER", label: 'Other' },
]

export function EnhancedWorkflowFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}: EnhancedWorkflowFormModalProps) {  
  
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<WorkflowFormData>({
    name: '',
    description: '',
    category: WorkflowCategory.OTHER,
    trigger: TriggerType.MANUAL,
    isActive: true,
    priority: 'medium',
    steps: [],
    tags: [],
    ...initialData
  })
  const [tagInput, setTagInput] = useState('');
  
  // Workflow type selection state
  const [workflowType, setWorkflowType] = useState<'visual' | 'bpmn'>('visual')
  
  // Initializing form data for BPMN workflow
  const [camundaWorkflowFormData, setCamundaWorkflowFormData] = useState<CreateProcessDefinitionRequestDto>({
      processKey: '',
      bpmnXml: '',
      name: '',
      description: '',
      category:  "OTHER" ,
      trigger:  "MANUAL",
      version: '1.0',
      isActive: true,
      deployImmediately: false,
      ...initialData
  })

  // BPMN file handling state
  const [bpmnFile, setBpmnFile] = useState<File | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [bpmnContent, setBpmnContent] = useState('')

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData })
    }
  }, [initialData])

  const totalSteps = 5
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: `Step ${formData.steps.length + 1}`,
      type: 'action',
      description: '',
      config: {},
      position: { x: 0, y: formData.steps.length * 120 }
    }
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
  }

  const removeStep = (stepId: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }))
  }

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  // BPMN file handling functions
  const handleBpmnFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validExtensions = ['.bpmn', '.xml']
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    if (!validExtensions.includes(fileExtension)) {
      alert('Please select a valid BPMN file (.bpmn or .xml)')
      return
    }

    try {
      const content = await file.text()
      setBpmnFile(file)
      setUploadedFileName(file.name)
      setBpmnContent(content)
      
      // Switch to BPMN workflow type
      setWorkflowType('bpmn')
      
      console.log('BPMN file uploaded successfully:', file.name)
    } catch (error) {
      console.error('Error reading BPMN file:', error)
      alert('Error reading the BPMN file. Please try again.')
    }
  }

  const removeBpmnFile = () => {
    setBpmnFile(null)
    setUploadedFileName('')
    setBpmnContent('')
    setWorkflowType('visual')
    
    // Reset file input
    const fileInput = document.getElementById('bpmn-upload-modal') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setFormData(prev => {
        const oldIndex = prev.steps.findIndex(step => step.id === active.id)
        const newIndex = prev.steps.findIndex(step => step.id === over?.id)

        return {
          ...prev,
          steps: arrayMove(prev.steps, oldIndex, newIndex)
        }
      })
    }
  }

  const handleSubmit = () => {
    const camundaData:CreateProcessDefinitionRequestDto = {
      processKey: formData.category + '-' + formData.name.toLowerCase().replace(/\s+/g, '-'),
      bpmnXml: bpmnContent,
      name: formData.name,
      description: formData.description,
      category: formData.category as WorkflowCategory,
      version: '1.0',
      isActive: formData.isActive,
      deployImmediately: false
    };

    setCamundaWorkflowFormData(camundaData);
    camundaApiClient.createProcessDefinition(camundaData).then(response => {
      console.log('Process definition created successfully:', response);
    }).catch(error => {
      console.error('Error creating process definition:', error);
    });

    onSubmit(formData)
    onClose()
  }

  // Sortable Step Component
  const SortableStep = ({ step, index }: { step: WorkflowStep, index: number }) => {
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

    const stepType = stepTypes.find(t => t.value === step.type)

    return (
      <Card 
        ref={setNodeRef} 
        style={style} 
        className={cn(
          "p-4 group hover:shadow-md transition-all",
          isDragging && "shadow-lg"
        )}
      >
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="flex flex-col items-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity pt-2"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">#{index + 1}</span>
          </button>

          <div className="flex flex-col items-center">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mb-2",
              stepType?.color === 'blue' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
              stepType?.color === 'purple' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
              stepType?.color === 'orange' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
              stepType?.color === 'green' && "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
            )}>
              {stepType?.icon && <stepType.icon className="h-5 w-5" />}
            </div>
            <span className="text-xs text-muted-foreground lg:hidden">#{index + 1}</span>
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={step.name}
                onChange={(e) => updateStep(step.id, { name: e.target.value })}
                className="flex-1 h-9 font-medium"
                placeholder="Step name"
              />
              <Select 
                value={step.type} 
                onValueChange={(value) => updateStep(step.id, { type: value as WorkflowStep['type'] })}
              >
                <SelectTrigger className="w-40 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stepTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => removeStep(step.id)}
                size="sm"
                variant="ghost"
                className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <Textarea
              value={step.description}
              onChange={(e) => updateStep(step.id, { description: e.target.value })}
              placeholder="Describe what this step does..."
              className="text-sm min-h-[70px] resize-none"
            />

            {/* Step Configuration Preview */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Settings className="h-3 w-3" />
              <span>Configuration available in step 3</span>
            </div>
          </div>
        </div>
        
        {index < formData.steps.length - 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-px bg-border flex-1 w-8"></div>
              <ArrowRight className="h-4 w-4" />
              <div className="h-px bg-border flex-1 w-8"></div>
            </div>
          </div>
        )}
      </Card>
    )
  }

  const StepContent = ({ step }: { step: number }) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold ">Basic Information</h3>
              <p className="text-sm text-muted-foreground">Let's start with the workflow basics</p>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Workflow Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workflow name..."
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as WorkflowCategory }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this workflow does..."
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trigger Configuration</h3>
              <p className="text-sm text-muted-foreground">Configure when this workflow should run</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="trigger" className="text-sm font-medium">Trigger Type</Label>
                <Select value={formData.trigger} onValueChange={(value) => setFormData(prev => ({ ...prev, trigger: value  as TriggerType }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Active Status</Label>
                  <p className="text-xs text-muted-foreground">Enable this workflow to run automatically</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Tags</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1"
                    />
                    <Button onClick={addTag} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button title="Close" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Workflow Design</h3>
              <p className="text-sm text-muted-foreground">Choose how to build your workflow</p>
            </div>            {/* Workflow Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  "hover:border-primary/50",
                  workflowType === 'visual' 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" 
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
                )}
                onClick={() => setWorkflowType('visual')}
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl mx-auto flex items-center justify-center">
                    <GitBranch className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Visual Builder</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Build workflows step by step with our visual interface
                    </p>
                  </div>
                  <div className="flex justify-center">
                    {workflowType === 'visual' ? (
                      <Badge variant="default" className="bg-blue-600 text-white">
                        Selected
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Recommended
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>

              <Card 
                className={cn(
                  "p-4 cursor-pointer transition-all border-2",
                  "hover:border-primary/50",
                  workflowType === 'bpmn' 
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30" 
                    : "border-dashed bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20"
                )}
                onClick={() => setWorkflowType('bpmn')}
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl mx-auto flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">BPMN Import</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                      Upload existing BPMN files for Camunda integration
                    </p>
                  </div>
                  <div className="flex justify-center">
                    {workflowType === 'bpmn' ? (
                      <Badge variant="default" className="bg-purple-600 text-white">
                        Selected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300">
                        Advanced
                      </Badge>
                    )}
                  </div>
                </div>              </Card>
            </div>

            {/* BPMN File Upload Section - Only show when BPMN is selected */}
            {workflowType === 'bpmn' && (
              <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                    <Upload className="h-5 w-5" />
                    Upload BPMN File
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!bpmnFile ? (
                    <div 
                      className="border-2 border-dashed border-purple-300 rounded-lg p-6 hover:border-purple-500 transition-colors"
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
                        <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          <Upload className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-purple-900 dark:text-purple-100">Upload BPMN File</h5>
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            Choose a BPMN (.bpmn or .xml) file or drag and drop it here
                          </p>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept=".bpmn,.xml"
                            onChange={handleBpmnFileUpload}
                            className="hidden"
                            id="bpmn-upload-modal"
                          />
                          <Button asChild variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
                            <label htmlFor="bpmn-upload-modal" className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              Choose BPMN File
                            </label>
                          </Button>
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            Supports .bpmn and .xml files
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-purple-300 rounded-lg p-4 bg-white dark:bg-purple-950/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-purple-900 dark:text-purple-100">{uploadedFileName}</p>
                            <p className="text-sm text-purple-700 dark:text-purple-300">
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
                  
                  <div className="bg-purple-100 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                    <div className="flex gap-3">
                      <Info className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-purple-900 dark:text-purple-100">
                          BPMN Integration Note
                        </p>
                        <p className="text-xs text-purple-700 dark:text-purple-200">
                          This BPMN file will be validated and deployed to your Camunda engine when the workflow is created.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}            {/* Workflow Steps Builder - Only show when Visual is selected */}
            {workflowType === 'visual' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Workflow Steps ({formData.steps.length})</Label>
                  <Button onClick={addStep} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Step
                  </Button>
                </div>

                <ScrollArea className="h-[350px] border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  {formData.steps.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <GitBranch className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold mb-2">No steps added yet</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start building your workflow by adding the first step
                      </p>
                      <Button onClick={addStep} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add First Step
                      </Button>
                    </div>
                  ) : (
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={formData.steps.map(step => step.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {formData.steps.map((step, index) => (
                            <SortableStep key={step.id} step={step} index={index} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced Configuration</h3>
              <p className="text-sm text-muted-foreground">Configure advanced settings for your workflow steps</p>
            </div>

            {formData.steps.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="font-semibold mb-2">No steps to configure</h4>
                <p className="text-sm text-muted-foreground">
                  Go back to Step 2 to add workflow steps first
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    Configure each step with specific parameters and conditions
                  </span>
                </div>

                <ScrollArea className="h-[400px] border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="space-y-6">
                    {formData.steps.map((step, index) => {
                      const stepType = stepTypes.find(t => t.value === step.type)
                      return (
                        <Card key={step.id} className="p-4">
                          <div className="space-y-4">
                            {/* Step Header */}
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                stepType?.color === 'blue' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                                stepType?.color === 'purple' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
                                stepType?.color === 'orange' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
                                stepType?.color === 'green' && "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                              )}>
                                {stepType?.icon && <stepType.icon className="h-4 w-4" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{step.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {stepType?.label} • Step {index + 1}
                                </p>
                              </div>
                            </div>

                            {/* Step Configuration Tabs */}
                            <Tabs defaultValue="general" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                              </TabsList>

                              <TabsContent value="general" className="space-y-3 mt-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label className="text-xs font-medium">Timeout (seconds)</Label>
                                    <Input
                                      type="number"
                                      placeholder="300"
                                      value={step.config.timeout || ''}
                                      onChange={(e) => updateStep(step.id, {
                                        config: { ...step.config, timeout: parseInt(e.target.value) || 300 }
                                      })}
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs font-medium">Retry Attempts</Label>
                                    <Input
                                      type="number"
                                      placeholder="3"
                                      value={step.config.retryAttempts || ''}
                                      onChange={(e) => updateStep(step.id, {
                                        config: { ...step.config, retryAttempts: parseInt(e.target.value) || 3 }
                                      })}
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                  <div>
                                    <Label className="text-xs font-medium">Enable Step</Label>
                                    <p className="text-xs text-muted-foreground">Execute this step during workflow run</p>
                                  </div>
                                  <Switch
                                    checked={step.config.enabled !== false}
                                    onCheckedChange={(checked) => updateStep(step.id, {
                                      config: { ...step.config, enabled: checked }
                                    })}
                                  />
                                </div>
                              </TabsContent>

                              <TabsContent value="conditions" className="space-y-3 mt-4">
                                {step.type === 'condition' ? (
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-xs font-medium">Condition Expression</Label>
                                      <Textarea
                                        placeholder="e.g., ${request.amount > 1000}"
                                        value={step.config.condition || ''}
                                        onChange={(e) => updateStep(step.id, {
                                          config: { ...step.config, condition: e.target.value }
                                        })}
                                        className="text-xs min-h-[60px] font-mono"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <Label className="text-xs font-medium">If True</Label>
                                        <Select
                                          value={step.config.onTrue || ''}
                                          onValueChange={(value) => updateStep(step.id, {
                                            config: { ...step.config, onTrue: value }
                                          })}
                                        >
                                          <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="Select action" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="continue">Continue</SelectItem>
                                            <SelectItem value="skip">Skip Next Step</SelectItem>
                                            <SelectItem value="jump">Jump to Step</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label className="text-xs font-medium">If False</Label>
                                        <Select
                                          value={step.config.onFalse || ''}
                                          onValueChange={(value) => updateStep(step.id, {
                                            config: { ...step.config, onFalse: value }
                                          })}
                                        >
                                          <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="Select action" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="continue">Continue</SelectItem>
                                            <SelectItem value="skip">Skip Next Step</SelectItem>
                                            <SelectItem value="stop">Stop Workflow</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                ) : step.type === 'delay' ? (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <Label className="text-xs font-medium">Delay Amount</Label>
                                        <Input
                                          type="number"
                                          placeholder="5"
                                          value={step.config.delayAmount || ''}
                                          onChange={(e) => updateStep(step.id, {
                                            config: { ...step.config, delayAmount: parseInt(e.target.value) || 5 }
                                          })}
                                          className="h-8 text-xs"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs font-medium">Delay Unit</Label>
                                        <Select
                                          value={step.config.delayUnit || 'minutes'}
                                          onValueChange={(value) => updateStep(step.id, {
                                            config: { ...step.config, delayUnit: value }
                                          })}
                                        >
                                          <SelectTrigger className="h-8 text-xs">
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
                                ) : step.type === 'notification' ? (
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-xs font-medium">Recipients</Label>
                                      <Input
                                        placeholder="email@example.com, user2@example.com"
                                        value={step.config.recipients || ''}
                                        onChange={(e) => updateStep(step.id, {
                                          config: { ...step.config, recipients: e.target.value }
                                        })}
                                        className="h-8 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs font-medium">Message Template</Label>
                                      <Textarea
                                        placeholder="Workflow ${workflowName} completed successfully"
                                        value={step.config.messageTemplate || ''}
                                        onChange={(e) => updateStep(step.id, {
                                          config: { ...step.config, messageTemplate: e.target.value }
                                        })}
                                        className="text-xs min-h-[60px]"
                                      />
                                    </div>
                                  </div>
                                ) : step.type === 'action' ? (
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-xs font-medium">Action Type</Label>
                                      <Select
                                        value={step.config.actionType || ''}
                                        onValueChange={(value) => updateStep(step.id, {
                                          config: { ...step.config, actionType: value }
                                        })}
                                      >
                                        <SelectTrigger className="h-8 text-xs">
                                          <SelectValue placeholder="Select action type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="http">HTTP Request</SelectItem>
                                          <SelectItem value="database">Database Query</SelectItem>
                                          <SelectItem value="script">Run Script</SelectItem>
                                          <SelectItem value="approval">Request Approval</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    {step.config.actionType === 'http' && (
                                      <div className="space-y-2">
                                        <div>
                                          <Label className="text-xs font-medium">URL</Label>
                                          <Input
                                            placeholder="https://api.example.com/endpoint"
                                            value={step.config.url || ''}
                                            onChange={(e) => updateStep(step.id, {
                                              config: { ...step.config, url: e.target.value }
                                            })}
                                            className="h-8 text-xs"
                                          />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <Label className="text-xs font-medium">Method</Label>
                                            <Select
                                              value={step.config.method || 'POST'}
                                              onValueChange={(value) => updateStep(step.id, {
                                                config: { ...step.config, method: value }
                                              })}
                                            >
                                              <SelectTrigger className="h-8 text-xs">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="GET">GET</SelectItem>
                                                <SelectItem value="POST">POST</SelectItem>
                                                <SelectItem value="PUT">PUT</SelectItem>
                                                <SelectItem value="DELETE">DELETE</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div>
                                            <Label className="text-xs font-medium">Content Type</Label>
                                            <Select
                                              value={step.config.contentType || 'application/json'}
                                              onValueChange={(value) => updateStep(step.id, {
                                                config: { ...step.config, contentType: value }
                                              })}
                                            >
                                              <SelectTrigger className="h-8 text-xs">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="application/json">JSON</SelectItem>
                                                <SelectItem value="application/xml">XML</SelectItem>
                                                <SelectItem value="application/x-www-form-urlencoded">Form</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-center py-4">
                                    <p className="text-xs text-muted-foreground">
                                      No specific conditions for this step type
                                    </p>
                                  </div>
                                )}
                              </TabsContent>

                              <TabsContent value="advanced" className="space-y-3 mt-4">
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-xs font-medium">Error Handling</Label>
                                    <Select
                                      value={step.config.errorHandling || 'stop'}
                                      onValueChange={(value) => updateStep(step.id, {
                                        config: { ...step.config, errorHandling: value }
                                      })}
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="stop">Stop Workflow</SelectItem>
                                        <SelectItem value="continue">Continue</SelectItem>
                                        <SelectItem value="retry">Retry Step</SelectItem>
                                        <SelectItem value="skip">Skip Step</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label className="text-xs font-medium">Variables</Label>
                                    <Textarea
                                      placeholder="key1=value1&#10;key2=value2"
                                      value={step.config.variables || ''}
                                      onChange={(e) => updateStep(step.id, {
                                        config: { ...step.config, variables: e.target.value }
                                      })}
                                      className="text-xs min-h-[60px] font-mono"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      One variable per line in key=value format
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div>
                                      <Label className="text-xs font-medium">Log Execution</Label>
                                      <p className="text-xs text-muted-foreground">Enable detailed logging for this step</p>
                                    </div>
                                    <Switch
                                      checked={step.config.logExecution !== false}
                                      onCheckedChange={(checked) => updateStep(step.id, {
                                        config: { ...step.config, logExecution: checked }
                                      })}
                                    />
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Review & Create</h3>
              <p className="text-sm text-muted-foreground">Review your workflow configuration before creating</p>
            </div>

            <Card className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Name</Label>
                  <p className="font-medium">{formData.name || 'Untitled Workflow'}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Category</Label>
                  <p className="font-medium">{categoryOptions.find(c => c.value === formData.category)?.label || 'None'}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Trigger</Label>
                  <p className="font-medium">{triggerOptions.find(t => t.value === formData.trigger)?.label || 'None'}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
                  <Badge variant={formData.priority === 'high' ? 'destructive' : formData.priority === 'medium' ? 'default' : 'secondary'}>
                    {formData.priority}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                <p className="text-sm mt-1">{formData.description || 'No description provided'}</p>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Steps ({formData.steps.length})</Label>
                <div className="mt-2 space-y-1">
                  {formData.steps.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No steps configured</p>
                  ) : (
                    formData.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{index + 1}.</span>
                        <span className="font-medium">{step.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {stepTypes.find(t => t.value === step.type)?.label}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {formData.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[95vw] sm:w-full p-0 gap-0 bg-background border-border/40">
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800  ">
          <div className="flex items-center justify-between">
            <div>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  {mode === 'create' ? 'Create Workflow' : 'Edit Workflow'} 
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {mode === 'create' 
                      ? 'Build an automated workflow to streamline your processes'
                      : 'Update your workflow configuration'
                  }
                </DialogDescription>
            </div>
            <Badge variant="outline" className="text-xs">
                Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </DialogHeader>        
        {/* Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh - 200px)] overflow-scroll" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="px-4 sm:px-6 py-6">
            <StepContent step={currentStep} />
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-col sm:flex-row justify-between w-full gap-2 sm:gap-0">            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              {currentStep === totalSteps - 1 ? (
                <Button onClick={handleSubmit} className="flex items-center gap-2 flex-1 sm:flex-none">
                  <Save className="h-4 w-4" />
                  {mode === 'create' ? 'Create Workflow' : 'Update Workflow'}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
                  className="flex items-center gap-2 flex-1 sm:flex-none"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
