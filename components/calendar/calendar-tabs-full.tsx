"use client"
import { useState } from "react"
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
  Edit
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
  mockData_CalendarEvents
} from "@/lib/interfaces/app/calendar/calendar_data_types"

// Enhanced Calendar with Time Tracking features inspired by Atimeüs
export default function CalendarTabsClientFull({ dictionary, locale }: AppComponentDictionaryProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("month")
  const [selectedEvent, setSelectedEvent] = useState<AppCalendarEvent | null>(null)
  const [isTimeTracking, setIsTimeTracking] = useState(false)
  const [currentTimeEntry, setCurrentTimeEntry] = useState<Partial<TimeEntry> | null>(null)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries)
  const [showTimeEntryDialog, setShowTimeEntryDialog] = useState(false)
  const [filterCategory, setFilterCategory] = useState<ActivityCategory | "all">("all")
  const [filterStatus, setFilterStatus] = useState<ActivityStatus | "all">("all")

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
  const stopTimeTracking = () => {
    if (currentTimeEntry) {
      const now = new Date()
      const endTime = now.toTimeString().slice(0, 5)
      
      // Calculate duration
      const start = new Date(`2000-01-01T${currentTimeEntry.startTime}:00`)
      const end = new Date(`2000-01-01T${endTime}:00`)
      const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60))

      const completeEntry: TimeEntry = {
        ...currentTimeEntry,
        endTime,
        duration,
        taskDescription: "",
        location: "",
        status: "draft"
      } as TimeEntry

      setTimeEntries([...timeEntries, completeEntry])
      setCurrentTimeEntry(null)
      setIsTimeTracking(false)
      setShowTimeEntryDialog(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Time Tracking Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Time Tracking Controls
            {isTimeTracking && (
              <Badge variant="secondary" className="ml-2">
                <Clock className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {!isTimeTracking ? (
              <>
                <Button onClick={() => startTimeTracking("incident-response")} variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  Start Incident Response
                </Button>
                <Button onClick={() => startTimeTracking("security-project", "PROJ-2025-001")} variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  Start Project Work
                </Button>
                <Button onClick={() => startTimeTracking("operational-security")} variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  Start Operations
                </Button>
                <Button onClick={() => startTimeTracking("administration")} variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  Start Admin Tasks
                </Button>
              </>
            ) : (
              <Button onClick={stopTimeTracking} variant="destructive" size="sm">
                <StopCircle className="h-4 w-4 mr-1" />
                Stop Tracking ({currentTimeEntry?.category})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Category</Label>
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as ActivityCategory | "all")}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="incident-response">Incident Response</SelectItem>
                  <SelectItem value="security-project">Security Projects</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="training-development">Training</SelectItem>
                  <SelectItem value="operational-security">Operations</SelectItem>
                  <SelectItem value="vendor-management">Vendor Management</SelectItem>
                  <SelectItem value="administration">Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as ActivityStatus | "all")}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="manager-approved">Manager Approved</SelectItem>
                  <SelectItem value="finance-approved">Finance Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredTimeEntries.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No time entries for this date
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
                      <Button variant="outline" size="sm">
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
                      onClick={() => setSelectedEvent(event)}
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

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
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
