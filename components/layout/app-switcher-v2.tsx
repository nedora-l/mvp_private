"use client"

import { useSettings } from "@/contexts/settings-context"
import React, { useMemo } from "react"
import { Dictionary } from "@/locales/dictionary"
import { dockApps } from "@/lib/mock-data/common"

interface AppSwitcherV2ComponentProps {
  dictionary: Dictionary;
  locale: string;
  isVisible?: boolean;
  toggleDock?: () => void;
}

export function AppSwitcherV2Component({ dictionary, locale, isVisible, toggleDock }: AppSwitcherV2ComponentProps) {
  const { settings } = useSettings()

  const handleAppClick = (appId: string) => {
    console.log(`App clicked: ${appId}`)
  }

  return (
    <div className={`bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 transition-all duration-300 translate-x-0 opacity-100`}
    >
        <div className="flex flex-col gap-3">
            {dockApps.map((app, index) => (
                <div
                    key={app.id}
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-110"
                    onClick={() => {
                        handleAppClick(app.id);
                        if (toggleDock) toggleDock();
                    }}
                    title={`${app.name} - ${app.subtitle}`}
                    >
                    <div
                        className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:w-14 group-hover:h-14`}
                    >
                        <app.icon className={`h-6 w-6 ${app.iconColor} group-hover:h-7 group-hover:w-7 transition-all duration-300`} />
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
