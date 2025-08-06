import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/lib/interfaces/apis/common";
import { aiChatServerService } from "@/lib/services/server/chat/ai.chat.server.service";
import { AddMessageRequestDto, ChatMessageResponseDto, ChatSessionListItemDto, ChatSessionResponseDto, CreateChatSessionRequestDto } from "@/lib/interfaces/apis/chat";

/**
 * Extract token from Authorization header
 */
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}


export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    // If no token provided, return 401 Unauthorized
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }

    const body = await request.json() as AddMessageRequestDto;

    const data: ChatMessageResponseDto = await aiChatServerService.addMessageToChat(token, body.chatSessionId || 'current', body);
    const response: ApiResponse<ChatMessageResponseDto> = {
      status: 200,
      message: "Success",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(" error:", error);
    return NextResponse.json(
      { 
        status: 500,
        message: "Internal server error",
        data: null,
        type: "ERROR"
      }, 
      { status: 500 }
    );
  }
}


export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request);
    // If no token provided, return 401 Unauthorized
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }
    const data: ChatSessionListItemDto[] = await aiChatServerService.getUserChatSessions(token);
    const response: ApiResponse<ChatSessionListItemDto[]> = {
      status: 200,
      message: "Success",
      data: data,
      type: "RECORD_DETAILS"
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(" error:", error);
    return NextResponse.json(
      { 
        status: 500,
        message: "Internal server error",
        data: null,
        type: "ERROR"
      }, 
      { status: 500 }
    );
  }
}