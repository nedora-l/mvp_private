"use client";
import React from 'react';
import Breadcrumbs from '@/components/help/Breadcrumbs';
import AppCyberConcerns from '@/components/help/components/CyberConcerns';
import { helpCenterTopics } from '@/lib/data/help-center-data';
import { Dictionary } from '@/locales/dictionary';

export   function TopicPageComponent(params: { topicSlug: string, locale: string, dictionary:Dictionary } ) {
  const { topicSlug, locale, dictionary } = params;

  const topic = helpCenterTopics.find(t => t.slug === topicSlug);
  // Load translations from multiple namespaces
  if (!topic) {
    return null;
  }
  const breadcrumbItems = [
    { label: 'Help Center', href: `/${locale}/apps/helpcenter` },
    { label: topic.title, href: `/${locale}/apps/helpcenter/${topic.slug}` },
  ];

  if(topic){
    if(topic.component != null && topic.component !== undefined){
      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {topic.component(topic.title,topic.description,dictionary, locale)}
        </div>
      );
    }
    if(topic.slug === 'it-and-security'){
      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          { topicSlug === 'it-and-security' && (
            <AppCyberConcerns title={topic.title} description={topic.description} dictionary={dictionary} locale={locale} />
          )}
        </div>
      )
    }

  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-4xl font-bold mb-4">{topic.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{topic.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
      </div>
    </div>
  );
}
