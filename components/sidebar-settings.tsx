"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, Sidebar, Smartphone } from "lucide-react"
import { clearSidebarState, getSavedSidebarState, useSidebarState } from "@/hooks/use-sidebar-state"
import { cn } from "@/lib/utils"

export function SidebarSettings() {
  const [isResetting, setIsResetting] = useState(false)
  const { 
    isCollapsed, 
    isMobileOpen, 
    setSidebarCollapsed, 
    setMobileSidebarOpen 
  } = useSidebarState()

  const handleResetSettings = async () => {
    setIsResetting(true)
    try {
      clearSidebarState()
      // Force refresh of sidebar state
      window.location.reload()
    } catch (error) {
      console.error("Failed to reset sidebar settings:", error)
    } finally {
      setIsResetting(false)
    }
  }

  const savedState = getSavedSidebarState()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sidebar className="h-5 w-5" />
          Sidebar Settings
        </CardTitle>
        <CardDescription>
          Customize your sidebar preferences. These settings are automatically saved and will persist across sessions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current State Display */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Current State</h4>
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Sidebar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <Label className="text-sm">Desktop Sidebar</Label>
              </div>
              <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                isCollapsed 
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              )}>
                {isCollapsed ? "Collapsed" : "Expanded"}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <Label className="text-sm">Mobile Sidebar</Label>
              </div>
              <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                isMobileOpen 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300"
              )}>
                {isMobileOpen ? "Open" : "Closed"}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Manual Controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Manual Controls</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="sidebar-collapsed" className="text-sm">
                Collapse sidebar by default
              </Label>
              <Switch
                id="sidebar-collapsed"
                checked={isCollapsed}
                onCheckedChange={setSidebarCollapsed}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="mobile-sidebar" className="text-sm">
                Open mobile sidebar
              </Label>
              <Switch
                id="mobile-sidebar"
                checked={isMobileOpen}
                onCheckedChange={setMobileSidebarOpen}
                className="lg:opacity-50 lg:pointer-events-none"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Reset Button */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Reset Settings</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetSettings}
            disabled={isResetting}
            className="w-full"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isResetting && "animate-spin")} />
            {isResetting ? "Resetting..." : "Reset to Default"}
          </Button>
          <p className="text-xs text-muted-foreground">
            This will clear your saved sidebar preferences and reload the page.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
