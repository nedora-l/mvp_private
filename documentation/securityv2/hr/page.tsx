import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  Calendar,
  FileText,
  Award,
  Clock,
  DollarSign,
  Clipboard,
  Download,
  ChevronRight,
} from "lucide-react"

import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"

export default function HRPage({ params }: BasePageProps ) {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">HR Portal</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center">
            <Award className="mr-2 h-4 w-4" />
            Benefits
          </TabsTrigger>
          <TabsTrigger value="timeoff" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Time Off
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Payroll
          </TabsTrigger>
          <TabsTrigger value="forms" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Forms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Off Balance</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15 days</div>
                <p className="text-xs text-muted-foreground">Vacation: 10 days, Sick: 5 days</p>
                <Button variant="link" className="px-0 text-xs mt-2">
                  Request time off
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Payday</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">July 15, 2023</div>
                <p className="text-xs text-muted-foreground">Direct deposit</p>
                <Button variant="link" className="px-0 text-xs mt-2">
                  View pay stubs
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Benefits Enrollment</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-muted-foreground">Next enrollment: Nov 1-15</p>
                <Button variant="link" className="px-0 text-xs mt-2">
                  Review benefits
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance Review</CardTitle>
                <Clipboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Aug 15, 2023</div>
                <p className="text-xs text-muted-foreground">Mid-year review</p>
                <Button variant="link" className="px-0 text-xs mt-2">
                  Prepare self-assessment
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Time Off</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Summer Vacation", dates: "July 24-28, 2023", status: "Approved", days: 5 },
                    { name: "Personal Day", dates: "August 15, 2023", status: "Pending", days: 1 },
                  ].map((timeOff, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{timeOff.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{timeOff.dates}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            timeOff.status === "Approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {timeOff.status}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {timeOff.days} {timeOff.days === 1 ? "day" : "days"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Time Off
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Pay Stubs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { period: "June 16-30, 2023", date: "July 5, 2023", amount: "$3,250.00" },
                    { period: "June 1-15, 2023", date: "June 20, 2023", amount: "$3,250.00" },
                    { period: "May 16-31, 2023", date: "June 5, 2023", amount: "$3,250.00" },
                  ].map((payStub, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{payStub.period}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>Paid on {payStub.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{payStub.amount}</p>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Pay Stubs
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>HR Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Open Enrollment Coming Soon",
                    date: "July 10, 2023",
                    content:
                      "Annual benefits open enrollment will begin on November 1. Information sessions will be held throughout October.",
                  },
                  {
                    title: "New Parental Leave Policy",
                    date: "June 28, 2023",
                    content:
                      "We're excited to announce our enhanced parental leave policy, offering 16 weeks of paid leave for all new parents.",
                  },
                  {
                    title: "Summer Work Hours",
                    date: "June 15, 2023",
                    content: "Summer hours (9 AM - 4 PM on Fridays) will be in effect from July 1 through September 1.",
                  },
                ].map((announcement, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <span className="text-sm text-muted-foreground">{announcement.date}</span>
                    </div>
                    <p className="text-muted-foreground">{announcement.content}</p>
                    <Button variant="link" className="px-0 mt-2">
                      Read more <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Your Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Health Insurance",
                      provider: "Blue Cross Blue Shield",
                      plan: "PPO Family Plan",
                      status: "Active",
                      icon: "🏥",
                    },
                    {
                      title: "Dental Insurance",
                      provider: "Delta Dental",
                      plan: "Comprehensive Family Plan",
                      status: "Active",
                      icon: "🦷",
                    },
                    {
                      title: "Vision Insurance",
                      provider: "VSP",
                      plan: "Premium Plan",
                      status: "Active",
                      icon: "👁️",
                    },
                    {
                      title: "401(k) Retirement",
                      provider: "Fidelity",
                      plan: "Company match up to 6%",
                      status: "Enrolled",
                      icon: "💰",
                    },
                    {
                      title: "Life Insurance",
                      provider: "MetLife",
                      plan: "2x Annual Salary",
                      status: "Active",
                      icon: "🛡️",
                    },
                    {
                      title: "Disability Insurance",
                      provider: "Guardian",
                      plan: "Short & Long Term",
                      status: "Active",
                      icon: "🩺",
                    },
                  ].map((benefit) => (
                    <Card key={benefit.title} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{benefit.icon}</span>
                            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2 py-1 rounded-full">
                              {benefit.status}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground">{benefit.provider}</p>
                          <p className="text-sm">{benefit.plan}</p>
                        </div>
                        <div className="bg-muted p-3 flex justify-between items-center">
                          <Button variant="link" className="p-0 h-auto text-sm">
                            View Details
                          </Button>
                          <Button variant="link" className="p-0 h-auto text-sm">
                            ID Card
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Additional Benefits</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Wellness Program",
                        description: "Access to gym discounts, wellness challenges, and health resources.",
                      },
                      {
                        title: "Employee Assistance Program",
                        description: "Confidential counseling and support services for you and your family.",
                      },
                      {
                        title: "Professional Development",
                        description: "$2,000 annual stipend for courses, conferences, and certifications.",
                      },
                      {
                        title: "Commuter Benefits",
                        description: "Pre-tax deductions for public transportation and parking expenses.",
                      },
                    ].map((benefit) => (
                      <div key={benefit.title} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <h4 className="font-medium">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                        <Button variant="link" className="ml-auto">
                          Learn More
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeoff">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Time Off Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Vacation", used: 5, total: 15, color: "bg-blue-500" },
                    { type: "Sick Leave", used: 2, total: 7, color: "bg-green-500" },
                    { type: "Personal Days", used: 1, total: 3, color: "bg-purple-500" },
                  ].map((balance) => (
                    <div key={balance.type}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{balance.type}</span>
                        <span>
                          {balance.used} / {balance.total} days
                        </span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${balance.color}`}
                          style={{ width: `${(balance.used / balance.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6">Request Time Off</Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Time Off Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "Vacation",
                      dates: "July 24-28, 2023",
                      days: 5,
                      status: "Approved",
                      requestedOn: "June 10, 2023",
                      approvedBy: "Lisa Brown",
                    },
                    {
                      type: "Personal Day",
                      dates: "August 15, 2023",
                      days: 1,
                      status: "Pending",
                      requestedOn: "July 5, 2023",
                      approvedBy: null,
                    },
                    {
                      type: "Sick Leave",
                      dates: "June 5, 2023",
                      days: 1,
                      status: "Taken",
                      requestedOn: "June 5, 2023",
                      approvedBy: "System",
                    },
                  ].map((request, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{request.type}</h3>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              request.status === "Approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : request.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{request.dates}</span>
                          <span className="mx-1">•</span>
                          <span>
                            {request.days} {request.days === 1 ? "day" : "days"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Requested on {request.requestedOn}
                          {request.approvedBy && ` • Approved by ${request.approvedBy}`}
                        </p>
                      </div>
                      <div className="flex space-x-2 mt-2 md:mt-0">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        {request.status === "Pending" && (
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Company Holidays</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "New Year's Day", date: "January 1, 2023", past: true },
                  { name: "Martin Luther King Jr. Day", date: "January 16, 2023", past: true },
                  { name: "Presidents' Day", date: "February 20, 2023", past: true },
                  { name: "Memorial Day", date: "May 29, 2023", past: true },
                  { name: "Independence Day", date: "July 4, 2023", past: true },
                  { name: "Labor Day", date: "September 4, 2023", past: false },
                  { name: "Thanksgiving Day", date: "November 23, 2023", past: false },
                  { name: "Day after Thanksgiving", date: "November 24, 2023", past: false },
                  { name: "Christmas Day", date: "December 25, 2023", past: false },
                ].map((holiday) => (
                  <Card key={holiday.name} className={holiday.past ? "opacity-60" : ""}>
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{holiday.name}</h3>
                        <p className="text-sm text-muted-foreground">{holiday.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Pay Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Annual Salary</p>
                    <p className="text-2xl font-bold">$78,000.00</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gross Pay (Semi-Monthly)</p>
                    <p className="text-xl font-semibold">$3,250.00</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Pay (Semi-Monthly)</p>
                    <p className="text-xl font-semibold">$2,437.50</p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Next Payday</p>
                    <p className="text-lg font-medium">July 15, 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Pay Stubs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { period: "June 16-30, 2023", date: "July 5, 2023", gross: "$3,250.00", net: "$2,437.50" },
                    { period: "June 1-15, 2023", date: "June 20, 2023", gross: "$3,250.00", net: "$2,437.50" },
                    { period: "May 16-31, 2023", date: "June 5, 2023", gross: "$3,250.00", net: "$2,437.50" },
                    { period: "May 1-15, 2023", date: "May 20, 2023", gross: "$3,250.00", net: "$2,437.50" },
                    { period: "April 16-30, 2023", date: "May 5, 2023", gross: "$3,250.00", net: "$2,437.50" },
                  ].map((payStub, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-medium">{payStub.period}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>Paid on {payStub.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 md:mt-0">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Gross</p>
                          <p className="font-medium">{payStub.gross}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Net</p>
                          <p className="font-medium">{payStub.net}</p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Pay Stubs
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Tax Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "W-2 Form (2022)", date: "January 31, 2023", description: "Annual wage and tax statement" },
                  {
                    name: "W-4 Form",
                    date: "Last updated: March 15, 2022",
                    description: "Employee's withholding certificate",
                  },
                  {
                    name: "1095-C Form (2022)",
                    date: "January 31, 2023",
                    description: "Employer-provided health insurance offer and coverage",
                  },
                ].map((document, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium">{document.name}</h3>
                      <p className="text-sm text-muted-foreground">{document.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{document.date}</p>
                    </div>
                    <div className="flex space-x-2 mt-2 md:mt-0">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                      {document.name === "W-4 Form" && (
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "HR Forms",
                description: "Common forms for HR-related requests and documentation",
                forms: [
                  { name: "Personal Information Update", type: "pdf" },
                  { name: "Direct Deposit Authorization", type: "pdf" },
                  { name: "Emergency Contact Information", type: "pdf" },
                  { name: "Name Change Request", type: "pdf" },
                ],
              },
              {
                title: "Benefits Forms",
                description: "Forms related to employee benefits and enrollment",
                forms: [
                  { name: "Benefits Enrollment Form", type: "pdf" },
                  { name: "401(k) Contribution Change", type: "pdf" },
                  { name: "Health Insurance Waiver", type: "pdf" },
                  { name: "Dependent Coverage Form", type: "pdf" },
                ],
              },
              {
                title: "Time Off & Leave",
                description: "Forms for requesting time off and leave of absence",
                forms: [
                  { name: "Vacation Request Form", type: "pdf" },
                  { name: "Sick Leave Request", type: "pdf" },
                  { name: "FMLA Application", type: "pdf" },
                  { name: "Parental Leave Request", type: "pdf" },
                ],
              },
              {
                title: "Expense & Reimbursement",
                description: "Forms for submitting expenses and reimbursement requests",
                forms: [
                  { name: "Expense Report Template", type: "xlsx" },
                  { name: "Travel Reimbursement Form", type: "pdf" },
                  { name: "Mileage Log", type: "xlsx" },
                  { name: "Petty Cash Request", type: "pdf" },
                ],
              },
              {
                title: "Performance & Development",
                description: "Forms related to employee performance and career development",
                forms: [
                  { name: "Performance Review Template", type: "docx" },
                  { name: "Self-Assessment Form", type: "pdf" },
                  { name: "Training Request Form", type: "pdf" },
                  { name: "Career Development Plan", type: "docx" },
                ],
              },
              {
                title: "Policies & Procedures",
                description: "Important company policies and procedural documents",
                forms: [
                  { name: "Employee Handbook", type: "pdf" },
                  { name: "Code of Conduct", type: "pdf" },
                  { name: "IT Security Policy", type: "pdf" },
                  { name: "Travel Policy", type: "pdf" },
                ],
              },
            ].map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <div className="space-y-2">
                    {category.forms.map((form) => (
                      <div key={form.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{form.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
