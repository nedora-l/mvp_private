/**
 * AI Agent interfaces and types
 */

export type AIAgentStatus = 'active' | 'inactive' | 'training' | 'error'  | 'all';
export type AIAgentType = 'chat' | 'assistant' | 'automation' | 'analytics' | 'support' | 'all';
export type AIAgentModel = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'gemini-pro' | 'custom' | 'all';

export interface AIAgentConfiguration {
  model: AIAgentModel;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  mcpConfig?: string
  structuredOutput: boolean;
  responseFormat: 'text' | 'json' | 'xml' | 'md' | 'html';
  responseSchema?: string;
  functions?: string[];
  knowledgeBase?: string[];
  knowledgeBaseIds?: string[];
  tools?: string[];
  capabilities?: string[];
  constraints?: {
    maxRequestsPerHour?: number;
    maxTokensPerRequest?: number;
    allowedUsers?: string[];
    allowedRoles?: string[];
  };
  rateLimiting?: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
  safety?: {
    contentFilter?: boolean;
  };
}

export interface AIAgentMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  tokensUsed: number;
  lastUsed?: string;
  uptime: number;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: AIAgentType;
  status: AIAgentStatus;
  configuration?: AIAgentConfiguration;
  metrics?: AIAgentMetrics;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version?: string;
  tags?: string[];
  enabled?: boolean;
  isPublic?: boolean;
  permissions?: {
    canEdit: string[];
    canUse: string[];
  };
}

export interface CreateAIAgentDto {
  name: string;
  description: string;
  type: AIAgentType;
  configuration: AIAgentConfiguration;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateAIAgentDto extends Partial<CreateAIAgentDto> {
  id: string;
  status?: AIAgentStatus;
}

export interface AIAgentSearchFilter {
  query?: string;
  type?: AIAgentType;
  status?: AIAgentStatus;
  tags?: string[];
  createdBy?: string;
}
