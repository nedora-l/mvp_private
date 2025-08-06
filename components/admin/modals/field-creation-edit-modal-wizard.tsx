"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Save, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  FileText,
  Hash,
  Calendar,
  Mail,
  Link,
  Settings,
  Database
} from "lucide-react"
import { 
  MetaDataFieldDtoMin, 
  MetaDataFieldTypeDto,
  MetaDataFieldRequestDto, 
  MetaDataFieldCategoryDto
} from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldTypeSelectionStep } from "./components/FieldTypeSelectionStep";
import { FieldInformationStep } from "./components/FieldInformationStep";
import { FieldConfigurationStep } from "./components/FieldConfigurationStep";
import { FieldWizardActions } from "./components/FieldWizardActions";

interface FieldCreationEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingField: MetaDataFieldDtoMin | null
  fieldFormData: Partial<MetaDataFieldRequestDto>
  setFieldFormData: (data: Partial<MetaDataFieldRequestDto>) => void
  fieldTypes: MetaDataFieldTypeDto[];
  fieldsCategories: MetaDataFieldCategoryDto[];
  onSubmit: () => void
  isSubmitting?: boolean
}

const stepTitles = [
  "Select Field Type",
  "Field Information", 
  "Configuration & Validation"
]

export function FieldCreationEditModalWizard({
  open,
  onOpenChange,
  editingField,
  fieldFormData,
  setFieldFormData,
  fieldTypes,
  fieldsCategories,
  onSubmit,
  isSubmitting = false
}: FieldCreationEditModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentActiveCategory, setCurrentActiveCategory] = useState( fieldsCategories.length == 0 ? "all" : fieldsCategories[0].code || "" )

  const handleCancel = () => {
    if (!isSubmitting) {
      setCurrentStep(0)
      onOpenChange(false)
    }
  }

  const handleNext = () => {
    if (currentStep < stepTitles.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    onSubmit();
    setCurrentStep(0);
  }

  // Validation for each step
  const isStep1Valid: boolean = fieldFormData.typeId !== undefined && fieldFormData.typeId > 0;
  const isStep2Valid: boolean = fieldFormData.label !== undefined && fieldFormData.apiName !== undefined;
  const isStep3Valid: boolean = true;

  const canProceedToNext = () : boolean => {
    switch (currentStep) {
      case 0: return isStep1Valid === true
      case 1: return isStep2Valid === true
      case 2: return isStep3Valid === true
      default: return false
    }
  }

  const getSelectedFieldType = () => {
    return fieldTypes.find(type => type.id === fieldFormData.typeId)
  }

  const getFieldTypeIcon = (typeName: string): React.ElementType => {
    const lowerTypeName = typeName?.toLowerCase() || ""
    if (lowerTypeName.includes("text") || lowerTypeName.includes("email") || lowerTypeName.includes("phone")) return FileText
    if (lowerTypeName.includes("number") || lowerTypeName.includes("currency") || lowerTypeName.includes("percent")) return Hash
    if (lowerTypeName.includes("date") || lowerTypeName.includes("time")) return Calendar
    if (lowerTypeName.includes("pick") || lowerTypeName.includes("check")) return Settings
    if (lowerTypeName.includes("lookup") || lowerTypeName.includes("link")) return Link
    return Database
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !isSubmitting && onOpenChange(newOpen)}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingField ? 'Edit Field' : 'Create New Field'}
            <Badge variant="outline" className="ml-auto">
              Step {currentStep + 1} of {stepTitles.length}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {stepTitles[currentStep]}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {stepTitles.map((title, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 
                ${index <= currentStep 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground text-muted-foreground'
                }
              `}>
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="flex-1 ml-3">
                <div className={`text-sm font-medium ${
                  index === currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {title}
                </div>
              </div>
              {index < stepTitles.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${
                  index < currentStep ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Field Type Selection */}
          {currentStep === 0 && (
            <FieldTypeSelectionStep
              onFieldSelect={() => handleNext()}
              fieldFormData={fieldFormData}
              setFieldFormData={setFieldFormData}
              fieldTypes={fieldTypes}
              fieldsCategories={fieldsCategories}
              currentActiveCategory={currentActiveCategory}
              setCurrentActiveCategory={setCurrentActiveCategory} 
            />
          )}

          {/* Step 2: Field Information */}
          {currentStep === 1 && (
            <FieldInformationStep
              fieldFormData={fieldFormData}
              setFieldFormData={setFieldFormData}
              selectedFieldType={getSelectedFieldType()}
              getFieldTypeIcon={getFieldTypeIcon}
            />
          )}

          {/* Step 3: Configuration & Validation */}
          {currentStep === 2 && (
            <FieldConfigurationStep
              fieldFormData={fieldFormData}
              setFieldFormData={setFieldFormData}
              selectedFieldType={getSelectedFieldType()}
            />
          )}
        </div>

        {/* Action Buttons */}
        <FieldWizardActions 
          currentStep={currentStep}
          totalSteps={stepTitles.length}
          isSubmitting={isSubmitting}
          canProceed={canProceedToNext() }
          onPrevious={handlePrevious}
          onNext={handleNext}
          onFinish={handleFinish}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
