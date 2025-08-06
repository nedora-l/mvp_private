'use client'

import { List01 } from "./list01"
import { List02 } from "./list02"
import { List03 } from "./list03"
import { Dictionary } from "@/locales/dictionary"

interface ContentProps {
  dictionary: Dictionary;
  locale: string;
}

export function Content({ dictionary, locale }: ContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="md:col-span-2 lg:col-span-1">
        <List01 dictionary={dictionary} locale={locale} />
      </div>
      <div className="md:col-span-2 lg:col-span-1">
        <List02 dictionary={dictionary} locale={locale} />
      </div>
      <div className="md:col-span-2 lg:col-span-1">
        <List03 dictionary={dictionary} locale={locale} />
      </div>
    </div>
  )
}
