import { AIAgent, AIAgentType, AIAgentStatus } from "@/lib/interfaces/apis/ai-agents/common"

export const mockAIAgents: AIAgent[] = [
  {
      id: "agent-001",
      name: "Customer Support Assistant",
      description: "Intelligent customer support agent that handles common inquiries and escalates complex issues",
      type: "support",
      status: "active",
      configuration: {
          model: "gpt-4",
          temperature: 0.3,
          maxTokens: 1500,
          systemPrompt: "You are a helpful customer support assistant. Be professional, empathetic, and solution-focused. Always try to help the customer resolve their issue efficiently.",
          /*
          functions: ["ticket_search", "knowledge_base", "escalation"],
          knowledgeBase: ["product_docs", "faq", "troubleshooting"],
          rateLimiting: {
            requestsPerMinute: 100,
            tokensPerMinute: 150000
          },
          safety: {
            contentFilter: true,
            toxicityThreshold: 0.8
          }
          */
      },
      metrics: {
          totalRequests: 15420,
          successfulRequests: 14680,
          failedRequests: 740,
          averageResponseTime: 2.3,
          tokensUsed: 2845600,
          uptime: 99.2,
          lastUsed: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      createdBy: "admin@company.com",
      tags: ["customer-service", "support", "auto-escalation"],
      version: "1.0.0",
  },
  {
    id: "agent-002",
    name: "Data Analytics Engine",
    description: "Advanced analytics agent for generating insights from business data and creating reports",
    type: "analytics",
    status: "active",
    configuration: {
      model: "gpt-4",
      temperature: 0.1,
      maxTokens: 2000,
      systemPrompt: "You are a data analytics expert. Analyze data patterns, generate insights, and provide clear, actionable recommendations. Always include confidence levels and data sources.",
      //functions: ["data_query", "visualization", "statistical_analysis", "report_generation"],
      // knowledgeBase: ["sales_data", "marketing_metrics", "user_behavior"],
      /*
      rateLimiting: {
        requestsPerMinute: 50,
        tokensPerMinute: 100000
      },
      safety: {
        contentFilter: false,
        toxicityThreshold: 0.9
      }
      */
    },
    metrics: {
      totalRequests: 8650,
      successfulRequests: 8425,
      failedRequests: 225,
      averageResponseTime: 4.7,
      tokensUsed: 1925400,
      uptime: 98.8,
      lastUsed: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 minutes ago
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    createdBy: "data-team@company.com",
    tags: ["analytics", "reporting", "insights", "bi"],
    //version: "1.0.0",
/*
    *isPublic: true,
    permissions: {
      canEdit: ["data-team@company.com", "admin@company.com"],
      canUse: ["all_users"]
    } */
  },
  {
    id: "agent-003",
    name: "Workflow Automation Bot",
    description: "Automates repetitive business processes and manages workflow orchestration",
    type: "automation",
    status: "training",
    configuration: {
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      maxTokens: 1000,
      systemPrompt: "You are an automation specialist. Execute tasks efficiently, handle errors gracefully, and maintain detailed logs of all operations.",
      functions: ["api_calls", "document_processing", "notification", "workflow_trigger"],
      knowledgeBase: ["process_docs", "api_specs"],
      rateLimiting: {
        requestsPerMinute: 200,
        tokensPerMinute: 200000
      },
      safety: {
        contentFilter: true,
        toxicityThreshold: 0.7
      }
    },
    metrics: {
      totalRequests: 3240,
      successfulRequests: 3180,
      failedRequests: 60,
      averageResponseTime: 1.8,
      tokensUsed: 428500,
      uptime: 95.5,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 hours ago
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    createdBy: "automation@company.com",
    tags: ["automation", "workflow", "processes"],
    isPublic: false,
    permissions: {
      canEdit: ["automation@company.com", "admin@company.com"],
      canUse: ["operations-team", "hr-team"]
    }
  },
  {
    id: "agent-004",
    name: "Chat Assistant Alpha",
    description: "General purpose chatbot for internal employee communications and quick information retrieval",
    type: "chat",
    status: "active",
    configuration: {
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 1200,
      systemPrompt: "You are a friendly and helpful chat assistant for company employees. Provide quick answers, be conversational, and help with general inquiries.",
      functions: ["search", "calendar_lookup", "directory_search"],
      knowledgeBase: ["company_handbook", "policies", "directory"],
      rateLimiting: {
        requestsPerMinute: 150,
        tokensPerMinute: 180000
      },
      safety: {
        contentFilter: true,
        toxicityThreshold: 0.8
      }
    },
    metrics: {
      totalRequests: 22890,
      successfulRequests: 22456,
      failedRequests: 434,
      averageResponseTime: 1.9,
      tokensUsed: 3654200,
      uptime: 99.8,
      lastUsed: new Date(Date.now() - 1000 * 60 * 2).toISOString() // 2 minutes ago
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    createdBy: "it@company.com",
    tags: ["chat", "general", "employees", "internal"],
    isPublic: true,
    permissions: {
      canEdit: ["it@company.com", "admin@company.com"],
      canUse: ["all_employees"]
    }
  },
  {
    id: "agent-005",
    name: "Document Assistant",
    description: "Specialized agent for document analysis, summarization, and content generation",
    type: "assistant",
    status: "error",
    configuration: {
      model: "claude-3",
      temperature: 0.4,
      maxTokens: 2500,
      systemPrompt: "You are a document analysis expert. Help users understand, summarize, and work with various document types. Provide clear, structured responses.",
      functions: ["document_analysis", "summarization", "content_generation"],
      knowledgeBase: ["document_templates", "writing_guidelines"],
      rateLimiting: {
        requestsPerMinute: 80,
        tokensPerMinute: 200000
      },
      safety: {
        contentFilter: true,
        toxicityThreshold: 0.8
      }
    },
    metrics: {
      totalRequests: 1250,
      successfulRequests: 1100,
      failedRequests: 150,
      averageResponseTime: 3.2,
      tokensUsed: 456800,
      uptime: 88.0,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() // 8 hours ago
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    createdBy: "content@company.com",
    tags: ["documents", "analysis", "content"],
    isPublic: false,
    permissions: {
      canEdit: ["content@company.com", "admin@company.com"],
      canUse: ["content-team", "marketing-team"]
    }
  },
  {
    id: "agent-006",
    name: "Code Review Assistant",
    description: "AI agent specialized in code review, bug detection, and development best practices",
    type: "assistant",
    status: "inactive",
    configuration: {
      model: "gpt-4",
      temperature: 0.2,
      maxTokens: 2000,
      systemPrompt: "You are an expert code reviewer. Analyze code for bugs, security issues, performance problems, and adherence to best practices. Provide constructive feedback.",
      functions: ["code_analysis", "security_scan", "performance_check"],
      knowledgeBase: ["coding_standards", "security_guidelines", "best_practices"],
      rateLimiting: {
        requestsPerMinute: 40,
        tokensPerMinute: 80000
      },
      safety: {
        contentFilter: false,
        toxicityThreshold: 0.9
      }
    },
    metrics: {
      totalRequests: 580,
      successfulRequests: 565,
      failedRequests: 15,
      averageResponseTime: 5.8,
      tokensUsed: 234500,
      uptime: 92.5,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    createdBy: "dev@company.com",
    tags: ["code-review", "development", "quality"],
    isPublic: false,
    permissions: {
      canEdit: ["dev@company.com", "admin@company.com"],
      canUse: ["development-team"]
    }
  }
]

// Helper functions for filtering and searching
export const filterAgentsByType = (agents: AIAgent[], type?: AIAgentType): AIAgent[] => {
  if (!type) return agents
  return agents.filter(agent => agent.type === type)
}

export const filterAgentsByStatus = (agents: AIAgent[], status?: AIAgentStatus): AIAgent[] => {
  if (!status) return agents
  return agents.filter(agent => agent.status === status)
}

export const searchAgents = (agents: AIAgent[], query: string): AIAgent[] => {
  if (!query.trim()) return agents
  
  const lowerQuery = query.toLowerCase()
  return agents.filter(agent => 
    agent.name.toLowerCase().includes(lowerQuery) ||
    agent.description.toLowerCase().includes(lowerQuery) ||
    agent.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    agent.createdBy.toLowerCase().includes(lowerQuery)
  )
}
