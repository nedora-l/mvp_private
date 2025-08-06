"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dictionary } from "@/locales/dictionary"
import { useSidebarState } from "@/hooks/use-sidebar-state"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  Settings,
  Users,
  Workflow,
  Database,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
  Crown,
  Home,
  Menu,
  X,
  BotIcon,
  DownloadCloud,
  MailCheck
} from "lucide-react"

interface AdminSidebarProps {
  dictionary: Dictionary
}

const adminMenuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
    description: "Admin overview and analytics"
  },
  {
    title: "Users & Permissions", 
    href: "/admin/users",
    icon: Users,
    description: "Manage users, roles and permissions"
  },
  {
    title: "Workflows",
    href: "/admin/workflows", 
    icon: Workflow,
    description: "Configure automated workflows"
  },
  {
    title: "Objects Manager",
    href: "/admin/objects",
    icon: Database,
    description: "Manage custom objects and fields"
  },
  {
    title: "A.I Agents",
    href: "/admin/ai-agents",
    icon: BotIcon,
    description: "Manage A.I agents and their configurations"
  },
  {
    title: "Documents",
    href: "/admin/documents",
    icon: DownloadCloud,
    description: "Manage Dynamic Documents Templates and their configurations"
  },
  {
    title: "Emailing",
    href: "/admin/emails",
    icon: MailCheck,
    description: "Manage Email Templates"
  },
  {
    title: "System Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System configuration and settings"
  }
]

export function AdminSidebar({ dictionary }: AdminSidebarProps) {
  const pathname = usePathname()
  const {
    isCollapsed,
    isMobileOpen,
    isLoaded,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar
  } = useSidebarState(true) // Use compact mode for admin

  const NavItem = ({ item }: { item: typeof adminMenuItems[0] }) => {
    const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
    
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ease-out",
              "hover:scale-[0.98] active:scale-[0.96]",
              isCollapsed ? "justify-center p-2.5 mx-1" : "px-3 py-2.5 mx-1.5",
              isActive
                ? [
                    "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300",
                    "shadow-md shadow-amber-500/25 border-amber-200/50 dark:border-amber-500/30",
                    "backdrop-blur-sm"
                  ]
                : [
                    "text-slate-700 dark:text-slate-300",
                    "hover:text-slate-900 dark:hover:text-slate-100",
                    "hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:backdrop-blur-sm",
                    "hover:shadow-sm hover:shadow-slate-200/30 dark:hover:shadow-slate-800/30"
                  ]
            )}
          >
            {/* Active indicator */}
            {isActive && !isCollapsed && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full bg-gradient-to-b from-amber-500 to-orange-500 shadow-sm" />
            )}
            
            {/* Icon */}
            <div className={cn(
              "relative flex items-center justify-center transition-all duration-200",
              isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-2.5",
              isActive && "scale-105"
            )}>
              {isActive && (
                <div className="absolute inset-0 rounded-lg blur-sm opacity-30 bg-gradient-to-br from-amber-500 to-orange-500" />
              )}
              <item.icon className={cn(
                "relative transition-all duration-200",
                isCollapsed ? "h-5 w-5" : "h-4 w-4",
                isActive && "drop-shadow-sm"
              )} />
            </div>
            
            {/* Text */}
            {!isCollapsed && (
              <div className="flex flex-col items-start min-w-0">
                <span className={cn(
                  "font-medium transition-all duration-200 text-xs truncate w-full",
                  isActive && "font-semibold"
                )}>
                  {item.title}
                </span>
                <span className="text-[10px] text-muted-foreground line-clamp-1 w-full truncate">
                  {item.description}
                </span>
              </div>
            )}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 border-0 shadow-xl backdrop-blur-xl rounded-lg px-2.5 py-1.5 text-xs">
            <div className="font-medium">{item.title}</div>
            <div className="text-xs opacity-80">{item.description}</div>
          </TooltipContent>
        )}
      </Tooltip>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-58 h-screen bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 shadow-xl">
        <div className="animate-pulse p-4 space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <>
        {/* Mobile toggle button */}
        <button
          className={cn(
            "lg:hidden fixed top-3 left-3 z-50 p-2.5 rounded-xl shadow-xl transition-all duration-200",
            "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50",
            "hover:scale-105 active:scale-95 hover:shadow-lg"
          )}
          onClick={toggleMobileSidebar}
          aria-label="Toggle admin menu"
        >
          {isMobileOpen ? (
            <X className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          ) : (
            <Menu className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          )}
        </button>

        {/* Sidebar container */}
        <div
          className={cn(
            "fixed inset-y-0 z-20 flex flex-col transition-all duration-300 ease-out lg:static",
            "bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl",
            "border-r border-slate-200/50 dark:border-slate-800/50",
            "shadow-xl shadow-slate-900/5 dark:shadow-black/10 min-h-screen",
            isCollapsed ? "w-14" : "w-64",
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Header */}
          <div className="relative border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-amber-50/30 to-transparent dark:from-amber-900/20">
            <div className={cn(
              "flex items-center transition-all duration-200",
              isCollapsed ? "justify-center px-3 h-14" : "gap-2 px-4 h-14"
            )}>
              {!isCollapsed && (
                <div className="flex items-center gap-2 min-w-0">
                  <Crown className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <h2 className="font-semibold text-sm truncate">Admin Panel</h2>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-lg h-8 w-8 transition-all duration-200 group flex-shrink-0",
                  "hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:scale-105 active:scale-95",
                  "border border-transparent hover:border-slate-200/30 dark:hover:border-slate-700/30",
                  isCollapsed ? "ml-0" : "ml-auto"
                )}
                onClick={toggleSidebar}
              >
                <ChevronLeft className={cn(
                  "h-4 w-4 transition-all duration-200 text-slate-500 dark:text-slate-400",
                  "group-hover:text-slate-700 dark:group-hover:text-slate-200",
                  isCollapsed && "rotate-180"
                )} />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <nav className={cn(
                "transition-all duration-200",
                isCollapsed ? "py-3 px-1" : "py-4 px-2"
              )}>
                <div className="space-y-1">
                  {adminMenuItems.map((item) => (
                    <NavItem key={item.href} item={item} />
                  ))}
                </div>
              </nav>
            </ScrollArea>
          </div>

          {/* Back to App */}
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/20 to-transparent dark:from-slate-900/20">
            <div className={cn(
              "transition-all duration-200",
              isCollapsed ? "py-2 px-1" : "py-3 px-2"
            )}>
              <Link href="/app">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "w-full transition-all duration-200 text-xs border-slate-200/50 dark:border-slate-700/50",
                    "hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:scale-[0.98]",
                    isCollapsed ? "px-2 py-2" : "justify-start px-3 py-2"
                  )}
                  title={isCollapsed ? "Back to App" : undefined}
                >
                  <BarChart3 className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && "Back to App"}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-200"
            onClick={closeMobileSidebar}
          />
        )}
      </>
    </TooltipProvider>
  )
}
