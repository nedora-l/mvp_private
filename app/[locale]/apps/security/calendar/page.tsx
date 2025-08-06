import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Timer, 
  BarChart3, 
  FileText, 
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { getDictionary } from "@/locales/dictionaries"
import CalendarTabsClientFull from "@/components/calendar/calendar-tabs-full"

export default async function CalendarPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const dictionary = await getDictionary(locale, ['common', 'calendar']);

  // Mock data for dashboard cards
  const todayStats = {
    scheduledEvents: 5,
    activeTimeTracking: 1,
    pendingApprovals: 3,
    totalHoursToday: 6.5
  }

  const monthlyStats = {
    totalHours: 152,
    billableHours: 128,
    taceScore: 84,
    completedProjects: 3
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {dictionary.calendar?.title || "Security Calendar & Time Tracking"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive time management and activity tracking for security teams
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Quick Timer
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {dictionary.actions?.create || "Create"} {dictionary.calendar?.target || "Event"}
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.scheduledEvents}</div>
            <p className="text-xs text-muted-foreground">
              2 critical, 3 scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tracking</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayStats.activeTimeTracking}</div>
            <p className="text-xs text-muted-foreground">
              Incident response ongoing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.totalHoursToday}h</div>
            <p className="text-xs text-muted-foreground">
              4.5h billable, 2h admin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TACE Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{monthlyStats.taceScore}%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start tracking common security activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <span className="text-sm">Incident Response</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                <FileText className="h-6 w-6 text-blue-500" />
                <span className="text-sm">Security Audit</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span className="text-sm">Compliance</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                <Users className="h-6 w-6 text-purple-500" />
                <span className="text-sm">Training</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                <BarChart3 className="h-6 w-6 text-orange-500" />
                <span className="text-sm">Operations</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                <Timer className="h-6 w-6 text-cyan-500" />
                <span className="text-sm">Admin Tasks</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Time entries waiting for validation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">July 15 CRA</p>
                  <p className="text-xs text-muted-foreground">8.5 hours</p>
                </div>
                <Badge variant="outline" className="text-yellow-600">
                  Manager Review
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Project ABC Audit</p>
                  <p className="text-xs text-muted-foreground">12 hours</p>
                </div>
                <Badge variant="outline" className="text-blue-600">
                  Finance Review
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Training Session</p>
                  <p className="text-xs text-muted-foreground">4 hours</p>
                </div>
                <Badge variant="outline" className="text-green-600">
                  Approved
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary - July 2025</CardTitle>
          <CardDescription>Overview of your time tracking and security activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{monthlyStats.totalHours}h</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
              <div className="text-xs text-green-600 mt-1">+8% vs last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{monthlyStats.billableHours}h</div>
              <div className="text-sm text-muted-foreground">Billable Hours</div>
              <div className="text-xs text-green-600 mt-1">84% utilization</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{monthlyStats.taceScore}%</div>
              <div className="text-sm text-muted-foreground">TACE Score</div>
              <div className="text-xs text-blue-600 mt-1">Above target</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{monthlyStats.completedProjects}</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
              <div className="text-xs text-green-600 mt-1">On schedule</div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Main Calendar Component */}
      <CalendarTabsClientFull dictionary={dictionary} locale={locale} />
    </div>
  )
}
