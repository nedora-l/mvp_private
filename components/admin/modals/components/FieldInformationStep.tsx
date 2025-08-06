"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MetaDataFieldRequestDto, MetaDataFieldTypeDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service"
import { FileText, Hash, Calendar, Settings, Link, Database, Icon } from "lucide-react"

interface FieldInformationStepProps {
  fieldFormData: Partial<MetaDataFieldRequestDto>
  setFieldFormData: (data: Partial<MetaDataFieldRequestDto>) => void
  selectedFieldType: MetaDataFieldTypeDto | undefined
  getFieldTypeIcon: (typeName: string) =>  React.ElementType
}

export function FieldInformationStep({
  fieldFormData,
  setFieldFormData,
  selectedFieldType,
  getFieldTypeIcon
}: FieldInformationStepProps) {

  const SelectedIcon = selectedFieldType ? getFieldTypeIcon(selectedFieldType?.title || "text") : Database;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6 p-4 border rounded-md bg-muted/40">
        <SelectedIcon className="h-8 w-8 text-primary" />
        <div>
          <h4 className="text-md font-semibold">{selectedFieldType?.title || "N/A"}</h4>
          <p className="text-sm text-muted-foreground">
            {selectedFieldType?.description || "Please select a field type first."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fieldLabel">Field Label</Label>
          <Input
            id="fieldLabel"
            placeholder="e.g., Customer Name, Order ID"
            value={fieldFormData.label || ""}
            onChange={(e) =>
              setFieldFormData({ ...fieldFormData, label: e.target.value })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">
            This is the display name for the field in the UI.
          </p>
        </div>
        <div>
          <Label htmlFor="apiName">API Name</Label>
          <Input
            id="apiName"
            placeholder="e.g., customer_name, order_id"
            value={fieldFormData.apiName || ""}
            onChange={(e) =>
              setFieldFormData({ ...fieldFormData, apiName: e.target.value })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">
            Unique identifier for the field (no spaces, use underscores).
          </p>
        </div>
      </div>      <div>
        <Label htmlFor="fieldDescription">Description</Label>
        <Textarea
          id="fieldDescription"
          placeholder="Provide a brief description of this field..."
          value={fieldFormData.description || ""}
          onChange={(e) =>
            setFieldFormData({ ...fieldFormData, description: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          Optional: A short explanation of the field's purpose.
        </p>
      </div>

      <div>
        <Label htmlFor="helpText">Help Text</Label>
        <Input
          id="helpText"
          placeholder="e.g., Enter your full legal name as it appears on your ID"
          value={fieldFormData.helpText || ""}
          onChange={(e) =>
            setFieldFormData({ ...fieldFormData, helpText: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          Optional: Short hint or guidance shown to users when filling out this field.
        </p>
      </div>
    </div>
  )
}
