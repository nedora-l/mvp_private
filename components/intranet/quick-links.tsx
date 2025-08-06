import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Users, Briefcase, HelpCircle, Coffee, BookOpen, PlusCircle, BotIcon } from "lucide-react"
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component"

const quickLinks = {
  en: [
    { name: "Ai Chat", icon: BotIcon, href: "/app/chat" },
    { name: "HR Portal", icon: Briefcase, href: "/app/hr" },
    { name: "IT Support", icon: HelpCircle, href: "/apps/helpcenter" },
    { name: "Documents", icon: FileText, href: "/app/documents" },
    { name: "Calendar", icon: Calendar, href: "/app/calendar" },
    { name: "Team Directory", icon: Users, href: "/app/directory" },
    { name: "Learning Portal", icon: BookOpen, href: "/app/learning" },
    { name: "Break Room", icon: Coffee, href: "/app/break-room" },
  ],
  fr: [
    { name: "Chat I.A.", icon: BotIcon, href: "/app/chat" },
    { name: "Portail RH", icon: Briefcase, href: "/app/hr" },
    { name: "Support", icon: HelpCircle, href: "/apps/helpcenter" },
    { name: "Documents", icon: FileText, href: "/app/documents" },
    { name: "Calendrier", icon: Calendar, href: "/app/calendar" },
    { name: "Annuaire", icon: Users, href: "/app/directory" },
    { name: "Portail", icon: BookOpen, href: "/app/learning" },
    { name: "Salle de pause", icon: Coffee, href: "/app/break-room" },
  ],
  ar: [
    { name: "محادثة الذكاء الاصطناعي", icon: BotIcon, href: "/app/chat" },
    { name: "الموارد البشرية", icon: Briefcase, href: "/app/hr" },
    { name: "الدعم التقني", icon: HelpCircle, href: "/apps/helpcenter" },
    { name: "المستندات", icon: FileText, href: "/app/documents" },
    { name: "التقويم", icon: Calendar, href: "/app/calendar" },
    { name: "دليل الفريق", icon: Users, href: "/app/directory" },
    { name: "بوابة التعلم", icon: BookOpen, href: "/app/learning" },
    { name: "غرفة الاستراحة", icon: Coffee, href: "/app/break-room" },
  ],
}

export function QuickLinks({ dictionary, locale }: AppComponentDictionaryProps) {
  // Default to English if the locale is not supported
  const currentLanguage = (locale && quickLinks[locale as keyof typeof quickLinks]) 
    ? locale as keyof typeof quickLinks 
    : 'fr';
  
  const localizedQuickLinks = quickLinks[currentLanguage];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          { dictionary.home.quickLinks.title || "Liens rapides" }
        </CardTitle>
        <Button variant="ghost" size="icon">
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">{ dictionary.home.quickLinks.add || "Add custom link" } </span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {localizedQuickLinks.map((link) => (
            <Button
              key={link.name}
              variant="outline"
              className="h-auto py-4 justify-start flex-col items-center text-center"
              asChild
            >
              <a href={link.href}>
                <link.icon className="h-6 w-6 mb-2" />
                <span>{link.name}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
