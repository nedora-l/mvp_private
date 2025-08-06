import { BasePageProps } from '@/lib/interfaces/common/dictionary-props-component';
import { getDictionary } from '@/locales/dictionaries'; // Import getDictionary
import React from 'react';
import NewChatPage from '@/components/chat/NewChatPage'; // Import the NewChatPage component


export type NewChatPageProps = {
  params: {
    locale: string;
  };
}
export default async function NewChatPageServer({ params }: NewChatPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const dict = await getDictionary(locale);
  return <NewChatPage dictionary={dict} locale={locale}  />;
}
