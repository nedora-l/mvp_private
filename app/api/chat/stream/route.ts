import { type NextRequest, NextResponse } from "next/server"
import { ApiResponse, ApiResponseTYPE, HateoasResponse } from "@/lib/interfaces/apis/common";
import { aiChatServerService } from "@/lib/services/server/chat/ai.chat.server.service";
import { ChatSessionListItemDto, ChatSessionResponseDto, CreateChatSessionRequestDto } from "@/lib/interfaces/apis/chat";
import { DEFAULT_BASE_URL } from "@/lib/constants/global";

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

    // Choose base URL based on environment
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_BASE_URL;
      
    const { message, history } = await request.json();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch(`${baseUrl}/api/v2/chats/stream`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ message, history }),
          });

          const reader = response.body?.getReader();
          if (!reader) throw new Error('No reader available');

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
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