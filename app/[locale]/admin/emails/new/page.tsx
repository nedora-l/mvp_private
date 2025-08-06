import { NewEmailTemplateForm } from "@/components/admin/templates/emails/new-email-template-form";
import { getDictionary } from "@/locales/dictionaries"
import type React from "react"

type NewEmailTemplatePageProps = {
  params: {
    locale: string;
  };
};

export default async function NewEmailTemplatePage({ params }: NewEmailTemplatePageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  // Get dictionaries for the page
  const dict = await getDictionary(locale, ['common', 'admin']);
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New Email Template</h1>
        <p className="text-muted-foreground">
          Design and configure a new email template for your organization
        </p>
      </div>
      <NewEmailTemplateForm dictionary={dict} locale={locale} />
    </div>
  )
}
