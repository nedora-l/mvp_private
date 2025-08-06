"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the new components
import {
  ObjectDetailsHeader,
  ObjectQuickStats,
  OverviewTab,
  FieldsTab,
  RelationshipsTab,
  SettingsTab,
} from "./components/objects";

// Import the field modal component
import { FieldCreationEditModalWizard } from "./modals/field-creation-edit-modal-wizard";

// Import API clients and types
import { objectsApiClient } from "@/lib/services/client/admin/objects/objects.client.service";
import { 
  MetaDataFieldDtoMin, 
  MetaDataRecordDto,
  MetaDataFieldTypeDto,
  MetaDataFieldRequestDto, 
  MetaDataFieldCategoryDto
} from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { Dictionary } from "@/locales/dictionary";interface ObjectDetailsPageProps {
  objectId: string | number;
  onBack?: () => void;
  dictionary: Dictionary;
  locale: string;
}

interface RelationshipDefinition {
  id: string;
  name: string;
  type: "lookup" | "master-detail" | "many-to-many";
  childObject: string;
  parentObject: string;
  fieldName: string;
  description?: string;
  cascadeDelete: boolean;
  isActive: boolean;
  createdDate: string;
}
/**
 * 
  // Mock data - replace with actual API calls
  const mockObject: ObjectDto = {
    id: objectId.toString(),
    name: "Customer",
    apiName: "Customer__c",
    description: "Customer information and contact details for business operations",
    recordCount: 1247,
    fieldsCount: 15,
    relationshipsCount: 3,
    lastModified: "2 hours ago",
    isCustom: true,
    status: "Active"
  }

  const mockFields: FieldDefinition[] = [
    {
      id: "1",
      name: "Customer Name",
      apiName: "Name",
      type: "text",
      dataType: "Text(80)",
      required: true,
      unique: false,
      description: "The customer's full name",
      isCustom: false,
      createdDate: "2024-01-15",
      lastModified: "2024-01-15"
    },
    {
      id: "2",
      name: "Email Address",
      apiName: "Email__c",
      type: "email",
      dataType: "Email",
      required: true,
      unique: true,
      description: "Primary email address for customer communications",
      isCustom: true,
      createdDate: "2024-01-15",
      lastModified: "2024-02-20"
    },
    {
      id: "3",
      name: "Phone Number",
      apiName: "Phone__c",
      type: "phone",
      dataType: "Phone",
      required: false,
      unique: false,
      description: "Primary contact phone number",
      isCustom: true,
      createdDate: "2024-01-15",
      lastModified: "2024-01-15"
    },
    {
      id: "4",
      name: "Customer Type",
      apiName: "Customer_Type__c",
      type: "picklist",
      dataType: "Picklist",
      required: true,
      unique: false,
      description: "Type of customer relationship",
      picklistValues: ["Individual", "Business", "Enterprise", "Government"],
      isCustom: true,
      createdDate: "2024-01-15",
      lastModified: "2024-03-10"
    },
    {
      id: "5",
      name: "Annual Revenue",
      apiName: "Annual_Revenue__c",
      type: "currency",
      dataType: "Currency(16,2)",
      required: false,
      unique: false,
      description: "Estimated annual revenue of the customer",
      isCustom: true,
      createdDate: "2024-02-01",
      lastModified: "2024-02-01"
    }
  ]

  const mockRelationships: RelationshipDefinition[] = [
    {
      id: "1",
      name: "Customer Contacts",
      type: "lookup",
      childObject: "Contact",
      parentObject: "Customer__c",
      fieldName: "Customer__c",
      description: "Contacts associated with this customer",
      cascadeDelete: false,
      isActive: true,
      createdDate: "2024-01-15"
    },
    {
      id: "2",
      name: "Customer Orders",
      type: "master-detail",
      childObject: "Order__c",
      parentObject: "Customer__c",
      fieldName: "Customer__c",
      description: "Orders placed by this customer",
      cascadeDelete: true,
      isActive: true,
      createdDate: "2024-01-20"
    },
    {
      id: "3",
      name: "Customer Products",
      type: "many-to-many",
      childObject: "Product__c",
      parentObject: "Customer__c",
      fieldName: "Customer_Product__c",
      description: "Products associated with this customer through junction object",
      cascadeDelete: false,
      isActive: true,
      createdDate: "2024-02-05"
    }export function ObjectDetailsPage({
  objectId,
  dictionary,
  locale
}: ObjectDetailsPageProps) {
  // State variables
  const [metaDataFieldsTypes, setMetaDataFieldsTypes] = useState<MetaDataFieldTypeDto[]>([]);
  const [metaDataFieldsCategories, setMetaDataFieldsCategories] = useState<MetaDataFieldCategoryDto[]>([]);
  const [relationships, setRelationships] = useState<RelationshipDefinition[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isFieldsLoading, setIsFieldsLoading] = useState(true);
  const [isFieldsTypesLoading, setIsFieldsTypesLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFieldType, setSelectedFieldType] = useState<string>("all");
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);

  // Data state
  const [metaDataRecord, setMetaDataRecord] = useState<MetaDataRecordDto | null>(null);
  const [metaDataFields, setMetaDataFields] = useState<MetaDataFieldDtoMin[]>([]);
  const [editingMetaField, setEditingMetaField] = useState<MetaDataFieldDtoMin | null>(null);
  const [fieldTypes, setFieldTypes] = useState<MetaDataFieldTypeDto[]>([]);
  const [editingRelationship, setEditingRelationship] = useState<RelationshipDefinition | null>(null);

  // Form state
  const [isSubmittingField, setIsSubmittingField] = useState(false);
  const [fieldFormData, setFieldFormData] = useState<Partial<MetaDataFieldRequestDto>>({
    label: '',
    apiName: '',
    description: '',
    helpText: '',
    defaultValue: '',
    choices: '',
    typeId: 0,
    decimals: 0,
    textLength: 255,
    isActive: true,
    isRequired: false,
    isUnique: false,
    isSearchable: false,
    isStrict: false,
    isCaseSensitive: false,
    isSystemLocked: false,
  });

  const { toast } = useToast();

  // onBack function: return to the objects list page
  const refreshDetails = () => {
    setIsLoading(true);
    objectsApiClient.getObjectDetails(objectId.toString())
      .then((data) => {
        setMetaDataRecord(data.data || null);
        setIsLoading(false);
        toast({
          title: "Refreshed",
          description: "Object details have been refreshed.",
        });
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to refresh object details.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const refreshFields = () => {
    setIsFieldsLoading(true);
    objectsApiClient.getRecordFields(objectId.toString(),{page: 0, size: 100})
    .then((data) => {
      setMetaDataFields(data.data?.content || []);
      toast({
        title: "Refreshed",
        description: "Object fields have been refreshed.",
      });
    })
    .catch((error) => {
      toast({
        title: "Error",
        description: "Failed to refresh object fields.",
      });
    })
    .finally(() => {
      setIsFieldsLoading(false);
    });
  };

  //metaDataFieldsTypes
  const refreshFieldsTypes = () => {
    setIsFieldsTypesLoading(true);
    objectsApiClient.getFieldTypes({ page: 0, size: 100 })
    .then((data) => {
      setMetaDataFieldsTypes(data.data?.content || []);
      toast({
        title: "Refreshed",
        description: "Object fields have been refreshed.",
      });
    })
    .catch((error) => {
      toast({
        title: "Error",
        description: "Failed to refresh object fields.",
      });
    })
    .finally(() => {
      setIsFieldsTypesLoading(false);
    });
  };

  //getFieldCategories
  const refreshFieldsCategories = () => {
    setIsLoading(true);
    objectsApiClient.getFieldCategories({ page: 0, size: 100 })
    .then((data) => {
      setMetaDataFieldsCategories(data.data?.content || []);
      setIsLoading(false);
      toast({
        title: "Refreshed",
        description: "Object fields have been refreshed.",
      });
    })
    .catch((error) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to refresh object fields.",
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const refreshAll = () => {
    refreshDetails();
    refreshFields();
    refreshFieldsTypes();
    refreshFieldsCategories();
  };

  // Load field types when component mounts
  useEffect(() => {
    const loadFieldTypes = async () => {
      try {
        const response = await objectsApiClient.getFieldTypes({ page: 0, size: 100 });
        setFieldTypes(response.data?.content || []);
      } catch (error) {
        console.error('Failed to load field types:', error);
        toast({
          title: "Error",
          description: "Failed to load field types.",
          variant: "destructive"
        });
      }
    };

    loadFieldTypes();
  }, []);

  // Reset form when modal opens for creating new field
  const resetFieldForm = () => {
    setFieldFormData({
      label: '',
      apiName: '',
      description: '',
      helpText: '',
      defaultValue: '',
      choices: '',
      typeId: fieldTypes.length > 0 ? fieldTypes[0].id : 0,
      decimals: 0,
      textLength: 255,
      isActive: true,
      isRequired: false,
      isUnique: false,
      isSearchable: false,
      isStrict: false,
      isCaseSensitive: false,
      isSystemLocked: false,
    });
  };

  // Load existing field data when editing
  const loadFieldForEdit = (field: MetaDataFieldDtoMin) => {
    setFieldFormData({
      label: field.label,
      apiName: field.apiName,
      description: field.description || '',
      helpText: field.helpText || '',
      defaultValue: field.defaultValue || '',
      choices: field.choices || '',
      typeId: field.typeId || 0,
      decimals: field.decimals,
      textLength: field.textLength,
      isActive: field.active,
      isRequired: field.required,
      isUnique: field.unique,
      isSearchable: field.searchable,
      isStrict: field.strict,
      isCaseSensitive: field.caseSensitive,
      isSystemLocked: field.systemLocked,
      relatedRecordId: field.relatedRecordId,
    });
  };

  // onBack function: return to the objects list page
  const onBack = () => {
    window.location.href = `/${locale}/admin/objects`;
  };

  useEffect(() => {
    refreshAll();
  }, [objectId])

  const filteredFields = metaDataFields.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.apiName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedFieldType === "all" || !selectedFieldType || field.typeCode === selectedFieldType
    return matchesSearch && matchesType
  })
 

  const getFieldTypeLabel = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.code === type)
    return fieldType?.title || type
  }

  const getRelationshipTypeColor = (type: string) => {
    const relType = relationshipTypes.find(rt => rt.value === type)
    return relType?.color || "bg-gray-100 text-gray-700"
  }

  // Handler functions
  const handleEditObject = () => {
    // TODO: Implement edit object functionality
    toast({
      title: "Not implemented",
      description: "Edit object functionality coming soon.",
    });
  };

  // Field handlers
  const handleCreateField = () => {
    setEditingMetaField(null);
    resetFieldForm();
    setShowFieldModal(true);
  };

  const handleEditMetaField = (field: MetaDataFieldDtoMin) => {
    setEditingMetaField(field);
    loadFieldForEdit(field);
    setShowFieldModal(true);
  };

  // Handle field form submission
  const handleFieldFormSubmit = async () => {
    setIsSubmittingField(true);
    
    try {
      if (!fieldFormData.label || !fieldFormData.apiName || !fieldFormData.typeId) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      const dto: Omit<MetaDataFieldRequestDto, 'recordId'> = {
        typeId: fieldFormData.typeId!,
        apiName: fieldFormData.apiName!,
        label: fieldFormData.label!,
        description: fieldFormData.description,
        helpText: fieldFormData.helpText,
        defaultValue: fieldFormData.defaultValue,
        choices: fieldFormData.choices,
        relatedRecordId: fieldFormData.relatedRecordId,
        isActive: fieldFormData.isActive,
        isStrict: fieldFormData.isStrict,
        isRequired: fieldFormData.isRequired,
        isUnique: fieldFormData.isUnique,
        isCaseSensitive: fieldFormData.isCaseSensitive,
        isSystemLocked: fieldFormData.isSystemLocked,
        isSearchable: fieldFormData.isSearchable,
        decimals: fieldFormData.decimals,
        textLength: fieldFormData.textLength,
      };

      let response;
      if (editingMetaField) {
        // Update existing field        
        response = await objectsApiClient.updateRecordField(
          objectId.toString(), 
          editingMetaField.id.toString(), 
          { ...dto, recordId: objectId.toString() }
        );
      } else {
        // Create new field
        response = await objectsApiClient.createRecordField(objectId.toString(), dto);
      }
      
      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Success",
          description: editingMetaField ? "Field updated successfully." : "Field created successfully.",
        });
        setShowFieldModal(false);
        refreshFields(); // Refresh the fields list
        resetFieldForm(); // Reset form for next use
      } else {
        throw new Error(editingMetaField ? 'Failed to update field' : 'Failed to create field');
      }
    } catch (error) {
      console.error('Error submitting field:', error);
      toast({
        title: "Error",
        description: editingMetaField ? "Failed to update field. Please try again." : "Failed to create field. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingField(false);
    }
  };

  const handleDeleteField = (fieldId: string) => {
    setMetaDataFields(prev => prev.filter(f => f.id !== fieldId))
    toast({
      title: "Field Deleted",
      description: "The field has been successfully deleted.",
    })
  }

  // Relationship handlers
  const handleCreateRelationship = () => {
    setEditingRelationship(null)
    setShowRelationshipModal(true)
  }

  const handleEditRelationship = (relationship: RelationshipDefinition) => {
    setEditingRelationship(relationship)
    setShowRelationshipModal(true)
  }

  const handleDeleteRelationship = (relationshipId: string) => {
    setRelationships(prev => prev.filter(r => r.id !== relationshipId))
    toast({
      title: "Relationship Deleted",
      description: "The relationship has been successfully deleted.",
    })
  }

  // Settings handlers
  const handleUpdateSettings = (settings: Partial<MetaDataRecordDto>) => {
    if (metaDataRecord) {
      setMetaDataRecord({ ...metaDataRecord, ...settings });
      toast({
        title: "Settings Updated",
        description: "Object settings have been updated.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading object details...</p>
        </div>
      </div>
    )
  }

  if (!metaDataRecord) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Object Not Found</h3>
        <p className="text-muted-foreground mb-4">The requested object could not be found.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Objects
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Database className="h-8 w-8" />
              {metaDataRecord?.label}
            </h1>
            <p className="text-muted-foreground">{metaDataRecord?.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button size="sm" variant="outline" onClick={handleEditObject}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Object
          </Button>
          <Button size="sm" variant="outline" onClick={refreshAll}>
            <RefreshCcw className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Records</p>
                <p className="text-2xl font-bold">{'-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Fields</p>
                <p className="text-2xl font-bold">{metaDataFields.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Link className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Relationships</p>
                <p className="text-2xl font-bold">{relationships.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Last Modified</p>
                <p className="text-sm font-semibold">{metaDataRecord?.updatedAt ? metaDataRecord.updatedAt : '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fields">Fields ({metaDataFields.length})</TabsTrigger>
          <TabsTrigger value="relationships">Relationships ({relationships.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Object Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Badge variant={metaDataRecord?.isActive  ? 'default' : 'secondary'}>
                      {metaDataRecord?.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <Badge variant={metaDataRecord?.isSearchable ? 'default' : 'outline'}>
                      {metaDataRecord?.isSearchable ? 'Custom' : 'Standard'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">API Name</Label>
                    <p className="font-mono font-medium">{metaDataRecord?.apiName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p>{metaDataRecord?.typeTitle || metaDataRecord?.type?.title || 'Standard Object'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                      {metaDataRecord?.isActive ? 'Active' : 'Inactive'}
                    <div>
                    <Label className="text-muted-foreground">Last Modified</Label>
                    <p>{metaDataRecord?.updatedAt ? new Date(metaDataRecord.updatedAt).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}</p>
                    </div>
                </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{metaDataRecord?.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Records
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Record
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          {/* Fields Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select value={selectedFieldType} onValueChange={setSelectedFieldType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All field types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All field types</SelectItem>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.id} value={type.code}>
                      {type.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="ghost" onClick={refreshFields} className="mr-2"> 
                <RefreshCcw className="h-4 w-4 mr-2" />
              </Button>
              <Button onClick={handleCreateField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>

          {/* Fields Table */}
          <Card>
            <CardHeader>
              <CardTitle>Fields ({filteredFields.length})</CardTitle>
              <CardDescription>
                Manage fields and their properties for this object
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Name</TableHead>
                    <TableHead>API Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Unique</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metaDataFields.map((field) => {
                    const FieldIcon = getFieldTypeIconGlobal(field.typeCode || "text")
                    return (
                      <TableRow key={field.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FieldIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{field.label}</div>
                              {field.description && (
                                <div className="text-sm text-muted-foreground">{field.description}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {field.apiName}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getFieldTypeLabel(field.typeCode || "text")}
                          </Badge>
                        </TableCell>
                        <TableCell>{field.typeCode || "text"}</TableCell>
                        <TableCell>
                          {field.required ? (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {field.unique ? (
                            <Badge variant="default" className="text-xs">Unique</Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">No</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={field.systemLocked ? 'default' : 'outline'} className="text-xs">
                            {field.systemLocked ? 'Locked' : 'Open'}
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
                              <DropdownMenuItem onClick={() => handleEditMetaField(field)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Field
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Clone Field
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {!field.systemLocked && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Field
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Field</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this field? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteField(field.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          {/* Relationships Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Relationships</h3>
            <Button onClick={handleCreateRelationship}>
              <Plus className="h-4 w-4 mr-2" />
              Add Relationship
            </Button>
          </div>

          {/* Relationships Table */}
          <Card>
            <CardHeader>
              <CardTitle>Object Relationships ({relationships.length})</CardTitle>
              <CardDescription>
                Manage relationships between this object and other objects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Relationship Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Related Object</TableHead>
                    <TableHead>Field Name</TableHead>
                    <TableHead>Cascade Delete</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relationships.map((relationship) => (
                    <TableRow key={relationship.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{relationship.name}</div>
                          {relationship.description && (
                            <div className="text-sm text-muted-foreground">{relationship.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", getRelationshipTypeColor(relationship.type))}>
                          {relationship.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {relationship.childObject}
                        </code>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {relationship.fieldName}
                        </code>
                      </TableCell>
                      <TableCell>
                        {relationship.cascadeDelete ? (
                          <Badge variant="destructive" className="text-xs">Yes</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={relationship.isActive ? 'default' : 'secondary'} className="text-xs">
                          {relationship.isActive ? 'Active' : 'Inactive'}
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
                            <DropdownMenuItem onClick={() => handleEditRelationship(relationship)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Relationship
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Relationship
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Relationship</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this relationship? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteRelationship(relationship.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Object Settings</CardTitle>
              <CardDescription>
                Configure advanced settings and permissions for this object
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reports">Allow Reports</Label>
                      <Switch id="reports" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="activities">Track Activities</Label>
                      <Switch id="activities" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="history">Track Field History</Label>
                      <Switch id="history" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="search">Allow Search</Label>
                      <Switch id="search" defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">API Access</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bulk-api">Bulk API</Label>
                      <Switch id="bulk-api" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="streaming-api">Streaming API</Label>
                      <Switch id="streaming-api" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sharing">Allow Sharing</Label>
                      <Switch id="sharing" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="feeds">Enable Feeds</Label>
                      <Switch id="feeds" />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>        
      {/* Field Creation/Edit Modal */}     
       <FieldCreationEditModalWizard
          open={showFieldModal}
          onOpenChange={setShowFieldModal}
          editingField={editingMetaField}
          fieldFormData={fieldFormData}
          setFieldFormData={setFieldFormData}
          fieldsCategories={metaDataFieldsCategories}
          fieldTypes={metaDataFieldsTypes}
          onSubmit={handleFieldFormSubmit}
          isSubmitting={isSubmittingField}
      />

      {/* TODO: Add Relationship Creation/Edit Modal */}
    </div>
  )
}
