import type React from "react"
import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"
import { getDictionary } from "@/locales/dictionaries";

type AppLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export default async function Layout({
  children,
  params,
}: AppLayoutProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  // Await the dictionary function
  const dict = await getDictionary(locale);
  return (
    <div className="flex h-screen bg-background">
      <Sidebar dictionary={dict} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav locale={locale} dictionary={dict}  />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
