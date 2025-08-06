"use client"
import { ThemeToggle } from "./theme-toggle"
import { Notifications } from "./notifications"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSettings } from "@/contexts/settings-context"
import { Menu, Shield } from "lucide-react"
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
import React, { useEffect, useState } from "react"
import { Dictionary } from "@/locales/dictionary"
import LanguageSwitcherMenu from "./language-switcher-menu"
import { useAuth } from "./contexts/auth-context"
import { useSession } from "next-auth/react"
import AppSwitcherMenu from "./app-switcher-menu"
import { departments, quickLinks } from "@/lib/mock-data/common"
import { CurrentRoleBadgeComponent } from "./layout/current-role"
import { CurrentRoleBadgeSelectorComponent } from "./layout/role-selector"

export  function getCurrentDepartment(activeDepartment: string = "admin") {
  return departments.find((d) => d.id === activeDepartment) || departments[0]
}


export function TopNav({ 
  dictionary, 
  locale 
}: { 
  dictionary: Dictionary
  locale: string 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { logout, currentLoggedUser } = useAuth();
  const currentUser = session?.user || null ;

  const pathname = usePathname();
  const pathSegments = (pathname ?? "/").split("/").filter(Boolean)
  const { settings } = useSettings()
  const router = useRouter()

  const currentDept = getCurrentDepartment(settings.currentRole || "user");

  const [activeDepartment, setActiveDepartment] = useState("admin")
  const [activeRole, setActiveRole] = useState(settings.currentRole || "user")

  const handleLogout = () => {
    logout() // This now handles the redirect automatically
  }


  const handleQuickLinkClick = (link : string) => {
    router.push(link);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mr-2 md:hidden hover:bg-accent/50 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:block">
            <nav className="flex items-center space-x-2">
              <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                {dictionary.home?.title || "Accueil"}
              </Link>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={segment}>
                  <span className="text-muted-foreground/60">/</span>
                  <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover:underline underline-offset-4">
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          
          {/* Quick Links - Top Right */}
          <div className="hidden xl:flex items-center gap-1">
            {quickLinks
            .filter(link => link.isMain)
            .map((link, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${link.color} hover:bg-gray-100 text-xs px-2 py-1 h-7`}
                onClick={() => handleQuickLinkClick(link.href)}
                title={link.label}
              >
                <link.icon className="h-3 w-3" />
                <span className="hidden 2xl:inline">{link.label}</span>
              </Button>
            ))}
          </div>

          <div className="relative z-50">
            <LanguageSwitcherMenu dictionary={dictionary} currentLocale={locale} />
          </div>
          <div className="relative z-50">
            <ThemeToggle />
          </div>
          <div className="relative z-50">
            <Notifications />
          </div>
          <div className="relative z-50 mr-2">
            <AppSwitcherMenu />
          </div>


          { (currentUser != null || currentLoggedUser != null) && (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.image || currentLoggedUser?.profilePictureUrl || '/logo/avatar.svg'} alt={ `${currentUser?.name || currentLoggedUser?.lastName || '-' }`} />
                  <AvatarFallback>
                    {( `${currentUser?.name  || (currentLoggedUser?.firstName || '-' ) + " " + (currentLoggedUser?.lastName || '-')}`)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser?.name ||  (currentLoggedUser?.firstName || '-' ) + " " + (currentLoggedUser?.lastName || '-')}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser?.email ||  currentLoggedUser?.email ||  settings.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/app/profile`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/app/settings`} >Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/** Check if has role ROLE_ADMIN */}
              { currentUser?.roles?.includes("ROLE_ADMIN") && (
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/admin/`} >Administration</Link>
                </DropdownMenuItem>
              )}
              {/** Check if has role ROLE_SUPER_ADMIN */}
              { currentUser?.roles?.includes("ROLE_SUPER_ADMIN") && (
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/admin/`} >Super Administration</Link>
                </DropdownMenuItem>
              )}


              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                {dictionary.nav.logout || "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full border-t bg-background px-4 py-2">
          <nav className="flex flex-col space-y-2">
            <Link 
              href="/" 
              className="text-sm font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <Link 
                key={segment}
                href={`/${pathSegments.slice(0, index + 1).join("/")}`} 
                className="text-sm font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
