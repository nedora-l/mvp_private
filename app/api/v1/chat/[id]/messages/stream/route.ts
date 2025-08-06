import { type NextRequest, NextResponse } from "next/server"
// ApiResponse might not be directly applicable for the main stream response,
// but can be used for error responses.
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


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
     // Await params before accessing its properties
      const resolvedParams = await params;
    
    const token = extractToken(request);
    // If no token provided, return 401 Unauthorized
    if (!token) {
      const errorResponse: ApiResponse<null> = {
        status: 401,
        message: "Authentication required",
        data: null,
        type: "ERROR"
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const body = await request.json() as AddMessageRequestDto;
    const chatId = resolvedParams.id; // Use chatId from the URL path

    // This service method should call your Spring Boot API and return an AsyncIterable<string>
    const streamData: AsyncIterable<string> = await aiChatServerService.streamMessageToChat(token, chatId, body);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamData) {
            // Format as Server-Sent Event
            // Assuming 'chunk' is the string content from your Spring Boot `chunk.getContent()`
            controller.enqueue(encoder.encode(`data: ${chunk}\\n\\n`));
          }
        } catch (error) {
          console.error("Error during stream generation:", error);
          // You might want to enqueue an error message to the client if the stream is already open
           const errorMessage = error instanceof Error ? error.message : "Stream error";
           controller.enqueue(encoder.encode(`event: error\\ndata: ${JSON.stringify({ message: errorMessage })}\\n\\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Error in POST stream route:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const errorResponse: ApiResponse<null> = {
        status: 500,
        message: errorMessage,
        data: null,
        type: "ERROR"
      };
    return NextResponse.json(errorResponse, { status: 500 });
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
    // It's good practice to return a JSON error response here too
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const errorResponse: ApiResponse<null> = {
        status: 500,
        message: errorMessage,
        data: null,
        type: "ERROR"
      };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}