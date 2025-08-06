import { Button } from "@/components/ui/button"
import { Plus} from "lucide-react"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import CalendarTabsClient from "@/components/calendar/calendar-tabs"
import { getDictionary } from "@/locales/dictionaries"

export default async function CalendarPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const dictionary = await getDictionary(locale, ['common', 'calendar']);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.calendar.title}</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {dictionary.actions.create} {dictionary.calendar.target || "Event"}
        </Button>
      </div>
      <CalendarTabsClient dictionary={dictionary} locale={params.locale} />
    </div>
  )
}
