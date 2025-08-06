import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Calendar, Cake } from "lucide-react"
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component"

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

export function BirthdaysAndAnniversaries({ dictionary, locale }: AppComponentDictionaryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Gift className="mr-2 h-5 w-5 text-primary" />
          Evenements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="birthdays">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="birthdays" className="flex items-center">
              <Cake className="mr-2 h-4 w-4" />
              Birthdays
            </TabsTrigger>
            <TabsTrigger value="anniversaries" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Work Anniversaries
            </TabsTrigger>
          </TabsList>
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
