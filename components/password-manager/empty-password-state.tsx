"use client"

import { Dictionary } from "@/locales/dictionary"
import { Button } from "@/components/ui/button"
import { Plus, KeyRound } from "lucide-react"

interface EmptyPasswordStateProps {
  dictionary: Dictionary
}

export function EmptyPasswordState({ dictionary }: EmptyPasswordStateProps) {
  const dict = dictionary.passwordManager

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-lg bg-muted/10">
      <div className="rounded-full bg-muted p-6 mb-4">
        <KeyRound className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{dict.empty.title}</h3>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        {dict.empty.description}
      </p>
      <Button>
        <Plus className="mr-2 h-4 w-4" /> {dict.empty.action}
      </Button>
    </div>
  )
}