"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dictionary } from "@/locales/dictionary"
import { 
  Users, 
  Workflow, 
  Database, 
  Shield, 
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Plus,
  Play,
  BarChart3
} from "lucide-react"
import Link from "next/link"

interface AdminDashboardProps {
  dictionary: Dictionary
  locale: string
}

export function AdminDashboardComponent({ dictionary, locale }: AdminDashboardProps) {
  // Mock data for demonstration
  const stats = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+12%",
      icon: Users,
      href: "/admin/users"
    },
    {
      title: "Active Workflows", 
      value: "23",
      change: "+3",
      icon: Workflow,
      href: "/admin/workflows"
    },
    {
      title: "Custom Objects",
      value: "45",
      change: "+7",
      icon: Database,
      href: "/admin/objects"
    },
    {
      title: "System Health",
      value: "98.5%",
      change: "Optimal",
      icon: Activity,
      href: "/admin/settings"
    }
  ]

  const recentActivities = [
    {
      title: "New user registration spike",
      description: "47 new users registered in the last hour",
      time: "5 min ago",
      type: "info",
      icon: Users
    },
    {
      title: "Workflow execution completed",
      description: "Monthly report workflow completed successfully",
      time: "15 min ago", 
      type: "success",
      icon: CheckCircle
    },
    {
      title: "System maintenance scheduled",
      description: "Scheduled maintenance window this weekend",
      time: "1 hour ago",
      type: "warning",
      icon: Clock
    },
    {
      title: "Permission update required",
      description: "Review and update role permissions for compliance",
      time: "2 hours ago",
      type: "alert",
      icon: Shield
    }
  ]

  const quickActions = [
    {
      title: "Add New User",
      description: "Create a new user account with permissions",
      icon: Users,
      href: "/admin/users?action=new"
    },
    {
      title: "Create Workflow",
      description: "Design a new automated workflow",
      icon: Workflow,
      href: "/admin/workflows?action=new"
    },
    {
      title: "Define Object",
      description: "Create a new custom object with fields",
      icon: Database,
      href: "/admin/objects?action=new"
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: Settings,
      href: "/admin/settings"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and administrative controls
        </p>
      </div>

      {/* Quick Actions Bar */}            
      <div className="grid gap-4 md:grid-cols-4">
        <Card 
            className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              
            }}
        >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Create Workflow</p>
                    <p className="text-sm text-muted-foreground">Build new automation</p>
                  </div>
              </div>
            </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Play className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Run Workflow</p>
                  <p className="text-sm text-muted-foreground">Execute manually</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <div>
                <p className="font-medium">View Reports</p>
                <p className="text-sm text-muted-foreground">Execution analytics</p>
                </div>
            </div>
            </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                <Settings className="h-4 w-4 text-white" />
                </div>
                <div>
                <p className="font-medium">Settings</p>
                <p className="text-sm text-muted-foreground">Configure workflows</p>
                </div>
            </div>
            </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <action.icon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest system events and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-100 dark:bg-green-900' :
                  activity.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                  activity.type === 'alert' ? 'bg-red-100 dark:bg-red-900' :
                  'bg-blue-100 dark:bg-blue-900'
                }`}>
                  <activity.icon className={`h-4 w-4 ${
                    activity.type === 'success' ? 'text-green-600 dark:text-green-400' :
                    activity.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                    activity.type === 'alert' ? 'text-red-600 dark:text-red-400' :
                    'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
