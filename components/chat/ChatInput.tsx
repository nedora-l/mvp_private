"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, SendHorizontal, Plus, Wrench} from 'lucide-react'; // Added MicOff
import { Dictionary } from '@/locales/dictionary';

import { useI18n } from '@/lib/i18n/use-i18n'; 

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onPlusClick?: () => void; // Changed from onAttachFile to onPlusClick for clarity
  onToolsClick?: () => void; // Added for the new Tools button
  onStreamMessage?: (message: string) => Promise<void>;
  onAudioStreamMessage?: (message: string) => Promise<void>;
  onAudioRecording?: (audioData: Blob) => Promise<void>; // New prop for actual audio recording
  dictionary: Dictionary; // Using the imported Dictionary type
  isSending?: boolean;
}

// Simple Input component for the chat page
const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onPlusClick, 
  onToolsClick, 
  onStreamMessage, 
  onAudioStreamMessage, 
  onAudioRecording,
  dictionary, 
  isSending 
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { t } = useI18n(dictionary); // Initialize t function
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleStream = ( ) => {
    if (onStreamMessage && message.trim() && !isSending) {
      onStreamMessage(message.trim());
      setMessage('');
    }
  };
  
  const handleAudioStream = ( ) => {
    if (onAudioStreamMessage && message.trim() && !isSending) {
      onAudioStreamMessage(message.trim());
      setMessage('');
    }
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });
      
      setMediaStream(stream);
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunks.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm;codecs=opus' });
        if (onAudioRecording) {
          await onAudioRecording(audioBlob);
        }
        stopRecording();
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    setMediaRecorder(null);
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);
  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4  bg-card">
      {onPlusClick && (
        <Button onClick={onPlusClick} variant="ghost" size="icon" type="button" aria-label={t('chat.page.input.plusButtonLabel') || "Add options"} disabled={isSending}>
          <Plus size={24} /> {/* Changed Icon and size */}
        </Button>
      )}
      {onToolsClick && (
        <Button onClick={onToolsClick} variant="ghost" size="sm" type="button" aria-label={t('chat.page.input.toolsButtonLabel') || "Tools"} disabled={isSending} className="ml-1 mr-1 px-2">
          <Wrench size={18} className="mr-1" /> {/* Added Wrench Icon */}
          {t('chat.page.input.toolsButtonText') || "Tools"}
        </Button>
      )}
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t('chat.page.input.placeholder') || "Type your message..."}
        className="flex-grow mx-2 bg-background focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={t('chat.page.input.placeholder') || "Message input"}
        disabled={isSending}
      />      {(onAudioStreamMessage || onAudioRecording) && (
        <Button 
          onClick={onAudioRecording ? toggleRecording : handleAudioStream} 
          variant="ghost" 
          size="icon" 
          type="button" 
          aria-label={isRecording ? (t('chat.page.input.stopRecordingLabel') || "Stop recording") : (t('chat.page.input.micLabel') || "Use microphone")} 
          className={`mr-2 ${isRecording ? 'text-red-500 bg-red-50 hover:bg-red-100' : ''}`} 
          disabled={isSending && !isRecording}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </Button>
      )}
      
      {onStreamMessage && (
        <Button onClick={handleStream} type="button" size="icon" color='warning' aria-label={t('chat.page.input.sendLabel') || "Send message"} disabled={isSending}>
          <SendHorizontal size={20} />
        </Button> 
      )}
      {!onStreamMessage && (
        <Button type="submit" size="icon" aria-label={t('chat.page.input.sendLabel') || "Send message"} disabled={isSending}>
          <SendHorizontal size={20} />
        </Button>
      )}
    </form>
  );
};
 
export default ChatInput;
