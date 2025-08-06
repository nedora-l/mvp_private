"use client"
import { useState } from "react"
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
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateAIAgentDto, AIAgentType, AIAgentModel } from "@/lib/interfaces/apis/ai-agents"
import { createAIAgentClientApi } from "@/lib/services/client/admin/ai-agents/ai-agents.client.service"
import { useToast } from "@/hooks/use-toast"
import { Loader, Bot, Settings, Shield, Tag } from "lucide-react"

interface CreateAIAgentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAgentCreated: () => void
}

export function CreateAIAgentModal({ open, onOpenChange, onAgentCreated }: CreateAIAgentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateAIAgentDto>({
    name: "",
    description: "",
    type: "chat",
    configuration: {
      model: "gemini-pro",
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: "",
      structuredOutput: true,
      responseFormat: 'json',
      responseSchema: '',
      functions: [],
      knowledgeBase: [],
      rateLimiting: {
        requestsPerMinute: 60,
        tokensPerMinute: 10000
      },
      safety: {
        contentFilter: true,
      }
    },
    tags: [],
    isPublic: false
  })
  const [tagsInput, setTagsInput] = useState("")
  const [functionsInput, setFunctionsInput] = useState("")
  const [knowledgeBaseInput, setKnowledgeBaseInput] = useState("")
  const { toast } = useToast()

  const handleSubmit = async () => {
    console.log("Submitting form data:", formData);
    console.log("Tags input:", tagsInput);
    console.log("Functions input:", functionsInput);
    console.log("Knowledge base input:", knowledgeBaseInput);
    if (!formData.name || !formData.description || !formData.configuration.systemPrompt) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
      try {
        // Map formData to CreateAiAgentRequestDto for backend
        const processedData: CreateAIAgentDto = {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          configuration: {
            ...formData.configuration,
            responseSchema: formData.configuration.responseSchema || '',
            knowledgeBase: knowledgeBaseInput
              ? knowledgeBaseInput.split(',')
              : formData.configuration.knowledgeBase,
          },
          tags: tagsInput
            ? tagsInput.split(',').map(tag => tag.trim())
            : [],
          isPublic: formData.isPublic
        };
        const response = await createAIAgentClientApi(processedData)
        if (response.status === 201) {
          onAgentCreated()
          resetForm()
          toast({
            title: "Success",
            description: "AI agent created successfully",
          })
        } else {
          throw new Error(response.message || "Failed to create agent")
        }
      } catch (error) {
        console.error("Error creating agent:", error)
        toast({
          title: "Error",
          description: "Failed to create AI agent",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "chat",
      configuration: {
        model: "gpt-4",
        structuredOutput: true,
        responseFormat: 'json',
        responseSchema: '',
        temperature: 0.7,
        maxTokens: 2048,
        systemPrompt: "",
        functions: [],
        knowledgeBase: [],
        rateLimiting: {
          requestsPerMinute: 60,
          tokensPerMinute: 10000
        },
        safety: {
          contentFilter: true,
        }
      },
      tags: [],
      isPublic: false
    })
    setTagsInput("")
    setFunctionsInput("")
    setKnowledgeBaseInput("")
  }

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Create AI Agent
          </DialogTitle>
          <DialogDescription>
            Configure a new AI agent for your organization
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
                <CardDescription>Configure the basic properties of your AI agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Agent Name *</Label>
                    <Input
                      id="name"
                      placeholder="My AI Assistant"
                      value={formData.name}
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
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="production, customer-service, automated (comma-separated)"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
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
                <CardDescription>Configure the AI model settings and behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt *</Label>
                  <Textarea
                    id="systemPrompt"
                    placeholder="You are a helpful assistant specialized in..."
                    value={formData.configuration.systemPrompt}
                    onChange={(e) => updateFormData('configuration.systemPrompt', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="model">AI Model</Label>
                    <Select 
                      value={formData.configuration.model} 
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
                      value={formData.configuration.maxTokens}
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
                <CardDescription>Configure available functions and knowledge base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                
                <div className="space-y-2">
                  <Label htmlFor="mcpConfig">MCP Config </Label>
                  <Textarea
                    id="mcpConfig"
                    placeholder="{ mcpServers : []}"
                    value={formData.configuration.mcpConfig || ""}
                    onChange={(e) => updateFormData('configuration.mcpConfig', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="knowledgeBase">Database tables : </Label>
                  <Input 
                    id="knowledgeBase" placeholder="support_docs, faq, product_manuals (comma-separated)"
                    value={knowledgeBaseInput} onChange={(e) => setKnowledgeBaseInput(e.target.value)}
                  />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="functions">Available Functions</Label>
                  <Input
                        disabled={true}
                    id="functions"
                    placeholder="search_web, send_email, create_ticket (comma-separated)"
                    value={functionsInput}
                    onChange={(e) => setFunctionsInput(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="requestsPerMinute">Requests per Minute</Label>
                    <Input
                        disabled={true}
                      id="requestsPerMinute"
                      type="number"
                      value={formData.configuration.rateLimiting?.requestsPerMinute || 60}
                      onChange={(e) => updateFormData('configuration.rateLimiting.requestsPerMinute', parseInt(e.target.value))}
                      min={1}
                      max={1000}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tokensPerMinute">Tokens per Minute</Label>
                    <Input
                        disabled={true}
                      id="tokensPerMinute"
                      type="number"
                      value={formData.configuration.rateLimiting?.tokensPerMinute || 10000}
                      onChange={(e) => updateFormData('configuration.rateLimiting.tokensPerMinute', parseInt(e.target.value))}
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
                <CardDescription>Configure safety measures and content filtering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="contentFilter"
                    checked={formData.configuration.safety?.contentFilter || false}
                    onCheckedChange={(checked) => updateFormData('configuration.safety.contentFilter', checked)}
                  />
                  <Label htmlFor="contentFilter">Enable structured Response</Label>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="responseFormat">Response Format</Label>
                    <Select
                      value={formData.configuration.responseFormat}
                      onValueChange={(value: AIAgentModel) => updateFormData('configuration.responseFormat', value)}
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
                    value={formData.configuration.structuredOutput ? formData.configuration.responseSchema : ""}
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
            Create Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
