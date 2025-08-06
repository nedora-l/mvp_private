import { notFound } from 'next/navigation';
import { helpCenterTopics } from '@/lib/data/help-center-data';
import { getDictionary } from '@/locales/dictionaries';
import { TopicPageComponent } from '@/components/help/components/TopicPage';

export default async function TopicPage({ params }: { params: { locale: string, topicSlug: string } }) {
  const topic = helpCenterTopics.find(t => t.slug === params.topicSlug);
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'home', 'helpcenter', 'sidebar']);
   
  if (!topic) {
    notFound();
  }
 
  return (
    <TopicPageComponent  topicSlug={topic.slug} locale={locale} dictionary={dictionary} />
  );

}
 