import { Metadata } from "next"
import { getDictionary } from "@/locales/dictionaries"
import { PasswordManagerTabs } from "@/components/password-manager/password-manager-tabs"

export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const dict = await getDictionary(locale)

  return {
    title: `${dict.passwordManager.title} | ${dict.app.title}`,
    description: dict.passwordManager.description,
  }
}

export default async function PasswordManagerPage({
  params 
}: {
  params: { locale: string }
}) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const dict = await getDictionary(locale)
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2 py-2 sm:py-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{dict.passwordManager.title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {dict.passwordManager.description}
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <PasswordManagerTabs dictionary={dict} locale={locale} />
      </div>
    </div>
  )
}