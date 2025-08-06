import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import AuditLogsPageComponent from "@/components/security/audit-logs.component";

export default async function AuditLogsPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'security']);

  return (
    <AuditLogsPageComponent dictionary={dictionary} locale={locale} />
  )
}
