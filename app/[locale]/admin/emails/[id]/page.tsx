import { getDictionary } from "@/locales/dictionaries"
import { EmailTemplateDetailView } from "@/components/admin/templates/emails/email-template-detail-view"
import type React from "react"

type EmailTemplateDetailPageProps = {
  params: {
    locale: string;
    id: string;
  };
};

export default async function EmailTemplateDetailPage({ params }: EmailTemplateDetailPageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const templateId = resolvedParams.id;
  
  // Get dictionaries for the page
  const dict = await getDictionary(locale, ['common', 'admin']);
  
  return (
    <div className="space-y-6">
      <EmailTemplateDetailView 
        templateId={templateId}
        dictionary={dict} 
        locale={locale} 
      />
    </div>
  )
}
