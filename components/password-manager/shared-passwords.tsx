"use client"

import { Dictionary } from "@/locales/dictionary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Users, Key, Calendar, Lock, Eye, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { EmptyPasswordState } from "@/components/password-manager/empty-password-state"

// Mock data for shared passwords
const mockSharedPasswords = [
  {
    id: "1",
    title: "Company Admin Portal",
    username: "admin@company.com",
    website: "admin.company.com",
    sharedBy: "Alex Johnson",
    sharedByAvatar: "/placeholder-user.jpg",
    sharedDate: "2025-04-28T10:30:00Z",
    permission: "view",
    category: "work"
  },
  {
    id: "2",
    title: "Team AWS Account",
    username: "team-dev",
    website: "aws.amazon.com",
    sharedBy: "Maria Garcia",
    sharedByAvatar: "/placeholder-user.jpg",
    sharedDate: "2025-05-01T15:45:00Z",
    permission: "edit",
    category: "work"
  },
  {
    id: "3",
    title: "Project Management Tool",
    username: "developer@company.com",
    website: "jira.company.com",
    sharedBy: "David Kim",
    sharedByAvatar: "/placeholder-user.jpg",
    sharedDate: "2025-03-15T09:20:00Z",
    permission: "view",
    category: "work"
  }
];

interface SharedPasswordsProps {
  dictionary: Dictionary
}

export function SharedPasswords({ dictionary }: SharedPasswordsProps) {
  const dict = dictionary.passwordManager;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={dict.search}
            className="pl-8"
          />
        </div>
      </div>

      {mockSharedPasswords.length === 0 ? (
        <EmptyPasswordState dictionary={dictionary} />
      ) : (
        <div className="space-y-4">
          {mockSharedPasswords.map((password) => (
            <Card key={password.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    {password.title}
                  </CardTitle>
                  <Badge variant={password.permission === "edit" ? "default" : "secondary"}>
                    {dict.sharing.permissionTypes[password.permission as keyof typeof dict.sharing.permissionTypes]}
                  </Badge>
                </div>
                <CardDescription>{password.website}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{password.username}</div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">{dict.actions.reveal}</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">{dict.actions.copy}</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Users className="h-4 w-4" />
                    <span>{dict.sharing.sharedWith} </span>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={password.sharedByAvatar} alt={password.sharedBy} />
                      <AvatarFallback>{password.sharedBy.split(" ").map(name => name[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{password.sharedBy}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(password.sharedDate).toLocaleDateString()} 
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}