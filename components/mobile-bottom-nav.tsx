"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageCircle, Calendar, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dictionary } from "@/locales/dictionary"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileBottomNavProps {
    currentItem?: MobileBottomNavItem | null
  locale?: string
  items?: MobileBottomNavItem[]
  dictionary: Dictionary
}

interface MobileBottomNavItem {
  name: string
  href: string
  icon: React.ElementType
}

export function onNavItemClick(href: string): void {
    window.location.href = href;
}

const mobileNavigationItems: MobileBottomNavItem[] = [
  { name: "home", href: "/app", icon: Home },
  { name: "chat", href: "/app/chat", icon: MessageCircle },
  { name: "calendar", href: "/app/calendar", icon: Calendar },
  { name: "profile", href: "/app/profile", icon: UserCircle },
]

export function MobileBottomNav({ dictionary, items = mobileNavigationItems, currentItem, locale = "fr"}: MobileBottomNavProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  if (!isMobile) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex h-16 items-center justify-around">
        {items.map((item) => {
          const isActive = currentItem?.name === item.name
          return (
            <Link
              key={item.name}
              href={item.href || `/${locale}/app/${item.name}`}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive ? "text-primary" : "")} />
              <span className="text-xs">
                {dictionary.nav[item.name as keyof typeof dictionary.nav] || item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
