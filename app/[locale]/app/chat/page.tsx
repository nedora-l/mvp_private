import ChatWelcome from '@/components/chat/ChatWelcome'; // Changed from ChatPage to ChatWelcome
import { BasePageProps } from '@/lib/interfaces/common/dictionary-props-component';
import { getDictionary } from '@/locales/dictionaries';
import React from 'react';


export default async function NewChatPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const dict = await getDictionary(locale);
  // Use ChatWelcome component instead of ChatPage
  //loadChat={(chatId: string) => { console.log('Load chat:', chatId); }} startNewChat={() => { console.log('Start new chat'); }} 
  return <ChatWelcome dictionary={dict} locale={locale} />;
}
