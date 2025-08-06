"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AIAgent } from "@/lib/interfaces/apis/ai-agents/common"

import { 
  Bot, 
  Settings, 
  Activity, 
  Shield, 
  Clock, 
  TrendingUp,
  Zap,
  FileText,
  Tag,
  User,
  Globe,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AIAgentDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agent: AIAgent | null
}

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  training: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
}

const typeColors = {
  chat: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  assistant: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  automation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  analytics: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  support: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
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

export function AIAgentDetailsModal({ open, onOpenChange, agent }: AIAgentDetailsModalProps) {
  if (!agent) return null

  const successRate = (agent.metrics?.totalRequests || 0) > 0 
    ? ((agent.metrics?.successfulRequests || 0) / (agent.metrics?.totalRequests || 1) * 100)
    : 0

  const failureRate = (agent.metrics?.totalRequests || 0) > 0 
    ? ((agent.metrics?.failedRequests || 0) / (agent.metrics?.totalRequests || 1) * 100)
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {agent.name}
          </DialogTitle>
          <DialogDescription>
            {agent.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={statusColors[agent.status as keyof typeof statusColors]}>
            <StatusIcon status={agent.status} />
            <span className="ml-1">{agent.status}</span>
          </Badge>
          <Badge className={typeColors[agent.type as keyof typeof typeColors]}>
            {agent.type}
          </Badge>
          {agent.enabled ? (
            <Badge variant="outline">
              <Globe className="mr-1 h-3 w-3" />
              Public
            </Badge>
          ) : (
            <Badge variant="outline">
              <Lock className="mr-1 h-3 w-3" />
              Private
            </Badge>
          )}
          {agent.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agent.metrics?.totalRequests.toLocaleString() || ''}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agent.metrics?.averageResponseTime}s</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agent.metrics?.uptime}%</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Request Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Successful Requests</span>
                    <span>{agent.metrics?.successfulRequests.toLocaleString()} ({successRate.toFixed(1)}%)</span>
                  </div>
                  <Progress value={successRate} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Failed Requests</span>
                    <span>{agent.metrics?.failedRequests.toLocaleString()} ({failureRate.toFixed(1)}%)</span>
                  </div>
                  <Progress value={failureRate} className="h-2" />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium mb-1">Tokens Used</div>
                    <div className="text-2xl font-bold">{agent.metrics?.tokensUsed.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Last Used</div>
                    <div className="text-sm text-muted-foreground">
                      {agent.metrics?.lastUsed 
                        ? formatDistanceToNow(new Date(agent.metrics?.lastUsed), { addSuffix: true })
                        : 'Never'
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium">Created By</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {agent.createdBy}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Created</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Last Updated</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(agent.updatedAt), { addSuffix: true })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Visibility</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      {agent.enabled ? (
                        <>
                          <Globe className="h-3 w-3" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3" />
                          Private
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Model Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium">Model</div>
                    <div className="text-sm text-muted-foreground">{agent.configuration?.model}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Max Tokens</div>
                    <div className="text-sm text-muted-foreground">{agent.configuration?.maxTokens}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Temperature</div>
                    <div className="text-sm text-muted-foreground">{agent.configuration?.temperature}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">System Prompt</div>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    {agent.configuration?.systemPrompt}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features & Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agent.configuration?.functions && agent.configuration?.functions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Available Functions</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.configuration?.functions.map((func, index) => (
                        <Badge key={index} variant="outline">
                          <Zap className="mr-1 h-3 w-3" />
                          {func}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {agent.configuration?.knowledgeBase && agent.configuration?.knowledgeBase.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Knowledge Base</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.configuration?.knowledgeBase.map((kb, index) => (
                        <Badge key={index} variant="outline">
                          <FileText className="mr-1 h-3 w-3" />
                          {kb}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {agent.configuration?.constraints && (
                  <div>
                    <div className="text-sm font-medium mb-2">Rate Limiting</div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="bg-muted p-2 rounded">
                        <div className="text-xs text-muted-foreground">Requests/min</div>
                        <div className="font-medium">-</div>
                      </div>
                      <div className="bg-muted p-2 rounded">
                        <div className="text-xs text-muted-foreground">Tokens/min</div>
                        <div className="font-medium">{'-'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium">Content Filter</div>
                      <div className="text-sm text-muted-foreground">
                        Disabled
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Toxicity Threshold</div>
                      <div className="text-sm text-muted-foreground">
                        0
                      </div>
                    </div>
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Success Rate</span>
                      <span>{successRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={successRate} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uptime</span>
                      <span>{agent.metrics?.uptime}%</span>
                    </div>
                    <Progress value={agent.metrics?.uptime} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Usage Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Requests</span>
                    <span className="font-medium">{agent.metrics?.totalRequests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Successful</span>
                    <span className="font-medium text-green-600">{agent.metrics?.successfulRequests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Failed</span>
                    <span className="font-medium text-red-600">{agent.metrics?.failedRequests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tokens Used</span>
                    <span className="font-medium">{agent.metrics?.tokensUsed.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{agent.metrics?.averageResponseTime}s</div>
                  <div className="text-sm text-muted-foreground">Average response time</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="mx-auto h-12 w-12 mb-2" />
                  <p>Detailed activity metrics would be shown here</p>
                  <p className="text-sm">Last activity: {agent.metrics?.lastUsed 
                    ? formatDistanceToNow(new Date(agent.metrics?.lastUsed), { addSuffix: true })
                    : 'No recent activity'
                  }</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Access Permissions</CardTitle>
                <CardDescription>
                  Control who can edit and use this AI agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Can Edit</div>
                  <div className="space-y-1">
                     
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Can Use</div>
                  <div className="space-y-1">
                     
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
