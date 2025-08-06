"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dictionary } from "@/locales/dictionary"


import { 
  Plus,
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play,
  Pause,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Workflow,
  Activity,
  ArrowRight,
  GitBranch,
  Copy
} from "lucide-react"

import { camundaApiClient } from "@/lib/services/client/camunda/camunda.client.service"
import { cn } from "@/lib/utils"
import { ProcessDefinitionResponseDto } from "@/lib/services/server/camunda/camunda.server.service"
import { workflowsMockData } from "../types/mocks"
import { WorkflowsDetailsModalComponent } from "./workflows-definitions.details.modal"

// Type declarations for bpmn-js
interface BpmnCanvas {
  zoom(level: number | 'fit-viewport'): void
}

interface WorkflowsListProps {
  dictionary: Dictionary;
  locale: string;
  isLoading: boolean;
  handleEditWorkflow: (workflow: ProcessDefinitionResponseDto) => void;
  workflowsDefinitions: ProcessDefinitionResponseDto[];
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


export function WorkflowsListComponent({ dictionary, locale, workflowsDefinitions,handleEditWorkflow, isLoading }: WorkflowsListProps) {
   const [selectedWorkflow, setSelectedWorkflow] = useState<ProcessDefinitionResponseDto | null>(null)
   const [isDetailsOpen, setIsDetailsOpen] = useState(false)
   const [isPreviewOpen, setIsPreviewOpen] = useState(false)
   const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false)
   const [editingWorkflow, setEditingWorkflow] = useState<ProcessDefinitionResponseDto | null>(null)
  // Mock workflows data with enhanced structure
  const workflows =  workflowsMockData;

  // Component for template preview
  const TemplatePreviewSheet = ({ template }: { template: any }) => (
    <SheetContent className="w-[600px] sm:w-[700px]">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Workflow className="h-5 w-5" />
          {template.name}
        </SheetTitle>
        <SheetDescription>
          {template.description}
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="h-[calc(100vh-120px)] mt-6">
        <div className="space-y-6">
          {/* Template Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Category</p>
              <Badge variant="outline">{template.category}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Difficulty</p>
              <Badge variant={template.difficulty === "Easy" ? "default" : template.difficulty === "Medium" ? "secondary" : "destructive"}>
                {template.difficulty}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Steps</p>
              <p className="text-sm text-muted-foreground">{template.steps} steps</p>
            </div>
            <div>
              <p className="text-sm font-medium">Estimated Time</p>
              <p className="text-sm text-muted-foreground">{template.estimatedTime}</p>
            </div>
          </div>

          <Separator />

          {/* Template Steps */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Template Steps
            </h4>
            <div className="space-y-3">
              {template.detailedSteps?.map((step: any, index: number) => (
                <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{step.name}</p>
                      <Badge variant="secondary" className="text-xs">{step.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {index < template.detailedSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Use This Template
            </Button>
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          </div>
        </div>
      </ScrollArea>    
    </SheetContent>  
    )
  // Component for create workflow modal has been replaced by WorkflowFormModal

  return (
    <Card>
        <CardHeader>
        <CardTitle>Workflows ({workflows.length + workflowsDefinitions.length})</CardTitle>
        <CardDescription>
            Manage automated workflows and business processes
        </CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>


            {workflowsDefinitions.map((workflow) => (
                <TableRow key={workflow.id}>
                <TableCell>
                    <div>
                    <div className="font-medium flex items-center gap-2">
                        <Workflow className="h-4 w-4 text-primary" />
                        {workflow.name}
                    </div>
                    <div className="text-sm text-muted-foreground">{workflow.description}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                        {workflow.category}
                    </Badge>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                    {getStatusIcon("Active")}
                    <Badge variant={getStatusBadgeVariant("Active")}>
                        {"Active"}
                    </Badge>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant="secondary">{}</Badge>
                </TableCell>
                <TableCell>{"-"}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                    <span className="text-sm">{0}%</span>
                    <div className="w-16 h-2 bg-muted rounded-full">
                        <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${0}%` }}
                        />
                    </div>
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>                          
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Dialog open={isDetailsOpen && selectedWorkflow?.id === workflow.id} onOpenChange={(open) => {
                        setIsDetailsOpen(open)
                        if (!open) setSelectedWorkflow(null)
                        }}>
                        <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault()
                            setSelectedWorkflow(workflow)
                            setIsDetailsOpen(true)
                            }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                            </DropdownMenuItem>
                        </DialogTrigger>
                        {selectedWorkflow?.id === workflow.id && <WorkflowsDetailsModalComponent workflow={selectedWorkflow} />}                                </Dialog>
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault()
                            handleEditWorkflow(workflow)
                        }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Workflow
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                        <Activity className="h-4 w-4 mr-2" />
                        View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                        {workflow.category === "Active" ? (
                            <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                            </>
                        ) : (
                            <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                            </>
                        )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            ))}

            {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                <TableCell>
                    <div>
                    <div className="font-medium flex items-center gap-2">
                        <Workflow className="h-4 w-4 text-primary" />
                        {workflow.name}
                    </div>
                    <div className="text-sm text-muted-foreground">{workflow.description}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                        {workflow.category}
                    </Badge>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                    {getStatusIcon(workflow.status)}
                    <Badge variant={getStatusBadgeVariant(workflow.status)}>
                        {workflow.status}
                    </Badge>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant="secondary">{workflow.trigger}</Badge>
                </TableCell>
                <TableCell>{workflow.lastRun}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                    <span className="text-sm">{workflow.successRate}%</span>
                    <div className="w-16 h-2 bg-muted rounded-full">
                        <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${workflow.successRate}%` }}
                        />
                    </div>
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>                          <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Dialog open={isDetailsOpen && selectedWorkflow?.id === workflow.id} onOpenChange={(open) => {
                        setIsDetailsOpen(open)
                        if (!open) setSelectedWorkflow(null)
                        }}>
                        <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault()
                            setSelectedWorkflow(workflow)
                            setIsDetailsOpen(true)
                            }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                            </DropdownMenuItem>
                        </DialogTrigger>
                        {selectedWorkflow?.id === workflow.id && <WorkflowsDetailsModalComponent workflow={selectedWorkflow} />}                                </Dialog>
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault()
                            handleEditWorkflow(workflow)
                        }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Workflow
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                        <Activity className="h-4 w-4 mr-2" />
                        View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                        {workflow.status === "Active" ? (
                            <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                            </>
                        ) : (
                            <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                            </>
                        )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </CardContent>
    </Card>
  );
}
