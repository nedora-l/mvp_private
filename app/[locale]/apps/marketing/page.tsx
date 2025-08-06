import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"

export default function MarketingDashboardPage({ params }: BasePageProps ) {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Marketing Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Overview of current marketing campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>5 Active Campaigns, 2500 Leads Generated, $15k Ad Spend.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Generation</CardTitle>
            <CardDescription>Track new leads and conversion rates.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>500 New Leads This Week. Conversion Rate: 15%.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Engagement</CardTitle>
            <CardDescription>Monitor activity across social platforms.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Followers: 10k. Engagement Rate: 5%. 200 New Mentions.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Marketing Stats</CardTitle>
            <CardDescription>Performance of recent email campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Open Rate: 25%. Click-Through Rate: 5%. 2 Campaigns Sent.</p>
            {/* Placeholder for email campaign details */}
            <a href="#" className="text-sm text-blue-600 hover:underline">View Email Reports</a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Hub Overview</CardTitle>
            <CardDescription>Manage and track content performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>10 New Blog Posts. 5 Videos Published. Top Performing: 'Intro to X'.</p>
            {/* Placeholder for content metrics */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Analyze and manage customer segments.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Top Segment: 'Tech Enthusiasts'. 3 New Segments Created.</p>
            {/* Placeholder for segment details */}
            <a href="#" className="text-sm text-blue-600 hover:underline">Manage Segments</a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
