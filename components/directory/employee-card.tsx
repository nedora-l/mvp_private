"use client"
import { Card, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin,Building2, Mail, Phone} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppEmployee } from "@/lib/interfaces/apis"

export default function DirectoryEmployeeCard({ employee, dictionary }: { employee: AppEmployee; dictionary: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={(employee.name  || "")} />
            <AvatarFallback>
              {(employee.name || "")
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{employee.name}</h3>
            <p className="text-sm text-muted-foreground">{employee.title}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 mr-1" />
              <span>{employee.department?.name}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{employee.location}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`mailto:${employee.email}`} className="text-primary hover:underline">
              {employee.email}
            </a>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`tel:${employee.phone}`} className="text-primary hover:underline">
              {employee.phone}
            </a>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            {dictionary.directory.actions.message}
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            {dictionary.directory.actions.viewProfile}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
