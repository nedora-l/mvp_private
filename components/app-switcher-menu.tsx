'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { 
  AppWindowIcon as Apps, 
  BarChart, // Keep for DAWS or change
  FileSpreadsheet, // Keep for Projects or change
  Users, // Keep for RH or change
  LayoutGrid, // New for DAWS
  ListChecks, // New for Projects
  UsersRound, // New for RH
  Megaphone,  // New for Marketing
  Calculator,  // New for Compta
  BookCopy,
  Shield
} from "lucide-react"
import React from "react" // Ensure React is imported for JSX elements

// Define app data
export const apps = [
  {
    id: 'daws',
    icon: <LayoutGrid className="h-5 w-5" />,
    title: 'DAWS',
    description: 'D&A WorkSpace',
    href: '/fr/app',
    mainColor: '#4f46e5' // Indigo
  },
  {
    id: 'projects',
    icon: <ListChecks className="h-5 w-5" />,
    title: 'Gestion de Projets',
    description: 'D&A Gestion de Projets',
    href: '/fr/apps/projects',
    mainColor: '#f97316' // Orange
  },
  {
    id: 'hr',
    icon: <UsersRound className="h-5 w-5" />,
    title: 'RH',
    description: 'D&A Ressource Humaine',
    href: '/fr/apps/hr',
    mainColor: '#10b981' // Green
  },
  {
    id: 'marketing',
    icon: <Megaphone className="h-5 w-5" />,
    title: 'Marketing',
    description: 'D&A Marketing',
    href: '/fr/apps/marketing',
    mainColor: '#ec4899' // Pink
  },
  {
    id: 'compta',
    icon: <Calculator className="h-5 w-5" />,
    title: 'Compta',
    description: 'D&A Comptabilite',
    href: '/fr/apps/compta',
    mainColor: '#f59e0b' // Amber
  },
  /**{
    id: 'learning',
    icon: <BookCopy className="h-5 w-5" />,
    title: 'Learning',
    description: 'D&A Learning',
    href: '#',
    mainColor:  '#3b82f6' // Blue
  }, */
  {
    id: 'security',
    icon: <Shield className="h-5 w-5" />,
    title: 'Security',
    description: 'D&A Security',
    href: '/fr/apps/security',
    mainColor: '#ef4444' // Red
  }
]

export default function AppSwitcherMenu() {
  const pathName = usePathname();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="relative"
          aria-label="App Switcher"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[26rem]" align="end" forceMount>
        <DropdownMenuLabel className="font-semibold text-base p-3">Applications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2 grid grid-cols-2 gap-1">
          {apps.map((app) => (
            <DropdownMenuItem key={app.id} asChild className="focus:bg-accent focus:text-accent-foreground rounded-md p-0">
              <Link href={app.href} className="flex flex-col items-center justify-center gap-2 p-3 h-32 hover:bg-muted/50 transition-colors duration-150 rounded-md">
                <div 
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg" 
                  style={{ backgroundColor: `${app.mainColor}30`, color: app.mainColor }}
                >
                  {/* Ensure icon prop is passed correctly, React.cloneElement can be used if size needs dynamic adjustment */}
                  {app.icon && React.isValidElement(app.icon) ? React.cloneElement(app.icon) : null}
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="font-semibold text-sm">{app.title}</span>
                  <span className="text-xs text-muted-foreground px-1">{app.description}</span>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}