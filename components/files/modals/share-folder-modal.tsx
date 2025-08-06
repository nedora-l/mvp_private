
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
import { FileFolderDto } from "@/lib/interfaces/apis/files"
import { Dictionary } from "@/locales/dictionary"
import { useI18n } from "@/lib/i18n/use-i18n"

type ShareFolderModalProps = {
  isOpen: boolean
  onClose: () => void
  onShare: (folder: FileFolderDto, email: string) => void
  folder: FileFolderDto | null
  dictionary: Dictionary
}

export default function ShareFolderModal({
  isOpen,
  onClose,
  onShare,
  folder,
  dictionary,
}: ShareFolderModalProps) {
  const { t } = useI18n(dictionary)

  const handleShare = () => {
    if (folder) {
      // Replace with actual email input
      onShare(folder, "user@example.com")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("documents.shareFolder")}</DialogTitle>
        </DialogHeader>
        <Input placeholder="Email" />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleShare}>{t("documents.share")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
