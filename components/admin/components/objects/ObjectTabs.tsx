"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { MetaDataFieldDtoMin, MetaDataRecordDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { FieldCreationEditModalWizard } from "../../modals/field-creation-edit-modal-wizard";

interface ObjectTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  metaDataRecord: MetaDataRecordDto | null;
  metaDataFields: MetaDataFieldDtoMin[];
  relationships: MetaDataFieldDtoMin[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onShowFieldModal: () => void;
  onShowRelationshipModal: () => void;
  // Props for FieldCreationEditModalWizard
  showFieldModal: boolean;
  onFieldModalOpenChange: (open: boolean) => void;
  editingMetaField: MetaDataFieldDtoMin | null;
  fieldFormData: any; // Replace with actual type
  onFieldFormDataChange: (data: any) => void; // Replace with actual type
  fieldsCategories: any[]; // Replace with actual type
  metaDataFieldsTypes: any[]; // Replace with actual type
  onFieldFormSubmit: () => void;
  isSubmittingField: boolean;
}

export function ObjectTabs({
  activeTab,
  onTabChange,
  metaDataRecord,
  metaDataFields,
  relationships,
  searchTerm,
  onSearchTermChange,
  onShowFieldModal,
  onShowRelationshipModal,
  // FieldCreationEditModalWizard props
  showFieldModal,
  onFieldModalOpenChange,
  editingMetaField,
  fieldFormData,
  onFieldFormDataChange,
  fieldsCategories,
  metaDataFieldsTypes,
  onFieldFormSubmit,
  isSubmittingField,
}: ObjectTabsProps) {
  if (!metaDataRecord) {
    return null; // Or some loading/error state
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
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
              {/* Overview Content */}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overview Content */}
              <Separator />
              {/* Overview Content */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              {/* Overview Content */}
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Overview Content */}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="fields" className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
          <div>
            <Button onClick={onShowFieldModal}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            {/* Fields Table Header */}
          </CardHeader>
          <CardContent>
            {/* Fields Table Content */}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="relationships" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Relationships</h3>
          <Button onClick={onShowRelationshipModal}>
            <Plus className="h-4 w-4 mr-2" />
            Add Relationship
          </Button>
        </div>
        <Card>
          <CardHeader>
            {/* Relationships Table Header */}
          </CardHeader>
          <CardContent>
            {/* Relationships Table Content */}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            {/* Settings Content */}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Settings Content */}
            <Separator />
            {/* Settings Content */}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Field Creation/Edit Modal */}
      <FieldCreationEditModalWizard
        open={showFieldModal}
        onOpenChange={onFieldModalOpenChange}
        editingField={editingMetaField}
        fieldFormData={fieldFormData}
        setFieldFormData={onFieldFormDataChange} // Pass the handler here
        fieldsCategories={fieldsCategories}
        fieldTypes={metaDataFieldsTypes} // Corrected prop name
        onSubmit={onFieldFormSubmit}
        isSubmitting={isSubmittingField}
      />
    </Tabs>
  );
}
