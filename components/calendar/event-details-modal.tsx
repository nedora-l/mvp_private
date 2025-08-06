"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar,  AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar,
  Clock, 
  MapPin, 
  Users, 
  Edit,
  Timer,
  Play,
  Video,
  Phone,
  FileText,
  ExternalLink,
  MessageSquare,
  Bell,
  Share2
} from "lucide-react"
import { AppCalendarEvent, ActivityCategory } from "@/lib/interfaces/app/calendar/calendar_data_types"

type EventDetailsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: AppCalendarEvent | null
  onEdit?: (event: AppCalendarEvent) => void
  onStartTimeTracking?: (category: ActivityCategory, projectId?: string) => void
  onJoinMeeting?: (event: AppCalendarEvent) => void
}

export function EventDetailsModal({ 
  open, 
  onOpenChange, 
  event,
  onEdit,
  onStartTimeTracking,
  onJoinMeeting
}: EventDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("details")

  if (!event) return null

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getCategoryColor = (category?: ActivityCategory) => {
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
    return colors[category!] || "bg-gray-100 text-gray-800"
  }

  const isVirtualMeeting = event.location?.toLowerCase().includes('teams') || 
                          event.location?.toLowerCase().includes('zoom') || 
                          event.location?.toLowerCase().includes('virtual')

  const mockComments = [
    {
      author: "John Doe",
      time: "2 hours ago",
      message: "I've prepared the security assessment checklist for this meeting."
    },
    {
      author: "Jane Smith", 
      time: "1 hour ago",
      message: "Great! I'll bring the compliance documentation we discussed."
    }
  ]

  const mockRelatedEvents = [
    {
      id: "related-1",
      title: "Follow-up: Security Review",
      date: "2025-07-16",
      time: "10:00 AM"
    },
    {
      id: "related-2", 
      title: "Project Status Update",
      date: "2025-07-18",
      time: "2:00 PM"
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${getPriorityColor(event.priority)}`} />
            <span className="flex-1">{event.title}</span>
            {event.category && (
              <Badge className={getCategoryColor(event.category)}>
                {event.category.replace('-', ' ')}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {isVirtualMeeting && onJoinMeeting && (
                <Button 
                  onClick={() => onJoinMeeting(event)}
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Join Meeting
                </Button>
              )}
              
              {event.category && onStartTimeTracking && (
                <Button 
                  variant="outline"
                  onClick={() => onStartTimeTracking(event.category!, event.projectId)}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Tracking
                </Button>
              )}
              
              {onEdit && (
                <Button 
                  variant="outline"
                  onClick={() => onEdit(event)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Event
                </Button>
              )}

              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Event Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date & Time */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  {event.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Duration: {formatDuration(event.duration)}</span>
                    </div>
                  )}
                  {event.isRecurring && (
                    <Badge variant="outline" className="w-fit">
                      Recurring: {event.recurringPattern}
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    {isVirtualMeeting ? (
                      <Video className="h-4 w-4 text-blue-500 mt-0.5" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    )}
                    <div>
                      <p>{event.location}</p>
                      {isVirtualMeeting && (
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-blue-600"
                          onClick={() => onJoinMeeting?.(event)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Join Meeting
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {event.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Project & Client Info */}
            {(event.projectId || event.clientId) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {event.projectId && (
                    <div>
                      <span className="text-sm font-medium">Project: </span>
                      <Badge variant="outline">{event.projectId}</Badge>
                    </div>
                  )}
                  {event.clientId && (
                    <div>
                      <span className="text-sm font-medium">Client: </span>
                      <Badge variant="outline">{event.clientId}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="attendees" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Attendees ({event.attendees.length})
              </h3>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Send Reminder
              </Button>
            </div>

            <div className="grid gap-3">
              {event.attendees.map((attendee, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {attendee.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{attendee}</p>
                          <p className="text-sm text-muted-foreground">
                            {attendee.includes('@') ? attendee : `${attendee}@company.com`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">
                          Accepted
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Comments & Notes</h3>
              <Button size="sm" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Add Comment
              </Button>
            </div>

            <div className="space-y-4">
              {mockComments.map((comment, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {comment.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="related" className="space-y-4">
            <h3 className="text-lg font-semibold">Related Events</h3>
            
            <div className="space-y-3">
              {mockRelatedEvents.map((relatedEvent) => (
                <Card key={relatedEvent.id} className="cursor-pointer hover:bg-accent/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{relatedEvent.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {relatedEvent.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relatedEvent.time}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Created: {event.date} • Priority: {event.priority || 'medium'}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {onEdit && (
              <Button onClick={() => onEdit(event)} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Event
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
