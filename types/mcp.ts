
// Defines the structure for authentication details for an MCP server
export interface IMCPAuth {
  method: 'api_key' | 'oauth2' | 'pat' | 'basic_auth' | 'none'; 
  credentialsRef?: string; // Reference to where credentials are stored (e.g., env var name, vault key)
  clientIdRef?: string;
  clientSecretRef?: string;
  tokenUrl?: string;
  scopes?: string[];
  apiKeyHeader?: string; // e.g., "Authorization" or "X-API-Key"
  apiKeyPrefix?: string; // e.g., "Bearer "
}

// Defines the structure for a single MCP server configuration
export interface IMCPServerConfig {
  id: string; // Unique identifier for this server instance
  name: string; // User-friendly name
  type: 'data_analysis' | 'custom_internal' |'jira' | 'slack' | 'web_search' | 'salesforce' | 'asana' | 'custom';
  enabled: boolean;
  baseUrl?: string; // Base URL for the MCP server API
  authentication?: IMCPAuth;
  server_specific_config?: Record<string, any>; // For any other params (e.g., Jira instance URL, Slack default channel)
  tool_mapping?: Record<string, string>; // Maps generic tool names to server-specific functions
  retry_policy?: {
    max_attempts: number;
    backoff_ms: number;
  };
  rate_limits?: {
    requests_per_minute: number;
  };
}

// Defines the overall structure of the MCP server configuration file
export interface IMCPConfiguration {
  servers: IMCPServerConfig[];
}

// Interface for an MCP Server Connector
export interface IMCPServerConnector {
  // constructor(config: IMCPServerConfig, logger?: any); // Logger can be added later
  initialize(config: IMCPServerConfig): Promise<void>;
  executeTool(toolName: string, toolInput: any, requestContext?: any): Promise<any>;
  // authenticate?(): Promise<void>; // Optional, if explicit auth step needed outside executeTool
}
