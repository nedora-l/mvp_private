"use client";

import React, { useEffect, useState } from 'react'; // Added React
import { Dictionary } from '@/locales/dictionary';
import { useI18n } from '@/lib/i18n/use-i18n'; // Import useI18n
import { chatApiClient } from '@/lib/services/client/chat/ai.chat.client.service';
import { ChatMessageResponseDto, ChatSessionListItemDto } from '@/lib/interfaces/apis/chat';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface ChatMessageItemProps {
  dictionary: Dictionary;
  locale: string;
  chatMessage: ChatMessageResponseDto;
  isLastMessage?: boolean; // Optional prop to indicate if this is the last message in the chat
  onMessageSent?: (message: string) => Promise<void>; // Optional callback for when a message is sent
}

const MAX_LENGTH = 140; // Define a maximum length for the message content

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ dictionary, locale, chatMessage, isLastMessage = false, onMessageSent }) => {
  const { t } = useI18n(dictionary);
  const [isExpanded, setIsExpanded] = useState(false);

  const content = chatMessage.contentMd || chatMessage.content;
  const needsTruncation = content.length > MAX_LENGTH;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderContent = () => {
    if (chatMessage.contentMd) {
      const displayedContent = needsTruncation && !isExpanded && !isLastMessage ? `${chatMessage.contentMd.substring(0, MAX_LENGTH)}...` : chatMessage.contentMd;
      return <div dangerouslySetInnerHTML={{ __html: displayedContent }} />;
    }
    const displayedContent = needsTruncation && !isExpanded && !isLastMessage ? `${chatMessage.content.substring(0, MAX_LENGTH)}...` : chatMessage.content;
    return <p className="text-sm">{displayedContent}</p>;
  };

  const handleSuggestionClick = ({message}:{message: string}) => {
    if (onMessageSent) {
      onMessageSent(message)
        .then(() => {
          console.log('Message sent successfully:', message);
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    } else {
      console.warn('onMessageSent callback is not provided');
    }
  }

  if(chatMessage.role.toLowerCase() === 'system' && isLastMessage){
    return <div className="w-full ">
      <div className="text-xs mt-1.5 text-muted-foreground">
        <small>{chatMessage.content}</small>
      </div>
      { chatMessage.suggestions && chatMessage.suggestions.length > 0 && (
        <div className="w-full flex justify-center items-center mt-2">  
          {chatMessage.suggestions.map((suggestion, index) => (
            <Button key={index} variant={"outline"} size="sm" className="mx-1" onClick={() => {handleSuggestionClick({message: suggestion})}}>
              {suggestion} 
            </Button>
          ))}
        </div>
      )}
    </div>;
  }

  return (
    <div
        key={chatMessage.id}
        className={cn(
          "flex w-full",
          chatMessage.role.toLowerCase() === 'user' ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={cn(
            "max-w-[75%] lg:max-w-[65%] px-4 py-2.5 rounded-xl shadow-sm break-words transition-all duration-150 ease-out",
            chatMessage.role.toLowerCase() === 'user'
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-card text-card-foreground border rounded-bl-none'
          )}  style={{maxWidth: 'min(80%,432px)', overflow:'hidden'}}
        > 
            {renderContent()}
          {needsTruncation && !isLastMessage && (
            <button
              onClick={toggleExpanded}
              className="text-xs mt-1.5 text-blue-500 hover:underline focus:outline-none"
            >
              {isExpanded ? t('chat.seeLess') : t('chat.seeMore')}
            </button>
          )}
          {/* Markdown render */}
          {chatMessage.timestamp && (
            <div className={cn(
              "text-xs mt-1.5",
              chatMessage.role.toLowerCase() === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/80 text-left'
            )}>
              {new Date(chatMessage.timestamp).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>
  );
};
 
export default ChatMessageItem;
