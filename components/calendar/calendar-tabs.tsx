"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CalendarIcon, 
  Clock, 
  Users, 
  MapPin, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  UserPlus,
  Timer,
  Play,
  Pause,
  StopCircle,
  FileText,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Loader2,
  RefreshCw
} from "lucide-react"
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component"
import { 
  AppCalendarEvent, 
  TimeEntry,
  mockTimeEntries,
  SecurityProject,
  mockSecurityProjects,
  ActivityCategory,
  TimeEntryType,
  ActivityStatus,
  AbsenceType,
  mockData_CalendarEvents,
  MonthlyCRA
} from "@/lib/interfaces/app/calendar/calendar_data_types"
import { TimeEntryAPI } from "@/lib/api/timeEntry"
import { CRASubmissionModal } from "./cra-submission-modal"
import { TimeEntryModal } from "./time-entry-modal"
import { AbsenceRequestModal } from "./absence-request-modal"
import { EventDetailsModal } from "./event-details-modal"

// Enhanced Calendar with Time Tracking features inspired by Atimeüs
export default function CalendarTabsClient({ dictionary, locale }: AppComponentDictionaryProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("month")
  const [selectedEvent, setSelectedEvent] = useState<AppCalendarEvent | null>(null)
  const [isTimeTracking, setIsTimeTracking] = useState(false)
  const [currentTimeEntry, setCurrentTimeEntry] = useState<Partial<TimeEntry> | null>(null)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [showTimeEntryDialog, setShowTimeEntryDialog] = useState(false)
  const [filterCategory, setFilterCategory] = useState<ActivityCategory | "all">("all")
  const [filterStatus, setFilterStatus] = useState<ActivityStatus | "all">("all")
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTimeEntries, setIsLoadingTimeEntries] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [monthlyEntries, setMonthlyEntries] = useState<MonthlyCRA | null>(null)

  // Modal states
  const [showCRAModal, setShowCRAModal] = useState(false)
  const [showTimeEntryModal, setShowTimeEntryModal] = useState(false)
  const [showAbsenceModal, setShowAbsenceModal] = useState(false)
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false)
  const [editingTimeEntry, setEditingTimeEntry] = useState<TimeEntry | null>(null)
  const [isSubmittingCRA, setIsSubmittingCRA] = useState(false)

  // Current user ID (in a real app, this would come from auth context)
  const currentUserId = "user-001"

  // Load time entries when component mounts or date changes
  useEffect(() => {
    loadTimeEntries();
    generateMonthlyCRAData();
  }, [date, filterCategory, filterStatus])

  // API Functions
  const loadTimeEntries = async () => {
    setIsLoadingTimeEntries(true)
    setError(null)
    
    try {
      const response = await TimeEntryAPI.getTimeEntries({
        userId: currentUserId,
        date: date?.toISOString().split("T")[0],
        category: filterCategory === "all" ? undefined : filterCategory,
        status: filterStatus === "all" ? undefined : filterStatus
      })

      if (response.success && response.data) {
        setTimeEntries(response.data.timeEntries)
      } else {
        setError(response.error || "Failed to load time entries")
      }
    } catch (err) {
      setError("Network error while loading time entries")
      console.error("Error loading time entries:", err)
    } finally {
      setIsLoadingTimeEntries(false)
    }
  }

  const refreshTimeEntries = () => {
    loadTimeEntries();
    generateMonthlyCRAData();
  }

  // Filter events based on selected date and filters
  const selectedDateStr = date ? date.toISOString().split("T")[0] : ""
  const filteredEvents = mockData_CalendarEvents.filter((event) => {
    const matchesDate = event.date === selectedDateStr
    const matchesCategory = filterCategory === "all" || event.category === filterCategory
    return matchesDate && matchesCategory
  })

  // Filter time entries
  const filteredTimeEntries = timeEntries.filter((entry) => {
    const matchesDate = entry.date === selectedDateStr
    const matchesCategory = filterCategory === "all" || entry.category === filterCategory
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus
    return matchesDate && matchesCategory && matchesStatus
  })

  // Priority colors
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  // Category colors
  const getCategoryColor = (category?: ActivityCategory) => {
    switch (category) {
      case "incident-response": return "bg-red-100 text-red-800"
      case "security-project": return "bg-blue-100 text-blue-800"
      case "compliance": return "bg-purple-100 text-purple-800"
      case "training-development": return "bg-green-100 text-green-800"
      case "operational-security": return "bg-orange-100 text-orange-800"
      case "vendor-management": return "bg-cyan-100 text-cyan-800"
      case "administration": return "bg-gray-100 text-gray-800"
      case "absence": return "bg-pink-100 text-pink-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Status colors
  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800"
      case "submitted": return "bg-blue-100 text-blue-800"
      case "manager-approved": return "bg-green-100 text-green-800"
      case "finance-approved": return "bg-emerald-100 text-emerald-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Start time tracking
  const startTimeTracking = (category: ActivityCategory, projectId?: string) => {
    const now = new Date()
    setCurrentTimeEntry({
      id: `TE-${Date.now()}`,
      userId: "current-user",
      date: now.toISOString().split("T")[0],
      startTime: now.toTimeString().slice(0, 5),
      category,
      type: projectId ? "billable" : "non-billable",
      projectId,
      status: "draft"
    })
    setIsTimeTracking(true)
  }

  // Stop time tracking
  const stopTimeTracking = async () => {
    if (currentTimeEntry) {
      const now = new Date()
      const endTime = now.toTimeString().slice(0, 5)
      
      // Calculate duration
      const start = new Date(`2000-01-01T${currentTimeEntry.startTime}:00`)
      const end = new Date(`2000-01-01T${endTime}:00`)
      let diff = end.getTime() - start.getTime()
      
      // Handle overnight shifts
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000
      }
      
      const duration = Math.round(diff / (1000 * 60)) // minutes

      // Create the complete entry
      const completeEntryData = {
        ...currentTimeEntry,
        userId: currentUserId,
        endTime,
        duration,
        taskDescription: "",
        location: "",
        status: "draft" as ActivityStatus
      } as Omit<TimeEntry, 'id'>

      // Save to API first
      try {
        setIsLoading(true)
        const response = await TimeEntryAPI.createTimeEntry(completeEntryData)
        if (response.success && response.data) {
          setEditingTimeEntry(response.data)
          setCurrentTimeEntry(null)
          setIsTimeTracking(false)
          setShowTimeEntryModal(true)
          await refreshTimeEntries()
        } else {
          setError(response.error || "Failed to save time tracking session")
        }
      } catch (err) {
        setError("Network error while saving time tracking")
        console.error("Error saving time tracking:", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // CRA Submission handlers
  const handleCRASubmission = async (data: { comments?: string; requestPdfExport: boolean }) => {
    setIsSubmittingCRA(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('CRA submitted:', data)
      setShowCRAModal(false)
    } catch (error) {
      console.error('Error submitting CRA:', error)
    } finally {
      setIsSubmittingCRA(false)
    }
  }

  // Time Entry handlers
  const handleTimeEntrySave = async (timeEntryData: Omit<TimeEntry, 'id'>) => {
    setIsLoading(true)
    setError(null)

    try {
      if (editingTimeEntry) {
        // Update existing entry
        const response = await TimeEntryAPI.updateTimeEntry(editingTimeEntry.id, timeEntryData)
        if (response.success) {
          await refreshTimeEntries()
          setEditingTimeEntry(null)
          // Show success message (you could add a toast here)
        } else {
          setError(response.error || "Failed to update time entry")
        }
      } else {
        // Create new entry
        const response = await TimeEntryAPI.createTimeEntry({
          ...timeEntryData,
          userId: currentUserId
        })
        if (response.success) {
          await refreshTimeEntries()
          // Show success message
        } else {
          setError(response.error || "Failed to create time entry")
        }
      }
    } catch (err) {
      setError("Network error while saving time entry")
      console.error("Error saving time entry:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTimeEntryDelete = async (timeEntryId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await TimeEntryAPI.deleteTimeEntry(timeEntryId)
      if (response.success) {
        await refreshTimeEntries()
        // Show success message
      } else {
        setError(response.error || "Failed to delete time entry")
      }
    } catch (err) {
      setError("Network error while deleting time entry")
      console.error("Error deleting time entry:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Absence Request handler
  const handleAbsenceRequest = async (request: {
    type: AbsenceType
    startDate: string
    endDate: string
    reason?: string
    halfDay?: boolean
    documents?: File[]
  }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Absence request submitted:', request)
      setShowAbsenceModal(false)
    } catch (error) {
      console.error('Error submitting absence request:', error)
    }
  }

  // Event handlers
  const handleEditEvent = (event: AppCalendarEvent) => {
    console.log('Edit event:', event)
    setShowEventDetailsModal(false)
    // Would open event edit modal here
  }

  const handleJoinMeeting = (event: AppCalendarEvent) => {
    console.log('Join meeting:', event)
    // Would open meeting link here
    window.open('#', '_blank')
  }

  // Generate monthly CRA data
  const generateMonthlyCRAData = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const startDate = `${currentMonth}-01`
    const endDate = `${currentMonth}-31`
    
    try {
      const response = await TimeEntryAPI.getTimeEntryStats({
        userId: currentUserId,
        startDate,
        endDate
      })
      
      if (response.success && response.data) {
        const monthlyState = {
          month: currentMonth,
          timeEntries: timeEntries.filter(entry => entry.date.startsWith(currentMonth)),
          totalHours: response.data.totalHours,
          billableHours: response.data.billableHours,
          nonBillableHours: response.data.nonBillableHours,
          taceScore: Math.round((response.data.totalHours / (22 * 8 * 60)) * 100) // Approximate TACE calculation
        } as MonthlyCRA ;
        setMonthlyEntries(monthlyState)
        return monthlyState
      }
    } catch (error) {
      console.error("Error generating CRA data:", error)
    }
    
    // Fallback to basic calculation if API fails
    const monthlyEntries = timeEntries.filter(entry => entry.date.startsWith(currentMonth))
    const totalMinutes = monthlyEntries.reduce((sum, entry) => sum + entry.duration, 0)
    const billableMinutes = monthlyEntries
      .filter(entry => entry.type === 'billable')
      .reduce((sum, entry) => sum + entry.duration, 0)
    const nonBillableMinutes = totalMinutes - billableMinutes
    
    const workingDaysInMonth = 22 // Approximate
    const expectedHours = workingDaysInMonth * 8 * 60 // in minutes
    const taceScore = Math.round((totalMinutes / expectedHours) * 100)
    const monthlyState = {
          month: currentMonth,
          timeEntries: monthlyEntries,
          totalHours: totalMinutes,
          billableHours: billableMinutes,
          nonBillableHours: nonBillableMinutes,
          taceScore
        } as MonthlyCRA ;
        setMonthlyEntries(monthlyState)
    return monthlyState
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setError(null)
                refreshTimeEntries()
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Processing request...
          </AlertDescription>
        </Alert>
      )}
       
      {/* Main Tabs */}
      <Tabs defaultValue="calendar" onValueChange={setView}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="timesheet">Time Sheet</TabsTrigger>
            <TabsTrigger value="cra">Monthly CRA</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setDate(new Date())}>
              {dictionary.dates?.today || "Today"}
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAbsenceModal(true)}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Request Time Off
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <TabsContent value="calendar" className="mt-0">
              <Card>
                <CardContent className="p-4">
                  <Calendar 
                    mode="single" 
                    selected={date} 
                    onSelect={setDate} 
                    className="rounded-md border w-full"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timesheet" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Time Sheet - {selectedDateStr}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTimeEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getCategoryColor(entry.category)}>
                              {entry.category}
                            </Badge>
                            <Badge className={getStatusColor(entry.status)}>
                              {entry.status}
                            </Badge>
                            {entry.type === "billable" && (
                              <Badge variant="outline" className="text-green-600">
                                Billable
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium">{entry.taskDescription}</p>
                          <p className="text-sm text-gray-600">
                            {entry.startTime} - {entry.endTime} • {formatDuration(entry.duration)}
                          </p>
                          {entry.location && (
                            <p className="text-sm text-gray-500">📍 {entry.location}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingTimeEntry(entry)
                              setShowTimeEntryModal(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredTimeEntries.length === 0 && (                    <div className="text-center py-8 text-gray-500">
                      No time entries for this date
                      <div className="mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingTimeEntry(null)
                            setShowTimeEntryModal(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Time Entry
                        </Button>
                      </div>
                    </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cra" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Monthly CRA Summary
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowCRAModal(true)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Submit CRA
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">152h</div>
                      <div className="text-sm text-gray-600">Total Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">128h</div>
                      <div className="text-sm text-gray-600">Billable Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">24h</div>
                      <div className="text-sm text-gray-600">Non-Billable</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">84%</div>
                      <div className="text-sm text-gray-600">TACE Score</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Security Projects</span>
                      <span className="font-medium">45h (30%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Incident Response</span>
                      <span className="font-medium">32h (21%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Compliance</span>
                      <span className="font-medium">28h (18%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Operations</span>
                      <span className="font-medium">25h (16%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Training</span>
                      <span className="font-medium">15h (10%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Administration</span>
                      <span className="font-medium">7h (5%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Time Analytics & TACE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Weekly Utilization</h3>
                      <div className="space-y-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                          <div key={day} className="flex items-center gap-3">
                            <span className="w-12 text-sm">{day}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${85 + index * 3}%` }}
                              />
                            </div>
                            <span className="text-sm w-12">{85 + index * 3}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Category Distribution</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Projects</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Incidents</span>
                            <span className="text-sm font-medium">21%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Compliance</span>
                            <span className="text-sm font-medium">18%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Operations</span>
                            <span className="text-sm font-medium">16%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Training</span>
                            <span className="text-sm font-medium">10%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Admin</span>
                            <span className="text-sm font-medium">5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Active Security Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSecurityProjects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{project.name}</h3>
                          <Badge variant={project.status === "active" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress: {project.actualHours}h / {project.estimatedHours}h</span>
                          <span className={project.isBillable ? "text-green-600" : "text-gray-600"}>
                            {project.isBillable ? "Billable" : "Internal"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${Math.min((project.actualHours / project.estimatedHours) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Events & Details Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Events for {selectedDateStr}
                  <Badge variant="outline">{filteredEvents.length} events</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setSelectedEvent(event)
                        setShowEventDetailsModal(true)
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(event.priority)}`} />
                            <h3 className="font-medium">{event.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                            {event.duration && (
                              <span className="flex items-center gap-1">
                                <Timer className="h-4 w-4" />
                                {formatDuration(event.duration)}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {event.category && (
                              <Badge className={getCategoryColor(event.category)}>
                                {event.category}
                              </Badge>
                            )}
                            {event.tags?.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (event.category) {
                              startTimeTracking(event.category, event.projectId)
                            }
                          }}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Track Time
                        </Button>
                        {event.attendees.length > 0 && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendees.length} attendees
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredEvents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No events for selected date and filters
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>

      {/* Modal Components */}
      {   monthlyEntries  &&  monthlyEntries != null && (
      <CRASubmissionModal
        open={showCRAModal}
        onOpenChange={setShowCRAModal}
        monthlyData={monthlyEntries}
        onSubmit={handleCRASubmission}
        isSubmitting={isSubmittingCRA}
      />
      )}

      <TimeEntryModal
        open={showTimeEntryModal}
        onOpenChange={(open) => {
          setShowTimeEntryModal(open)
          if (!open) setEditingTimeEntry(null)
        }}
        timeEntry={editingTimeEntry || undefined}
        availableProjects={mockSecurityProjects}
        onSave={handleTimeEntrySave}
        onDelete={handleTimeEntryDelete}
        mode={editingTimeEntry ? 'edit' : 'create'}
      />

      <AbsenceRequestModal
        open={showAbsenceModal}
        onOpenChange={setShowAbsenceModal}
        onSubmit={handleAbsenceRequest}
      />

      <EventDetailsModal
        open={showEventDetailsModal}
        onOpenChange={setShowEventDetailsModal}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onStartTimeTracking={startTimeTracking}
        onJoinMeeting={handleJoinMeeting}
      />

      {/* Time Tracking Overlay */}
      {isTimeTracking && currentTimeEntry && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="font-medium">Tracking: {currentTimeEntry.category}</span>
            </div>
            <div className="text-sm opacity-90">
              Started: {currentTimeEntry.startTime}
            </div>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={stopTimeTracking}
              className="flex items-center gap-1"
            >
              <StopCircle className="h-3 w-3" />
              Stop
            </Button>
          </div>
        </div>
      )}

      {/* Event Details Dialog - Legacy (kept for compatibility) */}
      {selectedEvent && !showEventDetailsModal && (
        <Dialog open={!!selectedEvent && !showEventDetailsModal} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedEvent.priority)}`} />
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date & Time</Label>
                  <p>{selectedEvent.date} • {selectedEvent.time}</p>
                </div>
                <div>
                  <Label>Duration</Label>
                  <p>{selectedEvent.duration ? formatDuration(selectedEvent.duration) : "Not specified"}</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p>{selectedEvent.location}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <Badge className={getCategoryColor(selectedEvent.category)}>
                    {selectedEvent.category}
                  </Badge>
                </div>
              </div>
              {selectedEvent.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                </div>
              )}
              {selectedEvent.attendees.length > 0 && (
                <div>
                  <Label>Attendees ({selectedEvent.attendees.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedEvent.attendees.map((attendee) => (
                      <Badge key={attendee} variant="outline">{attendee}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedEvent.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
  
function EventCard({ event, dictionary }: { event: AppCalendarEvent, dictionary: any }) {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "workshop":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "planning":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "training":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "virtual":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{event.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground mt-1">
              <div className="flex items-center">
                <CalendarIcon className="h-3.5 w-3.5 mr-2" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
        <div className="mt-3 flex items-center">
          <Users className="h-4 w-4 text-muted-foreground mr-2" />
          <div className="flex -space-x-2">
            {event.attendees.slice(0, 3).map((attendee, index) => (
              <div
                key={index}
                className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs ring-2 ring-background"
              >
                {attendee.charAt(0)}
              </div>
            ))}
            {event.attendees.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs ring-2 ring-background">
                +{event.attendees.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
