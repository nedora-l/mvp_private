"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  MoreHorizontal,
  FolderIcon,
  Download,
  Share2,
  Trash2,
  Edit,
  TextCursor,
  Move,
} from "lucide-react"

import { useI18n } from "@/lib/i18n/use-i18n"
import { FileFolderDto } from "@/lib/interfaces/apis/files"
import { Dictionary } from "@/locales/dictionary"


type AppComponentDictionaryProps = {
  dictionary: Dictionary;
  locale: string;
  isLoading?: boolean;
  folder?: FileFolderDto;
  onDownloadFolder?: (folder: FileFolderDto) => void;
  onShareFolder?: (folder: FileFolderDto) => void;
  onDeleteFolder?: (folder: FileFolderDto) => void;
  onEditFolder?: (folder: FileFolderDto) => void;
  onMoveFolder?: (folder: FileFolderDto) => void;
  isSelected?: boolean;
  onSelect?: (folderId?: string | undefined) => void;
};


export default function DocumentsFileFolderComponent( { 
  dictionary, 
  folder, 
  isLoading,
  onDownloadFolder,
  onShareFolder,
  onDeleteFolder,
  onEditFolder,
  onMoveFolder,
  isSelected,
  onSelect
}: AppComponentDictionaryProps ) {
    console.log('DocumentsFileFolderComponent folder ID:', folder , 'isSelected:', isSelected, 'onSelect:', onSelect);



  const { t } = useI18n(dictionary);

  const handleFolderAction = (action: string, folder: FileFolderDto) => {
    switch (action) {
      case 'select':
        handleCardClick();
        break;
      case 'download':
        onDownloadFolder?.(folder);
        break;
      case 'share':
        onShareFolder?.(folder);
        break;
      case 'edit':
        onEditFolder?.(folder);
        break;
      case 'move':
        onMoveFolder?.(folder);
        break;
      case 'delete':
        onDeleteFolder?.(folder);
        break;
    }
  };

  const handleCardClick = () => {
    console.log("Card clicked", folder, onSelect);
    if (folder && onSelect) {
      onSelect(folder.id);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className={`transition-all duration-200 ease-in-out cursor-pointer rounded-xl border ${
              isSelected 
                ? 'border-l-4 border-primary bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/50 dark:to-blue-900/50' 
                : 'border-transparent bg-muted  hover:bg-muted'
            }`}
            onDoubleClickCapture={handleCardClick}
          >
            <CardContent className="p-2 flex items-center justify-between">
              <div className="flex items-center space-x-3 ">
                <FolderIcon className="h-6 w-6 text-primary nowrap" />
                <h4 className="font-medium">{folder?.title}</h4>
              </div>
              {folder && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleFolderAction('select', folder)}>
                      <TextCursor className="mr-2 h-4 w-4" />
                      <span>{t("documents.actions.select") || "Select"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFolderAction('download', folder)}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>{t("documents.actions.download") || "Download"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFolderAction('share', folder)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>{t("documents.actions.share") || "Share"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFolderAction('edit', folder)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>{t("documents.actions.rename") || "Rename"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFolderAction('move', folder)}>
                      <Move className="mr-2 h-4 w-4" />
                      <span>{t("documents.actions.move") || "Move"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => handleFolderAction('delete', folder)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{t("documents.actions.delete") || "Delete"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm text-muted-foreground">
              {folder?.fileCount || 0 } {t("documents.files") || "Files"}
              &nbsp; • &nbsp;
              <span title={t("documents.updated") || "Updated"}>
                  {folder?.updatedAt && !isNaN(Date.parse(folder?.updatedAt)) 
                      ? new Date(folder?.updatedAt).toLocaleDateString() 
                      : folder?.updatedAt || "-"}
              </span>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
