import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Megaphone, ThumbsUp, MessageSquare, Share2 } from "lucide-react"
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component"

const announcements = {
  en: [
    {
      id: 1,
      title: "Company Quarterly Results",
      content:
        "We're pleased to announce that our Q2 results exceeded expectations with a 15% growth in revenue. The executive team will host a town hall meeting next week to discuss the details.",
      author: {
        name: "Sarah Johnson",
        role: "CEO",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
      },
      date: "2 hours ago",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      title: "New Office Opening in Seattle",
      content:
        "We're excited to announce the opening of our new Seattle office next month. This expansion will help us better serve our West Coast clients and create new job opportunities.",
      author: {
        name: "Michael Chen",
        role: "COO",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
      },
      date: "Yesterday",
      likes: 42,
      comments: 15,
    },
    {
      id: 3,
      title: "IT System Maintenance",
      content:
        "The IT department will be performing system maintenance this Saturday from 10 PM to 2 AM. Some services may be temporarily unavailable during this time. Please save your work accordingly.",
      author: {
        name: "Alex Rivera",
        role: "IT Director",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
      },
      date: "2 days ago",
      likes: 12,
      comments: 5,
    },
  ],
  fr: [
    {
      id: 1,
      title: "Résultats trimestriels de l'entreprise",
      content:
        "Nous sommes heureux d'annoncer que nos résultats du deuxième trimestre ont dépassé les attentes avec une croissance de 15% du chiffre d'affaires. L'équipe de direction organisera une réunion générale la semaine prochaine pour discuter des détails.",
      author: {
        name: "Sarah Johnson",
        role: "PDG",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
      },
      date: "Il y a 2 heures",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      title: "Ouverture d'un nouveau bureau à Seattle",
      content:
        "Nous sommes ravis d'annoncer l'ouverture de notre nouveau bureau à Seattle le mois prochain. Cette expansion nous aidera à mieux servir nos clients de la côte ouest et créera de nouvelles opportunités d'emploi.",
      author: {
        name: "Michael Chen",
        role: "Directeur des opérations",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
      },
      date: "Hier",
      likes: 42,
      comments: 15,
    },
    {
      id: 3,
      title: "Maintenance du système informatique",
      content:
        "Le département informatique effectuera une maintenance du système ce samedi de 22h à 2h du matin. Certains services peuvent être temporairement indisponibles pendant cette période. Veuillez enregistrer votre travail en conséquence.",
      author: {
        name: "Alex Rivera",
        role: "Directeur informatique",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
      },
      date: "Il y a 2 jours",
      likes: 12,
      comments: 5,
    },
  ],
  ar: [
    {
      id: 1,
      title: "نتائج الشركة الفصلية",
      content:
        "يسرنا أن نعلن أن نتائج الربع الثاني تجاوزت التوقعات بنمو 15٪ في الإيرادات. سيستضيف فريق الإدارة اجتماعًا عامًا الأسبوع المقبل لمناقشة التفاصيل.",
      author: {
        name: "سارة جونسون",
        role: "الرئيس التنفيذي",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
      },
      date: "منذ ساعتين",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      title: "افتتاح مكتب جديد في سياتل",
      content:
        "يسعدنا أن نعلن عن افتتاح مكتبنا الجديد في سياتل الشهر المقبل. سيساعدنا هذا التوسع على خدمة عملائنا في الساحل الغربي بشكل أفضل وخلق فرص عمل جديدة.",
      author: {
        name: "مايكل تشين",
        role: "مدير العمليات",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
      },
      date: "الأمس",
      likes: 42,
      comments: 15,
    },
    {
      id: 3,
      title: "صيانة نظام تكنولوجيا المعلومات",
      content:
        "سيقوم قسم تكنولوجيا المعلومات بإجراء صيانة للنظام هذا السبت من الساعة 10 مساءً حتى 2 صباحًا. قد تكون بعض الخدمات غير متاحة مؤقتًا خلال هذا الوقت. يرجى حفظ عملك وفقًا لذلك.",
      author: {
        name: "أليكس ريفيرا",
        role: "مدير تكنولوجيا المعلومات",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
      },
      date: "منذ يومين",
      likes: 12,
      comments: 5,
    },
  ],
}

export function CompanyAnnouncements({ dictionary, locale }: AppComponentDictionaryProps) {
  // Default to English if the locale is not supported
  const currentLanguage = (locale && announcements[locale as keyof typeof announcements]) 
    ? locale as keyof typeof announcements 
    : 'fr';
  
  const localizedAnnouncements = announcements[currentLanguage];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Megaphone className="mr-2 h-5 w-5 text-primary" />
          {dictionary.home.companyAnnouncements?.title}
        </CardTitle>
        <Button variant="outline" size="sm">
          {dictionary.common.seeAll|| "View All"} 
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {localizedAnnouncements.map((announcement) => (
          <div key={announcement.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex items-start space-x-4 mb-3">
              <Avatar>
                <AvatarImage src={announcement.author.avatar || "/placeholder.svg"} alt={announcement.author.name} />
                <AvatarFallback>{announcement.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{announcement.author.name}</div>
                <div className="text-sm text-muted-foreground">
                  {announcement.author.role} • {announcement.date}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{announcement.title}</h3>
            <p className="text-muted-foreground mb-3">{announcement.content}</p>
            <div className="flex items-center space-x-4 text-sm">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{announcement.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{announcement.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <Share2 className="h-4 w-4" />
                <span>{dictionary.actions.share|| "Share"}</span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
