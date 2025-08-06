"use client";

import { ChevronRight, Eye, MessageCircle, Trash2 } from 'lucide-react'; // Icons for chat history items
import { Button } from '@/components/ui/button'; // Assuming Button is in ui folder
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming ScrollArea is in ui folder
import React, { useEffect, useState } from 'react'; // Added React
import { Dictionary } from '@/locales/dictionary';
import { useI18n } from '@/lib/i18n/use-i18n'; // Import useI18n
import { chatApiClient } from '@/lib/services/client/chat/ai.chat.client.service';
import { ChatSessionListItemDto } from '@/lib/interfaces/apis/chat';
import { HateoasResponse } from '@/lib/interfaces/apis';
import { Card } from '../ui/card';

interface ChatHistoryItemProps {
  dictionary: Dictionary;
  locale: string;
  chatSession: ChatSessionListItemDto;
  handleConversationClick: (conversationId: string) => void;
  handleDeleteConversation: (e: React.MouseEvent, conversationId: string) => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ dictionary, locale, chatSession, handleConversationClick, handleDeleteConversation }) => {
  const { t } = useI18n(dictionary);

  return (
    <Card onClick={() => handleConversationClick(chatSession.id)}>
      <div className="p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer border flex justify-between items-center group">
        <div className="flex items-center">
          <MessageCircle size={18} className="mr-3 text-muted-foreground" />
          <div className='text-start'>
            <h3 className="text-sm font-medium leading-tight">{chatSession.title}</h3>
            <p className="text-xs text-muted-foreground">{t('chat.history.lastMessage') || "Last message on"}: {chatSession.lastMessageSnippet}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => handleConversationClick(chatSession.id)}
          aria-label={`${t('chat.history.deleteConversationLabelPrefix') || "Delete conversation: "}${chatSession.title}`}
        >
          <ChevronRight size={16}  />
        </Button>
      </div>
    </Card>
  );
};
 
export default ChatHistoryItem;
