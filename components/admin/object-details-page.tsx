"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
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
import { Dictionary } from "@/locales/dictionary";
import { PreviewRecordsTab } from "./components/objects/PreviewRecordsTab";
import { RecordTriggersTab } from "./components/objects/triggersTab";

interface ObjectDetailsPageProps {
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

export function ObjectDetailsPage({
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
  const [isFieldsCategoriesLoading, setIsFieldsCategoriesLoading] = useState(true);

  const [oqlQuery, setOqlQuery] = useState("SELECT id   FROM ReportRecon__c");

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
    required: false,
    isUnique: false,
    isSearchable: false,
    isStrict: false,
    isCaseSensitive: false,
    isSystemLocked: false,
  });

  // Toast via sonner (imported above)

  // Refresh functions
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
    objectsApiClient.getRecordFields(objectId.toString(), { page: 0, size: 100 })
      .then((data) => {
        setMetaDataFields(data.data?.content || []);
        toast({
          title: "Refreshed",
          description: "Object fields have been refreshed.",
        });

        if (data.data?.content && data.data.content.length > 0) {
          setOqlQuery(`SELECT ${data.data.content.map(field => field.apiName).join(', ')} FROM ${metaDataRecord?.apiName}`);
        }
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

  const refreshFieldsTypes = () => {
    setIsFieldsTypesLoading(true);
    objectsApiClient.getFieldTypes({ page: 0, size: 100 })
      .then((data) => {
        setMetaDataFieldsTypes(data.data?.content || []);
        toast({
          title: "Refreshed",
          description: "Object field types have been refreshed.",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to refresh field types.",
        });
      })
      .finally(() => {
        setIsFieldsTypesLoading(false);
      });
  };

  const refreshFieldsCategories = () => {
    setIsFieldsCategoriesLoading(true);
    objectsApiClient.getFieldCategories({ page: 0, size: 100 })
      .then((data) => {
        setMetaDataFieldsCategories(data.data?.content || []);
        toast({
          title: "Refreshed",
          description: "Object field categories have been refreshed.",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to refresh field categories.",
        });
      })
      .finally(() => {
        setIsFieldsCategoriesLoading(false);
      });
  };

  const refreshAll = () => {
    refreshDetails();
    refreshFields();
    refreshFieldsTypes();
    refreshFieldsCategories();
  };

  // Handler functions
  const handleEditObject = () => {
    // TODO: Implement edit object functionality
    toast({
      title: "Not implemented",
      description: "Edit object functionality coming soon.",
    });
  };

  // Field handlers
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
      required: false,
      isUnique: false,
      isSearchable: false,
      isStrict: false,
      isCaseSensitive: false,
      isSystemLocked: false,
    });
  };

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
      isActive: field.isActive,
      required: field.required,
      isUnique: field.isUnique,
      isSearchable: field.isSearchable,
      isStrict: field.isStrict,
      isCaseSensitive: field.isCaseSensitive,
      isSystemLocked: field.isSystemLocked,
      relatedRecordId: field.relatedRecordId,
    });
  };

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

  const handleDeleteField = (fieldId: string) => {
    setMetaDataFields(prev => prev.filter(f => f.id !== fieldId));
    toast({
      title: "Field Deleted",
      description: "The field has been successfully deleted.",
    });
  };

  // Field form submission
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
        required: fieldFormData.required,
        isUnique: fieldFormData.isUnique,
        isCaseSensitive: fieldFormData.isCaseSensitive,
        isSystemLocked: fieldFormData.isSystemLocked,
        isSearchable: fieldFormData.isSearchable,
        decimals: fieldFormData.decimals,
        textLength: fieldFormData.textLength,
        typeCode: fieldFormData.typeCode || 'text', 
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

  // Relationship handlers
  const handleCreateRelationship = () => {
    setEditingRelationship(null);
    setShowRelationshipModal(true);
  };

  const handleEditRelationship = (relationship: RelationshipDefinition) => {
    setEditingRelationship(relationship);
    setShowRelationshipModal(true);
  };

  const handleDeleteRelationship = (relationshipId: string) => {
    setRelationships(prev => prev.filter(r => r.id !== relationshipId));
    toast({
      title: "Relationship Deleted",
      description: "The relationship has been successfully deleted.",
    });
  };

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

  // Navigation handler
  const onBack = () => {
    window.location.href = `/${locale}/admin/objects`;
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

  useEffect(() => {
    refreshAll();
  }, [objectId]);

  useEffect(() => {
    if (metaDataFields && metaDataRecord && metaDataFields.length > 0) {
      setOqlQuery(`SELECT ${metaDataFields.map(field => field.apiName).join(', ')} FROM ${metaDataRecord?.apiName}`);
    }
  }, [metaDataFields, metaDataRecord]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading object details...</p>
        </div>
      </div>
    );
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ObjectDetailsHeader
        metaDataRecord={metaDataRecord}
        onBack={onBack}
        onEdit={handleEditObject}
        onRefresh={refreshAll}
      />

      {/* Quick Stats */}
      <ObjectQuickStats
        metaDataRecord={metaDataRecord}
        fieldsCount={metaDataFields.length}
        relationshipsCount={relationships.length}
      />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="fields">Fields ({metaDataFields.length})</TabsTrigger>
          <TabsTrigger value="relationships">Relationships ({relationships.length})</TabsTrigger>
          <TabsTrigger value="dataLists">Lists</TabsTrigger>
          <TabsTrigger value="dataForms">Forms</TabsTrigger>
          <TabsTrigger value="dataRecordTypes">RecordTypes</TabsTrigger>
          <TabsTrigger value="dataTriggers">Triggers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab metaDataRecord={metaDataRecord} />
        </TabsContent>

        <TabsContent value="fields">
          <FieldsTab
            metaDataFields={metaDataFields}
            fieldTypes={metaDataFieldsTypes}
            searchTerm={searchTerm}
            refreshFields={refreshFields}
            onSearchTermChange={setSearchTerm}
            selectedFieldType={selectedFieldType}
            onFieldTypeChange={setSelectedFieldType}
            onCreateField={handleCreateField}
            onEditField={handleEditMetaField}
            onDeleteField={handleDeleteField}
            isLoading={isFieldsLoading}
          />
        </TabsContent>

        <TabsContent value="relationships">
          <RelationshipsTab
            relationships={relationships}
            onCreateRelationship={handleCreateRelationship}
            onEditRelationship={handleEditRelationship}
            onDeleteRelationship={handleDeleteRelationship}
          />
        </TabsContent>

        <TabsContent value="preview">
          <PreviewRecordsTab
            defaultOqlQuery={oqlQuery}
            metaDataFields={metaDataFields}
            fieldTypes={metaDataFieldsTypes}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            selectedFieldType={selectedFieldType}
            onFieldTypeChange={setSelectedFieldType}
            onCreateField={handleCreateField}
            onEditField={handleEditMetaField}
            onDeleteField={handleDeleteField}
            isLoading={isFieldsLoading}
          />
        </TabsContent>

        <TabsContent value="dataTriggers">
          <RecordTriggersTab
            metaDataRecord={metaDataRecord}
          />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab
            metaDataRecord={metaDataRecord}
            onUpdateSettings={handleUpdateSettings}
          />
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
  );
}
