import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/lib/interfaces/apis/common";
import { aiChatServerService } from "@/lib/services/server/chat/ai.chat.server.service";
import { ChatSessionListItemDto, ChatSessionResponseDto, CreateChatSessionRequestDto } from "@/lib/interfaces/apis/chat";

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
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const chatId = pathParts[pathParts.length - 1];
    console.log("Chat ID:", chatId);
    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" }, 
        { status: 400 }
      );
    }
    const data: ChatSessionResponseDto = await aiChatServerService.getChatSessionById(token,chatId);
    const response: ApiResponse<ChatSessionResponseDto> = {
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