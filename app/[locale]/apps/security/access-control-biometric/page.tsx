import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import AccessControlBiometricComponent from "@/components/security/access-control-biometric.component";

export default async function AccessControlBiometricPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'security']);

  return (
    <AccessControlBiometricComponent dictionary={dictionary} locale={locale} />
  )
}
