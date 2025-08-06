
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { FileFolderDto } from "@/lib/interfaces/apis/files"
import { Dictionary } from "@/locales/dictionary"
import { useI18n } from "@/lib/i18n/use-i18n"

type RenameFolderModalProps = {
  isOpen: boolean
  onClose: () => void
  onRename: (folder: FileFolderDto, newName: string) => void
  folder: FileFolderDto 
  dictionary: Dictionary
}

export default function RenameFolderModal({
  isOpen,
  onClose,
  onRename,
  folder,
  dictionary,
}: RenameFolderModalProps) {
    console.log("RenameFolderModal rendered",folder) // Debugging line
  const { t } = useI18n(dictionary)
  const [newName, setNewName] = useState(folder.title || "")

  const handleRename = () => {
    if (folder && newName) {
      onRename(folder, newName)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("documents.renameFolder")}</DialogTitle>
        </DialogHeader>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={t("documents.newFolderName")}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleRename}>{t("documents.rename")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
