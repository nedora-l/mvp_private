import { NextRequest, NextResponse } from 'next/server';
import { aiAgentsServerService } from '@/lib/services/server/ai-agents/ai-agents.server.service';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { UpdateAiAgentRequestDto } from '@/lib/services/server/ai-agents/ai-agents.dto';

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const { id } = params;
    const agent = await aiAgentsServerService.getAgentById(token, Number(id));
    if (!agent) {
      return NextResponse.json({ status: 404, message: 'AI Agent not found', data: null, type: 'ERROR' }, { status: 404 });
    }
    const response: ApiResponse<any> = {
      status: 200,
      message: 'Success',
      data: agent,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Get AI Agent error:', error);
    return NextResponse.json({ status: 500, message: 'Internal server error', data: null, type: 'ERROR' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const { id } = params;
    const body = await request.json();
    const updatedAgent = await aiAgentsServerService.updateAgent(token, Number(id), body as UpdateAiAgentRequestDto);
    const response: ApiResponse<any> = {
      status: 200,
      message: 'AI Agent updated successfully',
      data: updatedAgent,
      type: 'RECORD_DETAILS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Update AI Agent error:', error);
    return NextResponse.json({ status: 500, message: 'Failed to update AI agent', data: null, type: 'ERROR' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const { id } = params;
    await aiAgentsServerService.deleteAgent(token, Number(id));
    const response: ApiResponse<void> = {
      status: 200,
      message: 'AI Agent deleted successfully',
      type: 'SUCCESS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Delete AI Agent error:', error);
    return NextResponse.json({ status: 500, message: 'Failed to delete AI agent', data: null, type: 'ERROR' }, { status: 500 });
  }
}
