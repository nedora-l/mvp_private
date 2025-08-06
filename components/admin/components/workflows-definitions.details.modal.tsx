"use client"
import { useState, useRef, useEffect } from "react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Dictionary } from "@/locales/dictionary"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { 
  Search, 
  Plus,
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play,
  Pause,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Workflow,
  Settings,
  Activity,
  ArrowRight,
  Target,
  GitBranch,
  Zap,
  History,
  Copy,
  RefreshCcw,
  Upload,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react"

import { camundaApiClient } from "@/lib/services/client/camunda/camunda.client.service"
import { cn } from "@/lib/utils"
import { ProcessDefinitionResponseDto, ProcessFullDefinitionDto } from "@/lib/services/server/camunda/camunda.server.service"
import { workflowsMockData } from "../types/mocks"
 
interface WorkflowsDetailsProps {
  dictionary?: Dictionary;
  locale?: string;
  isLoading?: boolean;
  workflow: ProcessFullDefinitionDto | ProcessDefinitionResponseDto;
}


export const getStatusIcon = (status: string) => {
    switch (status) {
        case "Active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
        case "Paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
        case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />
        default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
}

export const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case "Active":
        return "default" as const
        case "Paused":
        return "secondary" as const
        case "Failed":
        return "destructive" as const
        default:
    return "outline" as const
  }
}

export function WorkflowsDetailsModalComponent({ dictionary, locale, workflow, isLoading }: WorkflowsDetailsProps) {
   const [isDetailsOpen, setIsDetailsOpen] = useState(false)
   const [isPreviewOpen, setIsPreviewOpen] = useState(false)
   const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false)
   const [editingWorkflow, setEditingWorkflow] = useState<ProcessDefinitionResponseDto | null>(null)
  return (
    <DialogContent className="max-w-4xl max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Workflow className="h-5 w-5" />
          {workflow.name}
        </DialogTitle>
        <DialogDescription>
          {workflow.description}
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[70vh]">
        <div className="space-y-6">
          {/* Workflow Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(workflow?.status || "Active")}
                <Badge variant={getStatusBadgeVariant(workflow?.status || "Active")}>
                  {workflow?.status || "Active"}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Success Rate</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{workflow.successRate}%</span>
                <Progress value={workflow.successRate} className="w-16" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Executions</p>
              <p className="text-lg font-bold">{ 0 }</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Version</p>
              <Badge variant="outline">v{workflow.version}</Badge>
            </div>
          </div>

          <Separator />

          {/* Workflow Steps */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Workflow Steps
            </h4>
            <div className="space-y-2">
              {(workflow.steps || []).map((step: any, index: number) => (
                <div key={step.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{step.name}</p>
                      <Badge variant="secondary" className="text-xs">{step.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Duration: {step.duration}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {step.status === "Success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {step.status === "Failed" && <XCircle className="h-4 w-4 text-red-500" />}
                    {step.status === "Pending" && <Clock className="h-4 w-4 text-yellow-500" />}
                    {step.status === "Waiting" && <Pause className="h-4 w-4 text-gray-500" />}
                    {step.status === "Not Run" && <AlertCircle className="h-4 w-4 text-gray-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Recent Executions */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Executions
            </h4>
            <div className="space-y-2">
              { (workflow?.recentExecutions || []).map((execution: any) => (
                <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {execution.status === "Success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {execution.status === "Failed" && <XCircle className="h-4 w-4 text-red-500" />}
                    {execution.status === "Pending" && <Clock className="h-4 w-4 text-yellow-500" />}
                    <div>
                      <p className="font-medium">{execution.user}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(execution.timestamp).toLocaleString()}
                      </p>
                      {execution.error && (
                        <p className="text-sm text-red-600">{execution.error}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{execution.duration}</p>
                    <Badge variant={execution.status === "Success" ? "default" : execution.status === "Failed" ? "destructive" : "secondary"}>
                      {execution.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Metadata */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Workflow Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">{workflow.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Created Date</p>
                <p className="text-sm text-muted-foreground">{workflow.createdAt}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Category</p>
                <Badge variant="outline">{workflow.category}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Trigger Type</p>
                <Badge variant="secondary">{workflow.trigger}</Badge>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  );
}


