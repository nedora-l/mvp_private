export type AIAgentStatus = 'active' | 'inactive' | 'training' | 'error' | 'all';
export type AIAgentType = 'chat' | 'assistant' | 'automation' | 'analytics' | 'support' | 'all';

export interface AIAgentMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  tokensUsed: number;
  uptime: number;
  lastUsed?: string;
}

export interface AIAgentConfiguration {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  knowledgeBaseIds?: string[];
  mcpConfig?: string;
  structuredOutput: boolean;
  responseFormat: 'text' | 'json' | 'xml' | 'md' | 'html';
  responseSchema?: string;
  functions?: string[];
  knowledgeBase?: string[];
  tools?: string[];
  capabilities?: string[];
  constraints?: {
    maxRequestsPerHour?: number;
    maxTokensPerRequest?: number;
    allowedUsers?: string[];
    allowedRoles?: string[];
  };
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: AIAgentType;
  status: AIAgentStatus;
  configuration: AIAgentConfiguration;
  metrics: AIAgentMetrics;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface CreateAIAgentDto {
  name: string;
  description: string;
  type: AIAgentType;
  configuration: AIAgentConfiguration;
  tags?: string[];
}

export interface UpdateAIAgentDto {
  id: string;
  name?: string;
  description?: string;
  type?: AIAgentType;
  configuration?: Partial<AIAgentConfiguration>;
  tags?: string[];
}

export interface AIAgentSearchFilter {
  query?: string;
  type?: AIAgentType;
  status?: AIAgentStatus;
  tags?: string[];
  createdBy?: string;
  limit?: number;
  offset?: number;
}

export interface AIAgentTemplate {
  id: string;
  name: string;
  description: string;
  type: AIAgentType;
  configuration: AIAgentConfiguration;
  tags: string[];
  isDefault: boolean;
}

export interface AIAgentActivity {
  id: string;
  agentId: string;
  type: 'request' | 'error' | 'config_change' | 'status_change';
  description: string;
  details?: any;
  timestamp: string;
  userId?: string;
}
