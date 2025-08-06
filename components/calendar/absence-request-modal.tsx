"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar,
  Clock, 
  MapPin, 
  Users, 
  Save, 
  X, 
  Edit,
  Timer,
  Play,
  AlertCircle,
  CheckCircle2,
  FileText,
  Video,
  Phone
} from "lucide-react"
import { AbsenceType } from "@/lib/interfaces/app/calendar/calendar_data_types"

type AbsenceRequestModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (request: {
    type: AbsenceType
    startDate: string
    endDate: string
    reason?: string
    halfDay?: boolean
    documents?: File[]
  }) => void
  isSubmitting?: boolean
}

export function AbsenceRequestModal({ 
  open, 
  onOpenChange, 
  onSubmit,
  isSubmitting = false 
}: AbsenceRequestModalProps) {
  const [formData, setFormData] = useState({
    type: "vacation" as AbsenceType,
    startDate: "",
    endDate: "",
    reason: "",
    halfDay: false,
    documents: [] as File[]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const absenceTypes = [
    { value: "vacation", label: "Vacation", description: "Paid time off" },
    { value: "sick", label: "Sick Leave", description: "Medical absence" },
    { value: "rtt", label: "RTT", description: "Reduction of Working Time" },
    { value: "formation", label: "Training", description: "Professional development" },
    { value: "compensatory", label: "Compensatory", description: "Time off in lieu" },
    { value: "unpaid", label: "Unpaid Leave", description: "Unpaid absence" }
  ]

  const calculateWorkingDays = (start: string, end: string, halfDay: boolean) => {
    if (!start || !end) return 0
    
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    
    // Basic calculation - would need more sophisticated logic for holidays/weekends
    const workingDays = diffDays * (5/7) // Rough estimate
    return halfDay ? workingDays / 2 : workingDays
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.endDate) newErrors.endDate = "End date is required"
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date"
    }
    if (formData.type === 'sick' && !formData.reason?.trim()) {
      newErrors.reason = "Reason is required for sick leave"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    
    onSubmit(formData)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData({ ...formData, documents: [...formData.documents, ...files] })
  }

  const removeDocument = (index: number) => {
    const newDocs = formData.documents.filter((_, i) => i !== index)
    setFormData({ ...formData, documents: newDocs })
  }

  const getAbsenceTypeColor = (type: AbsenceType) => {
    const colors = {
      vacation: "bg-blue-100 text-blue-800",
      sick: "bg-red-100 text-red-800",
      rtt: "bg-green-100 text-green-800",
      formation: "bg-purple-100 text-purple-800",
      compensatory: "bg-orange-100 text-orange-800",
      unpaid: "bg-gray-100 text-gray-800"
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const workingDays = calculateWorkingDays(formData.startDate, formData.endDate, formData.halfDay)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Request Time Off
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Absence Type Selection */}
          <div className="space-y-3">
            <Label>Absence Type *</Label>
            <div className="grid grid-cols-2 gap-3">
              {absenceTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.type === type.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, type: type.value as AbsenceType })}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{type.label}</p>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    <Badge className={getAbsenceTypeColor(type.value as AbsenceType)}>
                      {type.value}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          {/* Half Day Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="halfDay"
              title="Half day absence"
              placeholder="Half day absence"
              checked={formData.halfDay}
              onChange={(e) => setFormData({ ...formData, halfDay: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="halfDay" className="text-sm">
              Half day absence
            </Label>
          </div>

          {/* Duration Summary */}
          {formData.startDate && formData.endDate && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>
                    Duration: {workingDays.toFixed(1)} working day{workingDays !== 1 ? 's' : ''}
                    {formData.halfDay && ' (half day)'}
                  </span>
                  <Badge variant="outline">
                    {formData.startDate === formData.endDate ? 'Single day' : 'Multi-day'}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason {formData.type === 'sick' && '*'}
            </Label>
            <Textarea
              id="reason"
              placeholder={
                formData.type === 'sick' 
                  ? "Please provide details about your medical condition..." 
                  : "Optional: Provide additional details..."
              }
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              className={errors.reason ? "border-red-500" : ""}
            />
            {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
          </div>

          {/* Document Upload */}
          {(formData.type === 'sick' || formData.type === 'formation') && (
            <div className="space-y-3">
              <Label>
                Supporting Documents 
                {formData.type === 'sick' && ' (Medical certificate required)'}
              </Label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label 
                  htmlFor="document-upload" 
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FileText className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload documents or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX, JPG, PNG (max 10MB each)
                  </p>
                </label>
              </div>

              {/* Uploaded Documents */}
              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Documents:</p>
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{doc.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(doc.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Approval Workflow Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Approval Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Request submitted to your manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  <span>Manager review and approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  <span>HR notification and calendar update</span>
                </div>
              </div>
              <Alert className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  You will receive email notifications at each step of the approval process.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {formData.type === 'vacation' && "⚠️ Submit at least 2 weeks in advance"}
              {formData.type === 'sick' && "ℹ️ Medical certificate required for absences > 3 days"}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
