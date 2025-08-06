"use client";
import { MessageSquare, X } from 'lucide-react'; // Using lucide-react for icons
import { Button } from '@/components/ui/button'; // Assuming Button is in ui folder
import { Input } from '@/components/ui/input';   // Assuming Input is in ui folder
import React, { useState } from 'react';          // Added React and useState
import { Dictionary } from '@/locales/dictionary';
import { useI18n } from '@/lib/i18n/use-i18n'; // Import useI18n

interface ChatBarProps {
  dictionary:  Dictionary;
}

const ChatBar: React.FC<ChatBarProps> = ({ dictionary }) => {
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); // For mobile FAB state
  const { t } = useI18n(dictionary); // Initialize t function

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Message submitted:', message);
    setMessage(''); // Clear input after submit
  };

  // Mobile FAB view
  if (!isChatOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 md:hidden w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50"
        onClick={() => setIsChatOpen(true)}
        aria-label={t('chat.bar.openChatLabel') || "Open chat"}
      >
        <MessageSquare size={24} />
      </Button>
    );
  }

  return (
    <>
      {/* Mobile FAB view - expanded */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{t('chat.bar.title') || "Quick Chat"}</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)} aria-label={t('chat.bar.closeChatLabel') || "Close chat"}>
            <X size={20} />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('chat.bar.messagePlaceholder') || "Type a message..."}
            className="flex-grow"
            aria-label={t('chat.bar.messagePlaceholder') || "Message input"} 
          />
          <Button type="submit" aria-label={t('chat.bar.sendButton') || "Send"}>{t('chat.bar.sendButton') || "Send"}</Button>
        </form>
      </div>

      {/* Desktop fixed bar view */}
      <div className="hidden md:flex fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg items-center space-x-4 z-50">
        <MessageSquare size={24} className="text-primary" /> {/* Icon for desktop */}
        <form onSubmit={handleSubmit} className="flex-grow flex items-center space-x-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('chat.bar.messagePlaceholder') || "Type a message..."}
            className="flex-grow"
            aria-label={t('chat.bar.messagePlaceholder') || "Message input"} 
          />
          <Button type="submit" aria-label={t('chat.bar.sendButton') || "Send"}>{t('chat.bar.sendButton') || "Send"}</Button>
        </form>
        {/* Placeholder for more actions or link to full chat page */}
        <Button variant="outline" onClick={() => console.log('Open full chat page')}>
          {t('chat.bar.openFullChatButton') || "Open Full Chat"}
        </Button>
      </div>
    </>
  );
};

export default ChatBar;
