"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Briefcase,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart,
  Send,
  Paperclip,
  Search,
  Mail,
  Phone,
  UserPlus,
} from "lucide-react"

// Mock data for the team
const teamData = {
  id: 1,
  name: "Product Development",
  description:
    "The Product Development team is responsible for designing, developing, and maintaining our company's products. We work closely with Marketing, Sales, and Customer Support to ensure our products meet customer needs and market demands.",
  members: [
    {
      id: 1,
      name: "Alex Rivera",
      role: "Team Lead",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
      email: "alex.rivera@company.com",
      phone: "(+212) 06 345-6789",
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      role: "Product Manager",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27470341_7294795.jpg-XE0zf7R8tk4rfA1vm4fAHeZ1QoVEOo.jpeg",
      email: "emily.rodriguez@company.com",
      phone: "(+212) 06 890-1234",
    },
    {
      id: 3,
      name: "Robert Davis",
      role: "Senior Software Engineer",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
      email: "robert.davis@company.com",
      phone: "(+212) 06 789-0123",
    },
    {
      id: 4,
      name: "Jessica Chen",
      role: "UX Designer",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/799.jpg-0tEi4Xvg5YsFoGoQfQc698q4Dygl1S.jpeg",
      email: "jessica.chen@company.com",
      phone: "(+212) 06 901-2345",
    },
    {
      id: 5,
      name: "Michael Johnson",
      role: "Software Engineer",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
      email: "michael.johnson@company.com",
      phone: "(+212) 06 234-5678",
    },
  ],
  projects: [
    {
      id: 1,
      name: "New Product Launch",
      progress: 90,
      status: "In Progress",
      dueDate: "Jul 30, 2023",
      priority: "High",
    },
    {
      id: 2,
      name: "Mobile App Redesign",
      progress: 60,
      status: "In Progress",
      dueDate: "Aug 20, 2023",
      priority: "Medium",
    },
    {
      id: 3,
      name: "API Integration",
      progress: 40,
      status: "In Progress",
      dueDate: "Sep 10, 2023",
      priority: "Medium",
    },
    {
      id: 4,
      name: "User Testing",
      progress: 20,
      status: "Not Started",
      dueDate: "Sep 25, 2023",
      priority: "Low",
    },
    {
      id: 5,
      name: "Product Roadmap 2024",
      progress: 10,
      status: "Planning",
      dueDate: "Oct 15, 2023",
      priority: "High",
    },
  ],
  documents: [
    {
      id: 1,
      name: "Product Requirements Document.docx",
      type: "doc",
      size: "1.2 MB",
      updatedAt: "Yesterday, 2:30 PM",
      updatedBy: "Alex Rivera",
    },
    {
      id: 2,
      name: "UI Design Mockups.zip",
      type: "zip",
      size: "15.7 MB",
      updatedAt: "Jul 15, 2023",
      updatedBy: "Jessica Chen",
    },
    {
      id: 3,
      name: "API Documentation.pdf",
      type: "pdf",
      size: "3.5 MB",
      updatedAt: "Jul 10, 2023",
      updatedBy: "Robert Davis",
    },
    {
      id: 4,
      name: "Project Timeline.xlsx",
      type: "spreadsheet",
      size: "0.9 MB",
      updatedAt: "Jul 8, 2023",
      updatedBy: "Emily Rodriguez",
    },
    {
      id: 5,
      name: "Team Meeting Notes.docx",
      type: "doc",
      size: "0.7 MB",
      updatedAt: "Jul 5, 2023",
      updatedBy: "Michael Johnson",
    },
  ],
  discussions: [
    {
      id: 1,
      user: {
        name: "Alex Rivera",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
      },
      message: "Team, I've just uploaded the updated product requirements document. Please review it by tomorrow.",
      timestamp: "Today, 10:30 AM",
      replies: 3,
    },
    {
      id: 2,
      user: {
        name: "Jessica Chen",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/799.jpg-0tEi4Xvg5YsFoGoQfQc698q4Dygl1S.jpeg",
      },
      message:
        "The new UI mockups are ready for review. I've incorporated the feedback from our last meeting. Let me know what you think!",
      timestamp: "Yesterday, 3:45 PM",
      replies: 5,
    },
    {
      id: 3,
      user: {
        name: "Emily Rodriguez",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27470341_7294795.jpg-XE0zf7R8tk4rfA1vm4fAHeZ1QoVEOo.jpeg",
      },
      message:
        "Just a reminder that we have a client demo scheduled for next Thursday. Let's make sure everything is ready by Tuesday for internal review.",
      timestamp: "Jul 15, 2023",
      replies: 2,
    },
  ],
  activity: [
    {
      user: {
        name: "Robert Davis",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
      },
      action: "completed task",
      target: "Update API documentation",
      project: "API Integration",
      time: "1 hour ago",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    {
      user: {
        name: "Jessica Chen",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/799.jpg-0tEi4Xvg5YsFoGoQfQc698q4Dygl1S.jpeg",
      },
      action: "added file",
      target: "UI Design Mockups.zip",
      project: "Mobile App Redesign",
      time: "Yesterday",
      icon: FileText,
      iconColor: "text-blue-500",
    },
    {
      user: {
        name: "Emily Rodriguez",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27470341_7294795.jpg-XE0zf7R8tk4rfA1vm4fAHeZ1QoVEOo.jpeg",
      },
      action: "updated milestone",
      target: "Client demo preparation",
      project: "New Product Launch",
      time: "2 days ago",
      icon: BarChart,
      iconColor: "text-yellow-500",
    },
    {
      user: {
        name: "Michael Johnson",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
      },
      action: "flagged issue",
      target: "Performance bottleneck in login flow",
      project: "Mobile App Redesign",
      time: "3 days ago",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
  ],
}

export default function TeamPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("")

  // In a real app, you would fetch the team data based on the ID
  const team = teamData

  const getFileIcon = (type : string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "doc":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "spreadsheet":
        return <FileText className="h-5 w-5 text-green-500" />
      case "zip":
        return <FileText className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
            <p className="text-muted-foreground">{team.members.length} members</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Team Chat
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Team Settings
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <p>{team.description}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discussions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.activity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.name}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>{" "}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Briefcase className="h-3 w-3 mr-1" />
                          <span>{activity.project}</span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{activity.time}</span>
                        </p>
                      </div>
                      <div className={`p-1.5 rounded-full bg-muted ${activity.iconColor}`}>
                        <activity.icon className="h-3 w-3" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-2 text-sm">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.projects
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 3)
                    .map((project) => (
                      <div key={project.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>Due: {project.dueDate}</span>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.priority === "High"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : project.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            {project.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search projects..." className="pl-8" />
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.projects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{project.name}</CardTitle>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.priority === "High"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : project.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {project.priority}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Due: {project.dueDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{project.status}</span>
                      </div>
                    </div>
                    <Button variant="default" className="w-full" asChild>
                      <a href={`/teams/projects/${project.id}`}>View Project</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search documents..." className="pl-8" />
            </div>
            <div className="flex space-x-2">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Document
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Upload File
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Documents</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Last Modified</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Size</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Modified By</th>
                    <th className="p-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {team.documents.map((doc) => (
                    <tr key={doc.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(doc.type)}
                          <span>{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {doc.updatedAt}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{doc.size}</td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{doc.updatedBy}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Team Discussions</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div className="space-y-6">
                    {team.discussions.map((discussion) => (
                      <div key={discussion.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={discussion.user.avatar || "/placeholder.svg"}
                              alt={discussion.user.name}
                            />
                            <AvatarFallback>{discussion.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <p className="font-medium">{discussion.user.name}</p>
                              <p className="text-xs text-muted-foreground">{discussion.timestamp}</p>
                            </div>
                            <p className="text-sm">{discussion.message}</p>
                            <div className="flex items-center mt-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                {discussion.replies} {discussion.replies === 1 ? "reply" : "replies"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="p-4 border-t mt-auto">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.discussions.map((discussion) => (
                      <div key={discussion.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={discussion.user.avatar || "/placeholder.svg"}
                              alt={discussion.user.name}
                            />
                            <AvatarFallback>{discussion.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{discussion.user.name}</p>
                            <p className="text-xs text-muted-foreground">{discussion.timestamp}</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2 line-clamp-2">{discussion.message}</p>
                        <Button variant="link" className="p-0 h-auto text-xs mt-1">
                          View Discussion
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
