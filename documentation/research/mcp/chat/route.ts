import { NextResponse } from 'next/server';

import { ConfigurationManager } from '@/lib/mcp/ConfigurationManager';
import { IMCPServerConfig, IMCPServerConnector } from '@/types/mcp';

// Placeholder for connector factory - to be implemented later
async function getConnector(serverConfig: IMCPServerConfig): Promise<IMCPServerConnector | null> {
    console.log(`Attempting to get connector for type: ${serverConfig.type}`);
    return null;
}

export async function POST(request: Request) {
  // const session = await getServerSession(authOptions); // Temporarily commented out
  // if (!session) { // Temporarily commented out
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); // Temporarily commented out
  // }
  

  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const { server_id, tool_name, tool_input, request_context } = requestBody;

  if (!server_id || !tool_name) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          code: 'INVALID_INPUT',
          message: 'server_id and tool_name are required.',
        },
        original_request: requestBody,
      },
      { status: 400 }
    );
  }

  const configManager = ConfigurationManager.getInstance();
  if (!configManager.isConfigLoaded()) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          code: 'CONFIG_NOT_LOADED',
          message: 'MCP server configuration could not be loaded.',
        },
        original_request: requestBody,
      },
      { status: 500 }
    );
  }

  const serverConfig = configManager.getConfigById(server_id);

  if (!serverConfig) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          code: 'SERVER_CONFIG_NOT_FOUND',
          message: `Configuration for server_id '${server_id}' not found.`,
        },
        original_request: requestBody,
      },
      { status: 404 } // Not Found
    );
  }

  if (!serverConfig.enabled) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          code: 'SERVER_DISABLED',
          message: `MCP Server '${server_id}' is disabled.`,
        },
        original_request: requestBody,
      },
      { status: 403 } // Forbidden
    );
  }

  // --- Connector Logic --- 
  try {
    const connector = await getConnector(serverConfig);

    if (!connector) {
      return NextResponse.json(
        {
          status: 'error',
          error: {
            code: 'CONNECTOR_NOT_FOUND',
            message: `No connector available for server type '${serverConfig.type}'.`,
          },
          original_request: requestBody,
        },
        { status: 501 } // Not Implemented
      );
    }

    await connector.initialize(serverConfig);
    const result = await connector.executeTool(tool_name, tool_input, request_context);

    return NextResponse.json({
      status: 'success',
      server_id: server_id,
      tool_name: tool_name,
      tool_output: result,
      original_request: requestBody,
    });

  } catch (error: any) {
    console.error(`Error during MCP connector execution for server ${server_id}:`, error);
    return NextResponse.json(
      {
        status: 'error',
        server_id: server_id,
        tool_name: tool_name,
        error: {
          code: 'CONNECTOR_EXECUTION_ERROR',
          message: error.message || 'An unexpected error occurred with the connector.',
          details: error.stack, // Consider sanitizing or omitting in production
        },
        original_request: requestBody,
      },
      { status: 500 }
    );
  }
  // --- End Connector Logic ---
}

// Optional: Handle GET or other methods if needed for testing/health check
export async function GET() {
  return NextResponse.json({ message: 'MCP Client API endpoint. Use POST to interact with configured MCP servers.' });
}
