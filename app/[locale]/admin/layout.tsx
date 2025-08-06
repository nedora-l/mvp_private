import { getDictionary } from "@/locales/dictionaries"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SettingsProvider } from "@/contexts/settings-context"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { AuthProvider } from "@/components/contexts/auth-context"
import type React from "react"
import { TOKEN_STORAGE_KEY } from "@/lib/constants/global"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopNav } from "@/components/admin/admin-top-nav"

type AdminLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

// Server-side authentication check for admin
async function requireAdminAuth(locale: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_STORAGE_KEY)?.value
  if (!token) {
    redirect(`/${locale}/auth/login`)
  }
  // TODO: Add admin role check here
  return token
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Check authentication and admin permissions at the server level
  await requireAdminAuth(locale);
  
  // Await the dictionary function
  const dict = await getDictionary(locale, ['common', 'admin']);
  return (
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider delayDuration={0}>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30">
            {/* Modern glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-blue-50/20 dark:from-slate-900/40 dark:to-blue-950/20 backdrop-blur-[0.5px]" />
            
            <div className="relative flex min-h-screen">
              {/* Sidebar - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:block">
                <AdminSidebar dictionary={dict} />
              </div>
              
              {/* Main content area */}
              <div className="flex-1 flex flex-col min-w-0">
                <AdminTopNav dictionary={dict} locale={locale} />
                
                {/* Content with proper spacing and responsiveness */}
                <main className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                      {children}
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}
