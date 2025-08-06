'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { locales } from "@/middleware"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function LanguageSwitcherMenu({ 
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Language Switcher"
              >
          {currentLocale === 'en' ? '🇺🇸' : currentLocale === 'fr' ? '🇫🇷' : '🇲🇦'}
        </Button>
      
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {locales.map((locale) => (
          <DropdownMenuItem asChild>
            <Link  href={getPathWithNewLocale(locale) || '/'}>
              {locale === 'en' ? 'English' : locale === 'fr' ? 'Français' : 'العربية'}
            </Link>
          </DropdownMenuItem>
        ))} 
      </DropdownMenuContent>
    </DropdownMenu>
)
}