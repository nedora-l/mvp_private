"use client"

import { useSettings } from "@/contexts/settings-context"
import { Shield } from "lucide-react"
import React, { useMemo } from "react"
import { Dictionary } from "@/locales/dictionary"
import { getCurrentDepartment } from "../top-nav"

interface CurrentRoleBadgeProps {
  dictionary: Dictionary;
  locale: string;
}

export const departmentStyles: Record<string, string> = {
  admin: "bg-gradient-to-r from-red-50 to-orange-50 border-red-200",
  ceo: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
  finance: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
  operations: "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200",
  hr: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200",
  sales: "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200",
  tech: "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200",
  marketing: "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200",
  default: "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200",
}

export function CurrentRoleBadgeComponent({ dictionary, locale }: CurrentRoleBadgeProps) {
  const { settings } = useSettings()
  const currentDept = useMemo(() => getCurrentDepartment(), [])
  const activeDepartment = settings.currentDepartment || "ceo"

  // Pick style based on department, fallback to default
  const badgeStyle = departmentStyles[activeDepartment] || departmentStyles.default

  return (
    <div
      className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border ${badgeStyle}`}
      aria-label={currentDept.name}
    >
      <Shield className={`h-4 w-4 ${currentDept.color}`} aria-hidden="true" />
      <span className={`text-sm font-medium ${currentDept.color}`}>
        {currentDept.name}
      </span>
    </div>
  )
}
