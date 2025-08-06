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
import CalendarTabsClient from "@/components/calendar/calendar-tabs"
import { getDictionary } from "@/locales/dictionaries"

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


      {/* Main Calendar Component */}
      <CalendarTabsClient dictionary={dictionary} locale={locale} />
    </div>
  )
}
