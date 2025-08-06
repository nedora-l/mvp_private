"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n/use-i18n"
import { Dictionary } from "@/locales/dictionary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Home, Mail } from "lucide-react"
import { useSession } from "next-auth/react"
import { getDictionary } from "@/locales/dictionaries"

type AccessDeniedPageProps = {
  params: { locale: string }
}

export default async function AccessDeniedPage({ params }: AccessDeniedPageProps) {
    // Await params before accessing its properties
    const resolvedParams = await params;
    const locale = resolvedParams.locale;
    // Load translations from multiple namespaces
    const dictionary = await getDictionary(locale, ['common', 'accessDenied']);

    const searchParams = useSearchParams()
    const router = useRouter()
    const { data: session } = useSession()
    
    const [attemptedPath, setAttemptedPath] = useState<string>("")
    const [requiredRoles, setRequiredRoles] = useState<string[]>([])

    useEffect(() => {
        // Get URL parameters
        const attempted = searchParams.get('attempted') || ''
        const required = searchParams.get('required') || ''
        
        setAttemptedPath(attempted)
        setRequiredRoles(required.split(',').filter(Boolean))
    }, [locale, searchParams])

    const { t } = useI18n(dictionary )

    const handleGoBack = () => {
        router.back()
    }

    const handleGoHome = () => {
        router.push(`/${locale}/app`)
    }

    const handleContactSupport = () => {
        // You can implement this to open a support ticket or email
        window.location.href = `mailto:support@da-tech.ma?subject=Access Request - ${attemptedPath}&body=I need access to: ${attemptedPath}%0D%0ARequired roles: ${requiredRoles.join(', ')}%0D%0AMy current user ID: ${session?.user?.id}`
    }

    if (!dictionary) {
        return <div>Loading...</div>
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('accessDenied.title') || 'Access Denied'}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {t('accessDenied.description') || 'You don\'t have permission to access this page'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {attemptedPath && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>{t('accessDenied.attemptedPath') || 'Attempted path:'}:</strong>
              </p>
              <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                {attemptedPath}
              </p>
            </div>
          )}
          
          {requiredRoles.length > 0 && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>{t('accessDenied.requiredRoles') || 'Required roles:'}:</strong>
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {requiredRoles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {session?.user && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>{t('accessDenied.yourRoles') || 'Your roles:'}:</strong>
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {session.user.roles && session.user.roles.length > 0 ? (
                  session.user.roles.map((role: string) => (
                    <span
                      key={role}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t('accessDenied.noRoles') || 'No roles assigned'}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('accessDenied.goBack') || 'Go Back'}
            </Button>
            <Button
              onClick={handleGoHome}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              {t('accessDenied.goHome') || 'Go Home'}
            </Button>
          </div>
          
          <Button
            onClick={handleContactSupport}
            variant="ghost"
            className="w-full flex items-center gap-2 text-sm"
          >
            <Mail className="h-4 w-4" />
            {t('accessDenied.contactSupport') || 'Request Access'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
