import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { WorkflowsManagementComponent } from "@/components/admin/workflows-management.component";

export default async function WorkflowsPage({ params }: BasePageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations for admin
  const dictionary = await getDictionary(locale, ['common', 'admin']);

  return (
    <div className="space-y-6">
      <WorkflowsManagementComponent dictionary={dictionary} locale={locale} />
    </div>
  )
}
