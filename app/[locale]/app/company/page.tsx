import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import CompanyTabsClient from "@/components/company/company-tabs"
import { getDictionary } from "@/locales/dictionaries"

export default async function CompanyPage({ params }: BasePageProps ) {
  const resolvedParams = await params;
  const curLocale = resolvedParams.locale;
  const dictionary = await getDictionary(curLocale, ['common', 'company']);
  return (
    <CompanyTabsClient dictionary={dictionary} locale={curLocale} />
  )
}
