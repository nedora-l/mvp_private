import { getDictionary } from "@/locales/dictionaries"
import { CompanyAnnouncements } from "@/components/intranet/company-announcements"
import { QuickLinks } from "@/components/intranet/quick-links"
import { UpcomingEvents } from "@/components/intranet/upcoming-events"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"
import { TeamActivity } from "@/components/intranet/team-activity"
import { RecentDocuments } from "@/components/intranet/recent-documents"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users2, Target, FileText } from "lucide-react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import GeminiLiveChat from "@/components/chat/GeminiLiveChat"

export default async function Home({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Load translations from multiple namespaces
  const dictionary = await getDictionary(locale, ['common', 'home', 'teams', 'footer']);
  
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {dictionary.home.welcome}
        </h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">

          <Tabs defaultValue="quick-links" className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 h-auto md:h-auto">
              <TabsTrigger value="announcements" className="flex items-center">
                <Building2 className="mr-2 h-4 w-4" />
                {dictionary.home.companyAnnouncements?.title}
              </TabsTrigger>
              <TabsTrigger value="quick-links" className="flex items-center">
                <Users2 className="mr-2 h-4 w-4" />
                {dictionary.teams.activity?.title || dictionary.home.teamActivity.title}
              </TabsTrigger>
              <TabsTrigger value="policies" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Policies
              </TabsTrigger>
              <TabsTrigger value="birthdays" className="flex items-center">
                <Target className="mr-2 h-4 w-4" />
                Evenements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="announcements">
                <CompanyAnnouncements dictionary={dictionary} locale={locale} />
            </TabsContent>
            <TabsContent value="quick-links">
              <TeamActivity dictionary={dictionary} locale={resolvedParams.locale} />
            </TabsContent>
            <TabsContent value="policies">
                <RecentDocuments dictionary={dictionary} locale={resolvedParams.locale} />
            </TabsContent>
            <TabsContent value="birthdays">
                <UpcomingEvents dictionary={dictionary} locale={locale} />
            </TabsContent>
          </Tabs>
          <br/>
        </div>
        <div className="gap-6 lg:col-span-1 order-first sm:order-first lg:order-none">
          <QuickLinks dictionary={dictionary} locale={locale} />
        </div>

      </div>
      <MobileBottomNav dictionary={dictionary} />
    </div>
  )
}

/*

*/