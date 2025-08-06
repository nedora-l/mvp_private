import { Button } from "@/components/ui/button"
import {
  Users,
  Plus
} from "lucide-react"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"

import { getDictionary } from "@/locales/dictionaries"
import TeamsAndProjectsTabsClient from "@/components/teams/teams-projects-tabs"

export default async function TeamsPage({ params }: BasePageProps ) {
    // Await params before accessing its properties
    const resolvedParams = await params;
    const locale = resolvedParams.locale;

    // Load translations from multiple namespaces
    const dictionary = await getDictionary(locale, ['common', 'home', 'teams']);
    return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{dictionary.teams.title}</h1>
        <div className="flex space-x-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {dictionary.teams.createNew}
          </Button>
        </div>
      </div>
      <TeamsAndProjectsTabsClient dictionary={dictionary} locale={params.locale} />
    </div>
  )
}
