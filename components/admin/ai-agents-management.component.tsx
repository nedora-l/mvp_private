"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dictionary } from "@/locales/dictionary"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Bot,
  Activity,
  Pause,
  Play,
  Settings,
  Copy,
  TrendingUp,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader
} from "lucide-react"
import { AIAgent, AIAgentSearchFilter, AIAgentStatus, AIAgentType } from "@/lib/interfaces/apis/ai-agents/common"
import { getAIAgentsClientApi, toggleAIAgentStatusClientApi, deleteAIAgentClientApi } from "@/lib/services/client/admin/ai-agents/ai-agents.client.service"
import { CreateAIAgentModal } from "@/components/admin/modals/create-ai-agent-modal"
import { AIAgentDetailsModal } from "@/components/admin/modals/ai-agent-details-modal"
import { EditAIAgentModal } from "@/components/admin/modals/edit-ai-agent-modal"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface AIAgentsManagementProps {
  dictionary: Dictionary
  locale: string
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

const StatusIcon = ({ status }: { status: AIAgentStatus }) => {
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

export function AIAgentsManagement({ dictionary, locale }: AIAgentsManagementProps) {
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<AIAgentType | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<AIAgentStatus | "all">("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const fetchAgents = async () => {
    setIsLoading(true)
    try {
      const filters: AIAgentSearchFilter = {}
      
      if (searchTerm) filters.query = searchTerm
      if (selectedType !== "all") filters.type = selectedType as AIAgentType
      if (selectedStatus !== "all") filters.status = selectedStatus as AIAgentStatus

      const response = await getAIAgentsClientApi(filters)
      
      if (response.status === 200 && response.data) {
        setAgents(response.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch AI agents",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching agents:", error)
      toast({
        title: "Error",
        description: "Failed to fetch AI agents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (agent: AIAgent) => {
    try {
      const newStatus = agent.status === 'active' ? 'inactive' : 'active'
      const response = await toggleAIAgentStatusClientApi(agent.id, newStatus)
      
      if (response.status === 200) {
        setAgents(prev => prev.map(a => 
          a.id === agent.id ? { ...a, status: newStatus } : a
        ))
        toast({
          title: "Success",
          description: `Agent ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
        })
      }
    } catch (error) {
      console.error("Error toggling agent status:", error)
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this AI agent? This action cannot be undone.")) {
      return
    }

    try {
      const response = await deleteAIAgentClientApi(agentId)
      
      if (response.status === 200) {
        setAgents(prev => prev.filter(a => a.id !== agentId))
        toast({
          title: "Success",
          description: "Agent deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting agent:", error)
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = (agent: AIAgent) => {
    setSelectedAgent(agent)
    setIsDetailsModalOpen(true)
  }

  const handleEditAgent = (agent: AIAgent) => {
    setSelectedAgent(agent)
    setIsEditModalOpen(true)
  }

  const handleAgentCreated = () => {
    fetchAgents()
    setIsCreateModalOpen(false)
    toast({
      title: "Success",
      description: "AI agent created successfully",
    })
  }

  const handleAgentUpdated = () => {
    fetchAgents()
    setIsEditModalOpen(false)
    toast({
      title: "Success",
      description: "AI agent updated successfully",
    })
  }

  useEffect(() => {
    fetchAgents()
  }, [searchTerm, selectedType, selectedStatus])

  const activeAgents = agents.filter(a => a.status === 'active').length
  const totalRequests = agents.reduce((sum, a) => sum + (a.metrics?.totalRequests || 0), 0)
  const averageUptime = agents.length > 0
    ? agents.reduce((sum, a) => sum + (a.metrics?.uptime || 0), 0) / agents.length
    : 0

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeAgents} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageUptime.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              Processing requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">AI Agents</CardTitle>
              <CardDescription>
                Manage and monitor your AI agents
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
              <Select value={selectedType} onValueChange={(value: string) => setSelectedType(value as AIAgentType | "all")}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Agent Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
                <SelectItem value="automation">Automation</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={(value: string) => setSelectedStatus(value as AIAgentStatus | "all")}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agents Table */}
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => {
                    const successRate = (agent.metrics?.totalRequests || 0) > 0
                      ? ((agent.metrics?.successfulRequests || 0) / (agent.metrics?.totalRequests || 1) * 100).toFixed(1)
                      : '0'
                    
                    return (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {agent.description}
                            </div>
                            {agent.tags && agent.tags.length > 0 && (
                              <div className="flex gap-1">
                                {agent.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {agent.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{agent.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={typeColors[agent.type as keyof typeof typeColors]}>
                            {agent.type}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon status={agent.status} /> 
                            <Badge className={statusColors[agent.status as keyof typeof statusColors]}>
                              {agent.status}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {agent.metrics?.totalRequests.toLocaleString() || '0'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {agent.metrics?.tokensUsed.toLocaleString()} tokens
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{successRate}%</div>
                            <div className="text-xs text-muted-foreground">
                              {agent.metrics?.averageResponseTime}s avg
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {agent.metrics?.lastUsed 
                                ? formatDistanceToNow(new Date(agent.metrics?.lastUsed), { addSuffix: true })
                                : 'Never'
                              }
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {agent.metrics?.uptime}% uptime
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(agent)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditAgent(agent)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Configuration
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(agent)}>
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
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Clone Agent
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteAgent(agent.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              
              {agents.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No AI agents</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by creating your first AI agent.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Agent
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateAIAgentModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onAgentCreated={handleAgentCreated}
      />
      
      <AIAgentDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        agent={selectedAgent}
      />
      
      <EditAIAgentModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        agent={selectedAgent}
        onAgentUpdated={handleAgentUpdated}
      />
    </div>
  )
}
