"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/use-i18n"
import { FileDto } from "@/lib/interfaces/apis/files"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  StickyNote, 
  Plus, 
  Crown, 
  Bot, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Star,
  Pin,
  Edit3,
  Trash2,
  MoreHorizontal,
  Clock,
  Flag
} from "lucide-react"
import { AppComponentDictionaryPropsWithId } from "@/lib/interfaces/common/dictionary-props-component"
import { formatDistanceToNow } from "date-fns"

interface DocumentImportantNotesProps extends AppComponentDictionaryPropsWithId {
  currentFile: FileDto | null
}

interface ImportantNote {
  id: string
  content: string
  type: "leader" | "ai-agent" | "system" | "user"
  priority: "low" | "medium" | "high" | "critical"
  isPinned: boolean
  authorName: string
  authorRole?: string
  authorAvatar?: string
  createdAt: string
  updatedAt?: string
  tags?: string[]
  documentId: string
  metadata?: {
    aiAgentId?: string
    systemProcess?: string
    relatedSection?: string
  }
}

// Mock data for important notes
const mockImportantNotes: ImportantNote[] = [
  {
    id: "note-1",
    content: "This document contains critical security protocols that must be reviewed monthly. Any changes require approval from the security team.",
    type: "leader",
    priority: "critical",
    isPinned: true,
    authorName: "John Smith",
    authorRole: "Security Director",
    authorAvatar: "/placeholder-user.jpg",
    createdAt: "2024-07-01T09:00:00Z",
    tags: ["security", "compliance", "monthly-review"],
    documentId: "doc-123"
  },
  {
    id: "note-2", 
    content: "AI Analysis: This document shows patterns consistent with outdated procedures. Recommend updating sections 3.2 and 4.1 based on latest industry standards.",
    type: "ai-agent",
    priority: "medium",
    isPinned: false,
    authorName: "Document Assistant AI",
    authorRole: "AI Agent",
    createdAt: "2024-07-03T14:30:00Z",
    tags: ["ai-analysis", "outdated", "recommendation"],
    documentId: "doc-123",
    metadata: {
      aiAgentId: "agent-005",
      relatedSection: "sections-3.2-4.1"
    }
  },
  {
    id: "note-3",
    content: "Please ensure all team members review this before the quarterly meeting on July 15th. This will be referenced in our presentation to stakeholders.",
    type: "leader",
    priority: "high",
    isPinned: true,
    authorName: "Sarah Johnson", 
    authorRole: "Project Manager",
    authorAvatar: "/placeholder-user.jpg",
    createdAt: "2024-07-02T11:15:00Z",
    tags: ["quarterly-meeting", "stakeholders", "deadline"],
    documentId: "doc-123"
  },
  {
    id: "note-4",
    content: "Version control system has automatically flagged this document for backup. Last backup completed successfully at 2024-07-04 02:00 UTC.",
    type: "system",
    priority: "low",
    isPinned: false,
    authorName: "Backup System",
    authorRole: "System Process",
    createdAt: "2024-07-04T02:00:00Z",
    tags: ["backup", "version-control", "automated"],
    documentId: "doc-123",
    metadata: {
      systemProcess: "backup-service"
    }
  }
]

export default function DocumentImportantNotes({ dictionary, locale, id, currentFile }: DocumentImportantNotesProps) {
  const { t } = useI18n(dictionary)
  
  const [notes, setNotes] = useState<ImportantNote[]>(mockImportantNotes)
  const [filteredNotes, setFilteredNotes] = useState<ImportantNote[]>(mockImportantNotes)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNotePriority, setNewNotePriority] = useState<ImportantNote["priority"]>("medium")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  useEffect(() => {
    let filtered = notes

    if (filterType !== "all") {
      filtered = filtered.filter(note => note.type === filterType)
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter(note => note.priority === filterPriority)
    }

    // Sort by pinned first, then by creation date (newest first)
    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    setFilteredNotes(filtered)
  }, [notes, filterType, filterPriority])

  const getAuthorIcon = (type: ImportantNote["type"]) => {
    switch (type) {
      case "leader":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "ai-agent":
        return <Bot className="h-4 w-4 text-blue-500" />
      case "system":
        return <Info className="h-4 w-4 text-gray-500" />
      default:
        return <StickyNote className="h-4 w-4 text-green-500" />
    }
  }

  const getPriorityIcon = (priority: ImportantNote["priority"]) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "high":
        return <Flag className="h-4 w-4 text-orange-500" />
      case "medium":
        return <Info className="h-4 w-4 text-blue-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityBadgeVariant = (priority: ImportantNote["priority"]) => {
    switch (priority) {
      case "critical":
        return "destructive" as const
      case "high":
        return "default" as const
      case "medium":
        return "secondary" as const
      case "low":
        return "outline" as const
      default:
        return "outline" as const
    }
  }

  const getTypeLabel = (type: ImportantNote["type"]) => {
    switch (type) {
      case "leader":
        return t('documents.notes.types.leader') || "Leadership Note"
      case "ai-agent":
        return t('documents.notes.types.aiAgent') || "AI Analysis"
      case "system":
        return t('documents.notes.types.system') || "System Note"
      default:
        return t('documents.notes.types.user') || "User Note"
    }
  }

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return

    const newNote: ImportantNote = {
      id: `note-${Date.now()}`,
      content: newNoteContent,
      type: "user",
      priority: newNotePriority,
      isPinned: false,
      authorName: "Current User",
      authorRole: "User",
      createdAt: new Date().toISOString(),
      tags: [],
      documentId: id
    }

    setNotes([newNote, ...notes])
    setNewNoteContent("")
    setNewNotePriority("medium")
    setIsAddModalOpen(false)
  }

  const handleTogglePin = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, isPinned: !note.isPinned }
        : note
    ))
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }

  const pinnedNotes = filteredNotes.filter(note => note.isPinned)
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned)

  return (
    <div className="space-y-6">
      {/* Header with Add Note Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{t('documents.notes.title') || 'Important Notes'}</h3>
          <p className="text-sm text-muted-foreground">
            {t('documents.notes.description') || 'Key notes from leadership and AI agents about this document'}
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('documents.notes.addNote') || 'Add Note'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('documents.notes.addNewNote') || 'Add New Note'}</DialogTitle>
              <DialogDescription>
                {t('documents.notes.addDescription') || 'Add an important note about this document'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Note Content</label>
                <Textarea
                  placeholder="Enter your note here..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority Level</label>
                <Select value={newNotePriority} onValueChange={(value: ImportantNote["priority"]) => setNewNotePriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Low Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        Medium Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-orange-500" />
                        High Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Critical Priority
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNote}>
                  <StickyNote className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="leader">Leadership</SelectItem>
              <SelectItem value="ai-agent">AI Agent</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {filteredNotes.length} notes ({pinnedNotes.length} pinned)
        </div>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Pin className="h-4 w-4" />
            {t('documents.notes.pinnedNotes') || 'Pinned Notes'}
          </h4>
          {pinnedNotes.map((note) => (
            <Card key={note.id} className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={note.authorAvatar} alt={note.authorName} />
                        <AvatarFallback className="text-xs">
                          {note.authorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{note.authorName}</span>
                      {note.authorRole && (
                        <Badge variant="outline" className="text-xs">
                          {getAuthorIcon(note.type)}
                          <span className="ml-1">{note.authorRole}</span>
                        </Badge>
                      )}
                      <Badge variant={getPriorityBadgeVariant(note.priority)} className="text-xs">
                        {getPriorityIcon(note.priority)}
                        <span className="ml-1 capitalize">{note.priority}</span>
                      </Badge>
                      {note.isPinned && (
                        <Badge variant="secondary" className="text-xs">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mb-2">{note.content}</p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex gap-1 mb-2">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                      <span>•</span>
                      <span>{getTypeLabel(note.type)}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleTogglePin(note.id)}>
                        <Pin className="h-4 w-4 mr-2" />
                        {note.isPinned ? 'Unpin Note' : 'Pin Note'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Note
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Note
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Regular Notes */}
      <div className="space-y-3">
        {pinnedNotes.length > 0 && (
          <h4 className="font-medium">{t('documents.notes.allNotes') || 'All Notes'}</h4>
        )}
        {unpinnedNotes.map((note) => (
          <Card key={note.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={note.authorAvatar} alt={note.authorName} />
                      <AvatarFallback className="text-xs">
                        {note.authorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{note.authorName}</span>
                    {note.authorRole && (
                      <Badge variant="outline" className="text-xs">
                        {getAuthorIcon(note.type)}
                        <span className="ml-1">{note.authorRole}</span>
                      </Badge>
                    )}
                    <Badge variant={getPriorityBadgeVariant(note.priority)} className="text-xs">
                      {getPriorityIcon(note.priority)}
                      <span className="ml-1 capitalize">{note.priority}</span>
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{note.content}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1 mb-2">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                    <span>•</span>
                    <span>{getTypeLabel(note.type)}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleTogglePin(note.id)}>
                      <Pin className="h-4 w-4 mr-2" />
                      Pin Note
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Note
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Note
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-muted-foreground mb-2">
              {t('documents.notes.noNotes') || 'No notes found'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t('documents.notes.noNotesDescription') || 'Add the first note to help others understand important information about this document.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
