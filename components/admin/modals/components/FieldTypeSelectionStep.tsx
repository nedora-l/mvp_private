'use client'

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetaDataFieldTypeDto, MetaDataFieldCategoryDto, MetaDataFieldRequestDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service"
import { FileText, Hash, Calendar, Settings, Link, Database, Icon } from "lucide-react"

interface FieldTypeSelectionStepProps {
  fieldFormData: Partial<MetaDataFieldRequestDto>
  setFieldFormData: (data: Partial<MetaDataFieldRequestDto>) => void
  onFieldSelect: () => void
  fieldTypes: MetaDataFieldTypeDto[]
  fieldsCategories: MetaDataFieldCategoryDto[]
  currentActiveCategory: string
  setCurrentActiveCategory: (category: string) => void
}

export const getFieldTypeIcon = (typeName: string)  => {
  const lowerTypeName = typeName?.toLowerCase() || ""
  if (lowerTypeName.includes("text") || lowerTypeName.includes("email") || lowerTypeName.includes("phone")) return FileText
  if (lowerTypeName.includes("number") || lowerTypeName.includes("currency") || lowerTypeName.includes("percent")) return Hash
  if (lowerTypeName.includes("date") || lowerTypeName.includes("time")) return Calendar
  if (lowerTypeName.includes("pick") || lowerTypeName.includes("check")) return Settings
  if (lowerTypeName.includes("lookup") || lowerTypeName.includes("link")) return Link
  return Database
}

export function FieldTypeSelectionStep({
  fieldFormData,
  setFieldFormData,
  fieldTypes,
  fieldsCategories,
  currentActiveCategory,
  setCurrentActiveCategory,
  onFieldSelect
}: FieldTypeSelectionStepProps) {
  const renderFieldTypeRadioItems = (typesToRender: MetaDataFieldTypeDto[]) => {
    return typesToRender.map((type) => {
      const IconComponent = getFieldTypeIcon(type.title)
      return (
        <div key={type.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
            <RadioGroupItem value={type.id.toString()} id={`type-${type.id}`} />
            <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                    <Label htmlFor={`type-${type.id}`} className="text-sm font-medium cursor-pointer">
                        {type.title}
                    </Label>
                    {type.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
      )
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choose Field Type</h3>
      <p className="text-sm text-muted-foreground">
        Select the type of field you want to create. This determines how data is stored and displayed.
      </p>

      <Tabs value={currentActiveCategory} onValueChange={setCurrentActiveCategory} className="space-y-4">
        <TabsList>
          {fieldsCategories.length === 0 && (
            <TabsTrigger value="all">All Types</TabsTrigger>
          )}
          {fieldsCategories.length > 0 &&
            fieldsCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.code || ""}>
                {category.title}
              </TabsTrigger>
            ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <RadioGroup
            value={fieldFormData.typeId?.toString() || ""}
            onValueChange={(value) =>
              setFieldFormData({ ...fieldFormData, typeId: parseInt(value) })
            }
            className="gap-4"
          >
            {renderFieldTypeRadioItems(fieldTypes)}
          </RadioGroup>
        </TabsContent>

        {fieldsCategories.map((category) => (
          <TabsContent key={`tab-${category.id}`} value={category.code || ""} className="space-y-4">
            <RadioGroup
              value={fieldFormData.typeId?.toString() || ""}
              onValueChange={(value) => {
                setFieldFormData({ ...fieldFormData, typeId: parseInt(value) });
                onFieldSelect();
              }
              }
              className=" gap-4"
            >
              {renderFieldTypeRadioItems(
                fieldTypes.filter((ft) => ft.category?.code === category.code)
              )}
            </RadioGroup>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
