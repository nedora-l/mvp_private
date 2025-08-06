import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { DocsTemplatesManagement } from "@/components/admin/templates/documents/docs-templates-management.component";
export default async function EmailTemplatesPage({ params }: BasePageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations for admin
  const dictionary = await getDictionary(locale, ['common', 'admin']);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Documents Templates</h1>
        <p className="text-muted-foreground">
          Create, manage, and organize document templates for your organization
        </p>
      </div>
      
      <DocsTemplatesManagement dictionary={dictionary} locale={locale} />
    </div>
  )
}
