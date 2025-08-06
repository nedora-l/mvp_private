import ChatV2 from '@/components/Chat';
import { BasePageProps } from '@/lib/interfaces/common/dictionary-props-component';
import { getDictionary } from '@/locales/dictionaries';
import React from 'react';


export default async function ChatV2Page({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const dict = await getDictionary(locale);
  return <ChatV2  />;
}
