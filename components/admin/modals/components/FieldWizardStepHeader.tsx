"use client"

import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface FieldWizardStepHeaderProps {
  currentStep: number
  stepTitles: string[]
  editingField: boolean
}

export function FieldWizardStepHeader({
  currentStep,
  stepTitles,
  editingField,
}: FieldWizardStepHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        {editingField ? "Edit Field" : "Create New Field"}
        <Badge variant="outline" className="ml-auto">
          Step {currentStep + 1} of {stepTitles.length}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{stepTitles[currentStep]}</p>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between my-6">
        {stepTitles.map((title, index) => (
          <div key={index} className="flex items-center flex-1">
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2
                ${
                  index <= currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                }
              `}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div className="flex-1 ml-3">
              <div
                className={`text-sm font-medium ${
                  index === currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {title}
              </div>
            </div>
            {index < stepTitles.length - 1 && (
              <div
                className={`flex-1 h-px mx-4 ${
                  index < currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
