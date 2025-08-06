"use client";
import { MessageSquarePlus, History, Zap , MessageCircle, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react'; // Icons for chat history items
import { Button } from '@/components/ui/button'; // Assuming Button is in ui folder
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming ScrollArea is in ui folder
import React, { useEffect, useState } from 'react'; // Added React
import { Dictionary } from '@/locales/dictionary';
import { useI18n } from '@/lib/i18n/use-i18n'; // Import useI18n
import { chatApiClient } from '@/lib/services/client/chat/ai.chat.client.service';
import { ChatSessionListItemDto } from '@/lib/interfaces/apis/chat';
import { HateoasResponse } from '@/lib/interfaces/apis';
import ChatHistoryItem from './ChatHistoryItem';
import ChatHistoryItemSingleton from './ChatHistoryItemSingleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Select, SelectTrigger, SelectValue } from '../ui/select';
import { SelectContent, SelectItem } from '@radix-ui/react-select';

interface ChatHistoryProps {
  dictionary: Dictionary;
  locale: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ dictionary, locale }) => {
  const { t } = useI18n(dictionary); // Initialize t function
  const [chatSessions, setChatSessions] = useState<ChatSessionListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState<number>(3);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  const refreshConversationList = () => {
    console.log('refreshConversationList');
    setIsLoading(true);
    setError(null);
    chatApiClient.getUserChatSessionPages({ page : page, size: pageSize })
      .then((response) => {
        console.log('Conversations fetched:', response);
        if(response.data?.page){
          console.log('data.page fetched:', response.data.page);
          setPage(response.data.page.number);
          setPageSize(response.data.page.size);
          setTotalPages(response.data.page.totalPages);
          setTotalElements(response.data.page.totalElements);
        }
        if(response.data?._embedded?.chatSessionListItemDtoList){
          setChatSessions(response.data?._embedded?.chatSessionListItemDtoList || []);
        }

      })
      .catch((error) => {
        console.error('Error fetching conversations:', error);
        setError('Failed to fetch conversations');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleConversationClick = (conversationId: string) => {
    console.log('Navigating to conversation:', conversationId);
    window.location.href = `/${locale}/app/chat/${conversationId}`;
  };
  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation(); // Prevent triggering handleConversationClick
    console.log('Attempting to delete conversation:', conversationId);
    // Add logic to remove conversation from state/backend
  };
  useEffect(() => {
    if(chatSessions.length > 0) {
      console.log('Chat sessions:', chatSessions);
    }
    else {
      console.log('No chat sessions available');
      refreshConversationList();
    }
  }, [chatSessions,pageSize,page]);

  return (
    <div className="h-full bg-background p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <History size={24} className="mr-3 text-muted-foreground hidden  md:hidden lg:block" />
          <h3 className="md:text-lg lg:text-xl lg:font-semibold">{t('chat.welcome.recentChatsTitle') || "Recent Chats"}</h3>
        </div>
        <Button variant="ghost" aria-label={t('chat.history.refreshButton') || "REFRESH"} 
          onClick={refreshConversationList} className="flex items-center">
          <RefreshCcw size={16} />
        </Button>
      </div>
      <div className="space-y-2">
        {/* Animation if isLoading */}
        {isLoading && (
          <div className="w-full flex flex-col space-y-2">
            {Array.from({ length: pageSize }).map((_, i) => (
              <ChatHistoryItemSingleton 
                key={i} 
                opacity={Math.max(1 - i*0.2, 0)} 
              />
            ))}
          </div>
        )}
        {!isLoading && chatSessions.length > 0 && (
          chatSessions.map((conv) => (   
              <ChatHistoryItem key={conv.id} dictionary={dictionary} locale={locale} chatSession={conv} handleConversationClick={handleConversationClick} handleDeleteConversation={handleDeleteConversation} />
          ))
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex justify-between  gap-2 my-4">
            <div className="flex items-center justify-center ">
              <Button 
                variant="ghost" 
                size="sm"
                disabled={page <= 1}
                aria-label={t('pagination.previous') || "Previous"}
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1);
                    refreshConversationList();
                  }
                }}
              >
                <ChevronLeft size={16} className="mr-2" />  
              </Button>
              
              <Tooltip>
                <TooltipContent>  
                  <span className="text-sm text-muted-foreground">
                    {t('pagination.showing', { start: (page - 1) * pageSize + 1, end: page * pageSize, total: totalElements }) || 
                      `Showing ${(page - 1) * pageSize + 1} to ${page * pageSize} of ${totalElements}`}
                  </span>
                </TooltipContent>
                <TooltipTrigger>
                  <span className="text-sm text-muted-foreground">
                    {page } / {totalPages} 
                  </span>
                </TooltipTrigger>
              </Tooltip>
                
              <Button 
                variant="ghost" 
                size="sm"
                disabled={page >= totalPages}
                aria-label={t('pagination.next') || "Next"}
                onClick={() => {
                  if (page <= totalPages) {
                  setPage(page + 1);
                  refreshConversationList();
                  }
                }}
                >
                <ChevronRight size={16} className="mr-2" />  
              </Button> 
              
            </div>
            <div>
              <Tooltip>
                <TooltipContent>
                  <span className="text-sm text-muted-foreground">
                    {t('pagination.showing', { start: (page - 1) * pageSize + 1, end: page * pageSize, total: totalElements }) ||
                      `Showing ${(page - 1) * pageSize + 1} to ${page * pageSize} of ${totalElements}`}
                  </span>
                </TooltipContent>
                <TooltipTrigger>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    aria-label={t('pagination.showing', { start: (page - 1) * pageSize + 1, end: page * pageSize, total: totalElements }) ||
                          `Showing ${(page - 1) * pageSize + 1} to ${page * pageSize} of ${totalElements}`}
                  >
                    
                      <span className="text-sm text-muted-foreground">
                        {totalElements} {t('pagination.total') || "Total"} 
                      </span>
                  </Button> 
                </TooltipTrigger>
              </Tooltip>
            </div>
          </div>
        )}
        

        {isLoading && totalPages > 1 && (
          <div className="flex justify-between  gap-2 my-4">
            <div className="flex items-center justify-center ">
              <Button 
                variant="ghost" 
                size="sm"
                disabled={page < 1}
                aria-label={t('pagination.previous') || "Previous"}
              >
                <ChevronLeft size={16} className="mr-2" />  
              </Button>
              <span className="text-sm text-muted-foreground">
                <span className="bg-gray-200 rounded animate-pulse"> 
                 &nbsp; &nbsp;
                </span>
                &nbsp;/&nbsp;
                <span className=" bg-gray-200 rounded animate-pulse"> 
                  &nbsp; &nbsp;
                </span>
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                disabled={page >= totalPages}
                aria-label={t('pagination.next') || "Next"}
              >
                <ChevronRight size={16} className="mr-2" />  
              </Button>
            </div>
            <div>
               <span className="text-sm text-muted-foreground">
                  <span className=" bg-gray-200 rounded animate-pulse"> 
                    &nbsp; &nbsp;
                  </span> {t('pagination.total') || "Total"} 
                </span>
            </div>
          </div>
        )}

        {!isLoading && totalPages == 0 && (
          <Button variant="link" className="text-primary">
            {t('chat.welcome.viewAllHistory') || "View All History"}
          </Button>
        )}
      </div>
        
    </div>
  );
};

export default ChatHistory;
