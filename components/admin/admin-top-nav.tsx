"use client"
import { ThemeToggle } from "@/components/theme-toggle"
import { Notifications } from "@/components/notifications"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSettings } from "@/contexts/settings-context"
import { Menu, Crown, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import React, { useState } from "react"
import { Dictionary } from "@/locales/dictionary"
import LanguageSwitcherMenu from "@/components/language-switcher-menu"
import { useAuth } from "@/components/contexts/auth-context"
import { useSession } from "next-auth/react"
import AppSwitcherMenu from "../app-switcher-menu"

export function AdminTopNav({ 
  dictionary, 
  locale 
}: { 
  dictionary: Dictionary
  locale: string 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const pathname = usePathname();
  const pathSegments = (pathname ?? "/").split("/").filter(Boolean)
  const { settings } = useSettings()
  const { logout, currentLoggedUser } = useAuth();
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/auth/login`)
  }

  const currentUser = session?.user || null;

  // Generate breadcrumb from path
  const generateBreadcrumb = () => {
    const segments = pathSegments.slice(1); // Remove locale
    const breadcrumbs = segments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 2).join("/")}`;
      const title = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { href, title };
    });
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumb();
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm">
      <div className="w-full flex h-14 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center min-w-0 flex-1">
          {/* Admin indicator and breadcrumb */}
          <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
            <div className="flex items-center gap-1.5 lg:gap-2 flex-shrink-0">
              <Crown className="h-4 w-4 lg:h-5 lg:w-5 text-amber-500" />
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200 text-xs px-2 py-0.5">
                <AlertTriangle className="h-2.5 w-2.5 lg:h-3 lg:w-3 mr-1" />
                <span className="hidden sm:inline">Admin</span>
                <span className="sm:hidden">A</span>
              </Badge>
            </div>
            
            {/* Breadcrumb - hidden on small screens */}
            <div className="hidden md:block min-w-0">
              <nav className="flex items-center space-x-1 lg:space-x-2 text-xs lg:text-sm text-muted-foreground">
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.href}>
                    {index > 0 && <span className="text-slate-300 dark:text-slate-600">/</span>}
                    <Link 
                      href={breadcrumb.href} 
                      className="hover:text-foreground transition-colors truncate max-w-[100px] lg:max-w-none"
                      title={breadcrumb.title}
                    >
                      {breadcrumb.title}
                    </Link>
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 lg:gap-2">
          {/* Mobile breadcrumb dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  {breadcrumbs[breadcrumbs.length - 1]?.title || "Menu"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {breadcrumbs.map((breadcrumb) => (
                  <DropdownMenuItem key={breadcrumb.href} asChild>
                    <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Language switcher */}
          <LanguageSwitcherMenu 
            dictionary={dictionary} 
            currentLocale={locale} 
          />

          {/* Theme toggle */}
          <ThemeToggle  />

          {/* Notifications */}
          <Notifications  />

          {/* App switcher */}
          <AppSwitcherMenu 
          />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 lg:h-9 lg:w-9 rounded-full"
              >
                <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                  <AvatarImage 
                    src={currentUser?.image || "/placeholder-avatar.jpg"} 
                    alt={currentUser?.name || "User"} 
                  />
                  <AvatarFallback className="text-xs">
                    {currentUser?.name?.charAt(0) || (
                      (currentLoggedUser?.lastName || "") + " " + (currentLoggedUser?.firstName || "") 
                    )?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser?.name || (
                      (currentLoggedUser?.lastName || "") + " " + (currentLoggedUser?.firstName || "") 
                    ) || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email || currentLoggedUser?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/app/profile`} className="cursor-pointer">
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/app`} className="cursor-pointer">
                  Back to App
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
