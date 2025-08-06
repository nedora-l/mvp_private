import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import AccessControlPageComponent from "@/components/security/access-control.component";

export default async function AccessControlPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'security']);

  return (
    <AccessControlPageComponent dictionary={dictionary} locale={locale} />
  )
}
