"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader, Bot, Settings, Shield } from "lucide-react"
import { updateAIAgentClientApi } from "@/lib/services/client/admin/ai-agents/ai-agents.client.service"
import { useToast } from "@/hooks/use-toast"
import { AIAgent, AIAgentModel, UpdateAIAgentDto, AIAgentType  } from "@/lib/interfaces/apis/ai-agents/common"

interface EditAIAgentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agent: AIAgent | null
  onAgentUpdated: () => void
}

export function EditAIAgentModal({ open, onOpenChange, agent, onAgentUpdated }: EditAIAgentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<UpdateAIAgentDto | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (agent) {
    setFormData({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.type,
      configuration: agent.configuration
        ? {
          model: (agent.configuration.model ?? "gpt-3.5-turbo") as AIAgentModel,
          temperature: agent.configuration.temperature ?? 0.7,
          maxTokens: agent.configuration.maxTokens ?? 1024,
          systemPrompt: agent.configuration.systemPrompt ?? "",
          mcpConfig: agent.configuration.mcpConfig ?? "",
          structuredOutput: agent.configuration.structuredOutput ?? false,
          responseFormat: agent.configuration.responseFormat ?? "text",
          responseSchema: agent.configuration.responseSchema ?? "",
          functions: agent.configuration.functions ?? [],
          knowledgeBase: agent.configuration.knowledgeBase ?? [],
          knowledgeBaseIds: agent.configuration.knowledgeBaseIds ?? [],
          tools: agent.configuration.tools ?? [],
          capabilities: agent.configuration.capabilities ?? [],
          constraints: {
            maxRequestsPerHour: agent.configuration.constraints?.maxRequestsPerHour ?? 60,
            maxTokensPerRequest: agent.configuration.constraints?.maxTokensPerRequest ?? 1024,
            allowedUsers: agent.configuration.constraints?.allowedUsers ?? [],
            allowedRoles: agent.configuration.constraints?.allowedRoles ?? [],
          }
        }
        : {
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          maxTokens: 1024,
          systemPrompt: "",
          mcpConfig: "",
          structuredOutput: false,
          responseFormat: "text",
          responseSchema: "",
          functions: [],
          knowledgeBase: [],
          knowledgeBaseIds: [],
          tools: [],
          capabilities: [],
          constraints: {
            maxRequestsPerHour: 60,
            maxTokensPerRequest: 1024,
            allowedUsers: [],
            allowedRoles: [],
          }
        },
      tags: agent.tags || [],
    })
    }
  }, [agent])

  if (!formData) return null

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      if (!prev) return prev
      const newData: any = { ...prev }
      const keys = path.split('.')
      let current = newData
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
        const form:UpdateAIAgentDto =  {
          id: formData.id,
          name: formData.name,
          description: formData.description,
          type: formData.type,
          configuration: formData.configuration,
          tags: formData.tags,
        };
      const response = await updateAIAgentClientApi(form);

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "AI agent updated successfully",
        })
        onAgentUpdated()
        onOpenChange(false)
      } else {
        throw new Error(response.message || "Failed to update agent")
      }
    } catch (error) {
      console.error("Error updating agent:", error)
      toast({
        title: "Error",
        description: "Failed to update AI agent",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Edit AI Agent
          </DialogTitle>
          <DialogDescription>
            Update the configuration and details of your AI agent
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="model">Model Config</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="safety">Response</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
                <CardDescription>Edit the basic properties of your AI agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name *</Label>
                    <Input
                      id="name"
                      placeholder="My AI Assistant"
                      value={formData.name || ''}
                      onChange={(e) => updateFormData('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Agent Type *</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: AIAgentType) => updateFormData('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chat">Chat Assistant</SelectItem>
                        <SelectItem value="assistant">Task Assistant</SelectItem>
                        <SelectItem value="automation">Automation</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="support">Customer Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this AI agent does and its primary use cases..."
                    value={formData.description || ''}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="production, customer-service, automated (comma-separated)"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => updateFormData('tags', e.target.value.split(',').map((t: string) => t.trim()))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="model" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Model Configuration
                </CardTitle>
                <CardDescription>Edit the AI model settings and behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt *</Label>
                  <Textarea
                    id="systemPrompt"
                    placeholder="You are a helpful assistant specialized in..."
                    value={formData.configuration?.systemPrompt || ''}
                    onChange={(e) => updateFormData('configuration.systemPrompt', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="model">AI Model</Label>
                    <Select 
                      value={formData.configuration?.model} 
                      onValueChange={(value: AIAgentModel) => updateFormData('configuration.model', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        <SelectItem value="custom">Custom Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={formData.configuration?.maxTokens || 0}
                      onChange={(e) => updateFormData('configuration.maxTokens', parseInt(e.target.value))}
                      min={1}
                      max={8192}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features & Capabilities</CardTitle>
                <CardDescription>Edit available functions and knowledge base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mcpConfig">MCP Config </Label>
                  <Textarea
                    id="mcpConfig"
                    placeholder="{ mcpServers : []}"
                    value={formData.configuration?.mcpConfig || ""}
                    onChange={(e) => updateFormData('configuration.mcpConfig', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="knowledgeBase">Database tables : </Label>
                  <Input 
                    id="knowledgeBase" placeholder="support_docs, faq, product_manuals (comma-separated)"
                    value={formData.configuration?.knowledgeBase?.join(', ') || ''}
                    onChange={(e) => updateFormData('configuration.knowledgeBase', e.target.value.split(',').map((t: string) => t.trim()))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="functions">Available Functions</Label>
                  <Input
                    id="functions"
                    placeholder="search_web, send_email, create_ticket (comma-separated)"
                    value={formData.configuration?.functions?.join(', ') || ''}
                    onChange={(e) => updateFormData('configuration.functions', e.target.value.split(',').map((t: string) => t.trim()))}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="requestsPerMinute">Requests per Minute</Label>
                    <Input
                      id="requestsPerMinute"
                      type="number"
                      value={formData.configuration?.constraints?.maxRequestsPerHour || 60}
                      onChange={(e) => updateFormData('configuration.constraints.maxRequestsPerHour', parseInt(e.target.value))}
                      min={1}
                      max={1000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tokensPerMinute">Tokens per Minute</Label>
                    <Input
                      id="tokensPerMinute"
                      type="number"
                      value={formData.configuration?.constraints?.maxTokensPerRequest || 10000}
                      onChange={(e) => updateFormData('configuration.constraints.maxTokensPerRequest', parseInt(e.target.value))}
                      min={100}
                      max={100000}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Response & Security
                </CardTitle>
                <CardDescription>Edit safety measures and content filtering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="contentFilter"
                    checked={formData.configuration?.structuredOutput || false}
                    onCheckedChange={(checked) => updateFormData('configuration.structuredOutput', checked)}
                  />
                  <Label htmlFor="contentFilter">Enable structured Response</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responseFormat">Response Format</Label>
                  <Select
                    value={formData.configuration?.responseFormat}
                    onValueChange={(value: string) => updateFormData('configuration.responseFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="md">Markdown</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                      <SelectItem value="text">text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responseSchema">
                    Response Structure
                  </Label>
                  <Textarea
                    id="responseSchema"
                    placeholder="{...}"
                    value={formData.configuration?.structuredOutput ? formData.configuration?.responseSchema || '' : ''}
                    onChange={(e) => updateFormData('configuration.responseSchema', e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Update Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
