"use client"

import { useState, useEffect, useRef } from "react"
import { useI18n } from "@/lib/i18n/use-i18n"
import { FileDto } from "@/lib/interfaces/apis/files"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  FileText, 
  Search, 
  Download,
  Copy,
  RefreshCw,
  Sparkles,
  Brain,
  Lightbulb,
  PaperclipIcon
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { AppComponentDictionaryPropsWithId } from "@/lib/interfaces/common/dictionary-props-component"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: string
  type?: 'text' | 'suggestion' | 'summary' | 'question'
  metadata?: {
    confidence?: number
    sources?: string[]
    actions?: Array<{
      label: string
      action: () => void
      icon?: any
    }>
  }
}

interface DocumentChatProps extends Omit<AppComponentDictionaryPropsWithId, 'id'> {
  documentId: string
  currentFile: FileDto | null
}

export default function DocumentChat({ 
  dictionary, 
  locale, 
  documentId, 
  currentFile 
}: DocumentChatProps) {
  const { t } = useI18n(dictionary)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Mock AI responses based on document analysis
  const aiResponses = {
    summary: "I've analyzed the document and found it contains technical specifications with 3 main sections: architecture overview, implementation details, and testing procedures. The document appears to be well-structured and comprehensive.",
    
    questions: [
      "What are the key requirements mentioned in this document?",
      "Can you explain the implementation timeline?",
      "What testing procedures are outlined?",
      "Are there any dependencies mentioned?",
      "What are the main deliverables?"
    ],
    
    insights: [
      "The document follows industry best practices for technical documentation.",
      "Implementation timeline seems realistic based on the scope outlined.",
      "Testing procedures are comprehensive and cover edge cases.",
      "Dependencies are clearly documented with version requirements."
    ]
  }

  // Initialize with welcome message and document analysis
  useEffect(() => {
    if (currentFile) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        content: `Hello! I'm your AI assistant. I've analyzed "${currentFile.originalFilename}" and I'm ready to help you understand, summarize, or answer questions about this document. What would you like to know?`,
        sender: 'ai',
        timestamp: 'Just now',
        type: 'text',
        metadata: {
          confidence: 0.95,
          actions: [
            {
              label: 'Summarize Document',
              action: () => handleSuggestedAction('summarize'),
              icon: FileText
            },
            {
              label: 'Ask Questions',
              action: () => handleSuggestedAction('questions'),
              icon: Brain
            },
            {
              label: 'Get Insights',
              action: () => handleSuggestedAction('insights'),
              icon: Lightbulb
            }
          ]
        }
      }
      setMessages([welcomeMessage])
    }
  }, [currentFile])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: 'Just now',
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): ChatMessage => {
    const lowerInput = userInput.toLowerCase()
    
    let content = ""
    let type: ChatMessage['type'] = 'text'
    let metadata: ChatMessage['metadata'] = { confidence: 0.9 }

    if (lowerInput.includes('summary') || lowerInput.includes('summarize')) {
      content = aiResponses.summary
      type = 'summary'
      metadata.actions = [
        {
          label: 'Download Summary',
          action: () => handleDownloadSummary(),
          icon: Download
        },
        {
          label: 'Copy Summary',
          action: () => handleCopySummary(),
          icon: Copy
        }
      ]
    } else if (lowerInput.includes('question') || lowerInput.includes('what') || lowerInput.includes('how')) {
      content = "Here are some key questions I can help you with based on this document:"
      type = 'question'
      metadata.actions = aiResponses.questions.map((q, i) => ({
        label: q,
        action: () => handleQuestionClick(q),
        icon: MessageCircle
      }))
    } else if (lowerInput.includes('insight') || lowerInput.includes('analysis')) {
      content = "Based on my analysis of the document, here are some key insights:\n\n" + 
                aiResponses.insights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')
      type = 'suggestion'
    } else if (lowerInput.includes('requirement') || lowerInput.includes('spec')) {
      content = "Based on the document, the key requirements include:\n\n• Technical architecture compliance\n• Performance benchmarks\n• Security protocols implementation\n• Testing coverage of 90%+\n• Documentation standards adherence"
    } else if (lowerInput.includes('timeline') || lowerInput.includes('schedule')) {
      content = "The implementation timeline outlined in the document suggests:\n\n• Phase 1: Architecture setup (2 weeks)\n• Phase 2: Core development (6 weeks)\n• Phase 3: Testing & QA (3 weeks)\n• Phase 4: Deployment & monitoring (1 week)\n\nTotal estimated duration: 12 weeks"
    } else {
      // Generic response
      content = `I understand you're asking about "${userInput}". Based on my analysis of the document, I can provide specific information. Could you be more specific about what aspect you'd like me to focus on?`
      metadata.actions = [
        {
          label: 'Analyze Content',
          action: () => handleSuggestedAction('analyze'),
          icon: Search
        },
        {
          label: 'Find Related Sections',
          action: () => handleSuggestedAction('related'),
          icon: FileText
        }
      ]
    }

    return {
      id: Date.now().toString(),
      content,
      sender: 'ai',
      timestamp: 'Just now',
      type,
      metadata
    }
  }

  const handleSuggestedAction = (action: string) => {
    setIsAnalyzing(true)
    
    setTimeout(() => {
      let response: ChatMessage
      
      switch (action) {
        case 'summarize':
          response = {
            id: Date.now().toString(),
            content: aiResponses.summary,
            sender: 'ai',
            timestamp: 'Just now',
            type: 'summary',
            metadata: {
              confidence: 0.95,
              actions: [
                { label: 'Download Summary', action: handleDownloadSummary, icon: Download },
                { label: 'Copy Summary', action: handleCopySummary, icon: Copy }
              ]
            }
          }
          break
        case 'questions':
          response = {
            id: Date.now().toString(),
            content: "Here are some questions I can help you with:",
            sender: 'ai',
            timestamp: 'Just now',
            type: 'question',
            metadata: {
              confidence: 0.9,
              actions: aiResponses.questions.map(q => ({
                label: q,
                action: () => handleQuestionClick(q),
                icon: MessageCircle
              }))
            }
          }
          break
        case 'insights':
          response = {
            id: Date.now().toString(),
            content: "Key insights from document analysis:\n\n" + 
                     aiResponses.insights.map((insight, i) => `${i + 1}. ${insight}`).join('\n'),
            sender: 'ai',
            timestamp: 'Just now',
            type: 'suggestion',
            metadata: { confidence: 0.88 }
          }
          break
        default:
          response = {
            id: Date.now().toString(),
            content: "I'm analyzing the document for more detailed insights...",
            sender: 'ai',
            timestamp: 'Just now',
            type: 'text',
            metadata: { confidence: 0.8 }
          }
      }
      
      setMessages(prev => [...prev, response])
      setIsAnalyzing(false)
    }, 1000)
  }

  const handleQuestionClick = (question: string) => {
    setInput(question)
  }

  const handleDownloadSummary = () => {
    // Implement download functionality
    console.log('Downloading summary...')
  }

  const handleCopySummary = () => {
    // Implement copy functionality
    navigator.clipboard.writeText(aiResponses.summary)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t('documents.chat.title') || 'Document AI Assistant'}
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
        {currentFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{t('documents.chat.analyzing') || 'Analyzing'}:</span>
            <span className="font-medium">{currentFile.originalFilename}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 p-0">
        {/* Messages area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-full w-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  </Avatar>
                )}
                
                <div className={cn(
                  "max-w-[80%] space-y-2",
                  message.sender === 'user' ? 'items-end' : 'items-start'
                )}>
                  <div
                    className={cn(
                      "rounded-xl px-4 py-3 shadow-sm",
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-foreground',
                      message.type === 'summary' && 'border-blue-200 bg-blue-50',
                      message.type === 'question' && 'border-green-200 bg-green-50',
                      message.type === 'suggestion' && 'border-purple-200 bg-purple-50'
                    )}
                  >
                    {message.type && message.type !== 'text' && (
                      <div className="flex items-center gap-2 mb-2">
                        {message.type === 'summary' && <FileText className="h-4 w-4 text-blue-600" />}
                        {message.type === 'question' && <Brain className="h-4 w-4 text-green-600" />}
                        {message.type === 'suggestion' && <Lightbulb className="h-4 w-4 text-purple-600" />}
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {message.type}
                        </span>
                      </div>
                    )}
                    
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    
                    {message.metadata?.confidence && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {t('documents.chat.confidence') || 'Confidence'}: {Math.round(message.metadata.confidence * 100)}%
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  {message.metadata?.actions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.metadata.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={action.action}
                          className="h-8 text-xs"
                        >
                          {action.icon && <action.icon className="h-3 w-3 mr-1" />}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </div>
                </div>
                
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <div className="bg-gradient-to-br from-gray-500 to-gray-700 h-full w-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Avatar>
                )}
              </div>
            ))}
            
            {/* Loading indicator */}
            {(isLoading || isAnalyzing) && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-full w-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </Avatar>
                <div className="bg-muted rounded-xl px-4 py-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">
                      {isAnalyzing 
                        ? t('documents.chat.analyzing') || 'Analyzing document...'
                        : t('documents.chat.thinking') || 'Thinking...'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Separator />
        
        {/* Input area */}
        <div className="px-6 pb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('documents.chat.placeholder') || 'Ask me anything about this document...'}
                disabled={isLoading || isAnalyzing}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                disabled
              >
                <PaperclipIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading || isAnalyzing}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick actions */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedAction('summarize')}
              disabled={isLoading || isAnalyzing}
              className="text-xs"
            >
              <FileText className="h-3 w-3 mr-1" />
              {t('documents.chat.summarize') || 'Summarize'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedAction('questions')}
              disabled={isLoading || isAnalyzing}
              className="text-xs"
            >
              <Brain className="h-3 w-3 mr-1" />
              {t('documents.chat.questions') || 'Ask Questions'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestedAction('insights')}
              disabled={isLoading || isAnalyzing}
              className="text-xs"
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              {t('documents.chat.insights') || 'Get Insights'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
