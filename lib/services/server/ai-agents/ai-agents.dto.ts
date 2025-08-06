export interface AiAgentDto {
    id: number;
    name: string;
    description: string;
    model: string;
    organizationId: number;
    createdById: number;
    updatedById: number;
    createdAt: string; // LocalDateTime is serialized as a string
    updatedAt: string; // LocalDateTime is serialized as a string
    slug: string;
    enabled: boolean;
    systemPrompt: string;
    returnObject: string;
    metaKeywords: string;
    responseFormat: string;
    structuredResponse: boolean;
    temperature: number;
    maxTokens: number;
    mcpConfig: string;
    dynamicDbTables: string;
  }
  
  export interface CreateAiAgentRequestDto {
    name?: string;
    description?: string;
    model: string;
    slug: string;
    organizationId?: number;
    enabled?: boolean;
    systemPrompt?: string;
    returnObject?: string;
    metaKeywords?: string;
    responseFormat?: string;
    structuredResponse?: boolean;
    temperature?: number;
    maxTokens?: number;
    mcpConfig?: string;
    dynamicDbTables?: string;
  }
  
  export interface UpdateAiAgentRequestDto {
    name?: string;
    description?: string;
    model?: string;
    slug?: string;
    organizationId?: number;
    enabled?: boolean;
    systemPrompt?: string;
    returnObject?: string;
    metaKeywords?: string;
    responseFormat?: string;
    structuredResponse?: boolean;
    temperature?: number;
    maxTokens?: number;
    mcpConfig?: string;
    dynamicDbTables?: string;
  }
  