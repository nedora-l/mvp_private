"use client"

import { cn } from "@/lib/utils"

interface PasswordStrengthMeterProps {
  score: number
  feedback: string
}

export function PasswordStrengthMeter({ score, feedback }: PasswordStrengthMeterProps) {
  // Calculate the width of the strength bar based on the score (0-5)
  const strengthPercentage = Math.min(100, (score / 5) * 100)
  
  // Determine color based on score
  const strengthBarColor = () => {
    if (score >= 4) return "bg-success"
    if (score >= 2) return "bg-warning"
    return "bg-destructive"
  }
  
  return (
    <div className="mt-1 space-y-1">
      <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
        <div 
          className={cn("h-full transition-all duration-300", strengthBarColor())}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{feedback}</p>
    </div>
  )
}