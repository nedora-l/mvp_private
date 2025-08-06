"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Mic, Settings2, SendHorizontal, MessageSquare, Palette, FileText, X, RefreshCcw } from 'lucide-react'; // Added X for mobile close
import { Dictionary } from '@/locales/dictionary';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"; // For mobile settings
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/use-i18n'; // Import useI18n
import { chatApiClient } from '@/lib/services/client/chat/ai.chat.client.service';
import { AddMessageRequestDto, ChatMessageResponseDto, ChatSessionResponseDto, CreateChatSessionRequestDto } from '@/lib/interfaces/apis/chat';
import { remark } from 'remark';
import html from 'remark-html';

import remarkParse from 'remark-parse'
import {unified} from 'unified'

// Local ChatMessage interface, consider aligning with a global one if available
interface ChatMessage {
  id: number | string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp?: Date;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStreamMessage?: (message: string) => void;

  dictionary: Dictionary; // Using the imported Dictionary type
  isSending?: boolean;
}

// Simple Input component for the chat page
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onStreamMessage, dictionary, isSending }) => {
  const [message, setMessage] = useState('');
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
  return (
    <form onSubmit={handleSubmit} className="flex items-center p-3 border-t bg-card">
      <Button variant="ghost" size="icon" type="button" aria-label={t('chat.page.input.attachFileLabel') || "Attach file"} disabled={isSending}>
        <Paperclip size={20} />
      </Button>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t('chat.page.input.placeholder') || "Type your message..."}
        className="flex-grow mx-2 bg-background focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={t('chat.page.input.placeholder') || "Message input"}
        disabled={isSending}
      />
      <Button variant="ghost" size="icon" type="button" aria-label={t('chat.page.input.micLabel') || "Use microphone"} className="mr-2" disabled={isSending}>
        <Mic size={20} />
      </Button>
      <Button type="submit" size="icon" aria-label={t('chat.page.input.sendLabel') || "Send message"} disabled={isSending}>
        <SendHorizontal size={20} />
      </Button>
      {onStreamMessage && (
        <Button onClick={handleStream} type="button" size="icon" color='warning' aria-label={t('chat.page.input.sendLabel') || "Send message"} disabled={isSending}>
          <SendHorizontal size={20} />
        </Button> 
      )}
      
    </form>
  );
};

interface ChatPageProps {
   locale: string;
   dictionary: Dictionary;
}

// generate contentMd
const buildMessage = async (content: ChatMessageResponseDto): Promise<ChatMessageResponseDto> => {
  const processedContent = await remark().use(html).process(content.content);
  console.log('HTML content:', processedContent.toString());
  return {
    ...content,
    contentMd:  processedContent.toString(),
  };
};

const NewChatPage: React.FC<ChatPageProps> = ({ dictionary, locale}) => {
  const [messages, setMessages] = useState<ChatMessageResponseDto[]>([]);
  const [isSending, setIsSending] = useState(false);

  const { t } = useI18n(dictionary); // Initialize t function

  const handleSendMessage = async (newMessageText: string) => {
    setIsSending(true);
    const newUserMessage: ChatMessageResponseDto = {
      id: Date.now().toString(), // Ensure unique ID
      content: newMessageText,
      role: "USER",
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

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

   

  const renderSettingsContent = () => (
    <div className="p-4 flex flex-col gap-6 h-full">
        <div className="flex items-center gap-2">
          <MessageSquare size={24} className="text-primary" />
          <h2 className="text-xl font-semibold">{t('chat.page.settingsTitle') || "AI Chat Settings"}</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2">
              <Palette size={18} />
              {t('chat.page.modelTitle') || "Model Configuration"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-model">{t('chat.page.modelLabel') || "AI Model"}</Label>
              <Select defaultValue="gpt-4-turbo">
                <SelectTrigger id="ai-model" aria-label={t('chat.page.modelLabel') || "Select AI Model"}>
                  <SelectValue placeholder={t('chat.page.selectModelPlaceholder') || "Select a model"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">{t('chat.page.temperatureLabel') || "Temperature"}</Label>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                defaultValue={[0.7]}
                aria-label={t('chat.page.temperatureLabel') || "Adjust Temperature"}
                className="my-3" // Added margin for better spacing
              />
              <p className="text-xs text-muted-foreground pt-1">
                {t('chat.page.temperatureDescription') || "Controls randomness. Lower is more deterministic."}
              </p>
            </div>
            <Button variant="outline" className="w-full mt-2">
              {t('chat.page.moreSettingsButton') || "Advanced Settings"}
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2">
              <FileText size={18} />
              {t('chat.page.contextFilesLabel') || "Context & Attachments"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-grow flex flex-col">
            <Button variant="outline" size="sm" className="w-full">
              {t('chat.page.uploadFileButton') || "Upload File"}
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              {t('chat.page.fileSizeLimit') || "Max file size: 5MB"}
            </div>
            <ScrollArea className="flex-grow mt-2 p-2 border rounded-md h-20">
              <div className="text-xs text-muted-foreground">
                {t('chat.page.noFilesUploaded') || "No files uploaded yet. Drag and drop or click upload."}
              </div>
              {/* Example of uploaded files list - can be dynamic */}
              {/* <ul className="text-xs space-y-1 mt-1">
                <li>📄 document1.pdf</li>
                <li>📄 notes_final.txt</li>
              </ul> */}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
  );

  return (
    <div className="flex flex-col h-available bg-muted/40"> 
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Unified Header for AI Tools */}
        <div className="p-3 border-b bg-card flex justify-between items-center">
          <h2 className="text-lg font-semibold md:hidden">{t('chat.page.mobileTitle') || "Chat AI"}</h2>
          <h2 className="text-lg font-semibold hidden md:block">{t('chat.page.desktopTitle', { defaultValue: "Chat" })}</h2>

          <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('chat.page.settingsTitle') || "Open Settings"}>
                <Settings2 size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 bg-card">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                    <MessageSquare size={20} className="text-primary" />
                    {t('chat.page.settingsTitle') || "AI Chat Settings"}
                </SheetTitle>
                 <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">{t('chat.page.closeSettings.label', { defaultValue: "Close" })}</span>
                </SheetClose>
              </SheetHeader>
              {renderSettingsContent()} 
            </SheetContent>
          </Sheet>
          </div>
        </div>
        
        {/* Message Display Area */}
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  msg.role.toLowerCase() === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] lg:max-w-[65%] px-4 py-2.5 rounded-xl shadow-sm break-words transition-all duration-150 ease-out",
                    msg.role.toLowerCase() === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card text-card-foreground border rounded-bl-none'
                  )}
                > 
                    {msg.contentMd && (<div dangerouslySetInnerHTML={{ __html: msg.contentMd }} />)}
                    {!msg.contentMd && (<p className="text-sm">{msg.content}</p> )}
                  {/* Markdown render */}
                  {msg.timestamp && (
                    <div className={cn(
                      "text-xs mt-1.5",
                      msg.role.toLowerCase() === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/80 text-left'
                    )}>
                      {new Date(msg.timestamp).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input Area */}
        <ChatInput onSendMessage={handleSendMessage} dictionary={dictionary} isSending={isSending} />
      </main>
    </div>
  );
};

export default NewChatPage;
