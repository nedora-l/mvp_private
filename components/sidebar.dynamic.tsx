"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Building2,
  Users2,
  Briefcase,
  HelpCircle,
  Folder,
  Calendar,
  Users,
  GraduationCap,
  Award,
  Settings,
  ChevronLeft,
  Menu,
  Lock,
  BotMessageSquare,
  ListChecks,
  LayoutGrid,
  CreditCard,
  Target,
  Presentation,
  Megaphone,
  Mail,
  Share2,
  LineChart,
  BookCopy,
  ArrowRightLeft,
  ArrowLeftRight,
  Landmark,
  PieChart,
  FileText, // Added for Invoices
  UsersIcon, // Assuming UsersIcon is for a specific purpose, keeping it
  Users2Icon, // Assuming Users2Icon is for a specific purpose, keeping it
  Library,
  // Added icons for security navigation
  Shield,
  KeyRound,        // For general access control
  Fingerprint,     // For biometric access control
  Camera,          // For camera access control
  Siren,
  ScanSearch,
  ClipboardList,
  LayoutDashboard,
  Palette,
  DollarSign,
  Cog,
  Smile,
  Server,
  Wrench
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebarState } from "@/hooks/use-sidebar-state" // Import the hook
import { Dictionary } from "@/locales/dictionary"
import { useI18n } from "@/lib/i18n/use-i18n"

// Define NavItemType if it's not already defined globally or in a shared types file
interface NavItemType {
  name: string;
  href: string;
  icon: React.ElementType;
  current?: boolean; // Optional: if you use it to mark current item
  disabled?: boolean; // Optional: if you need to disable items
}

// Define color themes for different apps
export const colorThemes = {
  default: {
    primary: "blue",
    secondary: "purple",
    accent: "slate",
    gradient: "from-blue-500 to-purple-500",
    bg: "from-blue-500/20 to-purple-500/20",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200/50 dark:border-blue-500/30",
    shadow: "shadow-blue-500/25",
    hover: "hover:from-blue-500/5 hover:to-purple-500/5"
  },
  helpcenter: {
    primary: "indigo",
    secondary: "blue",
    accent: "slate",
    gradient: "from-indigo-500 to-blue-500",
    bg: "from-indigo-500/20 to-blue-500/20",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200/50 dark:border-blue-500/30",
    shadow: "shadow-indigo-500/25",
    hover: "hover:from-indigo-500/5 hover:to-blue-500/5"
  },
  security: {
    primary: "red",
    secondary: "orange",
    accent: "slate",
    gradient: "from-red-500 to-orange-500",
    bg: "from-red-500/20 to-orange-500/20",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200/50 dark:border-red-500/30",
    shadow: "shadow-red-500/25",
    hover: "hover:from-red-500/5 hover:to-orange-500/5"
  },
  hr: {
    primary: "green",
    secondary: "emerald",
    accent: "slate",
    gradient: "from-green-500 to-emerald-500",
    bg: "from-green-500/20 to-emerald-500/20",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200/50 dark:border-green-500/30",
    shadow: "shadow-green-500/25",
    hover: "hover:from-green-500/5 hover:to-emerald-500/5"
  },
  projects: {
    primary: "cyan",
    secondary: "sky",
    accent: "slate",
    gradient: "from-cyan-500 to-sky-500",
    bg: "from-cyan-500/20 to-sky-500/20",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200/50 dark:border-cyan-500/30",
    shadow: "shadow-cyan-500/25",
    hover: "hover:from-cyan-500/5 hover:to-sky-500/5"
  },
  compta: {
    primary: "indigo",
    secondary: "violet",
    accent: "slate",
    gradient: "from-indigo-500 to-violet-500",
    bg: "from-indigo-500/20 to-violet-500/20",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200/50 dark:border-indigo-500/30",
    shadow: "shadow-indigo-500/25",
    hover: "hover:from-indigo-500/5 hover:to-violet-500/5"
  },
  marketing: {
    primary: "pink",
    secondary: "rose",
    accent: "slate",
    gradient: "from-pink-500 to-rose-500",
    bg: "from-pink-500/20 to-rose-500/20",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200/50 dark:border-pink-500/30",
    shadow: "shadow-pink-500/25",
    hover: "hover:from-pink-500/5 hover:to-rose-500/5"
  }
}

// Define navigation configurations within the client component
export const navigationConfigs = {
  default: {
    navigation: [
      { name: "nav.home", href: "/app", icon: Home },
      { name: "nav.chat", href: "/app/chat", icon: BotMessageSquare },
      { name: "nav.calendar", href: "/app/calendar", icon: Calendar },
      { name: "nav.documents", href: "/app/documents", icon: Folder },
      //{ name: "teams", href: "/app/teams", icon: Users },
      { name: "nav.projects", href: "/app/projects", icon: Building2 },
      { name: "nav.directory", href: "/app/directory", icon: Users2 },
      { name: "nav.hr", href: "/app/hr", icon: Briefcase },
      { name: "nav.company", href: "/app/company", icon: Building2 },
    ],
    bottomNavigation: [
      //{ name: "it", href: "/app/it-support", icon: HelpCircle },
      //{ name: "learning", href: "/app/learning", icon: GraduationCap },
      //{ name: "recognition", href: "/app/recognition", icon: Award },
      //{ name: "profile", href: "/app/profile", icon: Settings },
      { name: "nav.settings", href: "/app/settings", icon: Settings },
      { name: "nav.help", href: "/apps/helpcenter", icon: HelpCircle },
    ]
  },
  
  helpcenter: {
    navigation: [
      { name: "sidebar.helpcenter.title", href: "/apps/helpcenter", icon: Home },
      { name: "sidebar.gettingStarted", href: "/apps/helpcenter/getting-started", icon: Smile },
      { name: "sidebar.companyPolicies", href: "/apps/helpcenter/company-policies", icon: Building2 },
      { name: "sidebar.helpcenter.itAndSecurity", href: "/apps/helpcenter/it-and-security", icon: Shield },
      { name: "sidebar.helpcenter.departments", href: "/apps/helpcenter/departments", icon: Users2 },
      { name: "sidebar.helpcenter.toolsAndSoftware", href: "/apps/helpcenter/tools-and-software", icon: Wrench },
      { name: "sidebar.helpcenter.professionalDevelopment", href: "/apps/helpcenter/professional-development", icon: GraduationCap },
    ],
    bottomNavigation: [
      { name: "sidebar.helpcenter.settings", href: "/apps/helpcenter/settings", icon: Settings },
    ]
  },
  security: {
    navigation: [
      { name: "nav.dashboard", href: "/apps/security", icon: Home },
      { name: "nav.calendar", href: "/apps/security/calendar", icon: Calendar },
      { name: "nav.accessControl", href: "/apps/security/access-control", icon: KeyRound },
      { name: "nav.accessControlBiometric", href: "/apps/security/access-control-biometric", icon: Fingerprint },
      { name: "nav.accessControlCamera", href: "/apps/security/access-control-camera", icon: Camera },
      { name: "nav.threatDetection", href: "/apps/security/threats", icon: Siren },
      { name: "nav.vulnerabilityManagement", href: "/apps/security/vulnerabilities", icon: ScanSearch },
      { name: "nav.auditLogs", href: "/apps/security/audit-logs", icon: ClipboardList },
      { name: "nav.passwordManager", href: "/apps/security/password-manager", icon: Lock },
    ],
    bottomNavigation: [
      { name: "nav.settings", href: "/apps/security/settings", icon: Settings },
    ]
  },
  hr: {
    navigation: [
      { name: "nav.home", href: "/apps/hr", icon: Home },
      { name: "nav.chat", href: "/apps/hr/chat", icon: BotMessageSquare },
      { name: "nav.calendar", href: "/apps/hr/calendar", icon: Calendar },
      { name: "nav.candidates", href: "/apps/hr/candidates", icon: Users },
      { name: "nav.directory", href: "/apps/hr/directory", icon: Users2 },
      { name: "nav.documents", href: "/apps/hr/documents", icon: Folder },
      { name: "nav.company", href: "/apps/hr/company", icon: Building2 },
    ],
    bottomNavigation: [
      { name: "nav.settings", href: "/apps/hr/settings", icon: Settings },
    ]
  },
  projects: {
    navigation: [
      { name: "Accueil", href: "/apps/projects", icon: Home },
      { name: "Tâches", href: "/apps/projects/tasks", icon: ListChecks },
      { name: "Tableaux", href: "/apps/projects/board", icon: LayoutGrid },
      { name: "Calendrier", href: "/apps/projects/calendar", icon: Calendar },
      { name: "Documents", href: "/apps/projects/documents", icon: Folder },
      {
        name: "Gestion de Projets",
        href: "/apps/projects/gestion",
        icon: Briefcase,
        children: [
          { name: "Vue d'ensemble", href: "/apps/projects/gestion/overview", icon: LineChart },
          { name: "Liste des Projets", href: "/apps/projects/gestion/liste", icon: FileText },
          { name: "Tâches", href: "/apps/projects/gestion/tasks", icon: ListChecks },
          { name: "Tableaux", href: "/apps/projects/gestion/board", icon: LayoutGrid },
          { name: "Sprints", href: "/apps/projects/gestion/sprint", icon: Target },
          { name: "Budget", href: "/apps/projects/gestion/budget", icon: DollarSign },
          { name: "Backlog", href: "/apps/projects/gestion/backlog", icon: ClipboardList },
          { name: "Rapports", href: "/apps/projects/gestion/reports", icon: PieChart },
          { name: "Recherche", href: "/apps/projects/gestion/search", icon: Server },
          { name: "Méthodes Agiles", href: "/apps/projects/gestion/agile", icon: Palette },
        ]
      },
    ],
    bottomNavigation: [
      { name: "Paramètres", href: "/apps/projects/settings", icon: Settings },
    ]
  },
  compta: {
    navigation: [
      { name: "nav.dashboard", href: "/apps/compta", icon: LayoutDashboard },
      { name: "nav.chartOfAccounts", href: "/apps/compta/chart-of-accounts", icon: BookCopy },
      { name: "nav.accountsPayable", href: "/apps/compta/payables", icon: ArrowRightLeft },
      { name: "nav.accountsReceivable", href: "/apps/compta/receivables", icon: ArrowLeftRight },
      { name: "nav.invoices", href: "/apps/compta/invoices", icon: FileText }, // Added Invoices
      { name: "nav.banking", href: "/apps/compta/banking", icon: Landmark },
      { name: "nav.expenseManagement", href: "/apps/compta/expenses", icon: CreditCard },
      { name: "nav.financialReports", href: "/apps/compta/reports", icon: PieChart },
      { name: "nav.budgeting", href: "/apps/compta/budgeting", icon: Target },
      { name: "nav.settings", href: "/apps/compta/settings", icon: Settings },
    ],
    bottomNavigation: [
      { name: "nav.help", href: "/apps/compta/help", icon: HelpCircle },
    ]
  },
  marketing: {
    navigation: [
      { name: "nav.dashboard", href: "/apps/marketing", icon: Presentation },
      { name: "nav.campaigns", href: "/apps/marketing/campaigns", icon: Megaphone },
      { name: "nav.leadManagement", href: "/apps/marketing/leads", icon: UsersIcon },
      { name: "nav.customerSegments", href: "/apps/marketing/segments", icon: Users2Icon },
      { name: "nav.emailMarketing", href: "/apps/marketing/emails", icon: Mail },
      { name: "nav.socialMedia", href: "/apps/marketing/social", icon: Share2 },
      { name: "nav.analytics", href: "/apps/marketing/analytics", icon: LineChart },
      { name: "nav.contentHub", href: "/apps/marketing/content", icon: Library },
      { name: "nav.settings", href: "/apps/marketing/settings", icon: Settings },
    ],
    bottomNavigation: [
      { name: "sidebar.help", href: "/apps/marketing/help", icon: HelpCircle },
    ]
  }
}

// Constants for localStorage keys - moved to hook
// const SIDEBAR_STORAGE_KEY = "daws-sidebar-state"
// const MOBILE_SIDEBAR_STORAGE_KEY = "daws-mobile-sidebar-state"

export function SidebarDynamic(
  { logoComponent, configType = "default", dictionary, compact = false }: 
  { 
    logoComponent: React.ReactNode; 
    configType?: keyof typeof navigationConfigs; 
    dictionary: Dictionary;
    compact?: boolean;
  }
) {
  const pathname = usePathname();
  const { t } = useI18n(dictionary);
  
  // Use the new sidebar state hook
  const {
    isCollapsed,
    isMobileOpen,
    isLoaded,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar
  } = useSidebarState(compact)

  // Get the locale from pathname
  const locale = pathname?.split('/')[1] ?? "fr" ;

  // Get navigation config and color theme based on type
  const config = navigationConfigs[configType]
  const theme = colorThemes[configType]
  const { navigation, bottomNavigation } = config

  const NavItem = ({ item, isBottom = false }: { item: NavItemType & { children?: NavItemType[] }; isBottom?: boolean }) => {
    // Update href to include locale
    const href = `/${locale}${item.href === '/' ? '' : item.href}`
    
    // Check if this is the home route (first item in navigation)
    const isHomeRoute = navigation[0]?.href === item.href
    
    // More precise isActive check to prevent home route from always being active
    const isActive = isHomeRoute 
      ? pathname === href // Home route: only exact match
      : pathname === href || pathname.startsWith(href + '/') // Other routes: exact match or child routes
    
    const [open, setOpen] = React.useState(false);

    // Si l'item a des enfants, on affiche un menu déroulant
    if (item.children && item.children.length > 0) {
      return (
        <div className="relative">
          <div
            className={cn(
              "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ease-out cursor-pointer",
              isCollapsed ? "justify-center p-2.5 mx-1" : "px-3 py-2.5 mx-1.5",
              isActive
                ? [
                    `bg-gradient-to-r ${theme.bg} ${theme.text}`,
                    `shadow-md ${theme.shadow} ${theme.border}`,
                    "backdrop-blur-sm"
                  ]
                : [
                    "text-slate-700 dark:text-slate-300",
                    "hover:text-slate-900 dark:hover:text-slate-100",
                    "hover:bg-slate-100/60 dark:hover:bg-slate-800/40 hover:backdrop-blur-sm",
                    "hover:shadow-sm hover:shadow-slate-200/30 dark:hover:shadow-slate-800/30"
                  ]
            )}
            onClick={() => setOpen((v) => !v)}
          >
            <item.icon className={cn(
              "relative transition-all duration-200",
              isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-2.5"
            )} />
            {!isCollapsed && (
              <span className="relative font-medium transition-all duration-200 text-xs">
                {t(item.name) || "Navigation"}
              </span>
            )}
            {!isCollapsed && (
              <span className={cn("ml-auto transition-transform", open ? "rotate-90" : "")}>▶</span>
            )}
          </div>
          {open && !isCollapsed && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.name}
                  href={`/${locale}${child.href === '/' ? '' : child.href}`}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition hover:bg-blue-50 dark:hover:bg-slate-800/40",
                    pathname === `/${locale}${child.href === '/' ? '' : child.href}` && "bg-blue-100 text-blue-700 dark:bg-slate-800/60"
                  )}
                >
                  <child.icon className="h-4 w-4" />
                  {t(child.name) || child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ease-out",
              "hover:scale-[0.98] active:scale-[0.96]",
              isCollapsed ? "justify-center p-2.5 mx-1" : "px-3 py-2.5 mx-1.5",
              isActive
                ? [
                    `bg-gradient-to-r ${theme.bg} ${theme.text}`,
                    `shadow-md ${theme.shadow} ${theme.border}`,
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
            {/* Active indicator - more compact */}
            {isActive && !isCollapsed && (
              <div className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full shadow-sm",
                `bg-gradient-to-b ${theme.gradient}`
              )} />
            )}
            
            {/* Icon with themed styling */}
            <div className={cn(
              "relative flex items-center justify-center transition-all duration-200",
              isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-2.5",
              isActive && "scale-105"
            )}>
              {isActive && (
                <div className={cn(
                  "absolute inset-0 rounded-lg blur-sm opacity-30",
                  `bg-gradient-to-br ${theme.gradient}`
                )} />
              )}
              <item.icon className={cn(
                "relative transition-all duration-200",
                isCollapsed ? "h-5 w-5" : "h-4 w-4",
                isActive && "drop-shadow-sm",
                // Ensure icon colors remain visible on hover
                isActive 
                  ? "text-current" 
                  : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100"
              )} />
            </div>
            
            {/* Text with compact spacing */}
            {!isCollapsed && (
              <span className={cn(
                "relative font-medium transition-all duration-200 text-xs",
                isActive && "font-semibold",
                // Ensure text remains visible on hover
                isActive 
                  ? "text-current" 
                  : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100"
              )}>
                { t(item.name) || "Navigation" }
              </span>
            )}
            
            {/* Themed hover effect - subtle overlay */}
            {!isActive && (
              <div className={cn(
                "absolute inset-0 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100",
                "bg-slate-100/40 dark:bg-slate-800/40"
              )} />
            )}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 border-0 shadow-xl backdrop-blur-xl rounded-lg px-2.5 py-1.5 text-xs">
                { t(item.name) || "Navigation" }
          </TooltipContent>
        )}
      </Tooltip>
    )
  }

  // Show loading state while sidebar state is being loaded to prevent layout shift
  if (!isLoaded) {
    return null; // Return null to prevent server-side rendering mismatch
  }

  return (
    <TooltipProvider>
      <>
        {/* Modern mobile toggle button */}
        <button
          className={cn(
            "lg:hidden fixed top-3 left-3 z-50 p-2.5 rounded-xl shadow-xl transition-all duration-200",
            "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50",
            "hover:scale-105 active:scale-95 hover:shadow-lg hover:bg-white dark:hover:bg-slate-900"
          )}
          onClick={toggleMobileSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4 text-slate-700 dark:text-slate-300" />
        </button>
        
        {/* Compact sidebar container */}
        <div
          className={cn(
            "fixed inset-y-0 z-20 flex flex-col transition-all duration-300 ease-out lg:static",
            // Modern glassmorphism background
            "bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl",
            // Themed border
            "border-r border-slate-200/50 dark:border-slate-800/50",
            // Compact shadow
            "shadow-xl shadow-slate-900/5 dark:shadow-black/10",
            // Compact width transitions
            isCollapsed ? "w-14" : "w-56",
            // Mobile positioning
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          {/* Compact header section */}
          <div className="relative border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/30 to-transparent dark:from-slate-900/30">
            <div className={cn(
              "flex items-center transition-all duration-200",
              isCollapsed ? "justify-center px-3 h-14" : "gap-2 px-4 h-14"
            )}>
              {!isCollapsed && logoComponent}
              
              {/* Compact collapse button */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-lg h-8 w-8 transition-all duration-200 group",
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
                <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} Sidebar</span>
              </Button>
            </div>
          </div>
          
          {/* Compact navigation section */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
              <nav className={cn(
                "flex-1 transition-all duration-200",
                isCollapsed ? "py-3 px-1" : "py-4 px-2"
              )}>
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </div>
              </nav>
            </div>
          </div>
          
          {/* Compact bottom navigation */}
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/20 to-transparent dark:from-slate-900/20">
            <nav className={cn(
              "transition-all duration-200",
              isCollapsed ? "py-2 px-1" : "py-3 px-2"
            )}>
              <div className="space-y-1">
                {bottomNavigation.map((item) => (
                  <NavItem key={item.name} item={item} isBottom />
                ))}
              </div>
            </nav>
          </div>
        </div>
        
        {/* Modern mobile overlay */}
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
