import { Button } from "@/components/ui/button"
import { Gift, Calendar, Cake, Clock, MapPin, Users } from "lucide-react"
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const events = {
  en: [
    {
      id: 1,
      title: "Town Hall Meeting",
      date: "July 15, 2023",
      time: "10:00 AM - 11:30 AM",
      location: "Main Conference Room",
      attendees: 45,
      attendeesLabel: "attendees"
    },
    {
      id: 2,
      title: "Team Building Workshop",
      date: "July 20, 2023",
      time: "2:00 PM - 5:00 PM",
      location: "Innovation Center",
      attendees: 28,
      attendeesLabel: "attendees"
    },
    {
      id: 3,
      title: "Product Launch Planning",
      date: "July 25, 2023",
      time: "9:00 AM - 12:00 PM",
      location: "Strategy Room B",
      attendees: 12,
      attendeesLabel: "attendees"
    },
  ],
  fr: [
    {
      id: 1,
      title: "Réunion générale",
      date: "15 juillet 2023",
      time: "10h00 - 11h30",
      location: "Salle de conférence principale",
      attendees: 45,
      attendeesLabel: "participants"
    },
    {
      id: 2,
      title: "Atelier de team building",
      date: "20 juillet 2023",
      time: "14h00 - 17h00",
      location: "Centre d'innovation",
      attendees: 28,
      attendeesLabel: "participants"
    },
    {
      id: 3,
      title: "Planification de lancement de produit",
      date: "25 juillet 2023",
      time: "9h00 - 12h00",
      location: "Salle de stratégie B",
      attendees: 12,
      attendeesLabel: "participants"
    },
  ],
  ar: [
    {
      id: 1,
      title: "اجتماع البلدية",
      date: "15 يوليو 2023",
      time: "10:00 ص - 11:30 ص",
      location: "قاعة المؤتمرات الرئيسية",
      attendees: 45,
      attendeesLabel: "مشارك"
    },
    {
      id: 2,
      title: "ورشة بناء الفريق",
      date: "20 يوليو 2023",
      time: "2:00 م - 5:00 م",
      location: "مركز الابتكار",
      attendees: 28,
      attendeesLabel: "مشارك"
    },
    {
      id: 3,
      title: "تخطيط إطلاق المنتج",
      date: "25 يوليو 2023",
      time: "9:00 ص - 12:00 م",
      location: "غرفة الاستراتيجية ب",
      attendees: 12,
      attendeesLabel: "مشارك"
    },
  ]
}

const birthdays = [
  {
    id: 1,
    name: "Jennifer Smith",
    department: "Marketing",
    date: "July 15",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
  },
  {
    id: 2,
    name: "Michael Johnson",
    department: "Engineering",
    date: "July 18",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
  },
  {
    id: 3,
    name: "Sarah Williams",
    department: "Human Resources",
    date: "July 22",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
  },
]

const anniversaries = [
  {
    id: 1,
    name: "David Wilson",
    department: "Sales",
    years: 5,
    date: "July 16",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334178.jpg-Y74tW6XFO68g7N36SE5MSNDNVKLQ08.jpeg",
  },
  {
    id: 2,
    name: "Lisa Brown",
    department: "Customer Support",
    years: 10,
    date: "July 20",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5295.jpg-fLw0wGGZp8wuTzU5dnyfjZDwAHN98a.jpeg",
  },
  {
    id: 3,
    name: "Robert Davis",
    department: "Finance",
    years: 3,
    date: "July 25",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
  },
]

export function UpcomingEvents({ dictionary, locale }: AppComponentDictionaryProps) {
  // Default to French if the locale is not supported
  const currentLanguage = (locale && events[locale as keyof typeof events]) 
    ? locale as keyof typeof events 
    : 'fr';
  
  const localizedEvents = events[currentLanguage];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          {dictionary.home?.upcomingEvents?.title || "Upcoming Events"}
        </CardTitle>
        <Button variant="outline" size="sm">
          {dictionary.home?.upcomingEvents?.viewCalendar || "View Calendar"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all" className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
            </TabsTrigger>
            <TabsTrigger value="birthdays" className="flex items-center">
              <Cake className="mr-2 h-4 w-4" />
              Birthdays
            </TabsTrigger>
            <TabsTrigger value="anniversaries" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Work Anniversaries
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {localizedEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-3 hover:bg-accent transition-colors">
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 mr-2" />
                      <span>{event.attendees} {event.attendeesLabel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="birthdays">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {birthdays.map((person) => (
                <div key={person.id} className="flex items-center space-x-4 border rounded-lg p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.department}</p>
                    <p className="text-sm flex items-center mt-1">
                      <Cake className="h-3.5 w-3.5 mr-1 text-primary" />
                      {person.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="anniversaries">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {anniversaries.map((person) => (
                <div key={person.id} className="flex items-center space-x-4 border rounded-lg p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.department}</p>
                    <p className="text-sm flex items-center mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-primary" />
                      {person.years} {person.years === 1 ? "year" : "years"} • {person.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
