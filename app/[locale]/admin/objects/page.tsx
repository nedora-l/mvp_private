import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { ObjectsManagerComponent } from "@/components/admin/objects-manager.component";

export default async function ObjectsManagerPage({ params }: BasePageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // Load translations for admin
  const dictionary = await getDictionary(locale, ['common', 'admin']);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Objects Manager</h1>
        <p className="text-muted-foreground">
          Create and manage custom objects, fields, and relationships like Salesforce
        </p>
      </div>
      <ObjectsManagerComponent dictionary={dictionary} locale={locale} />
    </div>
  )
}
