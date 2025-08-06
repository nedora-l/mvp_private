import { getDictionary } from "@/locales/dictionaries"
import { ThemeProvider } from "@/components/theme-provider"
import LanguageSwitcherMenu from "@/components/language-switcher-menu"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { DynamicLogo } from "@/components/dynamic-logo"
import { AuthProvider } from "@/components/contexts/auth-context"
import NextAuthProvider from "@/components/auth/next-auth-provider"
import Image from "next/image"

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // In Next.js, we need to await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Await the dictionary function with both common and login namespaces
  const dict = await getDictionary(locale, ['common', 'login']);
  
  // Set direction for RTL languages
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (    
  <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextAuthProvider>
            <AuthProvider>
              <div className={`${dir === 'rtl' ? 'rtl' : ''} flex min-h-screen flex-col bg-background`}>
              <header className="absolute top-0 w-full border-b bg-background/95 backdrop-blur">
                <div className="container flex h-14 items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <Image 
                        src="/logo/avatar.svg"
                        alt="D&A Workspace" 
                        width={32} 
                        height={32} 
                      />
                    <span className="font-bold">Workspace</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <ModeToggle />
                    <LanguageSwitcherMenu dictionary={dict} currentLocale={locale} />
                  </div>
                </div>
              </header>
              
              <main className="flex flex-1 items-center justify-center pt-16">
                {children}
              </main>
              
              <footer className="py-4 text-center text-sm text-muted-foreground">
                <div className="container">
                  © {new Date().getFullYear()} D&A Workspace.
                  {dict.common?.rights || "All rights reserved."}
                  <DynamicLogo width={32} height={32}  />
                </div>
              </footer>
            </div>
          </AuthProvider>
        </NextAuthProvider>
      </ThemeProvider>
    </body>
  </html>
  )
}