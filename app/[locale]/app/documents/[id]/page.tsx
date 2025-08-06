import { BasePagePropsWithId } from "@/lib/interfaces/common/dictionary-props-component"
import { getDictionary } from "@/locales/dictionaries";
import DocumentDetailsComponentPage from "@/components/files/document.details.component.page";


export default async function AppFileDetailsPage({ params }: BasePagePropsWithId) {
  const resolvedParams = await params;
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(resolvedParams.locale, ['common', 'documents']);
  return (
    <div className="space-y-6">
      <DocumentDetailsComponentPage dictionary={dictionary} locale={resolvedParams.locale} id={resolvedParams.id} />
    </div>
  )
}
