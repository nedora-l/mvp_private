import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { AdminSettingsComponent } from "@/components/admin/admin-settings.component";

export default async function AdminSettingsPage({ params }: BasePageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations for admin
  const dictionary = await getDictionary(locale, ['common', 'admin']);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system-wide settings and administrative preferences
        </p>
      </div>
      <AdminSettingsComponent dictionary={dictionary} locale={locale} />
    </div>
  )
}
