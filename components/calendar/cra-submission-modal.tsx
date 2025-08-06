"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  Download, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Calendar,
  User
} from "lucide-react"
import { MonthlyCRA, TimeEntry, ActivityCategory } from "@/lib/interfaces/app/calendar/calendar_data_types"

/*
| {
    month: string
    timeEntries: TimeEntry[]
    totalHours: number
    billableHours: number
    nonBillableHours: number
    taceScore: number
  }
*/
type CRASubmissionModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  monthlyData: MonthlyCRA ;
  onSubmit: (data: { comments?: string; requestPdfExport: boolean }) => void
  isSubmitting?: boolean
}

export function CRASubmissionModal({ 
  open, 
  onOpenChange, 
  monthlyData, 
  onSubmit,
  isSubmitting = false 
}: CRASubmissionModalProps) {
  const [comments, setComments] = useState("")
  const [requestPdfExport, setRequestPdfExport] = useState(true)

  const categoryBreakdown = monthlyData.timeEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.duration
    return acc
  }, {} as Record<ActivityCategory, number>)

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`
  }

  const getMonthName = (monthStr: string) => {
    const date = new Date(monthStr + "-01")
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const handleSubmit = () => {
    onSubmit({ comments, requestPdfExport })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submit Monthly CRA - {getMonthName(monthlyData.month)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                    <p className="text-2xl font-bold">{formatHours(monthlyData.totalHours)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Billable Hours</p>
                    <p className="text-2xl font-bold text-green-600">{formatHours(monthlyData.billableHours)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Non-Billable</p>
                    <p className="text-2xl font-bold text-orange-600">{formatHours(monthlyData.nonBillableHours)}</p>
                  </div>
                  <User className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">TACE Score</p>
                    <p className="text-2xl font-bold text-purple-600">{monthlyData.taceScore}%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Time Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryBreakdown).map(([category, minutes]) => {
                  const percentage = ((minutes / monthlyData.totalHours) * 100).toFixed(1)
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="min-w-[140px] justify-start">
                          {category.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px]">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="font-medium">{formatHours(minutes)}</div>
                        <div className="text-sm text-muted-foreground">{percentage}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Time Entries Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Time Entries Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Entries:</span>
                  <span className="font-medium">{monthlyData.timeEntries.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Days with Entries:</span>
                  <span className="font-medium">
                    {new Set(monthlyData.timeEntries.map(e => e.date)).size}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Hours/Day:</span>
                  <span className="font-medium">
                    {((monthlyData.totalHours / 60) / new Set(monthlyData.timeEntries.map(e => e.date)).size).toFixed(1)}h
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-2">
            <Label htmlFor="cra-comments">Additional Comments (Optional)</Label>
            <Textarea
              id="cra-comments"
              placeholder="Add any additional comments about your monthly activity report..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                    placeholder="Generate PDF"
                  type="checkbox"
                  id="pdf-export"
                  checked={requestPdfExport}
                  onChange={(e) => setRequestPdfExport(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="pdf-export" className="text-sm">
                  Generate PDF report for client sharing
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Validation Messages */}
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Your CRA is ready for submission. All required time entries are complete and have been validated.
            </AlertDescription>
          </Alert>

          <Separator />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Preview PDF
              </Button>
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
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? 'Submitting...' : 'Submit CRA'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
