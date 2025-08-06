import { redirect } from 'next/navigation';
import { defaultLocale } from '@/middleware';

// Root page redirects to the default locale
export default function Home() {
  redirect(`/${defaultLocale}`);
}