import { NextRequest, NextResponse } from 'next/server';
import { aiAgentsServerService } from '@/lib/services/server/ai-agents/ai-agents.server.service';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { UpdateAiAgentRequestDto } from '@/lib/services/server/ai-agents/ai-agents.dto';

// This would typically be imported from a shared data source
// const mockAIAgents: AIAgent[] = []; // Simplified for this endpoint

/**
 * Extract token from Authorization header
 */
function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * PATCH endpoint to update AI agent status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request);
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    // Only update the status field
    const updatedAgent = await aiAgentsServerService.updateAgent(token, Number(id), { status: body.status } as UpdateAiAgentRequestDto);
    const response: ApiResponse<any> = {
      status: 200,
      message: `AI Agent status updated to ${body.status}`,
      data: updatedAgent,
      type: 'RECORD_DETAILS',
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Update AI Agent status error:", error);
    return NextResponse.json(
      { 
        status: 500,
        message: "Failed to update AI agent status",
        data: null,
        type: "ERROR"
      }, 
      { status: 500 }
    );
  }
}
