import { getDictionary } from "@/locales/dictionaries"
import { AIAgentDetailView } from "@/components/admin/ai-agent-detail-view"
import type React from "react"

type AIAgentDetailPageProps = {
  params: {
    locale: string;
    id: string;
  };
};

export default async function AIAgentDetailPage({ params }: AIAgentDetailPageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const agentId = resolvedParams.id;
  
  // Get dictionaries for the page
  const dict = await getDictionary(locale, ['common', 'admin']);
  
  return (
    <div className="space-y-6">
      <AIAgentDetailView 
        agentId={agentId}
        dictionary={dict} 
        locale={locale} 
      />
    </div>
  )
}
