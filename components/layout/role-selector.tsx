"use client"

import { useSettings } from "@/contexts/settings-context"
import React, { useMemo } from "react"
import { Dictionary } from "@/locales/dictionary"
import { getCurrentDepartment } from "../top-nav"
import { departments } from "@/lib/mock-data/common"

interface CurrentRoleBadgeProps {
  dictionary: Dictionary;
  locale: string;
}

const departmentStyles: Record<string, string> = {
  ceo: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
  finance: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
  operations: "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200",
  hr: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200",
  sales: "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200",
  tech: "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200",
  marketing: "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200",
  default: "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200",
}

export function CurrentRoleBadgeSelectorComponent({ dictionary, locale }: CurrentRoleBadgeProps) {
  const { settings, setCurrentDepartment } = useSettings()
  //const currentDept = useMemo(() => getCurrentDepartment(), [])
  const activeDepartment = settings.currentDepartment || "ceo"

  // Update global settings context for reactivity everywhere
  const handleRoleChange = (role: string) => {
    if (typeof setCurrentDepartment === 'function') {
      setCurrentDepartment(role)
    } else {
      // fallback: direct mutation (not recommended, but for legacy support)
      settings.currentDepartment = role
    }
  }

  return (
    <div className="hidden lg:flex items-center gap-2">
      <select
        value={activeDepartment}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select department"
      >
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}  disabled={dept.isEnabled !== true}>
            {dept.name}
          </option>
        ))}
      </select>
    </div>
  )
}