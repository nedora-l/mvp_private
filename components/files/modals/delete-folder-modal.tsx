
"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileFolderDto } from "@/lib/interfaces/apis/files"
import { Dictionary } from "@/locales/dictionary"
import { useI18n } from "@/lib/i18n/use-i18n"

type DeleteFolderModalProps = {
  isOpen: boolean
  onClose: () => void
  onDelete: (folder: FileFolderDto) => void
  folder: FileFolderDto | null
  dictionary: Dictionary
}

export default function DeleteFolderModal({
  isOpen,
  onClose,
  onDelete,
  folder,
  dictionary,
}: DeleteFolderModalProps) {
  const { t } = useI18n(dictionary)

  const handleDelete = () => {
    if (folder) {
      onDelete(folder)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("documents.deleteFolder")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("documents.deleteFolderConfirmation")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction color="destructive" onClick={handleDelete}>
            {t("documents.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
