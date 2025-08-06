import { Metadata } from "next"
import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { LoginForm } from "@/components/login/login-form"


export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const dict = await getDictionary(locale, ['common', 'login'])
  return {
    title: `${dict.login?.title || 'Login'} | DAWS`,
    description: dict.login?.description || 'Login to your account',
  }
}

export default async function LoginPage({ params, searchParams }: BasePageProps & { searchParams: { redirect?: string } }) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const resolvedsearchParams = await searchParams;
  // Get the redirect URL from query params if available
  const redirect = resolvedsearchParams?.redirect || `/${locale}/app`;
  // Load translations with both common and login namespaces
  const dictionary = await getDictionary(locale, ['common', 'login']);
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-10 bg-gradient-to-br from-background to-muted/50 dark:from-background dark:to-muted/30">
      
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {dictionary.login?.title || 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {dictionary.login?.description || 'Sign in to your account to continue'}
          </p>
        </div>
        
        <LoginForm dictionary={dictionary} locale={locale} redirectPath={redirect} />
      </div>
    </div>
  )
}