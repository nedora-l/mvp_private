import DirectoriesTabsClient from "@/components/directory/directory-tabs";
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { getDictionary } from "@/locales/dictionaries"

export default async function DirectoryPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const curLocale = resolvedParams.locale;
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(curLocale, ['common', 'home', 'directory']);

  return (
     <DirectoriesTabsClient dictionary={dictionary} locale={curLocale} />
  )
}
 