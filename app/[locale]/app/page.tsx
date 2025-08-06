import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import DashboardPageComponent from "@/components/dashboard/dashboard.page.component"

export default async function Home({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'home', 'teams', 'footer']);

  return (
     <DashboardPageComponent dictionary={dictionary} locale={locale} />
  )
}
