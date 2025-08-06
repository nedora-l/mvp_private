import { getDictionary } from "@/locales/dictionaries"
import { TopNav } from "@/components/top-nav"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SettingsProvider } from "@/contexts/settings-context"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { AuthProvider } from "@/components/contexts/auth-context"
import type React from "react"
import { TOKEN_STORAGE_KEY } from "@/lib/constants/global"
import { SidebarDynamic } from "@/components/sidebar.dynamic"
import Link from "next/link"
import { Shield, UsersRound } from "lucide-react"


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
  requireAuth(locale);
  
  // Await the dictionary function
  const dict = await getDictionary(locale);
  
  return (
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider delayDuration={0}>          
          <div className="min-h-screen flex">
            <SidebarDynamic 
              configType="security"
              dictionary={dict}
              logoComponent={
                  (<Link href="/" className="flex items-center font-semibold">
                    <Shield className="mx-2 h-5 w-5" />
                    <span className="text-lg">D&A SoC</span>
                  </Link>)
                }   />

            <div className="flex-1">
              <TopNav dictionary={dict} locale={locale} />
              <main className="w-full">{children}</main>
            </div>
          </div>
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}
