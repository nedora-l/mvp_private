"use client";
import React, { useState } from 'react';
import { MessageSquarePlus, History, Zap } from 'lucide-react';
import { Dictionary } from '@/locales/dictionary';
import { useI18n } from '@/lib/i18n/use-i18n';
import ChatHistory from './ChatHistory';
import { AddMessageRequestDto, ChatMessageResponseDto, ChatSessionResponseDto, CreateChatSessionRequestDto } from '@/lib/interfaces/apis/chat';
import { chatApiClient } from '@/lib/services/client/chat/ai.chat.client.service';
import ChatInput from './ChatInput';
import { getStoredToken } from '@/lib/services';
import AiDynamicIcon from '../lotties/AiDynamicIcon';
import { useSession } from 'next-auth/react';
import { buildMessage, playAudioData } from './ChatPage';

interface ChatWelcomeProps {
  dictionary: Dictionary;
  locale: string;
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ dictionary, locale }) => {
    const [isSending, setIsSending] = useState(false);
    const [messages, setMessages] = useState<ChatMessageResponseDto[]>([]);
    const [chatSession, setChatSession] = useState<ChatSessionResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session, status } = useSession() ;
    const currentUser = session?.user || null ; // as UserProfileMin
    console.log('Current User:', currentUser);
    const token =  getStoredToken();
    console.log('Token:', token);
    const { t } = useI18n(dictionary);
    const audioContextRef = React.useRef<AudioContext | null>(null);
  
  
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
      };
      // Note: EventSource doesn't have a direct 'onclose' for when the *server* closes the stream normally.
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
  
  const handleSendMessage = async (newMessageText: string) => {
    setIsSending(true);
    console.log("New message sent to mock API:", newMessageText);
    const chatDto:CreateChatSessionRequestDto = { initialMessage: newMessageText };
    chatApiClient.createChatSession(chatDto).then((response) =>  {
        console.log('createChatSession fetched:', response);
        if (response.data) {
            window.location.href = `/${locale}/app/chat/${response.data.id}`;
        }
      })
      .catch((error) => {
        console.error('Error fetching conversations:', error);
      })
      .finally(() => {
        setIsSending(false);
      });

  };

  // onLoadChat={onLoadChat}  itemCount={3}, startNewChat, loadChat 
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background p-4 sm:p-8 md:p-6 text-center">
      <div className="w-24 sm:w-28 lg:w-32 xl:w-48 mx-auto"> <AiDynamicIcon /> </div>
      <h1 className="text-xl sm:text-3xl  lg:text-4xl mb-0 md:mb-1 lg:mb-1 bg-gradient-to-r from-[#0328f1] via-[#322fb5] to-[#c625df] bg-clip-text text-transparent">
        Hi {( `${currentUser?.name || ""}`).split(" ")[0]}, 
      </h1>
      <h2 className="text-xl sm:text-2xl  lg:text-4xl  mb-1 md:mb-2 lg:mb-3 bg-gradient-to-r from-[#0328f1] via-[#322fb5] to-[#c625df] bg-clip-text text-transparent">
        {t('chat.welcome.title') || "Welcome to AI Chat"}
      </h2>
      <p className="text-sm sm:text-sm lg:text-lg text-muted-foreground  mb-1 md:mb-2 lg:mb-10 max-w-md">
        {t('chat.welcome.description') || "Start a new conversation or pick up where you left off. Let's explore together!"}
      </p>
      {/* Chat Input Area */}
      <div className='w-full max-w-2xl fixed md:relative lg:relative bottom-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-sm '>
          <ChatInput 
            onAudioStreamMessage={handleGeminiStreamMessage}
            onSendMessage={handleSendMessage}
            dictionary={dictionary}
            isSending={isSending} />
      </div>
      <div className="w-full max-w-2xl">
        <ChatHistory dictionary={dictionary} locale={locale} />
      </div>
      
      <div className="w-full max-w-2xl h-16"></div>
    </div>
  );
};

export default ChatWelcome;
