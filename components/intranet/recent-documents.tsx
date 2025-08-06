import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FileImage, FileSpreadsheet, FileIcon as FilePdf, Clock, Download } from "lucide-react"
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component"

const documents = [
  {
    id: 1,
    name: "Q2 Financial Report.pdf",
    type: "pdf",
    size: "2.4 MB",
    updatedAt: "Today, 10:30 AM",
  },
  {
    id: 2,
    name: "Marketing Strategy 2023.docx",
    type: "doc",
    size: "1.8 MB",
    updatedAt: "Yesterday, 3:15 PM",
  },
  {
    id: 3,
    name: "Employee Handbook.pdf",
    type: "pdf",
    size: "3.2 MB",
    updatedAt: "Jul 10, 2023",
  },
  {
    id: 4,
    name: "Project Timeline.xlsx",
    type: "spreadsheet",
    size: "1.1 MB",
    updatedAt: "Jul 8, 2023",
  },
]

const getFileIcon = (type : string) => {
  switch (type) {
    case "pdf":
      return <FilePdf className="h-5 w-5 text-red-500" />
    case "doc":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "spreadsheet":
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    case "image":
      return <FileImage className="h-5 w-5 text-purple-500" />
    default:
      return <FileText className="h-5 w-5 text-gray-500" />
  }
}

export function RecentDocuments({ dictionary, locale }: AppComponentDictionaryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
            Recent Documents
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between hover:bg-accent rounded-md p-2 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getFileIcon(doc.type)}
              <div>
                <p className="text-sm font-medium">{doc.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{doc.updatedAt}</span>
                  <span className="mx-1">•</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
