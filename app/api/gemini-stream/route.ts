import { type NextRequest, NextResponse } from "next/server"
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Session,
  MediaResolution,
  TurnCoverage,
} from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, message, audioBase64 } = body

    if (action === "connect") {
      // Validate API key exists
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          {
            error: "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.",
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Ready to connect to Gemini Live",
      })
    }

    if (action === "send_message" || action === "send_audio") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY is not set." },
          { status: 500 }
        );
      }

      let geminiSession: Session | undefined = undefined;

      try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'models/gemini-2.5-flash-preview-native-audio-dialog';

        const config = {
          responseModalities: [Modality.AUDIO, Modality.TEXT],
          mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } }
          },
          realtimeInputConfig: { turnCoverage: TurnCoverage.TURN_INCLUDES_ALL_INPUT },
        };        // Store response data
        let responseText = '';
        let responseAudio = '';
        let responseMimeType = '';
        let isComplete = false;

        // Create a promise that resolves when we get a complete response
        const responsePromise = new Promise<{text: string, audioData: string, mimeType: string}>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Response timeout'));
          }, 30000); // 30 second timeout

          ai.live.connect({
            model,
            config,
            callbacks: {
              onopen: () => {
                console.log('Gemini Live session opened');
              },
              onmessage: (msg: LiveServerMessage) => {
                console.log('Received message from Gemini Live:', msg);
                
                const textPart = msg.serverContent?.modelTurn?.parts?.find(p => p.text)?.text;
                if (textPart) {
                  responseText += textPart;
                }

                const audioPart = msg.serverContent?.modelTurn?.parts?.find(p => p.inlineData);
                if (audioPart?.inlineData?.data && audioPart.inlineData.mimeType) {
                  responseAudio += audioPart.inlineData.data;
                  responseMimeType = audioPart.inlineData.mimeType;
                }                if (msg.serverContent?.turnComplete) {
                  isComplete = true;
                  clearTimeout(timeoutId);
                  resolve({
                    text: responseText || "I received your message.",
                    audioData: responseAudio,
                    mimeType: responseMimeType || "audio/wav"
                  });
                  if (geminiSession && typeof geminiSession.close === 'function') {
                    geminiSession.close();
                    geminiSession = undefined;
                  }
                }
              },              onerror: (e: ErrorEvent) => {
                console.error('Gemini Live session error:', e.message);
                clearTimeout(timeoutId);
                reject(new Error(e.message));
                if (geminiSession && typeof geminiSession.close === 'function') {
                  geminiSession.close();
                  geminiSession = undefined;
                }
              },
              onclose: (e: CloseEvent) => {
                console.log('Gemini Live session closed:', e.reason);
                if (!isComplete) {
                  clearTimeout(timeoutId);
                  reject(new Error('Session closed before completion'));
                }
                geminiSession = undefined;
              },
            },
          }).then((session) => {
            geminiSession = session;
              // Send the message or audio after connection is established
            if (action === "send_message" && message) {
              return session.sendClientContent({
                turns: [{
                  parts: [{ text: message }]
                }]
              });
            } else if (action === "send_audio" && audioBase64) {
              return session.sendClientContent({
                turns: [{
                  parts: [{ 
                    inlineData: {
                      mimeType: "audio/wav",
                      data: audioBase64
                    }
                  }]
                }]
              });
            }
          }).catch((error) => {
            clearTimeout(timeoutId);
            reject(error);
          });
        });

        // Wait for response
        const response = await responsePromise;

        return NextResponse.json({
          success: true,
          response: response.text,
          audioResponse: response.audioData ? {
            mimeType: response.mimeType,
            data: response.audioData,
          } : undefined,
        });      } catch (error) {
        console.error("Failed to process request:", error);
        if (geminiSession && typeof (geminiSession as any).close === 'function') {
          (geminiSession as any).close();
          geminiSession = undefined;
        }
        return NextResponse.json(
          {
            error: "Failed to process request",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Gemini Stream API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
