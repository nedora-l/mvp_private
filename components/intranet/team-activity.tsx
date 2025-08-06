'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageSquare, FileText, ThumbsUp } from "lucide-react"
import { Dictionary } from "@/locales/dictionary"
import { getPluralForm } from "@/lib/i18n/utils"
import { AppActivity } from "@/lib/interfaces/app/activities/activity"
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component"

const activities:AppActivity[] = [
  {
    id: 1,
    user: {
      name: "Emily Rodriguez",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
    },
    action: "commented on",
    target: "Project Roadmap",
    time: "10 minutes ago",
    type: "comment",
  },
  {
    id: 2,
    user: {
      name: "David Kim",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27470341_7294795.jpg-XE0zf7R8tk4rfA1vm4fAHeZ1QoVEOo.jpeg",
    },
    action: "uploaded",
    target: "Q3 Marketing Plan.pdf",
    time: "1 hour ago",
    type: "document",
  },
  {
    id: 3,
    user: {
      name: "Jessica Chen",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/799.jpg-0tEi4Xvg5YsFoGoQfQc698q4Dygl1S.jpeg",
    },
    action: "liked",
    target: "New Product Concept",
    time: "3 hours ago",
    type: "like",
  },
  {
    id: 4,
    user: {
      name: "Robert Taylor",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334228.jpg-eOsHCkvVrVAwcPHKYSs5sQwVKsqWpC.jpeg",
    },
    action: "joined",
    target: "Product Development Team",
    time: "Yesterday",
    type: "team",
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "comment":
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case "document":
      return <FileText className="h-4 w-4 text-green-500" />
    case "like":
      return <ThumbsUp className="h-4 w-4 text-red-500" />
    case "team":
      return <Users className="h-4 w-4 text-purple-500" />
    default:
      return <MessageSquare className="h-4 w-4" />
  }
}


export function TeamActivity({ dictionary, locale }: AppComponentDictionaryProps ) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" />
          {dictionary.teams.activity?.title || dictionary.home.teamActivity.title}
        </CardTitle>
        <Button variant="outline" size="sm">
          {dictionary.common.seeAll || dictionary.home.teamActivity.viewAll}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {dictionary.home.teamActivity.noActivity}
          </p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground flex items-center">
                  {getActivityIcon(activity.type)}
                  <span className="ml-1">{activity.time}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
