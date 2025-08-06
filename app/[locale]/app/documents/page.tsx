import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { getDictionary } from "@/locales/dictionaries"
import DocumentsComponentPageV2 from "@/components/files/documents.component.page.v2";

export default async function DocumentsPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const curLocale = resolvedParams.locale;
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(curLocale, ['common', 'documents']);
  
  return (
    <div className="space-y-6 p-6">
        <DocumentsComponentPageV2 dictionary={dictionary} locale={curLocale} />
    </div>
  )
}
