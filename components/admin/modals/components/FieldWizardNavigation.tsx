'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"

interface FieldWizardNavigationProps {
  currentStep: number
  totalSteps: number
  isSubmitting: boolean
  canProceed: boolean
  onPrevious: () => void
  onNext: () => void
  onFinish: () => void
  onCancel: () => void
  editingField: boolean
}

export function FieldWizardNavigation({
  currentStep,
  totalSteps,
  isSubmitting,
  canProceed,
  onPrevious,
  onNext,
  onFinish,
  onCancel,
  editingField,
}: FieldWizardNavigationProps) {
  return (
    <div className="flex justify-between pt-6 border-t">
      <div>
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button onClick={onNext} disabled={!canProceed || isSubmitting}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={onFinish} disabled={!canProceed || isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting
              ? editingField
                ? "Updating..."
                : "Creating..."
              : editingField
              ? "Update Field"
              : "Create Field"}
          </Button>
        )}
      </div>
    </div>
  )
}
