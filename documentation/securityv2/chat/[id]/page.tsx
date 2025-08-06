import ChatPage from '@/components/chat/ChatPage';
import { BasePageProps } from '@/lib/interfaces/common/dictionary-props-component';
import { getDictionary } from '@/locales/dictionaries'; // Import getDictionary
import React from 'react';


export type FullChatPageProps = {
  params: {
    locale: string;
    id: string;
  };
}


export default async function FullChatPage({ params }: FullChatPageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const id = resolvedParams.id; // Extract id from resolvedParams
  const dict = await getDictionary(locale);
  return <ChatPage dictionary={dict} locale={locale} sessionId={id} />;
}
