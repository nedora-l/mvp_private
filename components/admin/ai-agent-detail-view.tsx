"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dictionary } from "@/locales/dictionary"
import { AIAgent } from "@/lib/interfaces/apis/ai-agents/common"
import { toast } from "sonner"
import { 
  ArrowLeft,
  Bot, 
  Settings, 
  Activity, 
  Clock, 
  TrendingUp,
  Zap,
  Shield,
  User,
  Calendar,
  Edit,
  Trash2,
  Play,
  Pause,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

interface AIAgentDetailViewProps {
  agentId: string
  dictionary: Dictionary
  locale: string
}

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  training: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  all: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'inactive':
      return <XCircle className="h-4 w-4 text-gray-500" />
    case 'training':
      return <Loader className="h-4 w-4 text-blue-600 animate-spin" />
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    default:
      return null
  }
}

export function AIAgentDetailView({ agentId, dictionary, locale }: AIAgentDetailViewProps) {
  const [agent, setAgent] = useState<AIAgent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchAgentDetails()
  }, [agentId])
  const fetchAgentDetails = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // For demo purposes, find agent from mock data
      const mockData = await import('@/lib/mock-data/ai-agents')
      const foundAgent = mockData.mockAIAgents.find(a => a.id === agentId)
      
      if (foundAgent) {
        setAgent(foundAgent)
      } else {
        setError("Agent not found")
      }
    } catch (err) {
      console.error("Error fetching agent details:", err)
      setError("Failed to load agent details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push(`/${locale}/admin/ai-agents`)
  }

  const handleEdit = () => {
    toast.info("Edit functionality would be implemented here")
  }
  const handleToggleStatus = () => {
    if (!agent) return
    
    const newStatus = agent.status === 'active' ? 'inactive' : 'active'
    setAgent({ ...agent, status: newStatus })
    
    toast.success(`Agent ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
  }

  const handleClone = () => {
    toast.info("Clone functionality would be implemented here")
  }

  const handleExport = () => {
    if (!agent) return
    
    const exportData = {
      name: agent.name,
      description: agent.description,
      type: agent.type,
      configuration: agent.configuration,
      tags: agent.tags
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${agent.name.toLowerCase().replace(/\\s+/g, '-')}-config.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success("Agent configuration downloaded successfully")
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-8 w-20 bg-muted rounded" />
          <div className="h-8 w-48 bg-muted rounded" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded" />
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agents
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || "Agent not found"}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const successRate = agent.metrics.totalRequests > 0 
    ? ((agent.metrics.successfulRequests / agent.metrics.totalRequests) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agents
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bot className="h-8 w-8" />
              {agent.name}
            </h1>
            <p className="text-muted-foreground">{agent.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleToggleStatus}>
            {agent.status === 'active' ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleClone}>
            <Copy className="mr-2 h-4 w-4" />
            Clone
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Status and Tags */}
      <div className="flex flex-wrap gap-2">
        <Badge className={statusColors[agent.status]}>
          <StatusIcon status={agent.status} />
          <span className="ml-1 capitalize">{agent.status}</span>
        </Badge>
        <Badge variant="outline" className="capitalize">
          {agent.type}
        </Badge>
        {agent.tags?.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agent.metrics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {agent.metrics.tokensUsed.toLocaleString()} tokens used
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <Progress value={successRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agent.metrics.averageResponseTime}s</div>
            <p className="text-xs text-muted-foreground">
              Response time
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agent.metrics.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="metrics">Metrics & Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Model Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="text-sm font-medium">Model</div>
                  <div className="text-sm text-muted-foreground">{agent.configuration.model}</div>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium">Temperature</div>
                  <div className="text-sm text-muted-foreground">{agent.configuration.temperature}</div>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium">Max Tokens</div>
                  <div className="text-sm text-muted-foreground">{agent.configuration.maxTokens}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agent.configuration.safety && (
                  <>
                    <div className="grid gap-2">
                      <div className="text-sm font-medium">Content Filter</div>
                      <div className="text-sm text-muted-foreground">
                        {agent.configuration.safety.contentFilter ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div className="text-sm font-medium">Toxicity Threshold</div>
                      <div className="text-sm text-muted-foreground">
                        {agent.configuration.safety.toxicityThreshold}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md text-sm font-mono">
                {agent.configuration.systemPrompt}
              </div>
            </CardContent>
          </Card>

          {agent.configuration.functions && agent.configuration.functions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Available Functions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {agent.configuration.functions.map((func, index) => (
                    <Badge key={index} variant="outline">
                      {func}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Successful Requests</span>
                    <span>{agent.metrics.successfulRequests.toLocaleString()}</span>
                  </div>
                  <Progress value={successRate} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Failed Requests</span>
                    <span>{agent.metrics.failedRequests.toLocaleString()}</span>
                  </div>
                  <Progress value={(agent.metrics.failedRequests / agent.metrics.totalRequests) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Tokens Used</span>
                  <span className="font-medium">{agent.metrics.tokensUsed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Response Time</span>
                  <span className="font-medium">{agent.metrics.averageResponseTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Used</span>
                  <span className="font-medium">
                    {agent.metrics.lastUsed 
                      ? formatDistanceToNow(new Date(agent.metrics.lastUsed), { addSuffix: true })
                      : 'Never'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent events and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="mx-auto h-12 w-12 mb-2" />
                <p>Activity log would be shown here</p>
                <p className="text-sm">This would include request logs, configuration changes, and status updates</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Manage who can use and edit this agent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Can Edit</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3" />
                      user
                    </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Can Use</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3" />
                      userOrGroup
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Agent Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agent Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm font-medium">Created By</div>
              <div className="text-sm text-muted-foreground">{agent.createdBy}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Created</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(agent.createdAt), 'PPP')}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Last Updated</div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(agent.updatedAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
