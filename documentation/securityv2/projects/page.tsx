import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Search,
  Plus,
  Briefcase,
  Clock,
  Calendar,
  MessageSquare,
  FileText,
  BarChart,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"


export default function TeamsPage({ params }: BasePageProps ) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <div className="flex space-x-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search teams or projects..." className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="activeProjects" defaultChecked className="space-y-4">
        <TabsList>
          <TabsTrigger value="activeProjects" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Active Projects
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Recent Activity
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activeProjects">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                name: "Website Redesign",
                team: "Marketing",
                progress: 75,
                status: "In Progress",
                dueDate: "Aug 15, 2023",
                priority: "High",
              },
              {
                id: 2,
                name: "Q3 Financial Report",
                team: "Finance",
                progress: 40,
                status: "In Progress",
                dueDate: "Sep 30, 2023",
                priority: "Medium",
              },
              {
                id: 3,
                name: "New Product Launch",
                team: "Product Development",
                progress: 90,
                status: "In Progress",
                dueDate: "Jul 30, 2023",
                priority: "High",
              },
              {
                id: 4,
                name: "Customer Satisfaction Survey",
                team: "Customer Support",
                progress: 60,
                status: "In Progress",
                dueDate: "Aug 10, 2023",
                priority: "Medium",
              },
              {
                id: 5,
                name: "Employee Onboarding Improvement",
                team: "HR & Recruitment",
                progress: 30,
                status: "In Progress",
                dueDate: "Sep 15, 2023",
                priority: "Low",
              },
              {
                id: 6,
                name: "AI Integration Research",
                team: "Research & Innovation",
                progress: 50,
                status: "In Progress",
                dueDate: "Oct 1, 2023",
                priority: "High",
              },
            ].map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.team}</p>
                    </div>
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

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    user: {
                      name: "Alex Rivera",
                      avatar:
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
                    },
                    action: "completed task",
                    target: "Update product specifications",
                    project: "New Product Launch",
                    team: "Product Development",
                    time: "10 minutes ago",
                    icon: CheckCircle,
                    iconColor: "text-green-500",
                  },
                  {
                    user: {
                      name: "Jennifer Smith",
                      avatar:
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
                    },
                    action: "added file",
                    target: "Q3 Marketing Strategy.pdf",
                    project: "Website Redesign",
                    team: "Marketing",
                    time: "1 hour ago",
                    icon: FileText,
                    iconColor: "text-blue-500",
                  },
                  {
                    user: {
                      name: "David Wilson",
                      avatar:
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334178.jpg-Y74tW6XFO68g7N36SE5MSNDNVKLQ08.jpeg",
                    },
                    action: "commented on",
                    target: "Budget allocation for Q4",
                    project: "Q3 Financial Report",
                    team: "Finance",
                    time: "2 hours ago",
                    icon: MessageSquare,
                    iconColor: "text-purple-500",
                  },
                  {
                    user: {
                      name: "Lisa Brown",
                      avatar:
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5295.jpg-fLw0wGGZp8wuTzU5dnyfjZDwAHN98a.jpeg",
                    },
                    action: "created task",
                    target: "Develop customer feedback form",
                    project: "Customer Satisfaction Survey",
                    team: "Customer Support",
                    time: "3 hours ago",
                    icon: Plus,
                    iconColor: "text-indigo-500",
                  },
                  {
                    user: {
                      name: "Michael Chen",
                      avatar:
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
                    },
                    action: "updated milestone",
                    target: "Research phase completion",
                    project: "AI Integration Research",
                    team: "Research & Innovation",
                    time: "5 hours ago",
                    icon: BarChart,
                    iconColor: "text-yellow-500",
                  },
                  {
                    user: {
                      name: "Sarah Johnson",
                      avatar:
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
                    },
                    action: "flagged issue",
                    target: "Onboarding documentation outdated",
                    project: "Employee Onboarding Improvement",
                    team: "HR & Recruitment",
                    time: "Yesterday",
                    icon: AlertCircle,
                    iconColor: "text-red-500",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p>
                        <span className="font-medium">{activity.user.name}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {activity.project} • {activity.team}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{activity.time}</span>
                      </p>
                    </div>
                    <div className={`p-2 rounded-full bg-muted ${activity.iconColor}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
