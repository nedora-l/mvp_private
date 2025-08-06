import { ObjectDetailsPage } from "@/components/admin/object-details-page";
import { getDictionary } from "@/locales/dictionaries"

export type FullBasePageProps = {
  params: {
    locale: string;
    id: string;
  };
}

export default async function ObjectsRecordDetailsPage({ params }: FullBasePageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const id = resolvedParams.id; // Extract id from resolvedParams

  // Load translations for admin
  const dictionary = await getDictionary(locale, ['common', 'admin']);



  return (
    <ObjectDetailsPage  objectId={id} dictionary={dictionary} locale={locale} />
  )
}
