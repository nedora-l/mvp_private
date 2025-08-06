'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { locales } from "@/middleware"
import { Button } from "@/components/ui/button"

export default function LanguageSwitcher({ 
  dictionary,
  currentLocale
}: { 
  dictionary: any,
  currentLocale: string
}) {
  const pathName = usePathname();
  
  const getPathWithNewLocale = (locale: string) => {
    if(pathName != null) {
        const segments = pathName.split('/')
        segments[1] = locale
        return segments.join('/')
    }
    return pathName
  }

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={currentLocale === locale ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href={getPathWithNewLocale(locale) || '/'}>
            {locale === 'en' ? 'English' : locale === 'fr' ? 'Français' : 'العربية'}
          </Link>
        </Button>
      ))}
    </div>
  )
}