import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import AccessControlCameraComponent from "@/components/security/access-control-camera.component";

export default async function AccessControlCameraPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'security']);

  return (
    <AccessControlCameraComponent dictionary={dictionary} locale={locale} />
  )
}
