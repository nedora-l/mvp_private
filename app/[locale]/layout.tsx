import type { Metadata } from "next";
import { getDictionary } from "@/locales/dictionaries";
import { AuthProvider } from "@/components/contexts/auth-context";

export const metadata: Metadata = {
  title: "D&A Workspace",
  description: "Digital & Analytics Workspace",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
