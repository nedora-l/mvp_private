"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dictionary } from "@/locales/dictionary"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Database,
  FileText,
  Link,
  Settings,
  Copy,
  Archive,
  Users,
  Calendar,
  Hash,
  RefreshCcw,
  ArrowLeft
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MockData_mockRelationships } from "@/app/api/v1/admin/objects/route"
import { useI18n } from "@/lib/i18n/use-i18n"
import { objectsApiClient } from "@/lib/services/client/admin/objects/objects.client.service"
import { CreateObjectModal } from "@/components/admin/modals/create-object-modal"
import { ObjectDetailsPage } from "@/components/admin/object-details-page"
import { MetaDataRecordDto, MetaDataRecordRequestDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service"
import { useRouter } from "next/navigation"

interface ObjectsManagerProps {
  dictionary: Dictionary
  locale: string
}

export function ObjectsManagerComponent({ dictionary, locale }: ObjectsManagerProps) {
  const { t } = useI18n(dictionary);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState<number>(50);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedObject, setSelectedObject] = useState<number | string | null>(null)
  const [customObjects, setCustomObjects] = useState<MetaDataRecordDto[]>([]);

  // Modal and navigation state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'details'>('list');
  const [selectedObjectForDetails, setSelectedObjectForDetails] = useState<MetaDataRecordDto | null>(null);
  const router = useRouter();


  // Mock relationships
  const mockRelationships = MockData_mockRelationships;

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case "Text":
      case "Email":
        return <FileText className="h-4 w-4" />
      case "Number":
        return <Hash className="h-4 w-4" />
      case "Date":
        return <Calendar className="h-4 w-4" />
      case "Picklist":
        return <Settings className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredObjects = customObjects.filter(obj =>
    obj.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obj.apiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obj.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Navigation handlers
  const handleObjectClick = (object: MetaDataRecordDto) => {
    openRecordDetailsPage(object.id || '');
    //setSelectedObjectForDetails(object);
    //setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedObjectForDetails(null);
  };
  // Modal handlers
  const handleCreateObject = async (objectData: MetaDataRecordRequestDto): Promise<void> => {
    // TODO: Implement actual API call
    console.log('Creating object:', objectData);
    const response = await objectsApiClient.createMetaDataRecord(objectData);
    console.log('Created object:', response);
    setIsCreateModalOpen(false);
    refreshObjects();
  };

  const refreshObjects = () => {
    console.log('refresh Objects');
    setIsLoading(true);
    setError(null);
    objectsApiClient.getObjects({ page: 0, size: pageSize })
      .then((response) => {
        console.log('Objects fetched:', response);
        if (response.data) {
          console.log('data fetched:', response.data);
          setCustomObjects(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching Objects:', error);
        setError('Failed to fetch Objects');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (customObjects.length > 0) {
      console.log('customObjects:', customObjects);
    } else {
      console.log('No customObjects available');
      refreshObjects();
    }
  }, [customObjects]);



  // onBack function: return to the objects list page
  const openRecordDetailsPage = (id:string) => {
    router.push(`/${locale}/admin/objects/${id}`);
  };



  return (
    <div className="space-y-6">
      {currentView === 'details' && selectedObjectForDetails ? (
        <div>
          {/* Back to list navigation */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToList}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Objects
            </Button>
          </div>
          <ObjectDetailsPage 
            objectId={selectedObjectForDetails.id || ''}
            onBack={handleBackToList}
            dictionary={dictionary}
            locale={locale}
          />
        </div>
      ) : (
        <>
          <Tabs defaultValue="objects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="objects">Objects</TabsTrigger>
              <TabsTrigger value="schema">Schema Builder</TabsTrigger>
            </TabsList>
            
            <TabsContent value="objects" className="space-y-4">
              {/* Objects Header Actions */}
              <div className="flex justify-between items-center">                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search objects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-8 w-[300px] ${isLoading ? 'opacity-50' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {isLoading && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                      Loading objects...
                    </div>
                  )}
                </div><div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={refreshObjects}
                    disabled={isLoading}
                  >
                    <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Loading...' : 'Refresh'}
                  </Button>
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Object
                  </Button>
                </div>
              </div>

              {/* Objects Table */}             
              <Card>
                <CardHeader>
                  <CardTitle>
                    Objects {isLoading ? (
                      <div className="inline-block h-4 w-8 bg-muted animate-pulse rounded ml-1" />
                    ) : (
                      `(${filteredObjects.length})`
                    )}
                  </CardTitle>
                  <CardDescription>
                    Manage custom and standard objects in your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Object</TableHead>
                        <TableHead>API Name</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Fields</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        // Loading skeleton rows
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={`skeleton-${index}`}>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                </div>
                                <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                            </TableCell>
                            <TableCell>
                              <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                                <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredObjects.length === 0 ? (
                        // Empty state
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center gap-4">
                              <Database className="h-16 w-16 text-muted-foreground" />
                              <div>
                                <h3 className="text-lg font-medium">No objects found</h3>
                                <p className="text-muted-foreground">
                                  {searchTerm ? 'Try adjusting your search criteria' : 'Create your first object to get started'}
                                </p>
                              </div>
                              {!searchTerm && (
                                <Button onClick={() => setIsCreateModalOpen(true)}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Create Object
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        // Actual data rows
                        filteredObjects.map((object) => (
                          <TableRow 
                            key={object.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleObjectClick(object)}
                          >
                            <TableCell>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  <Database className="h-4 w-4 text-primary" />
                                  {object.label}
                                </div>
                                <div className="text-sm text-muted-foreground">{object.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-muted px-2 py-1 rounded text-sm">
                                {object.apiName}
                              </code>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {object.recordsCount?.toLocaleString()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-4 text-sm">
                                <span>{object.fieldsCount} fields</span>
                                <span>{object.relationshipsCount} relationships</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={object.isPublic ? "default" : "outline"}>
                                {object.isPublic ? "Custom" : "Standard"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleObjectClick(object)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Object
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Clone Object
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {object.isPublic && (
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Object
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schema" className="space-y-4">
              {/* Schema Builder */}
              <Card>
                <CardHeader>
                  <CardTitle>Schema Builder</CardTitle>
                  <CardDescription>
                    Visual representation of your data model and object relationships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] flex items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Schema Builder</h3>
                      <p className="text-muted-foreground mb-4">
                        Interactive schema visualization would be rendered here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Integration with diagramming library (like React Flow) needed
                      </p>
                      <Button className="mt-4">
                        <Eye className="h-4 w-4 mr-2" />
                        Open Schema Builder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>          {/* Create Object Modal */}
          <CreateObjectModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateObject}
            dictionary={dictionary}
          />
        </>
      )}
    </div>
  );
}
