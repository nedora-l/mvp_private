import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import SecuritySettingsPageComponent from "@/components/security/security-settings.component";

export default async function SecuritySettingsPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'security']);

  return (
    <SecuritySettingsPageComponent dictionary={dictionary} locale={locale} />
  )
}
