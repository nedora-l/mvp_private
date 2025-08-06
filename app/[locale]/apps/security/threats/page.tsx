import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import ThreatDetectionPageComponent from "@/components/security/threat-detection.component";

export default async function ThreatDetectionPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'security']);

  return (
    <ThreatDetectionPageComponent dictionary={dictionary} locale={locale} />
  )
}
