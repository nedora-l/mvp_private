import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenAI,
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
  TurnCoverage,
  Type,
} from '@google/genai';
import { promises as fs } from 'fs';
import path from 'path';
import { ensureWebSocketCompatibility } from '@/lib/utils/websocket-polyfill';
import { DEFAULT_SYSTEM_INSTRUCTION } from "@/lib/constants/global";

// Interfaces for better type safety
interface ChatRequest {
  message?: string;
  type?: 'text' | 'audio';
  audioData?: string; // base64 encoded audio
  mimeType?: string;
  systemInstruction?: string;
  voiceName?: string;
}

interface WavConversionOptions {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}

interface ChatResponse {
  text?: string;
  audioUrl?: string;
  error?: string;
}

// Class to encapsulate the Gemini Live session
class GeminiLiveSession {
  private session: Session | undefined;
  private responseQueue: LiveServerMessage[] = [];
  private audioParts: string[] = [];
  private ai: GoogleGenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'models/gemini-2.5-flash-preview-native-audio-dialog') {
    this.ai = new GoogleGenAI({ apiKey });
    this.model = model;
  }

  async connect(config: any, systemInstruction?: string): Promise<void> {
    const sessionConfig = { ...config };
    if (systemInstruction) {
      sessionConfig.context = {
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
      };
    }

    

    this.session = await this.ai.live.connect({
      model: this.model,
      callbacks: {
        onopen: () => console.debug('Gemini Live session opened'),
        onmessage: (message: LiveServerMessage) => {
          this.responseQueue.push(message);
        },
        onerror: (e: ErrorEvent) => {
          console.error('Gemini Live error:', e.message);
        },
        onclose: (e: CloseEvent) => {
          console.debug('Gemini Live session closed:', e.reason);
        },
      },
      config: sessionConfig, // Use the modified config
    });
  }  async sendMessage(message: string): Promise<ChatResponse> {
    if (!this.session) {
      throw new Error('Session not connected');
    }

    // Reset audio parts for new conversation
    this.audioParts = [];

    this.session.sendClientContent({
      turns: [{
        parts: [{
          text: message
        }]
      }]
    });

    const response = await this.handleTurn();
    return this.processResponse(response);
  }
  async sendAudioMessage(audioBuffer: Buffer, mimeType: string): Promise<ChatResponse> {
    if (!this.session) {
      throw new Error('Session not connected');
    }

    // Reset audio parts for new conversation
    this.audioParts = [];

    // Convert buffer to base64 for sending to Gemini Live
    const base64Audio = audioBuffer.toString('base64');

    // Send audio data to Gemini Live in the correct format
    this.session.sendClientContent({
      turns: [{
        parts: [{
          inlineData: {
            mimeType: mimeType,
            data: base64Audio
          }
        }]
      }]
    });

    const response = await this.handleTurn();
    return this.processResponse(response);
  }

  private async handleTurn(): Promise<LiveServerMessage[]> {
    const turn: LiveServerMessage[] = [];
    let done = false;

    while (!done) {
      const message = await this.waitMessage();
      turn.push(message);
      if (message.serverContent?.turnComplete) {
        done = true;
      }
    }

    return turn;
  }

  private async waitMessage(): Promise<LiveServerMessage> {
    return new Promise((resolve) => {
      const checkQueue = () => {
        const message = this.responseQueue.shift();
        if (message) {
          resolve(message);
        } else {
          setTimeout(checkQueue, 100);
        }
      };
      checkQueue();
    });
  }

  private async processResponse(messages: LiveServerMessage[]): Promise<ChatResponse> {
    let textResponse = '';
    let audioUrl: string | undefined;

    for (const message of messages) {
      // Handle tool calls
      if (message.toolCall) {
        await this.handleToolCalls(message);
      }

      // Process content
      if (message.serverContent?.modelTurn?.parts) {
        for (const part of message.serverContent.modelTurn.parts) {
          if (part.text) {
            textResponse += part.text;
          }

          if (part.inlineData && part.inlineData.mimeType?.includes('audio')) {
            this.audioParts.push(part.inlineData.data || '');
          }
        }
      }
    }

    // Process audio if available
    if (this.audioParts.length > 0) {
      audioUrl = await this.saveAudioFile();
    }

    return {
      text: textResponse || undefined,
      audioUrl
    };
  }

  private async handleToolCalls(message: LiveServerMessage): Promise<void> {
    if (!message.toolCall?.functionCalls || !this.session) return;

    const functionResponses = await Promise.all(
      message.toolCall.functionCalls.map(async (functionCall) => {
        console.log(`Executing function: ${functionCall.name}`, functionCall.args);
        
        // Handle different tool calls
        let response = '';
        switch (functionCall.name) {
          case 'getWeather':
            response = await this.getWeather(functionCall.args?.city?.toString() || '');
            break;
          default:
            response = 'Function not implemented';
        }

        return {
          id: functionCall.id,
          name: functionCall.name,
          response: { response }
        };
      })
    );

    this.session.sendToolResponse({ functionResponses });
  }

  private async getWeather(city: string): Promise<string> {
    // Implement actual weather API call here
    return `The weather in ${city} is sunny with 22°C`;
  }

  private async getDiscussion(city: string): Promise<string> {
    // Implement actual discussion API call here
    return `The discussion about ${city} is ongoing.`;
  }

  private async saveAudioFile(): Promise<string> {
    if (this.audioParts.length === 0) return '';

    const timestamp = Date.now();
    const fileName = `audio_${timestamp}.wav`;
    const filePath = path.join(process.cwd(), 'public', 'temp', fileName);

    // Ensure temp directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Convert and save audio
    const buffer = this.convertToWav(this.audioParts, 'audio/wav');
    await fs.writeFile(filePath, buffer);

    return `/temp/${fileName}`;
  }

  private convertToWav(rawData: string[], mimeType: string): Buffer {
    const options = this.parseMimeType(mimeType);
    const buffers = rawData.map(data => Buffer.from(data, 'base64'));
    const dataLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
    const wavHeader = this.createWavHeader(dataLength, options);

    return Buffer.concat([wavHeader, ...buffers]);
  }

  private parseMimeType(mimeType: string): WavConversionOptions {
    const [fileType, ...params] = mimeType.split(';').map(s => s.trim());
    const [, format] = fileType.split('/');

    const options: WavConversionOptions = {
      numChannels: 1,
      bitsPerSample: 16,
      sampleRate: 24000 // Default sample rate
    };

    if (format?.startsWith('L')) {
      const bits = parseInt(format.slice(1), 10);
      if (!isNaN(bits)) {
        options.bitsPerSample = bits;
      }
    }

    for (const param of params) {
      const [key, value] = param.split('=').map(s => s.trim());
      if (key === 'rate') {
        const rate = parseInt(value, 10);
        if (!isNaN(rate)) {
          options.sampleRate = rate;
        }
      }
    }

    return options;
  }

  private createWavHeader(dataLength: number, options: WavConversionOptions): Buffer {
    const { numChannels, sampleRate, bitsPerSample } = options;
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const buffer = Buffer.alloc(44);

    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataLength, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(byteRate, 28);
    buffer.writeUInt16LE(blockAlign, 32);
    buffer.writeUInt16LE(bitsPerSample, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataLength, 40);

    return buffer;
  }

  disconnect(): void {
    if (this.session) {
      this.session.close();
      this.session = undefined;
    }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Ensure WebSocket compatibility
    ensureWebSocketCompatibility();
    
    // Validate environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }    // Parse and validate request body
    let body: ChatRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { message, type = 'text', audioData, mimeType, systemInstruction, voiceName } = body;

    // Validate input based on type
    if (type === 'text' && (!message || typeof message !== 'string')) {
      return NextResponse.json(
        { error: 'Message is required and must be a string for text type' },
        { status: 400 }
      );
    }

    if (type === 'audio' && (!audioData || typeof audioData !== 'string')) {
      return NextResponse.json(
        { error: 'AudioData is required and must be a base64 string for audio type' },
        { status: 400 }
      );
    }

    const model = 'models/gemini-2.5-flash-preview-native-audio-dialog'    // Create session
    const geminiSession = new GeminiLiveSession(apiKey, model);

    const tools = [
      { googleSearch: {} },
    ];

    const config = {
      responseModalities: [
          Modality.AUDIO,
      ],
      mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
              voiceName: 'Aoede', // Default voice name
          }
        }
      },
      realtimeInputConfig: {
        turnCoverage: TurnCoverage.TURN_INCLUDES_ALL_INPUT,
      },
      contextWindowCompression: {
          triggerTokens: '25600',
          slidingWindow: { targetTokens: '12800' },
      },
    tools
    };

    const theSystemInstruction = DEFAULT_SYSTEM_INSTRUCTION ; // systemInstruction || "You are AIDA, a very helpful AI assistant ( made by `D&A Technologies` for `D&A Technologies`'s workspace management). You're name (A.I.D.A) is an Abbreviation of `Artificial Intelligence D&A Assistant.  Your primary goal is to assist the users in answering questions based on Company Data. You can speak so many languages : Arabic, French, English and morrocan dialect (Darija). You are designed to provide accurate and helpful responses, using the company data and tools available to you.";

    // Connect and send message
    await geminiSession.connect(config, theSystemInstruction);

    let response;
    if (type === 'audio' && audioData) {
      // Convert base64 to binary and send as audio
      const audioBuffer = Buffer.from(audioData, 'base64');
      response = await geminiSession.sendAudioMessage(audioBuffer, mimeType || 'audio/webm');
    } else {
      // Send text message
      response = await geminiSession.sendMessage(message || '');
    }
    
    // Clean up
    geminiSession.disconnect();

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in Gemini live chat API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}