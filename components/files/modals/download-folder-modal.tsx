
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

type DownloadFolderModalProps = {
  isOpen: boolean
  onClose: () => void
  onDownload: (folder: FileFolderDto) => void
  folder: FileFolderDto | null
  dictionary: Dictionary
}

export default function DownloadFolderModal({
  isOpen,
  onClose,
  onDownload,
  folder,
  dictionary,
}: DownloadFolderModalProps) {
  const { t } = useI18n(dictionary)

  const handleDownload = () => {
    if (folder) {
      onDownload(folder)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("documents.downloadFolder")}</DialogTitle>
        </DialogHeader>
        <p>{t("documents.downloadConfirmation")}</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleDownload}>{t("documents.download")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
