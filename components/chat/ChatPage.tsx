"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dictionary } from '@/locales/dictionary';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/use-i18n'; // Import useI18n
import { chatApiClient } from '@/lib/services/client/chat/ai.chat.client.service';
import { AddMessageRequestDto, ChatMessageResponseDto, ChatSessionResponseDto } from '@/lib/interfaces/apis/chat';
import { remark } from 'remark';
import html from 'remark-html';

import { getStoredToken } from '@/lib/services';
import ChatInput from './ChatInput';
import ChatPageHeader from './ChatPageHeader';
import ChatMessageItem from './ChatMessageItem';
import AiDynamicIcon from '../lotties/AiDynamicIcon';


interface ChatPageProps {
   locale: string;
   dictionary: Dictionary;
   sessionId?: string; 
}

// generate contentMd
export const buildMessage = async (content: ChatMessageResponseDto): Promise<ChatMessageResponseDto> => {
  const processedContent = await remark().use(html).process(content.content);
  console.log('HTML content:', processedContent.toString());
  return {
    ...content,
    contentMd:  processedContent.toString(),
  };
};

// Helper function to play audio (simplified)
export const playAudioData = async (base64Data: string, mimeType: string, audioContext: AudioContext | null) => {
  if (!audioContext || !base64Data) return;

  try {
    const audioData = atob(base64Data); // Decode base64
    const arrayBuffer = new ArrayBuffer(audioData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < audioData.length; i++) {
      uint8Array[i] = audioData.charCodeAt(i);
    }

    // decodeAudioData can handle various formats if the browser supports them.
    // For raw PCM like 'audio/L16; rate=16000', more complex handling might be needed
    // to construct an AudioBuffer manually if decodeAudioData fails.
    // However, Gemini might also send more common formats like 'audio/ogg' or 'audio/mpeg'.
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
    console.log("Audio playback started for mimeType:", mimeType);
  } catch (e) {
    console.error("Error playing audio:", e, "MIME Type:", mimeType, "Data (first 100 chars):", base64Data.substring(0,100));
  }
};


const ChatPage: React.FC<ChatPageProps> = ({ dictionary, locale, sessionId }) => {
  const [messages, setMessages] = useState<ChatMessageResponseDto[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [chatSession, setChatSession] = useState<ChatSessionResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const scrollAreaRef = React.useRef<HTMLDivElement>(null); // For auto-scrolling
  const { t } = useI18n(dictionary); // Initialize t function
  const token =  getStoredToken();
  const audioContextRef = React.useRef<AudioContext | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported by this browser.", e);
      }
    }
    return () => {
        // Clean up AudioContext if necessary, though usually it's fine to keep one instance
        // if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        //   audioContextRef.current.close();
        // }
    };
  }, []);

  const handleGeminiStreamMessage = async (newMessageText: string) => {
    setIsSending(true);
    const newUserMessage: ChatMessageResponseDto = {
      id: Date.now().toString(),
      content: newMessageText,
      role: "USER",
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const aiMessageId = `ai-${Date.now()}`;
    let accumulatedTextContent = ""; // For text parts
    let currentAiMessage: ChatMessageResponseDto = {
        id: aiMessageId,
        content: "...", // Placeholder
        role: "ASSISTANT",
        timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, currentAiMessage]);
    //app\api\v1\chat\gen-ai\route.ts
    const eventSource = new EventSource('/api/gemini-live-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      message: newMessageText,
      // You can add systemInstruction and voiceName here if needed
      systemInstruction: "You're Name is AIDA, a very helpful assistant, your are an AI Voice agent Assistant for D&A Technologies, Hence you got your name A.I. D.A." +
                          "You can speak so many languages, but since you're Morrocan you feel better talking darrija (Morrocan arabic dialect), then Arabic, French, English and lebenase" +
                          "please be very helpful for users",
      voiceName: "Aoede"
    }),
    } as any); // Cast to any for method/body, or use a fetch-based SSE wrapper
    eventSource.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'text') {
        accumulatedTextContent += data.content;
        currentAiMessage = { ...currentAiMessage, content: accumulatedTextContent };
         const processedMessage = await buildMessage(currentAiMessage);
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === aiMessageId ? processedMessage : msg))
        );
      } else if (data.type === 'audio' && data.data && data.mimeType) {
        console.log("Received audio data chunk, mimeType:", data.mimeType);
        if (audioContextRef.current) {
          playAudioData(data.data, data.mimeType, audioContextRef.current);
        } else {
          console.warn("AudioContext not available, cannot play audio.");
        }
      } else if (data.type === 'status') {
        console.log("Gemini Status:", data.content);
      } else if (data.type === 'turnComplete') {
        console.log("Gemini Turn Complete.");
      }
    };
    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      setError('Failed to stream message from Gemini');
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessageId ? { ...msg, content: "Error receiving response." } : msg
        )
      );
      eventSource.close();
      setIsSending(false);
    };    // Note: EventSource doesn't have a direct 'onclose' for when the *server* closes the stream normally.
    // The server closing the stream after 'turnComplete' or 'endInteraction' will effectively stop messages.
    // The 'onerror' above handles network errors or if the server sends an error.
  };

  const handleAudioRecording = async (audioBlob: Blob) => {
    setIsSending(true);
    
    try {
      // Convert audio blob to base64 for sending to API
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Add a placeholder message for user audio
      const newUserMessage: ChatMessageResponseDto = {
        id: Date.now().toString(),
        content: "🎵 Audio message",
        role: "USER",
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      const aiMessageId = `ai-${Date.now()}`;
      let accumulatedTextContent = "";
      let currentAiMessage: ChatMessageResponseDto = {
          id: aiMessageId,
          content: "...", 
          role: "ASSISTANT",
          timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, currentAiMessage]);

      // Send audio to Gemini Live API
      const response = await fetch('/api/v1/chat/gen-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'audio',
          audioData: base64Audio,
          mimeType: audioBlob.type,
          systemInstruction: "You're Name is AIDA, a very helpful assistant, your are an AI Voice agent Assistant for D&A Technologies, Hence you got your name A.I. D.A." +
                            "You can speak so many languages, but since you're Morrocan you feel better talking darrija (Morrocan arabic dialect), then Arabic, French, English and lebenase" +
                            "please be very helpful for users",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'text') {
                accumulatedTextContent += data.content;
                currentAiMessage = { ...currentAiMessage, content: accumulatedTextContent };
                const processedMessage = await buildMessage(currentAiMessage);
                setMessages((prevMessages) =>
                  prevMessages.map((msg) => (msg.id === aiMessageId ? processedMessage : msg))
                );
              } else if (data.type === 'audio' && data.data && data.mimeType) {
                console.log("Received audio data chunk, mimeType:", data.mimeType);
                if (audioContextRef.current) {
                  playAudioData(data.data, data.mimeType, audioContextRef.current);
                } else {
                  console.warn("AudioContext not available, cannot play audio.");
                }
              } else if (data.type === 'status') {
                console.log("Gemini Status:", data.content);
              } else if (data.type === 'turnComplete') {
                console.log("Gemini Turn Complete.");
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending audio:', error);
      setMessages((prevMessages) => [...prevMessages, {
        id: Date.now().toString(),
        content: "Error processing audio message.",
        role: "ASSISTANT",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const refreshConversation = ()   => {
    setIsLoading(true);
    setError(null);
    chatApiClient.getChatSessionById(sessionId || "current")
      .then((response) => {
        setChatSession(response.data || null);
        if (response.data?.messages) {
          setMessages([]);
          for (let index = 0; index < response.data.messages.length; index++) {
            const element:ChatMessageResponseDto = response.data.messages[index];
            buildMessage(element).then((newMessage) => {
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
          }
        }
      })
      .catch((error) => {
        setError('Failed to fetch conversations');
      })
      .finally(() => {
        setIsLoading(false);
      });
    // In a real app, this would likely navigate to the chat or load it.
  };
  
  const handleSendMessage = async (newMessageText: string) => {
    setIsSending(true);
    setIsLoading(true);
    const newUserMessage: ChatMessageResponseDto = {
      id: Date.now().toString(), // Ensure unique ID
      content: newMessageText,
      role: "USER",
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    console.log("New message sent to mock API:", newMessageText);
    chatApiClient.addMessageToChat(sessionId || "current",{sessionId: sessionId || "current", content: newMessageText} as AddMessageRequestDto).then((response) =>  {
        console.log('addMessageToChat fetched:', response);
        if (response.data) {
           buildMessage(response.data).then((newMessage) => {
              console.log('New message:', newMessage);
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching conversations:', error);
        setError('Failed to fetch conversations');
      })
      .finally(() => {
        setIsLoading(false);
        setIsSending(false);
      });;
     
  };

  const handleStreamMessage = async (newMessageText: string) => {
    setIsSending(true);
    setIsLoading(true);
    const newUserMessage: ChatMessageResponseDto = {
      id: Date.now().toString(), // Ensure unique ID
      content: newMessageText,
      role: "USER",
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const streamRequest: AddMessageRequestDto = { chatSessionId: sessionId || "current", content: newMessageText };
    console.log("New message sent to mock API:", newMessageText);
    let accumulatedContent = "";
    const aiMessageId = `ai-${Date.now()}`;

    try {
      // chatApiClient.streamMessageToChat returns an AsyncIterable<string>
      const stream = chatApiClient.streamMessageToChat(token || "",sessionId || "current", streamRequest);
      
      // Iterate directly over the async iterable
      for await (const chunk of stream) {
        accumulatedContent += chunk;
        // Update the content of the existing AI message placeholder
         const newAiMessage: ChatMessageResponseDto = {
          id: aiMessageId,
          content: chunk,
          role: "ASSISTANT",
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, newAiMessage]);
      }

      // Final update with processed HTML content
      const finalAiMessage: ChatMessageResponseDto = {
        id: aiMessageId,
        content: accumulatedContent,
        role: "ASSISTANT",
        timestamp: new Date().toISOString(), // Or use the timestamp from initialAiMessage
      };
      const processedMessage = await buildMessage(finalAiMessage);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessageId ? processedMessage : msg
        )
      );

    } catch (error) {
      console.error('Error streaming message:', error);
      setError('Failed to stream message');
      // Optionally remove or update the placeholder AI message on error
      setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== aiMessageId));
      // Or update with an error message
      // setMessages((prevMessages) =>
      //   prevMessages.map((msg) =>
      //     msg.id === aiMessageId ? { ...msg, content: "Error receiving message." } : msg
      //   )
      // );
    } finally {
      setIsLoading(false);
      setIsSending(false);
    }
  };

  useEffect(() => {
    if(chatSession) {
      console.log('Chat session:', chatSession);
    }
    else {
      console.log('No chat session available');
      refreshConversation();
    }
  }, [chatSession]);

  useEffect(() => {
    if (messages.length > 0 && scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-available bg-muted/40"> 
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        <ChatPageHeader
          dictionary={dictionary}
          locale={locale}
          sessionId={sessionId}
          chatSession={chatSession}
          refreshConversation={refreshConversation}
        />
        {/* Message Display Area */}
        <ScrollArea className="flex-grow" ref={scrollAreaRef} style={{maxHeight: 'calc(100vh - 200px)', overflow: 'auto'}} > 
          <div className="p-4 space-y-4" >
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                dictionary={dictionary}
                locale={locale}
                chatMessage={msg}
                isLastMessage={msg.id === messages[messages.length - 1]?.id}
                onMessageSent={handleSendMessage}
              />
            ))}

            { isSending && (
              <div  className="flex w-full justify-start">
                <div className="max-w-[75%] lg:max-w-[65%] px-4 py-2.5 rounded-xl shadow-sm break-words transition-all duration-150 ease-out bg-card text-card-foreground border rounded-bl-none" > 
                  <div className="w-22 mx-auto" style={{ height: '22px', width: '22px' }}>
                    <AiDynamicIcon />
                  </div>
                </div>
              </div>
            )}

          </div>
        </ScrollArea>
        {/* Chat Input Area */}
        <ChatInput 
          onSendMessage={handleSendMessage} 
          onStreamMessage={handleStreamMessage} 
          onAudioStreamMessage={handleGeminiStreamMessage} 
          onAudioRecording={handleAudioRecording}
          dictionary={dictionary} 
          isSending={isSending} 
        />
      </main>
    </div>
  );
};

export default ChatPage;