import { getDictionary } from "@/locales/dictionaries"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SettingsProvider } from "@/contexts/settings-context"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { AuthProvider } from "@/components/contexts/auth-context"
import type React from "react"
import { TOKEN_STORAGE_KEY } from "@/lib/constants/global"

type AppLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

// Server-side authentication check
async function requireAuth(locale: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_STORAGE_KEY)?.value
  if (!token) {
    redirect(`/${locale}/auth/login`)
  }
  return token
}

export default async function AppLayout({
  children,
  params,
}: AppLayoutProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  // Check authentication at the server level
  await requireAuth(locale);
  // Await the dictionary function
  const dict = await getDictionary(locale);  return (
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider delayDuration={0}>
          <div className="relative min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30">
            {/* Modern gradient background with glass effect overlay */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 pointer-events-none" />
            <Sidebar dictionary={dict} />
            <div className="flex-1 relative">
              <TopNav dictionary={dict} locale={locale} />
              <main className="w-full relative z-10 backdrop-blur-[0.5px]">{children}</main>
            </div>
          </div>

        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}
