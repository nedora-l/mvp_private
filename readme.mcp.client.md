<!-- filepath: c:\Users\T.Rachid\dev\Products\DAWS\readme.mcp.client.md -->
# MCP (Model Context Protocol) Client API

**Date:** May 18, 2025

## 1. Overview

This document outlines the architecture and functionality of the MCP Client API implemented within the DAWS project. The primary goal of this API is to provide a unified interface for an AI model (or other services) to interact with various external tools and services (MCP Servers) in a standardized way. It allows for dynamic configuration of multiple MCP servers and routes requests to the appropriate server-specific connector.

## 2. Core Components

The MCP Client is built around several key components:

### 2.1. Configuration Management

* **`mcp-servers.config.json`**: (Located in the project root) This JSON file defines the configurations for all available MCP servers. Each server entry includes details like its ID, name, type, base URL, authentication method, and any server-specific parameters.
* **`mcp-servers.schema.json`**: (Located in the project root) A JSON schema that defines the structure and validation rules for `mcp-servers.config.json`. This ensures configuration consistency and helps prevent errors.
* **`lib/mcp/ConfigurationManager.ts`**: A singleton class responsible for:
  * Loading the `mcp-servers.config.json` file.
  * Validating its content against `mcp-servers.schema.json` using the `ajv` library.
  * Providing methods to retrieve all server configurations or a specific configuration by its ID.
  * Caching the loaded configuration for efficient access.

### 2.2. TypeScript Type Definitions

* **`types/mcp.ts`**: This file contains all necessary TypeScript interfaces for the MCP client, including:
  * `IMCPAuth`: Defines the structure for authentication details (API key, OAuth2, etc.).
  * `IMCPServerConfig`: Defines the structure for a single MCP server's configuration.
  * `IMCPConfiguration`: Defines the overall structure of the `mcp-servers.config.json` file (essentially an array of `IMCPServerConfig`).
  * `IMCPServerConnector`: An interface that all specific server connectors (like `WebSearchConnector`) must implement. It mandates methods like `initialize()` and `executeTool()`.

### 2.3. API Endpoint

* **`app/api/v1/mcp/chat/route.ts`**: This is the main Next.js API route that handles incoming requests to the MCP client.
  * It expects POST requests with a JSON body containing `server_id`, `tool_name`, `tool_input`, and an optional `request_context`.
  * Authentication (currently temporarily commented out for development) is planned using NextAuth.js.

### 2.4. Server Connectors

* **Concept**: Connectors are classes responsible for the actual communication with a specific type of MCP server. Each connector implements the `IMCPServerConnector` interface.
* **`lib/mcp/connectors/`**: This directory is intended to house all connector implementations.
* **`lib/mcp/connectors/WebSearchConnector.ts`**: An example implementation of a connector for a "web_search" type server.\r\n  * It handles its own initialization based on the server configuration (including setting up authentication like API keys from environment variables via `credentialsRef` and `process.env`).\r\n  * Its `executeTool` method maps generic tool names (e.g., "search", "fetch_page_content") to specific actions. It uses the `fetch` API to make live HTTP requests to the `baseUrl` defined in the server's configuration.\r\n  * The connector includes logic for:
    * Setting appropriate headers, including `Content-Type`, `Accept`, and an API key header (e.g., `X-Api-Key` or `Authorization: Bearer <key>`) if configured (`authentication.apiKeyHeader`, `authentication.apiKeyPrefix`).
    * Handling request timeouts using `AbortController` and the `timeout_ms` value from `server_specific_config` (defaults to 10 seconds).
    * Parsing JSON responses and attempting to parse error responses as JSON, falling back to text.
    * Handling non-JSON or empty responses (e.g., HTTP 204).

## 3. How It Works (Request Flow)

1. **Incoming Request**: A client (e.g., an AI model) sends a POST request to `/api/v1/mcp/chat`. The request body includes:
   * `server_id`: The unique identifier of the target MCP server (as defined in `mcp-servers.config.json`).
   * `tool_name`: The generic name of the tool to be executed (e.g., "search", "create_ticket").
   * `tool_input`: The parameters required by the tool.
   * `request_context` (optional): Any additional context for the request.

2. **Authentication (Future)**: The API route will first verify the session using NextAuth.js (currently bypassed).

3. **Configuration Retrieval**:
   * The API route gets an instance of the `ConfigurationManager`.
   * It calls `configManager.getConfigById(server_id)` to fetch the configuration for the requested server.
   * If the configuration is not found or the server is disabled, an appropriate error response is returned.

4. **Connector Instantiation**:
   * The API route uses a factory function `getConnector(serverConfig)` (defined within `route.ts`).
   * This factory function determines the type of connector needed based on `serverConfig.type` (e.g., "web_search", "jira").
   * It instantiates the corresponding connector class (e.g., `new WebSearchConnector()`).
   * If no connector is found for the specified type, a "Not Implemented" error is returned.

5. **Connector Initialization**:
   * The `initialize(serverConfig)` method of the instantiated connector is called. This allows the connector to set itself up (e.g., configure authentication, perform health checks).

6. **Tool Execution**:\r\n   * The `executeTool(tool_name, tool_input, request_context)` method of the connector is called.\r\n   * The connector translates the generic `tool_name` and `tool_input` into a specific request for its target MCP server.\r\n   * It handles the API call, including authentication, data transformation, and error handling, by making a live HTTP request using `fetch`.

7. **Response**:\r\n   * The result from `executeTool` is returned to the original client in a JSON response, along with status information.

## 4. Configuration and Usage

1. **Define Servers**: Populate `mcp-servers.config.json` with the details of the MCP servers you want to connect to. Ensure it validates against `mcp-servers.schema.json`.
2. **Set Environment Variables**: For authentication methods like API keys or OAuth credentials referenced via `credentialsRef` (or similar fields in `IMCPAuth`), ensure the corresponding environment variables are set in your `.env.local` or server environment.
   * Example for `WebSearchConnector` using an API key: If `credentialsRef` is "WEB_SEARCH_API_KEY", set `WEB_SEARCH_API_KEY=your_actual_api_key` in your environment.
3. **Implement Connectors**: For each unique `type` of server defined in your configuration, create a corresponding connector class in `lib/mcp/connectors/` that implements `IMCPServerConnector`.
4. **Update Connector Factory**: Add your new connector to the `getConnector` factory function in `app/api/v1/mcp/chat/route.ts`.
5. **Send Requests**: Make POST requests to `/api/v1/mcp/chat` with the appropriate `server_id`, `tool_name`, and `tool_input`.

## 5. Current Status & Next Steps

* Core framework for configuration management and request routing is in place.
* A `WebSearchConnector` exists with implemented real API call logic using `fetch`, including API key handling, timeouts, and response/error processing.
* **Next steps include:**
  * Thoroughly test `WebSearchConnector` with a live web search API, verifying configuration, API key handling, request/response flow, and error conditions.
  * Develop connectors for other MCP server types (e.g., Jira, Slack).
  * Re-enabling and fully configuring NextAuth.js for robust API security.
  * Adding comprehensive logging and error monitoring.
  * Expanding unit and integration tests.

This MCP client API provides a flexible and extensible way to integrate various tools and services, making them accessible through a consistent interface.

## 6. Testing the API

You can test the `/api/v1/mcp/chat` endpoint using `curl` or any other HTTP client. Ensure your DAWS application (and thus the API) is running, typically on `http://localhost:3000`.

**Prerequisites for Examples:**

* Your `mcp-servers.config.json` should have a server configured for web search. For example:

  ```json
  {
    "id": "my_web_search_server",
    "name": "My Mock Web Search Service",
    "type": "web_search",
    "enabled": true,
    "baseUrl": "http://localhost:3001/mock-search-api", // Replace with your actual or mock search API URL
    "authentication": {
      "method": "api_key",
      "credentialsRef": "MOCK_SEARCH_API_KEY", // Environment variable name
      "apiKeyHeader": "X-Api-Key"
    },
    "server_specific_config": {
      "timeout_ms": 15000
    }
  }
  ```

* If authentication is configured (like `MOCK_SEARCH_API_KEY` above), ensure the corresponding environment variable is set in your `.env.local` file (e.g., `MOCK_SEARCH_API_KEY=yourActualOrMockApiKey`).
* The `baseUrl` should point to a running service that can handle the requests. For initial testing, you might use a simple mock server.

**Example `curl` Commands:**

1.  **Successful 'search' Tool Call:**

    ```bash
    curl -X POST http://localhost:3000/api/v1/mcp/chat \\
    -H "Content-Type: application/json" \\
    -d '{
      "server_id": "my_web_search_server",
      "tool_name": "search",
      "tool_input": {
        "query": "latest AI advancements",
        "limit": 3
      }
    }'
    ```

2.  **Successful 'fetch_page_content' Tool Call:**

    ```bash
    curl -X POST http://localhost:3000/api/v1/mcp/chat \\
    -H "Content-Type: application/json" \\
    -d '{
      "server_id": "my_web_search_server",
      "tool_name": "fetch_page_content",
      "tool_input": {
        "url": "https://example.com/some-article-to-fetch"
      }
    }'
    ```

3.  **Error: Server Configuration Not Found:**

    ```bash
    curl -X POST http://localhost:3000/api/v1/mcp/chat \\
    -H "Content-Type: application/json" \\
    -d '{
      "server_id": "non_existent_server",
      "tool_name": "search",
      "tool_input": { "query": "test" }
    }'
    ```

    *Expected (similar to):*

    ```json
    {
      "status": "error",
      "error": {
        "code": "SERVER_CONFIG_NOT_FOUND",
        "message": "Configuration for server_id 'non_existent_server' not found."
      },
      "original_request": { ... }
    }
    ```

4.  **Error: Unsupported Tool for the Connector:**

    ```bash
    curl -X POST http://localhost:3000/api/v1/mcp/chat \\
    -H "Content-Type: application/json" \\
    -d '{
      "server_id": "my_web_search_server",
      "tool_name": "do_something_unknown",
      "tool_input": {}
    }'
    ```

    *Expected (similar to):*

    ```json
    {
      "status": "error",
      "server_id": "my_web_search_server",
      "tool_name": "do_something_unknown",
      "error": {
        "code": "CONNECTOR_EXECUTION_ERROR",
        "message": "Unsupported tool: do_something_unknown"
      },
      "original_request": { ... }
    }
    ```

5.  **Error: Request Timeout:**

    To test this, the upstream service at `baseUrl` (e.g., `http://localhost:3001/mock-search-api/search`) would need to intentionally delay its response beyond the configured `timeout_ms` (e.g., 15000ms in the example config).

    If a timeout occurs, the API response will be similar to:

    ```json
    {
      "status": "error",
      "server_id": "my_web_search_server",
      "tool_name": "search", // or the tool that timed out
      "error": {
        "code": "CONNECTOR_EXECUTION_ERROR",
        "message": "Request to My Mock Web Search Service timed out after 15000ms."
      },
      "original_request": { ... }
    }
    ```

6.  **API Key Handling:**

    The `WebSearchConnector` handles API key injection automatically if configured. The `curl` commands to the MCP API endpoint itself do not change. The connector reads the API key from the environment variable specified by `credentialsRef` and adds it to the outbound request to the `baseUrl` using the `apiKeyHeader` and `apiKeyPrefix` (if any).
    For the example configuration, ensure `MOCK_SEARCH_API_KEY` is set in your environment. The connector will then send a request to `http://localhost:3001/mock-search-api/...` with an `X-Api-Key: <yourActualOrMockApiKey>` header.

Remember to adjust `server_id`, `baseUrl`, `tool_input`, and API key details according to your specific `mcp-servers.config.json` and the requirements of the target MCP server.
