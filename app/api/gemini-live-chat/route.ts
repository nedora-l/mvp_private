import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Session,
  MediaResolution,
  TurnCoverage,
  // You might need other specific types from @google/genai if you expand config
} from '@google/genai';

export async function POST(request: NextRequest) {
  const {
    message,
    systemInstruction: clientSystemInstruction, // Allow client to send system instruction
    voiceName: clientVoiceName, // Allow client to specify voice
  } = await request.json();

  let geminiSession: Session | undefined = undefined;

  try {
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            controller.error(new Error("GEMINI_API_KEY is not set."));
            return;
          }

          const ai = new GoogleGenAI({ apiKey });
          const model = 'models/gemini-2.5-flash-preview-native-audio-dialog'; // Or make configurable

          const config: any = { // Use 'any' for config flexibility or define a strict type
            responseModalities: [Modality.AUDIO, Modality.TEXT], // Expect both text and audio
            mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: clientVoiceName || 'Aoede' } }
            },
            realtimeInputConfig: { turnCoverage: TurnCoverage.TURN_INCLUDES_ALL_INPUT },
          };

          if (clientSystemInstruction) {
            config.systemInstruction = { parts: [{ text: clientSystemInstruction }] };
          }
          // if (tools) config.tools = tools; // If you plan to use tools

          geminiSession = await ai.live.connect({
            model,
            config,
            callbacks: {
              onopen: () => {
                console.log('Gemini session opened for request');
                controller.enqueue(`data: ${JSON.stringify({ type: 'status', content: 'connected' })}\n\n`);
              },
              onmessage: (msg: LiveServerMessage) => {
                const textPart = msg.serverContent?.modelTurn?.parts?.find(p => p.text)?.text;
                if (textPart) {
                  controller.enqueue(`data: ${JSON.stringify({ type: 'text', content: textPart })}\n\n`);
                }

                const audioPart = msg.serverContent?.modelTurn?.parts?.find(p => p.inlineData);
                if (audioPart?.inlineData?.data && audioPart.inlineData.mimeType) {
                  controller.enqueue(`data: ${JSON.stringify({ type: 'audio', mimeType: audioPart.inlineData.mimeType, data: audioPart.inlineData.data })}\n\n`);
                }

                if (msg.serverContent?.turnComplete) {
                   controller.enqueue(`data: ${JSON.stringify({ type: 'turnComplete' })}\n\n`);
                }

                //msg.serverContent?.endInteraction ||
                if ( (msg.serverContent?.turnComplete && !msg.serverContent?.modelTurn?.parts?.length)) {
                    console.log('Gemini interaction ended or turn complete with no further parts, closing stream.');
                    try { controller.close(); } catch (e) { /* Controller might be already closing/closed */ }
                    geminiSession?.close();
                    geminiSession = undefined;
                }
              },
              onerror: (e: ErrorEvent) => {
                console.error('Gemini session error for request:', e.message);
                controller.error(new Error(e.message));
                geminiSession?.close();
                geminiSession = undefined;
              },
              onclose: (e: CloseEvent) => {
                console.log('Gemini session closed for request:', e.reason);
                try { controller.close(); } catch (e) { /* Controller might be already closing/closed */ }
                geminiSession = undefined;
              },
            },
          });

          if (message && geminiSession) {
            geminiSession.sendClientContent({ turns: [message] });
          } else if (!geminiSession) {
            controller.error(new Error("Gemini session could not be established."));
          }

        } catch (initError: any) {
          console.error("Failed to initialize Gemini session within stream:", initError);
          controller.error(initError instanceof Error ? initError : new Error(initError.message || 'Failed to initialize Gemini session'));
          if (geminiSession) {
            geminiSession.close();
            geminiSession = undefined;
          }
        }
      },
      cancel() {
        console.log("Client disconnected, closing Gemini session for request.");
        if (geminiSession) {
          geminiSession.close();
          geminiSession = undefined;
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("Error in Gemini live chat API route:", error);
    if (geminiSession  ) {
        //geminiSession?.close();
    }
    return NextResponse.json({ error: (error as Error).message || "Internal server error" }, { status: 500 });
  }
}