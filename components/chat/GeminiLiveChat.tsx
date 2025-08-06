'use client';

import { DEFAULT_SYSTEM_INSTRUCTION, DEFAULT_VOICE_NAME } from '@/lib/constants/global';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react'; // Added X icon

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  timestamp: Date;
}

interface ApiResponse {
  text?: string;
  audioUrl?: string;
  error?: string;
}

// Added props interface
interface GeminiLiveChatProps {
  onClose?: () => void;
}

export default function GeminiLiveChat({ onClose }: GeminiLiveChatProps) { // Added onClose to props
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingVoiceName, setIsShowingVoiceName] = useState(false);
  const [voiceName, setVoiceName] = useState(DEFAULT_VOICE_NAME); // Default voice name
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/chat/gen-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          DEFAULT_SYSTEM_INSTRUCTION,
          voiceName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || 'No text response received',
        audioUrl: data.audioUrl,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-play audio if available
      if (data.audioUrl && audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play().catch(console.error);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(console.error);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <Card className="flex flex-col w-full h-full shadow-2xl rounded-lg border bg-card text-card-foreground overflow-hidden">
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Chat</CardTitle>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </CardHeader>

      {isShowingVoiceName && (
        <CardHeader className="p-3 border-b"> {/* Reduced padding */}
          <CardTitle className="text-base mb-2">Voice Configuration</CardTitle> {/* Adjusted title size */}
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label htmlFor="voiceName" className="block text-xs font-medium text-gray-600 mb-1">
                Voice Name
              </label>
              <select
                id="voiceName"
                title="Voice Name"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Kore">Kore</option>
                <option value="Charon">Charon</option>
                <option value="Fenrir">Fenrir</option>
                <option value="Aoede">Aoede</option>
              </select>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50"> {/* Reduced padding */}
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 py-6">
            <p className="text-sm">No messages yet. Start a conversation!</p>
            <p className="text-xs mt-1">Try asking: "Who are you?"</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.audioUrl && (
                <div className="mt-1.5">
                  <button
                    onClick={() => playAudio(message.audioUrl!)}
                    className="flex items-center space-x-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Play</span>
                  </button>
                </div>
              )}
              <p className="text-xs mt-1 opacity-60 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 max-w-[80%] px-3 py-2 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-700"></div>
                <span className="text-xs">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {error && (
        <div className="bg-red-50 border-t border-b border-red-200 text-red-700 px-4 py-2 text-xs">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <CardFooter className="p-2 border-t"> {/* Removed bg-white and rounded-b-lg */}
        <div className="w-full">
          <div className="flex space-x-2 items-end">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type message..."
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={1}
              disabled={isLoading}
              style={{ maxHeight: '80px', overflowY: 'auto' }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
              ) : (
                'Send'
              )}
            </button>
          </div>
          <div className="flex justify-between items-center mt-1.5 px-1">
            <button
              onClick={clearMessages}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
            <button
              onClick={() => setIsShowingVoiceName(!isShowingVoiceName)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {isShowingVoiceName ? 'Hide Voice Config' : 'Voice Config'}
            </button>
          </div>
        </div>
      </CardFooter>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />
    </Card>
  );
}