import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE, HateoasResponse } from "@/lib/interfaces/apis/common";
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

    const body = await request.json() as CreateChatSessionRequestDto;

    const data: ChatSessionResponseDto = await aiChatServerService.createChatSession(token, body);
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
    //get page and limit from query params
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const size = url.searchParams.get("size");
    console.log("page:", page);
    console.log("size:", size);
    const data: HateoasResponse<ChatSessionListItemDto> = await aiChatServerService.getUserChatSessionPages(token, { page: Number(page) || 1, size: Number(size) || 10 });
    const response: ApiResponse<HateoasResponse<ChatSessionListItemDto>> = {
      status: 200,
      message: "Success",
      data: data,
      type: ApiResponseTYPE.HATEOAS_RECORD_LIST
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(" error:", error);
    return NextResponse.json(
      { 
        status: 500,
        message: "Internal server error",
        data: null,
        type: ApiResponseTYPE.ERROR
      }, 
      { status: 500 }
    );
  }
}