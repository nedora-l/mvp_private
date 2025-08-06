import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import SecurityDashboardComponent from "@/components/security/security-dashboard.component";

export default async function SecurityDashboardPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'security']);

  return (
    <SecurityDashboardComponent dictionary={dictionary} locale={locale} />
  )
}
