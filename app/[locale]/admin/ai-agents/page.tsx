import { getDictionary } from "@/locales/dictionaries"
import { AIAgentsManagement } from "@/components/admin/ai-agents-management.component"
import type React from "react"

type AIAgentsPageProps = {
  params: {
    locale: string;
  };
};

export default async function AIAgentsPage({ params }: AIAgentsPageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Get dictionaries for the page
  const dict = await getDictionary(locale, ['common', 'admin']);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Agents Management</h1>
        <p className="text-muted-foreground">
          Manage and configure AI agents for your organization
        </p>
      </div>
      
      <AIAgentsManagement dictionary={dict} locale={locale} />
    </div>
  )
}
