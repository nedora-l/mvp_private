import { redirect } from 'next/navigation';
import { defaultLocale } from '@/middleware';
import { BasePageProps } from '@/lib/interfaces/common/dictionary-props-component';
import LoadingPage from '@/components/loading';
import { getDictionary } from '@/locales/dictionaries';

export default async function Home({ params }: BasePageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || defaultLocale;
  // If no locale provided, redirect to the default locale
  if (!resolvedParams?.locale) {
    redirect(`/${defaultLocale}`);
  }
  
  const dictionary = await getDictionary(locale, ['common', 'home']);
  return (
    <LoadingPage dictionary={dictionary} locale={locale} />
  );

}