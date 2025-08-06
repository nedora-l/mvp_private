"use client"

import Link from "next/link"
import { Dictionary } from "@/locales/dictionary"
import { SidebarDynamic } from "./sidebar.dynamic"
import { Shield } from "lucide-react"

export function SidebarSecurity({ dictionary }: { dictionary: Dictionary }) {
  return (
    <SidebarDynamic 
      logoComponent={
        (<Link href="/apps/security" className="flex items-center gap-2 font-semibold group transition-all duration-200 hover:scale-105">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="relative bg-gradient-to-br from-red-500 to-orange-600 p-1.5 rounded-lg shadow-md">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </div>
          <span className="text-sm bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent font-bold">
            Security
          </span>
        </Link>)
      } 
      configType="security"
      dictionary={dictionary}  
      compact={true}
    />
  )
}
