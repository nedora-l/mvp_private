"use client";
import { Button } from '@/components/ui/button';
import {  Edit, Plus, RefreshCcw, Settings2 } from 'lucide-react'; // Added X for mobile close
import { Dictionary } from '@/locales/dictionary';
import { useI18n } from '@/lib/i18n/use-i18n'; // Import useI18n
import { ChatSessionResponseDto } from '@/lib/interfaces/apis/chat';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import ChatHeaderSidebar from './ChatHeaderSidebar';

interface ChatPageHeaderProps {
   locale: string;
   dictionary: Dictionary;
   sessionId?: string; 
   chatSession: ChatSessionResponseDto | null; 
   refreshConversation?: () => void;
}

const ChatPageHeader: React.FC<ChatPageHeaderProps> = ({ dictionary, locale, sessionId, chatSession, refreshConversation }) => {
  const { t } = useI18n(dictionary); 
  const handleNewChat = () => {
    console.log('Starting new chat');
    const newChatUrl = `/${locale}/app/chat`;
    window.location.href = newChatUrl;
  }

  const handleEditChat = () => {
    console.log('Starting edit chat');
    // Showing a modal to get the new title 
    const newTitle = prompt(t('chat.page.editTitlePrompt') || "Enter new chat title");
    if (newTitle && chatSession) {
      // Call API to update chat session title
      console.log('Updating chat session title:', newTitle);
      // Assuming you have a function to update the chat session
      // chatApiClient.updateChatSessionTitle(chatSession.id, newTitle)
      //   .then(response => {
      //     console.log('Chat session updated:', response);
      //     // Optionally, refresh the page or update state
      //   })
      //   .catch(error => {
      //     console.error('Error updating chat session:', error);
      //   });
    }
  }

  return (
     <div className="p-3 border-b bg-card flex justify-between items-center">
        <h2 className="text-lg font-semibold">{chatSession?.title}</h2>
        <div>
          <Button variant="ghost" size="icon" onClick={handleNewChat} aria-label={t('chat.welcome.startNewChat') || "Start New Chat"}>
            <Plus size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={refreshConversation} aria-label={t('chat.page.refresh') || "Refresh"}>
            <RefreshCcw size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={handleEditChat} aria-label={"Modifier le titre"}>
            <Edit size={20} />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('chat.page.settingsTitle') || "Open Settings"}>
                <Settings2 size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 bg-card">
              <ChatHeaderSidebar
                dictionary={dictionary}
                locale={locale}
                sessionId={sessionId}
                chatSession={chatSession}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
  );
};

export default ChatPageHeader;
