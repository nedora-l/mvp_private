import { IMCPServerConfig, IMCPServerConnector, IMCPAuth } from "@/types/mcp";

// Define a specific type for your WebSearch connector's config if it has unique props
// For now, we'll use the general IMCPServerConfig

export class WebSearchConnector implements IMCPServerConnector {
    private config!: IMCPServerConfig;
    private apiKey: string | null = null;

    constructor() {
        // Initialization logic that doesn't depend on config can go here
    }

    async initialize(config: IMCPServerConfig): Promise<void> {
        this.config = config;
        console.log(`Initializing WebSearchConnector for server: ${this.config.name}`);

        // Handle authentication setup
        if (this.config.authentication) {
            await this.setupAuthentication(this.config.authentication);
        }
        // Perform any other async setup tasks, like fetching initial data or validating connection
        // For example, you might ping the baseUrl
        if (this.config.baseUrl) {
            try {
                // const response = await fetch(`${this.config.baseUrl}/health`);
                // if (!response.ok) {
                //     throw new Error(`Health check failed: ${response.statusText}`);
                // }
                console.log(`WebSearchConnector: Successfully connected to ${this.config.baseUrl} (simulated health check).`);
            } catch (error: any) {
                console.error(`WebSearchConnector: Error connecting to ${this.config.baseUrl}: ${error.message}`);
                throw new Error(`Failed to initialize connector for ${this.config.name}: ${error.message}`);
            }
        }
    }

    private async setupAuthentication(authConfig: IMCPAuth): Promise<void> {
        switch (authConfig.method) {
            case 'api_key':
                if (authConfig.credentialsRef) {
                    this.apiKey = process.env[authConfig.credentialsRef] || null;
                    if (!this.apiKey) {
                        console.warn(`WebSearchConnector: API key specified by credentialsRef '${authConfig.credentialsRef}' not found in environment variables.`);
                        // Depending on strictness, you might throw an error here
                        // throw new Error(`API key '${authConfig.credentialsRef}' not found in environment variables.`);
                    }
                    console.log("WebSearchConnector: API Key authentication configured.");
                } else {
                    console.warn("WebSearchConnector: API key authentication method specified, but no credentialsRef provided.");
                }
                break;
            case 'oauth2':
                // Implement OAuth2 logic, potentially using a library
                // This would involve fetching a token using clientIdRef, clientSecretRef, tokenUrl, scopes
                console.warn("WebSearchConnector: OAuth2 authentication not yet implemented for this connector.");
                break;
            // Add other auth methods as needed
            case 'none':
                console.log("WebSearchConnector: No authentication configured.");
                break;
            default:
                console.warn(`WebSearchConnector: Unsupported authentication method: ${authConfig.method}`);
        }
    }

    async executeTool(toolName: string, toolInput: any, requestContext?: any): Promise<any> {
        console.log(`WebSearchConnector: Executing tool '${toolName}' for server '${this.config.name}' with input:`, toolInput);
        if (requestContext) {
            console.log("WebSearchConnector: Request context:", requestContext);
        }

        if (!this.config.baseUrl) {
            throw new Error("Base URL is not configured for this WebSearch connector.");
        }

        // Map generic tool_name to a specific API endpoint or function
        // This mapping could also come from this.config.tool_mapping
        let endpoint = '';
        let method = 'POST'; // Default method
        let body: any = toolInput;

        switch (toolName) {
            case 'search':
                endpoint = `/search`; // Example endpoint
                method = 'POST';
                body = { query: toolInput.query, limit: toolInput.limit || 10 }; // Example transformation
                break;
            case 'fetch_page_content':
                endpoint = `/fetch`; // Example endpoint
                method = 'POST';
                body = { url: toolInput.url }; // Example transformation
                break;
            default:
                throw new Error(`Unsupported tool: ${toolName}`);
        }

        const requestUrl = `${this.config.baseUrl}${endpoint}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json', // Added Accept header
        };

        if (this.apiKey && this.config.authentication?.apiKeyHeader) {
            const prefix = this.config.authentication.apiKeyPrefix || '';
            headers[this.config.authentication.apiKeyHeader] = `${prefix}${this.apiKey}`;
        }

        console.log(`WebSearchConnector: Making ${method} request to ${requestUrl}`);

        // Determine timeout for the request
        // Timeout can be specified in server_specific_config or use a default.
        const timeoutMs = this.config.server_specific_config?.timeout_ms || 10000; // Default to 10 seconds

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

            const response = await fetch(requestUrl, {
                method: method,
                headers: headers,
                body: (method !== 'GET' && method !== 'HEAD') ? JSON.stringify(body) : undefined,
                signal: controller.signal // Added AbortController signal for timeout
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorBody;
                try {
                    errorBody = await response.json(); // Try to parse as JSON
                } catch (e) {
                    errorBody = await response.text(); // Fallback to text
                }
                console.error(`WebSearchConnector: API request failed with status ${response.status}`, errorBody);
                throw new Error(`API request to ${this.config.name} failed with status ${response.status}. Details: ${typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody)}`);
            }

            // Handle cases where the response might be empty or not JSON
            const contentType = response.headers.get("content-type");
            if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
                console.log("WebSearchConnector: Received non-JSON or empty response.");
                // Return a text representation or an empty object, depending on expected behavior
                // If expecting text for some tools, this might need to be more sophisticated
                return { data: await response.text(), status: response.status }; 
            }

            const result = await response.json();

            console.log("WebSearchConnector: Successfully executed tool and received result.");
            return result;
        } catch (error: any) {
            console.error(`WebSearchConnector: Error executing tool '${toolName}': ${error.message}`);
            // TODO: Implement retry logic based on this.config.retry_policy if needed
            if (error.name === 'AbortError') {
                throw new Error(`Request to ${this.config.name} timed out after ${timeoutMs}ms.`);
            }
            throw error; // Re-throw the error or handle it as per requirements
        }
    }
}
