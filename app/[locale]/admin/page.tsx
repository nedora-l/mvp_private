import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { AdminDashboardComponent } from "@/components/admin/admin-dashboard.component"

export default async function AdminDashboard({ params }: BasePageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations for admin
  const dictionary = await getDictionary(locale, ['common', 'admin']);

  return (
    <AdminDashboardComponent dictionary={dictionary} locale={locale} />
  )
}
