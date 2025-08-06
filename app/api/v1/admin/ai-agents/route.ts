import { NextRequest, NextResponse } from 'next/server';
import { aiAgentsServerService } from '@/lib/services/server/ai-agents/ai-agents.server.service';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { CreateAiAgentRequestDto } from '@/lib/services/server/ai-agents/ai-agents.dto';
import { CreateAIAgentDto } from '@/lib/interfaces/apis';

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const agentsResponse = await aiAgentsServerService.getAllAgentsGlobally(token);
    const agents = agentsResponse._embedded?.aiAgentDtoList || [];
    const response: ApiResponse<any[]> = {
      status: 200,
      message: 'Success',
      data: agents,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('AI Agents API error:', error);
    return NextResponse.json({ status: 500, message: 'Internal server error', data: null, type: 'ERROR' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Creating new AI Agent...');

    const token = extractToken(request);
    console.log('Token extracted:', token);

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const body:CreateAIAgentDto = await request.json();
    // Assume body matches CreateAiAgentRequestDto
    console.log('AI Agent body:', body);

    /**
     * 
  structuredOutput: boolean;
  responseFormat: 'text' | 'json' | 'xml' | 'md' | 'html';
  responseSchema?: string;
     */
    const bodyDto: CreateAiAgentRequestDto = {
      name: body.name,
      description: body.description,
      model: body.configuration?.model,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      enabled: true,
      systemPrompt: body.configuration?.systemPrompt,
      returnObject: body.configuration?.responseSchema || '',
      metaKeywords: body.tags?.join(', ') || '',
      responseFormat: body.configuration?.responseFormat,
      structuredResponse: body.configuration?.structuredOutput,
      temperature: body.configuration?.temperature,
      maxTokens: body.configuration?.maxTokens,
      mcpConfig: body.configuration?.mcpConfig,
      dynamicDbTables: body.configuration?.knowledgeBaseIds?.join(', ') || '',
    };
    const newAgent = await aiAgentsServerService.createAgent(token, bodyDto );
    const response: ApiResponse<any> = {
      status: 201,
      message: 'AI Agent created successfully',
      data: newAgent,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Create AI Agent error:', error);
    return NextResponse.json({ status: 500, message: 'Failed to create AI agent', data: null, type: 'ERROR' }, { status: 500 });
  }
}
