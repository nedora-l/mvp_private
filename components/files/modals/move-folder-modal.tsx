
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileFolderDto } from "@/lib/interfaces/apis/files"
import { Dictionary } from "@/locales/dictionary"
import { useI18n } from "@/lib/i18n/use-i18n"

type MoveFolderModalProps = {
  isOpen: boolean
  onClose: () => void
  onMove: (folder: FileFolderDto, destination: string) => void
  folder: FileFolderDto | null
  dictionary: Dictionary
}

export default function MoveFolderModal({
  isOpen,
  onClose,
  onMove,
  folder,
  dictionary,
}: MoveFolderModalProps) {
  const { t } = useI18n(dictionary)

  const handleMove = () => {
    if (folder) {
      // Replace with actual destination logic
      onMove(folder, "new-destination")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("documents.moveFolder")}</DialogTitle>
        </DialogHeader>
        {/* Add folder tree or selection for destination */}
        <p>Select destination...</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleMove}>{t("documents.move")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
