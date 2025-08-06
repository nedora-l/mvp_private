"use client"

import { Button } from "@/components/ui/button"
import { Save, ChevronRight, ChevronLeft, X } from "lucide-react"

interface FieldWizardActionsProps {
  currentStep: number
  totalSteps: number
  isSubmitting: boolean
  canProceed: boolean
  onPrevious: () => void
  onNext: () => void
  onFinish: () => void
  onCancel: () => void
}

export function FieldWizardActions({
  currentStep,
  totalSteps,
  isSubmitting,
  canProceed,
  onPrevious,
  onNext,
  onFinish,
  onCancel,
}: FieldWizardActionsProps) {
  return (
    <div className="flex justify-between pt-6 border-t">
      <div>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          type="button"
        >
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </div>
      
      <div className="flex space-x-2">
        {currentStep > 0 && (
          <Button 
            variant="outline" 
            onClick={onPrevious} 
            disabled={isSubmitting}
            type="button"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        )}
        
        {currentStep < totalSteps - 1 && (
          <Button 
            onClick={onNext} 
            disabled={!canProceed || isSubmitting}
            type="button"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        
        {currentStep === totalSteps - 1 && (
          <Button 
            onClick={onFinish} 
            disabled={!canProceed || isSubmitting}
            type="submit" // Assuming this is the final submit
          >
            <Save className="mr-2 h-4 w-4" /> {isSubmitting ? "Saving..." : "Finish & Save"}
          </Button>
        )}
      </div>
    </div>
  )
}
