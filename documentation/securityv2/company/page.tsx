import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users2, Target, FileText } from "lucide-react"

import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"

export default function CompanyPage({ params }: BasePageProps ) {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">{'company.title'}</h1>

      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about" className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" />
            About Us
          </TabsTrigger>
          <TabsTrigger value="leadership" className="flex items-center">
            <Users2 className="mr-2 h-4 w-4" />
            Leadership
          </TabsTrigger>
          <TabsTrigger value="mission" className="flex items-center">
            <Target className="mr-2 h-4 w-4" />
            Mission & Values
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Policies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Our Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src="/placeholder.svg?height=400&width=800"
                  alt="Company headquarters"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold">Our Story</h3>
              <p>
                Founded in 2005, our company has grown from a small startup with just 5 employees to a global enterprise
                with offices in 12 countries. Our journey has been defined by innovation, resilience, and a commitment
                to excellence in everything we do.
              </p>

              <p>
                Today, we're proud to be an industry leader, serving thousands of clients worldwide with cutting-edge
                solutions that address their most pressing challenges. Our diverse team of professionals brings together
                expertise from various fields, creating a dynamic environment where creativity and collaboration thrive.
              </p>

              <h3 className="text-xl font-semibold mt-6">Our Locations</h3>
              <p>
                With our headquarters in San Francisco and regional offices across North America, Europe, and Asia, we
                maintain a strong global presence while understanding local markets and needs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold">North America</h4>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>San Francisco (HQ)</li>
                    <li>New York</li>
                    <li>Chicago</li>
                    <li>Toronto</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold">Europe</h4>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>London</li>
                    <li>Berlin</li>
                    <li>Paris</li>
                    <li>Amsterdam</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold">Asia Pacific</h4>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>Tokyo</li>
                    <li>Singapore</li>
                    <li>Sydney</li>
                    <li>Mumbai</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leadership">
          <Card>
            <CardHeader>
              <CardTitle>Leadership Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Sarah Johnson",
                    title: "Chief Executive Officer",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
                    bio: "Sarah has over 20 years of experience in the industry and has led the company through significant growth since joining in 2010.",
                  },
                  {
                    name: "Michael Chen",
                    title: "Chief Operating Officer",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
                    bio: "Michael oversees all operational aspects of the company, ensuring efficiency and excellence in our service delivery.",
                  },
                  {
                    name: "Alex Rivera",
                    title: "Chief Technology Officer",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
                    bio: "Alex leads our technology strategy and innovation initiatives, keeping us at the forefront of industry advancements.",
                  },
                  {
                    name: "Jennifer Smith",
                    title: "Chief Marketing Officer",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
                    bio: "Jennifer brings creative vision to our brand strategy and marketing efforts, driving our market presence and growth.",
                  },
                  {
                    name: "David Wilson",
                    title: "Chief Financial Officer",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334178.jpg-Y74tW6XFO68g7N36SE5MSNDNVKLQ08.jpeg",
                    bio: "David manages our financial strategy and planning, ensuring sustainable growth and shareholder value.",
                  },
                  {
                    name: "Lisa Brown",
                    title: "Chief People Officer",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5295.jpg-fLw0wGGZp8wuTzU5dnyfjZDwAHN98a.jpeg",
                    bio: "Lisa oversees our talent acquisition and development, fostering a culture of inclusion and excellence.",
                  },
                ].map((leader) => (
                  <div key={leader.name} className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                      <img
                        src={leader.image || "/placeholder.svg"}
                        alt={leader.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg">{leader.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{leader.title}</p>
                    <p className="text-sm">{leader.bio}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mission">
          <Card>
            <CardHeader>
              <CardTitle>Mission & Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-lg">
                  To empower organizations and individuals with innovative solutions that drive meaningful change and
                  sustainable growth.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-lg">
                  To be the global leader in our industry, recognized for excellence, innovation, and positive impact on
                  communities worldwide.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Our Core Values</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {[
                    {
                      title: "Innovation",
                      description: "We embrace creativity and forward-thinking to develop groundbreaking solutions.",
                    },
                    {
                      title: "Integrity",
                      description: "We uphold the highest ethical standards in all our interactions and decisions.",
                    },
                    {
                      title: "Collaboration",
                      description:
                        "We believe in the power of teamwork and diverse perspectives to achieve excellence.",
                    },
                    {
                      title: "Customer Focus",
                      description: "We are dedicated to understanding and exceeding our customers' expectations.",
                    },
                    {
                      title: "Sustainability",
                      description:
                        "We are committed to responsible business practices that benefit our planet and future generations.",
                    },
                    {
                      title: "Inclusivity",
                      description:
                        "We foster a diverse and inclusive environment where everyone feels valued and respected.",
                    },
                  ].map((value) => (
                    <div key={value.title} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-2">{value.title}</h4>
                      <p>{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Company Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Employee Handbook",
                    description: "Comprehensive guide to company policies, procedures, and employee benefits.",
                    lastUpdated: "January 15, 2023",
                    fileSize: "3.2 MB",
                  },
                  {
                    title: "Code of Conduct",
                    description:
                      "Guidelines for professional behavior and ethical standards expected from all employees.",
                    lastUpdated: "March 10, 2023",
                    fileSize: "1.5 MB",
                  },
                  {
                    title: "Remote Work Policy",
                    description: "Rules and expectations for employees working remotely or in hybrid arrangements.",
                    lastUpdated: "April 22, 2023",
                    fileSize: "1.8 MB",
                  },
                  {
                    title: "IT Security Guidelines",
                    description: "Protocols for maintaining data security and protecting company information.",
                    lastUpdated: "May 5, 2023",
                    fileSize: "2.1 MB",
                  },
                  {
                    title: "Travel & Expense Policy",
                    description: "Procedures for business travel arrangements and expense reimbursements.",
                    lastUpdated: "February 28, 2023",
                    fileSize: "1.7 MB",
                  },
                  {
                    title: "Diversity & Inclusion Policy",
                    description: "Our commitment to fostering a diverse and inclusive workplace environment.",
                    lastUpdated: "June 12, 2023",
                    fileSize: "1.9 MB",
                  },
                ].map((policy) => (
                  <div key={policy.title} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <h3 className="font-semibold">{policy.title}</h3>
                      <p className="text-sm text-muted-foreground">{policy.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last updated: {policy.lastUpdated} • {policy.fileSize}
                      </p>
                    </div>
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-md text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
