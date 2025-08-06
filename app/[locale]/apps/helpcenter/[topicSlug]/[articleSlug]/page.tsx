import { helpCenterTopics } from '@/lib/data/help-center-data';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/help/Breadcrumbs';

export default function ArticlePage({ params }: { params: { locale: string, topicSlug: string, articleSlug: string } }) {
  const topic = helpCenterTopics.find(t => t.slug === params.topicSlug);
  const article = topic?.articles.find(a => a.slug === params.articleSlug);

  if (!topic || !article) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Help Center', href: `/${params.locale}/apps/helpcenter` },
    { label: topic.title, href: `/${params.locale}/apps/helpcenter/${topic.slug}` },
    { label: article.title, href: `/${params.locale}/apps/helpcenter/${topic.slug}/${article.slug}` },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      <article className="prose dark:prose-invert max-w-none">
        <h1>{article.title}</h1>
        <p>{article.content}</p>
      </article>
    </div>
  );
}
