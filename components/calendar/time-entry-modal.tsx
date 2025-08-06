"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Clock, 
  Save, 
  X, 
  AlertCircle, 
  Timer,
  MapPin,
  FileText,
  DollarSign
} from "lucide-react"
import { 
  TimeEntry, 
  ActivityCategory, 
  TimeEntryType, 
  ActivityStatus,
  SecurityProject
} from "@/lib/interfaces/app/calendar/calendar_data_types"

type TimeEntryModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  timeEntry?: Partial<TimeEntry>
  availableProjects: SecurityProject[]
  onSave: (timeEntry: Omit<TimeEntry, 'id'>) => void
  onDelete?: (timeEntryId: string) => void
  mode: 'create' | 'edit'
}

export function TimeEntryModal({ 
  open, 
  onOpenChange, 
  timeEntry, 
  availableProjects,
  onSave,
  onDelete,
  mode = 'create'
}: TimeEntryModalProps) {
  const [formData, setFormData] = useState<Partial<TimeEntry>>({
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "17:00",
    category: "operational",
    type: "non-billable",
    taskDescription: "",
    location: "",
    status: "draft",
    duration: 480, // 8 hours default
    isOvertime: false,
    isOnCall: false,
    comments: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (timeEntry && mode === 'edit') {
      setFormData({ ...timeEntry })
    } else if (mode === 'create') {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        startTime: "09:00",
        endTime: "17:00",
        category: "operational",
        type: "non-billable",
        taskDescription: "",
        location: "",
        status: "draft",
        duration: 480,
        isOvertime: false,
        isOnCall: false,
        comments: ""
      })
    }
  }, [timeEntry, mode, open])

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(`2000-01-01T${start}:00`)
    const endTime = new Date(`2000-01-01T${end}:00`)
    let diff = endTime.getTime() - startTime.getTime()
    
    // Handle overnight shifts
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000
    }
    
    return Math.round(diff / (1000 * 60)) // minutes
  }

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newData = { ...formData, [field]: value }
    
    if (newData.startTime && newData.endTime) {
      const duration = calculateDuration(newData.startTime, newData.endTime)
      newData.duration = duration
      newData.isOvertime = duration > 480 // More than 8 hours
    }
    
    setFormData(newData)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.startTime) newErrors.startTime = "Start time is required"
    if (!formData.endTime) newErrors.endTime = "End time is required"
    if (!formData.taskDescription?.trim()) newErrors.taskDescription = "Task description is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (formData.duration && formData.duration <= 0) newErrors.duration = "Duration must be positive"
    if (formData.duration && formData.duration > 1440) newErrors.duration = "Duration cannot exceed 24 hours"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const timeEntryData = {
      ...formData,
      userId: "current-user", // This would come from auth context
      submittedAt: formData.status === 'submitted' ? new Date().toISOString() : undefined
    } as Omit<TimeEntry, 'id'>

    onSave(timeEntryData)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (timeEntry?.id && onDelete) {
      onDelete(timeEntry.id)
      onOpenChange(false)
    }
  }

  const getCategoryColor = (category: ActivityCategory) => {
    const colors = {
      "incident-response": "bg-red-100 text-red-800",
      "security-project": "bg-blue-100 text-blue-800",
      "compliance": "bg-purple-100 text-purple-800",
      "training-development": "bg-green-100 text-green-800",
      "operational-security": "bg-orange-100 text-orange-800",
      "vendor-management": "bg-cyan-100 text-cyan-800",
      "administration": "bg-gray-100 text-gray-800",
      "absence": "bg-pink-100 text-pink-800",
      "operational": "bg-yellow-100 text-yellow-800",
      "project": "bg-indigo-100 text-indigo-800",
      "research": "bg-teal-100 text-teal-800",
      "meeting": "bg-violet-100 text-violet-800",
      "audit": "bg-emerald-100 text-emerald-800"
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            {mode === 'edit' ? 'Edit Time Entry' : 'New Time Entry'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and Time Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime || ''}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                className={errors.startTime ? "border-red-500" : ""}
              />
              {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime || ''}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                className={errors.endTime ? "border-red-500" : ""}
              />
              {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
            </div>
          </div>

          {/* Duration Display */}
          {formData.duration && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Duration: {formatDuration(formData.duration)}</span>
                {formData.isOvertime && (
                  <Badge variant="outline" className="text-orange-600">
                    Overtime
                  </Badge>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Category and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value as ActivityCategory })}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="security-project">Security Project</SelectItem>
                  <SelectItem value="incident-response">Incident Response</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="training-development">Training & Development</SelectItem>
                  <SelectItem value="vendor-management">Vendor Management</SelectItem>
                  <SelectItem value="administration">Administration</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value as TimeEntryType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billable">Billable</SelectItem>
                  <SelectItem value="non-billable">Non-billable</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="absence">Absence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Selection */}
          {formData.type === 'billable' && (
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select 
                value={formData.projectId || ''} 
                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{project.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {project.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="taskDescription">Task Description *</Label>
            <Textarea
              id="taskDescription"
              placeholder="Describe the work performed..."
              value={formData.taskDescription || ''}
              onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
              rows={3}
              className={errors.taskDescription ? "border-red-500" : ""}
            />
            {errors.taskDescription && <p className="text-sm text-red-500">{errors.taskDescription}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                placeholder="Office, Client site, Remote, etc."
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                placeholder="Overtime"
                type="checkbox"
                id="isOnCall"
                checked={formData.isOnCall || false}
                onChange={(e) => setFormData({ ...formData, isOnCall: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isOnCall" className="text-sm">
                On-call duty
              </Label>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Any additional notes..."
              value={formData.comments || ''}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={2}
            />
          </div>

          {/* Status for Edit Mode */}
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as ActivityStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="manager-approved">Manager Approved</SelectItem>
                  <SelectItem value="finance-approved">Finance Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            {mode === 'edit' && onDelete && (
              <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Delete
              </Button>
            )}
            
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {mode === 'edit' ? 'Update' : 'Save'} Entry
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
