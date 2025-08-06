import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import VulnerabilityManagementPageComponent from "@/components/security/vulnerability-management.component";

export default async function VulnerabilityManagementPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'security']);

  return (
    <VulnerabilityManagementPageComponent dictionary={dictionary} locale={locale} />
  )
}
