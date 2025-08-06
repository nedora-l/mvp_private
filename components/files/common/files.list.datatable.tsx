"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  FileIcon as FilePdf,
  FileImage,
  FileSpreadsheet,
  Clock,
  MoreHorizontal,
  FolderPlus,
  FolderIcon,
  Download,
  Share2,
  Trash2,
  Edit,
} from "lucide-react"

import { useI18n } from "@/lib/i18n/use-i18n"
import { FileDto, FileFolderDto } from "@/lib/interfaces/apis/files"
import { useState } from "react"
import { Dictionary } from "@/locales/dictionary"

const getFileIcon = (type: string) => {
  switch (type) {
    case "folder":
      return <FolderIcon className="h-5 w-5 text-yellow-500" />
    case "pdf":
      return <FilePdf className="h-5 w-5 text-red-500" />
    case "doc":
    case "docx":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "xls":
    case "xlsx":
    case "spreadsheet":
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "image":
      return <FileImage className="h-5 w-5 text-purple-500" />
    default:
      return <FileText className="h-5 w-5 text-gray-500" />
  }
}

const getFileTypeFromName = (fileName: string): string => {
  if (!fileName) return "unknown";
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) return "unknown";
  
  // Map extensions to types
  if (extension === "pdf") return "pdf";
  if (["doc", "docx"].includes(extension)) return "doc";
  if (["xls", "xlsx"].includes(extension)) return "xls";
  if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) return "image";
  return extension;
}

const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes || bytes === 0) return "-";
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

type AppComponentDictionaryProps = {
  dictionary: Dictionary;
  locale: string;
  title?: string;
  isLoading?: boolean;
  files: FileDto[];
  folders?: FileFolderDto[];
  headerButtons?: React.ReactNode[];
  onDownloadFile?: (file: FileDto) => void;
  onShareFile?: (file: FileDto) => void;
  onDeleteFile?: (file: FileDto) => void;
  onDownloadFolder?: (folder: FileFolderDto) => void;
  onShareFolder?: (folder: FileFolderDto) => void;
  onDeleteFolder?: (folder: FileFolderDto) => void;
  onEditFolder?: (folder: FileFolderDto) => void;
  handleOpenDetails?: (file: FileDto) => void;
};


export default function DocumentsFilesListDataTableComponent( { 
  dictionary, 
  title, 
  files, 
  folders, 
  headerButtons, 
  isLoading,
  onDownloadFile,
  onShareFile,
  onDeleteFile,
  onDownloadFolder,
  onShareFolder,
  onDeleteFolder,
  onEditFolder,
  handleOpenDetails
}: AppComponentDictionaryProps ) {
  const { t } = useI18n(dictionary);

  const handleFileAction = (action: string, file: FileDto) => {
    switch (action) {
      case 'download':
        onDownloadFile?.(file);
        break;
      case 'share':
        onShareFile?.(file);
        break;
      case 'delete':
        onDeleteFile?.(file);
        break;
    }
  };

  const handleFolderAction = (action: string, folder: FileFolderDto) => {
    switch (action) {
      case 'download':
        onDownloadFolder?.(folder);
        break;
      case 'share':
        onShareFolder?.(folder);
        break;
      case 'edit':
        onEditFolder?.(folder);
        break;
      case 'delete':
        onDeleteFolder?.(folder);
        break;
    }
  };

  return (
    <Card>
        {title && (
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>{title}</CardTitle>
                <div className="flex items-center space-x-2">
                    {headerButtons}
                </div>
            </CardHeader>
        )}
        <CardContent className="p-0">
            <table className="w-full">
                <thead>
                <tr className="border-b">
                    <th className="text-left p-4 font-medium">{t("documents.datatable.name") || "Name"}</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell" style={{ width: "240px" }}>{t("documents.datatable.modified") || "Last Modified"}</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell" style={{ width: "140px" }}>{t("documents.datatable.size") || "Size"}</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell" style={{ width: "140px" }}>{t("documents.datatable.author") || "Author"}</th>
                    <th className="p-4 font-medium" style={{ width: "60px" }}></th>
                </tr>
                </thead>
                <tbody>
                {isLoading && (
                    <tr   className="border-b last:border-0 hover:bg-accent/50">
                        <td className="p-4">
                            <div className="flex items-center space-x-3">
                                {getFileIcon("folder")}
                                <span className="text-xs text-muted-foreground h-3 bg-gray-200 rounded animate-pulse"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
                            </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell" style={{ width: "120px" }}>
                            <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs text-muted-foreground h-3 bg-gray-200 rounded animate-pulse"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
                            </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell" style={{ width: "120px" }}>
                            <span className="text-xs text-muted-foreground h-3 bg-gray-200 rounded animate-pulse"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
                        </td>
                        <td className="p-4 text-muted-foreground hidden lg:table-cell" style={{ width: "120px" }}>
                            <span className="text-xs text-muted-foreground h-3 bg-gray-200 rounded animate-pulse"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
                        </td>
                        <td className="p-4" style={{ width: "50px" }}>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </td>
                    </tr>
                )}

                {isLoading && (
                    <tr>
                        <td colSpan={5} className="p-4 text-center">
                            {t("loading") || "Loading..."}
                        </td>
                    </tr>
                )}                
                
                {!isLoading && folders && folders.map((folder) => (
                    <tr key={folder.id} className="border-b last:border-0 hover:bg-accent/50">
                        <td className="p-4">
                            <div className="flex items-center space-x-3">
                            {getFileIcon("folder")}
                            <span>{folder.title}</span>
                            </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">
                            <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                    {folder.updatedAt && !isNaN(Date.parse(folder.updatedAt)) 
                                    ? new Date(folder.updatedAt).toLocaleDateString() 
                                    : folder.updatedAt || "-"}
                            </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">
                            {folder.fileCount ? `${folder.fileCount} files` : "-"}
                        </td>                        
                        <td className="p-4 text-muted-foreground hidden lg:table-cell">-</td>
                        <td className="p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    
                                    <DropdownMenuItem onClick={() => handleFolderAction('download', folder)}>
                                        <Download className="h-4 w-4" />
                                        {t("documents.actions.download") || "Download"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleFolderAction('share', folder)}>
                                        <Share2 className="h-4 w-4" />
                                        {t("documents.actions.share") || "Share"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleFolderAction('edit', folder)}>
                                        <Edit className="h-4 w-4" />
                                        {t("documents.actions.edit") || "Edit"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => handleFolderAction('delete', folder)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        {t("documents.actions.delete") || "Delete"}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </td>
                    </tr>
                ))}
                
                {!isLoading && files.map((file) => (
                    <tr key={file.id} className="border-b last:border-0 hover:bg-accent/50">
                        <td className="p-4">
                            <div className="flex items-center space-x-3">
                            {getFileIcon(getFileTypeFromName(file.originalFilename || file.filePath || ""))}
                            <span>{file.originalFilename || file.filePath}</span>
                            </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">
                            <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {file.createdAt && !isNaN(Date.parse(file.createdAt)) 
                                ? new Date(file.createdAt).toLocaleDateString() 
                                : file.createdAt}
                            </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{formatFileSize(file.fileSize)}</td>                        <td className="p-4 text-muted-foreground hidden lg:table-cell">{file.createdByUsername}</td>
                        <td className="p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {handleOpenDetails && (
                                        <DropdownMenuItem onClick={() => handleOpenDetails(file)}>
                                            <FileText className="h-4 w-4" />
                                            {t("documents.actions.details") || "Details"}
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleFileAction('download', file)}>
                                        <Download className="h-4 w-4" />
                                        {t("documents.actions.download") || "Download"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleFileAction('share', file)}>
                                        <Share2 className="h-4 w-4" />
                                        {t("documents.actions.share") || "Share"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        onClick={() => handleFileAction('delete', file)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        {t("documents.actions.delete") || "Delete"}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </CardContent>
    </Card>
  )
}
