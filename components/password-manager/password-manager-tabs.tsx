"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dictionary } from "@/locales/dictionary"
import { Lock, Share, ShieldCheck } from "lucide-react"
import { PasswordVault } from "./password-vault"
import { SharedPasswords } from "./shared-passwords"
import { SecurityDashboard } from "./security-dashboard"

interface PasswordManagerTabsProps {
    dictionary: Dictionary,
    locale: string
}

export function PasswordManagerTabs({ dictionary, locale }: PasswordManagerTabsProps) {
  const dict = dictionary.passwordManager

  return (
    <Tabs defaultValue="vault" className="space-y-4">
      <TabsList className="w-full flex flex-wrap overflow-x-auto sm:flex-nowrap">
        <TabsTrigger value="vault" className="flex items-center gap-2 whitespace-nowrap">
          <Lock className="h-4 w-4" />
          <span>{dict.vault}</span>
        </TabsTrigger>
        <TabsTrigger value="shared" className="flex items-center gap-2 whitespace-nowrap">
          <Share className="h-4 w-4" />
          <span>{dict.shared}</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2 whitespace-nowrap">
          <ShieldCheck className="h-4 w-4" />
          <span>{dict.security.title}</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="vault" className="space-y-4">
        <PasswordVault dictionary={dictionary} locale={locale} />
      </TabsContent>
      <TabsContent value="shared" className="space-y-4">
        <SharedPasswords dictionary={dictionary} />
      </TabsContent>
      <TabsContent value="security" className="space-y-4">
        <SecurityDashboard dictionary={dictionary} />
      </TabsContent>
    </Tabs>
  )
}