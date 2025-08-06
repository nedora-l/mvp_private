"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetaDataFieldRequestDto, MetaDataFieldTypeDto, MetaDataRecordDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service"
import { objectsApiClient } from "@/lib/services/client/admin/objects/objects.client.service"
import { useState, useEffect } from "react"
import { Plus, X, Link } from "lucide-react"

interface FieldConfigurationStepProps {
  fieldFormData: Partial<MetaDataFieldRequestDto>
  setFieldFormData: (data: Partial<MetaDataFieldRequestDto>) => void
  selectedFieldType: MetaDataFieldTypeDto | undefined
}

export function FieldConfigurationStep({
  fieldFormData,
  setFieldFormData,
  selectedFieldType
}: FieldConfigurationStepProps) {
  // State for picklist management
  const [picklistMode, setPicklistMode] = useState<'simple' | 'advanced'>('simple');
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [picklistOptions, setPicklistOptions] = useState<Array<{label: string, value: string}>>([]);

  // State for relationship field management
  const [availableRecords, setAvailableRecords] = useState<MetaDataRecordDto[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  // Initialize picklist options from existing choices
  useState(() => {
    if (fieldFormData.choices) {
      try {
        const parsed = JSON.parse(fieldFormData.choices);
        if (Array.isArray(parsed)) {
          setPicklistOptions(parsed);
        }
      } catch (error) {
        // If parsing fails, keep empty array and switch to advanced mode
        setPicklistMode('advanced');
      }
    }
  });

  // Get the field type code for conditional rendering
  const fieldTypeCode = selectedFieldType?.code?.toLowerCase() || '';

  // Helper functions to determine field type categories
  const isTextBasedField = () => {
    return fieldTypeCode.includes('text') || 
           fieldTypeCode.includes('email') || 
           fieldTypeCode.includes('url') ||
           fieldTypeCode.includes('string') ||
           fieldTypeCode.includes('textarea');
  };

  const isNumericField = () => {
    return fieldTypeCode.includes('number') || 
           fieldTypeCode.includes('integer') || 
           fieldTypeCode.includes('decimal') ||
           fieldTypeCode.includes('currency') ||
           fieldTypeCode.includes('percent');
  };

  const isBooleanField = () => {
    return fieldTypeCode.includes('boolean') || 
           fieldTypeCode.includes('checkbox');
  };

  const isPicklistField = () => {
    return fieldTypeCode.includes('select') || 
           fieldTypeCode.includes('picklist') || 
           fieldTypeCode.includes('dropdown') ||
           fieldTypeCode.includes('multiselect');
  };
  const isDateField = () => {
    return fieldTypeCode.includes('date') || 
           fieldTypeCode.includes('time');
  };

  const isRelationshipField = () => {
    return fieldTypeCode.includes('relation') || 
           fieldTypeCode.includes('lookup') || 
           fieldTypeCode.includes('reference') ||
           fieldTypeCode.includes('link') ||
           fieldTypeCode.includes('foreign');
  };

  // Load available records for relationship fields
  useEffect(() => {
    if (isRelationshipField()) {
      loadAvailableRecords();
    }
  }, [selectedFieldType]);

  const loadAvailableRecords = async () => {
    setIsLoadingRecords(true);
    try {
      const response = await objectsApiClient.getObjects();
      setAvailableRecords(response.data || []);
    } catch (error) {
      console.error('Failed to load available records:', error);
      setAvailableRecords([]);
    } finally {
      setIsLoadingRecords(false);
    }
  };
  // Event handlers
  const handleRequiredChange = (checked: boolean) => {
    setFieldFormData({ ...fieldFormData, required: checked })
  }

  const handleUniqueChange = (checked: boolean) => {
    setFieldFormData({ ...fieldFormData, isUnique: checked })
  }

  const handleActiveChange = (checked: boolean) => {
    setFieldFormData({ ...fieldFormData, isActive: checked })
  }

  const handleSearchableChange = (checked: boolean) => {
    setFieldFormData({ ...fieldFormData, isSearchable: checked })
  }

  const handleStrictChange = (checked: boolean) => {
    setFieldFormData({ ...fieldFormData, isStrict: checked })
  }

  const handleCaseSensitiveChange = (checked: boolean) => {
    setFieldFormData({ ...fieldFormData, isCaseSensitive: checked })
  }

  const handleDefaultValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldFormData({ ...fieldFormData, defaultValue: e.target.value })
  }

  const handleBooleanDefaultValueChange = (value: string) => {
    setFieldFormData({ ...fieldFormData, defaultValue: value === 'none' ? undefined : value })
  }

  const handleTextLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setFieldFormData({ ...fieldFormData, textLength: value })
  }
  const handleDecimalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    setFieldFormData({ ...fieldFormData, decimals: value })
  };

  const handleChoicesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFieldFormData({ ...fieldFormData, choices: e.target.value })
  };
  const handleRelatedRecordChange = (value: string) => {
    setFieldFormData({ ...fieldFormData, relatedRecordId: value })
  };

  const handleRelationshipTypeChange = (value: string) => {
    setFieldFormData({ 
      ...fieldFormData, 
      relationshipType: value as 'lookup' | 'master-detail' | 'principal-details' | 'parent-details'
    })
  };

  const handleCascadeDeleteChange = (checked: boolean) => {
    setFieldFormData({ ...fieldFormData, cascadeDelete: checked })
  };

  const handleRelatedFieldApiNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldFormData({ ...fieldFormData, relatedFieldApiName: e.target.value })
  };

  // Picklist option management functions
  const addPicklistOption = () => {
    if (newOptionLabel.trim() && newOptionValue.trim()) {
      const newOption = { label: newOptionLabel.trim(), value: newOptionValue.trim() };
      const updatedOptions = [...picklistOptions, newOption];
      setPicklistOptions(updatedOptions);
      setFieldFormData({ ...fieldFormData, choices: JSON.stringify(updatedOptions) });
      setNewOptionLabel('');
      setNewOptionValue('');
    }
  };

  const removePicklistOption = (index: number) => {
    const updatedOptions = picklistOptions.filter((_, i) => i !== index);
    setPicklistOptions(updatedOptions);
    setFieldFormData({ ...fieldFormData, choices: JSON.stringify(updatedOptions) });
  };

  const handlePicklistModeChange = (mode: 'simple' | 'advanced') => {
    setPicklistMode(mode);
    if (mode === 'simple' && fieldFormData.choices) {
      // Try to parse existing choices when switching to simple mode
      try {
        const parsed = JSON.parse(fieldFormData.choices);
        if (Array.isArray(parsed)) {
          setPicklistOptions(parsed);
        }
      } catch (error) {
        // If parsing fails, clear the choices and start fresh
        setPicklistOptions([]);
        setFieldFormData({ ...fieldFormData, choices: '' });
      }
    }
  };

  // Helper function to get relationship type description
  const getRelationshipTypeDescription = (type: string | undefined) => {
    switch (type) {
      case 'lookup':
        return 'Lookup relationships are loosely coupled. The child record can exist without the parent record.';
      case 'master-detail':
        return 'Master-detail relationships are tightly coupled. The detail record cannot exist without the master record.';
      case 'principal-details':
        return 'Principal-details relationships create a special parent-child relationship where this object (the child/detail) relates to a principal object (the parent). The detail records are dependent on the principal record.';
      case 'parent-details':
        return 'Parent-details relationships create a standard parent-child relationship between this detail object and a parent object. Detail records are typically dependent on their parent.';
      default:
        return 'Select a relationship type to see its description.';
    }
  };

  // Helper function to determine if cascade delete should be available
  const isCascadeDeleteAvailable = (type: string | undefined) => {
    return type === 'master-detail' || type === 'principal-details' || type === 'parent-details';
  };

  // Helper function to get the appropriate parent/child terminology
  const getRelationshipTerminology = (type: string | undefined) => {
    switch (type) {
      case 'principal-details':
        return { parent: 'principal', child: 'detail' };
      case 'parent-details':
        return { parent: 'parent', child: 'detail' };
      case 'master-detail':
        return { parent: 'master', child: 'detail' };
      default:
        return { parent: 'parent', child: 'child' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Field Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Set up validation rules and other configurations for this field.
        </p>
      </div>

      {/* Basic Field Properties */}
      <div className="space-y-4 p-4 border rounded-md">
        <h4 className="font-medium text-sm">Basic Properties</h4>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="active" className="flex flex-col space-y-1">
            <span>Active Field</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Field is currently active and available for use.
            </span>
          </Label>
          <Switch
            id="active"
            checked={fieldFormData.isActive ?? true}
            onCheckedChange={handleActiveChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="searchable" className="flex flex-col space-y-1">
            <span>Searchable Field</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Field is indexed and can be used in search operations.
            </span>
          </Label>
          <Switch
            id="searchable"
            checked={fieldFormData.isSearchable ?? true}
            onCheckedChange={handleSearchableChange}
          />
        </div>
      </div>

      {/* Validation Rules */}
      <div className="space-y-4 p-4 border rounded-md">
        <h4 className="font-medium text-sm">Validation Rules</h4>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="isRequired" className="flex flex-col space-y-1">
            <span>Required Field</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Users must provide a value for this field.
            </span>
          </Label>          <Switch
            id="isRequired"
            checked={fieldFormData.required || false}
            onCheckedChange={handleRequiredChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isUnique" className="flex flex-col space-y-1">
            <span>Unique Field</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Ensure that all values for this field are unique.
            </span>
          </Label>          <Switch
            id="isUnique"
            checked={fieldFormData.isUnique || false}
            onCheckedChange={handleUniqueChange}
          />
        </div>

        {/* Text-specific validation */}
        {isTextBasedField() && (
          <div className="flex items-center justify-between">
            <Label htmlFor="isCaseSensitive" className="flex flex-col space-y-1">
              <span>Case Sensitive</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Text comparisons will be case-sensitive.
              </span>
            </Label>
            <Switch
              id="isCaseSensitive"
              checked={fieldFormData.isCaseSensitive || false}
              onCheckedChange={handleCaseSensitiveChange}
            />
          </div>
        )}

        {/* Numeric-specific validation */}
        {isNumericField() && (
          <div className="flex items-center justify-between">
            <Label htmlFor="isStrict" className="flex flex-col space-y-1">
              <span>Strict Mode</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Enforce strict data type adherence and validation.
              </span>
            </Label>
            <Switch
              id="isStrict"
              checked={fieldFormData.isStrict || false}
              onCheckedChange={handleStrictChange}
            />
          </div>
        )}
      </div>

      {/* Type-Specific Configuration */}
      <div className="space-y-4 p-4 border rounded-md">
        <h4 className="font-medium text-sm">Type-Specific Configuration</h4>
        
        {/* Text Length for text-based fields */}
        {isTextBasedField() && (
          <div>
            <Label htmlFor="textLength">Maximum Text Length</Label>
            <Input
              id="textLength"
              type="number"
              min="1"
              max="10000"
              placeholder="e.g., 255"
              value={fieldFormData.textLength || ""}
              onChange={handleTextLengthChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum number of characters allowed (leave empty for no limit).
            </p>
          </div>
        )}

        {/* Decimal places for numeric fields */}
        {isNumericField() && (
          <div>
            <Label htmlFor="decimals">Decimal Places</Label>
            <Input
              id="decimals"
              type="number"
              min="0"
              max="10"
              placeholder="e.g., 2"
              value={fieldFormData.decimals || ""}
              onChange={handleDecimalsChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Number of decimal places for precision (0 for integers).
            </p>
          </div>
        )}        {/* Relationship Configuration for relationship fields */}
        {isRelationshipField() && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Link className="h-5 w-5 text-primary" />
              <h5 className="font-medium">Relationship Configuration</h5>
            </div>

            {/* Related Object Selection */}
            <div>
              <Label htmlFor="relatedRecord">Related Object</Label>
              <Select 
                value={fieldFormData.relatedRecordId || ''} 
                onValueChange={handleRelatedRecordChange}
                disabled={isLoadingRecords}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingRecords ? "Loading objects..." : "Select an object to relate to"} />
                </SelectTrigger>
                <SelectContent>
                  {availableRecords.map((record) => (
                    <SelectItem key={record.id} value={record.id}>
                      <div className="flex items-center gap-2">
                        <span>{record.label}</span>
                        <span className="text-xs text-muted-foreground">({record.apiName})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Select the object that this field will reference.
              </p>
            </div>            {/* Relationship Type Selection */}
            <div>
              <Label htmlFor="relationshipType">Relationship Type</Label>
              <Select 
                value={fieldFormData.relationshipType || ''} 
                onValueChange={handleRelationshipTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lookup">
                    <div className="space-y-1">
                      <div className="font-medium">Lookup Relationship</div>
                      <div className="text-xs text-muted-foreground">
                        Loosely links objects together. Child records remain independent.
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="master-detail">
                    <div className="space-y-1">
                      <div className="font-medium">Master-Detail Relationship</div>
                      <div className="text-xs text-muted-foreground">
                        Tightly links objects. Detail records depend on master record.
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="principal-details">
                    <div className="space-y-1">
                      <div className="font-medium">Principal-Details Relationship</div>
                      <div className="text-xs text-muted-foreground">
                        Creates a special parent-details relationship where this object (detail) relates to a principal object.
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="parent-details">
                    <div className="space-y-1">
                      <div className="font-medium">Parent-Details Relationship</div>
                      <div className="text-xs text-muted-foreground">
                        Creates a parent-details relationship between this detail object and a parent object.
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {fieldFormData.relationshipType && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                  {getRelationshipTypeDescription(fieldFormData.relationshipType)}
                </div>
              )}
            </div>

            {/* Display Field Configuration */}
            <div>
              <Label htmlFor="relatedFieldApiName">Display Field (API Name)</Label>
              <Input
                id="relatedFieldApiName"
                placeholder="e.g., name, title, email"
                value={fieldFormData.relatedFieldApiName || ""}
                onChange={handleRelatedFieldApiNameChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                The field from the related object to display in this lookup field (leave empty to use the default field).
              </p>
            </div>            {/* Cascade Delete Option for Master-Detail relationships */}
            {isCascadeDeleteAvailable(fieldFormData.relationshipType) && (
              <div className="flex items-center justify-between p-3 border rounded-md bg-amber-50">
                <Label htmlFor="cascadeDelete" className="flex flex-col space-y-1">
                  <span>Cascade Delete</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    When the {getRelationshipTerminology(fieldFormData.relationshipType).parent} record is deleted, 
                    also delete all related {getRelationshipTerminology(fieldFormData.relationshipType).child} records.
                  </span>
                </Label>
                <Switch
                  id="cascadeDelete"
                  checked={fieldFormData.cascadeDelete || false}
                  onCheckedChange={handleCascadeDeleteChange}
                />
              </div>
            )}            {/* Relationship Type Explanations and Warnings */}
            <div className="space-y-3">
              <div className="p-3 border rounded-md bg-blue-50">
                <h6 className="font-medium text-sm mb-2">Relationship Types Explained:</h6>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>
                    <strong>Lookup:</strong> Flexible relationship. Records can exist independently.
                  </div>
                  <div>
                    <strong>Master-Detail:</strong> Tight relationship. Detail records depend on master records.
                  </div>
                  <div>
                    <strong>Principal-Details:</strong> Special parent-child relationship where this object (child/detail) relates to a principal object (parent).
                  </div>
                  <div>
                    <strong>Parent-Details:</strong> Standard parent-child relationship between this detail object and a parent object.
                  </div>
                </div>
              </div>

              {/* Specific warnings based on relationship type */}
              {fieldFormData.relationshipType === 'principal-details' && (
                <div className="p-3 border border-orange-200 rounded-md bg-orange-50">
                  <h6 className="font-medium text-sm text-orange-800 mb-1">Principal-Details Relationship Notes:</h6>
                  <ul className="text-xs text-orange-700 space-y-1 list-disc list-inside">
                    <li>This creates a special type of parent-child relationship</li>
                    <li>Detail records (this object) are typically dependent on the principal record</li>
                    <li>Consider enabling cascade delete if detail records should not exist without the principal</li>
                    <li>Access to detail records may be controlled by access to the principal record</li>
                  </ul>
                </div>
              )}

              {fieldFormData.relationshipType === 'parent-details' && (
                <div className="p-3 border border-orange-200 rounded-md bg-orange-50">
                  <h6 className="font-medium text-sm text-orange-800 mb-1">Parent-Details Relationship Notes:</h6>
                  <ul className="text-xs text-orange-700 space-y-1 list-disc list-inside">
                    <li>This creates a standard parent-child relationship</li>
                    <li>Detail records are typically owned by their parent record</li>
                    <li>Consider enabling cascade delete to maintain data integrity</li>
                    <li>Parent records may aggregate data from their detail records</li>
                  </ul>
                </div>
              )}

              {fieldFormData.relationshipType === 'master-detail' && (
                <div className="p-3 border border-red-200 rounded-md bg-red-50">
                  <h6 className="font-medium text-sm text-red-800 mb-1">Master-Detail Relationship Warning:</h6>
                  <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                    <li>Detail records cannot exist without their master record</li>
                    <li>Deleting the master record will automatically delete all detail records</li>
                    <li>Detail records inherit security and sharing from the master record</li>
                    <li>Roll-up summary fields on master records can aggregate detail data</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Choices for picklist fields */}
        {isPicklistField() && (
          <div>
            <Label htmlFor="choices">Picklist Options</Label>
            <Tabs value={picklistMode} onValueChange={(value) => handlePicklistModeChange(value as 'simple' | 'advanced')} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simple">Simple Editor</TabsTrigger>
                <TabsTrigger value="advanced">Advanced (JSON)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="simple" className="space-y-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Add new option form */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="newOptionLabel" className="text-xs">Label</Label>
                          <Input
                            id="newOptionLabel"
                            placeholder="e.g., Yes"
                            value={newOptionLabel}
                            onChange={(e) => setNewOptionLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addPicklistOption()}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newOptionValue" className="text-xs">Value</Label>
                          <Input
                            id="newOptionValue"
                            placeholder="e.g., yes"
                            value={newOptionValue}
                            onChange={(e) => setNewOptionValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addPicklistOption()}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button 
                            type="button" 
                            onClick={addPicklistOption}
                            disabled={!newOptionLabel.trim() || !newOptionValue.trim()}
                            size="sm"
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Display existing options */}
                      {picklistOptions.length > 0 && (
                        <div>
                          <Label className="text-xs">Current Options</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {picklistOptions.map((option, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-2">
                                <span>{option.label}</span>
                                <span className="text-xs text-muted-foreground">({option.value})</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePicklistOption(index)}
                                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {picklistOptions.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No options added yet. Add your first option above.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced">
                <Textarea
                  id="choices"
                  placeholder='[{"label": "Option 1", "value": "opt1"}, {"label": "Option 2", "value": "opt2"}]'
                  rows={6}
                  value={fieldFormData.choices || ""}
                  onChange={handleChoicesChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter options as JSON array with label-value pairs. Example: {`[{"label": "Yes", "value": "yes"}, {"label": "No", "value": "no"}]`}
                </p>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Default Value */}
        <div>
          <Label htmlFor="defaultValue">Default Value</Label>
          {isBooleanField() ? (
            <Select value={fieldFormData.defaultValue || 'none'} onValueChange={handleBooleanDefaultValueChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select default value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Default</SelectItem>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="defaultValue"
              placeholder={
                isDateField() 
                  ? "e.g., TODAY, 2024-01-01" 
                  : isNumericField() 
                    ? "e.g., 0, 100" 
                    : "Enter a default value (optional)"
              }
              value={fieldFormData.defaultValue || ""}
              onChange={handleDefaultValueChange}
            />
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {isDateField() 
              ? "For dates, you can use 'TODAY' for current date or specific date format (YYYY-MM-DD)."
              : "If set, this value will be automatically populated for new entries."
            }
          </p>
        </div>
      </div>
      
      {selectedFieldType?.isSystemLocked && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
                <strong>Note:</strong> This is a system field type. Some configurations might be restricted or have predefined behaviors.
            </p>
        </div>
      )}

    </div>
  )
}
