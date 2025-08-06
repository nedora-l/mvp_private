"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  Settings,
  ChevronRight,
  BarChart,
  CheckSquare,
  Circle,
  AlertCircle,
  Send,
  Paperclip,
  LinkIcon,
} from "lucide-react"

// Mock data for the project
const projectData = {
  id: 1,
  name: "New Product Launch",
  description:
    "This project involves the development and launch of our new flagship product. The team will be responsible for all aspects of the product development lifecycle, from initial design to market release.",
  progress: 75,
  status: "In Progress",
  startDate: "May 15, 2023",
  dueDate: "Aug 30, 2023",
  priority: "High",
  team: "Product Development",
  members: [
    {
      id: 1,
      name: "Alex Rivera",
      role: "Project Lead",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      role: "Product Manager",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27470341_7294795.jpg-XE0zf7R8tk4rfA1vm4fAHeZ1QoVEOo.jpeg",
    },
    {
      id: 3,
      name: "Robert Davis",
      role: "Senior Developer",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
    },
    {
      id: 4,
      name: "Jessica Chen",
      role: "UX Designer",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/799.jpg-0tEi4Xvg5YsFoGoQfQc698q4Dygl1S.jpeg",
    },
  ],
  milestones: [
    {
      id: 1,
      name: "Product Design Phase",
      status: "Completed",
      dueDate: "Jun 15, 2023",
      progress: 100,
    },
    {
      id: 2,
      name: "Development Phase",
      status: "In Progress",
      dueDate: "Jul 30, 2023",
      progress: 80,
    },
    {
      id: 3,
      name: "Testing Phase",
      status: "Not Started",
      dueDate: "Aug 15, 2023",
      progress: 0,
    },
    {
      id: 4,
      name: "Launch Phase",
      status: "Not Started",
      dueDate: "Aug 30, 2023",
      progress: 0,
    },
  ],
  tasks: [
    {
      id: 1,
      title: "Complete API documentation",
      status: "Completed",
      assignee: {
        name: "Robert Davis",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
      },
      dueDate: "Jul 10, 2023",
      priority: "Medium",
    },
    {
      id: 2,
      title: "Finalize UI design for product page",
      status: "In Progress",
      assignee: {
        name: "Jessica Chen",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/799.jpg-0tEi4Xvg5YsFoGoQfQc698q4Dygl1S.jpeg",
      },
      dueDate: "Jul 15, 2023",
      priority: "High",
    },
    {
      id: 3,
      title: "Implement user authentication",
      status: "In Progress",
      assignee: {
        name: "Robert Davis",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
      },
      dueDate: "Jul 20, 2023",
      priority: "High",
    },
    {
      id: 4,
      title: "Prepare marketing materials",
      status: "Not Started",
      assignee: {
        name: "Emily Rodriguez",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27470341_7294795.jpg-XE0zf7R8tk4rfA1vm4fAHeZ1QoVEOo.jpeg",
      },
      dueDate: "Jul 25, 2023",
      priority: "Medium",
    },
    {
      id: 5,
      title: "Conduct user testing",
      status: "Not Started",
      assignee: {
        name: "Jessica Chen",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/799.jpg-0tEi4Xvg5YsFoGoQfQc698q4Dygl1S.jpeg",
      },
      dueDate: "Aug 5, 2023",
      priority: "High",
    },
    {
      id: 6,
      title: "Prepare launch presentation",
      status: "Not Started",
      assignee: {
        name: "Alex Rivera",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
      },
      dueDate: "Aug 20, 2023",
      priority: "Medium",
    },
  ],
  files: [
    {
      id: 1,
      name: "Product Requirements Document.docx",
      type: "doc",
      size: "1.2 MB",
      updatedAt: "Jun 5, 2023",
      updatedBy: "Alex Rivera",
    },
    {
      id: 2,
      name: "UI Design Mockups.zip",
      type: "zip",
      size: "15.7 MB",
      updatedAt: "Jun 20, 2023",
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
      updatedAt: "Jul 5, 2023",
      updatedBy: "Emily Rodriguez",
    },
  ],
  discussions: [
    {
      id: 1,
      user: {
        name: "Alex Rivera",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
      },
      message:
        "Team, I've just updated the project timeline. We need to accelerate the development phase to meet our launch date. Please review and let me know if you have any concerns.",
      timestamp: "Yesterday, 2:30 PM",
      replies: 3,
    },
    {
      id: 2,
      user: {
        name: "Jessica Chen",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/799.jpg-0tEi4Xvg5YsFoGoQfQc698q4Dygl1S.jpeg",
      },
      message:
        "I've completed the initial UI designs for the product page. Please take a look at the mockups and provide feedback by tomorrow.",
      timestamp: "Jul 12, 2023",
      replies: 5,
    },
  ],
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("")
  const [newTask, setNewTask] = useState({ title: "", description: "", assignee: "", dueDate: "", priority: "Medium" })

  // In a real app, you would fetch the project data based on the ID
  const project = projectData

  const getStatusIcon = (status : string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <BarChart className="h-4 w-4 text-blue-500" />
      case "Not Started":
        return <Circle className="h-4 w-4 text-gray-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const getTaskStatusIcon = (status : string) => {
    switch (status) {
      case "Completed":
        return <CheckSquare className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <BarChart className="h-4 w-4 text-blue-500" />
      case "Not Started":
        return <Circle className="h-4 w-4 text-gray-500" />
      case "Blocked":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

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
        <div>
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Briefcase className="h-4 w-4 mr-1" />
            <span>{project.team}</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Projects</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Project Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <p>{project.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{project.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{project.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{project.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <p className="font-medium">{project.priority}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Team Members</p>
                <div className="flex -space-x-2">
                  {project.members.map((member) => (
                    <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-2 border-background">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks" className="flex items-center">
            <CheckSquare className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Files
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discussions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Project Tasks</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-3">
                      {getTaskStatusIcon(task.status)}
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : task.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Project Milestones</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Milestone
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {project.milestones.map((milestone) => (
                  <div key={milestone.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {getStatusIcon(milestone.status)}
                        <h3 className="font-semibold ml-2">{milestone.name}</h3>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          milestone.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : milestone.status === "In Progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {milestone.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Due: {milestone.dueDate}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${milestone.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Project Files</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Upload File
              </Button>
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
                  {project.files.map((file) => (
                    <tr key={file.id} className="border-b last:border-0 hover:bg-accent/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <span>{file.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {file.updatedAt}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{file.size}</td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{file.updatedBy}</td>
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
          <div className="grid grid-cols-1 gap-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Project Discussions</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                <div className="space-y-6">
                  {project.discussions.map((discussion) => (
                    <div key={discussion.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={discussion.user.avatar || "/placeholder.svg"} alt={discussion.user.name} />
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
                  <Button variant="ghost" size="icon">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
