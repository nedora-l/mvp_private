import { Metadata } from "next"
import { getDictionary } from "@/locales/dictionaries"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { LoginForm } from "@/components/login/login-form"
import { redirect } from "next/navigation";

export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale)
  return {
    title: `${dict.login?.title || 'Login'} | DAWS`,
    description: dict.login?.description || 'Login to your account',
  }
}

export default async function LoginPageRedirect({ params }: BasePageProps) {
  // Redirect to the new auth/login path
  redirect(`/${params.locale}/auth/login`);
}