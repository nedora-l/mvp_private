"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SessionDebug() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading session...</div>
  }

  if (!session) {
    return <div>No session found</div>
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Session Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Basic Info:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>ID: {session.user.id}</div>
            <div>Username: {session.user.username}</div>
            <div>Email: {session.user.email}</div>
            <div>First Name: {session.user.firstName}</div>
            <div>Last Name: {session.user.lastName}</div>
            <div>Phone: {session.user.phone}</div>
            <div>Address: {session.user.address}</div>
            <div>Locale: {session.user.locale}</div>
            <div>Time Zone: {session.user.timeZone}</div>
            <div>Title: {session.user.title}</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Organization:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Department ID: {session.user.departmentId}</div>
            <div>Team ID: {session.user.teamId}</div>
            <div>Country ID: {session.user.countryId}</div>
            <div>City ID: {session.user.cityId}</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Roles:</h4>
          <div className="flex flex-wrap gap-2">
            <div className="text-sm">Role String: {session.user.role}</div>
            <div className="flex flex-wrap gap-1">
              {session.user.roles?.map((role, index) => (
                <Badge key={index} variant="secondary">{role}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Auth Tokens:</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>Provider: {session.user.provider}</div>
            <div>Token Type: {session.user.tokenType}</div>
            <div>Access Token: {session.user.accessToken ? `${session.user.accessToken.substring(0, 20)}...` : 'None'}</div>
            <div>Refresh Token: {session.user.refreshToken ? `${session.user.refreshToken.substring(0, 20)}...` : 'None'}</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Raw Session Object:</h4>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
