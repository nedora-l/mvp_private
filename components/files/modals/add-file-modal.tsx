"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Upload, 
  FileText, 
  FileImage, 
  FileSpreadsheet, 
  Loader2,
  X,
  File,
  FileQuestionIcon
} from "lucide-react"
import { Dictionary } from "@/locales/dictionary"
import { useToast } from "@/hooks/use-toast"
import { getStoredToken } from "@/lib/services/auth/token-storage"
import { FileFolderDto } from "@/lib/interfaces/apis"

export interface AddFileModalProps {
  dictionary: Dictionary
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  parentFolderId?: string
  parentFolders?: FileFolderDto[] 
  onFileUploaded?: (file: any) => void
}

interface FilePreview {
  file: File
  preview?: string
  type: string
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "application/pdf":
      return <FileQuestionIcon className="h-8 w-8 text-red-500" />
    case "image/jpeg":
    case "image/png":
    case "image/gif":
    case "image/webp":
      return <FileImage className="h-8 w-8 text-purple-500" />
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <FileText className="h-8 w-8 text-blue-500" />
    default:
      return <File className="h-8 w-8 text-gray-500" />
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function AddFileModal({ 
  dictionary, 
  isOpen, 
  onOpenChange,
  parentFolders,
  parentFolderId,
  onFileUploaded
}: AddFileModalProps) {

//  handleFileFolderInputChange
  const [selectedFileParentFolder, setSelectedFileParentFolder] = useState<string | null>(parentFolderId || null)
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"browse" | "drag">("browse")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles: FilePreview[] = []
    
    Array.from(files).forEach((file) => {
      // Create preview for images
      let preview: string | undefined
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file)
      }

      newFiles.push({
        file,
        preview,
        type: file.type
      })
    })

    setSelectedFiles(prev => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev]
      // Revoke object URL to prevent memory leaks
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: dictionary.documents?.files ? "Please select at least one file" : "Veuillez sélectionner au moins un fichier",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {      // Implement the actual file upload logic
      const formData = new FormData()
       

      if (parentFolderId) {
        formData.append('parentFolderId', parentFolderId)
      }

      // Upload files to the API
      const response = await fetch('/api/v1/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${getStoredToken()}`,
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Upload failed')
      }

      const result = await response.json();

      toast({
        title: dictionary.actions?.upload || "Uploaded",
        description: result.message || `${selectedFiles.length} ${dictionary.documents?.files || "files"} ${dictionary.actions?.upload || "uploaded successfully"}`,
      })

      // Cleanup previews
      selectedFiles.forEach(filePreview => {
        if (filePreview.preview) {
          URL.revokeObjectURL(filePreview.preview)
        }
      })

      // Reset form
      setSelectedFiles([])

      // Notify parent component
      if (onFileUploaded) {
        onFileUploaded(result.data)
      }

      // Close modal
      onOpenChange(false)
    } catch (error) {
      console.error('Error uploading files:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Cleanup previews
    selectedFiles.forEach(filePreview => {
      if (filePreview.preview) {
        URL.revokeObjectURL(filePreview.preview)
      }
    })
    setSelectedFiles([])
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {dictionary.actions?.upload || "Upload Files"}
          </DialogTitle>
          <DialogDescription>
            {dictionary.documents?.files 
              ? "Select files to upload to your document library" 
              : "Sélectionnez des fichiers à télécharger dans votre bibliothèque de documents"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parent-folder">
              {dictionary.documents?.datatable?.folder || "Parent Folder"}
            </Label>
            <select
              title="Select parent folder"
              id="parent-folder"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedFileParentFolder || ""}
              onChange={(e) => setSelectedFileParentFolder(e.target.value)}
              disabled={isLoading}
            >
              <option value="">
                {dictionary.documents?.folders ? "Select parent folder (optional)" : "Sélectionner le dossier parent (optionnel)"}
              </option>
              {parentFolders?.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.title}
                </option>
              ))}
            </select>
          </div>
          {/* Upload Method Selection */}
          <div className="space-y-2">
            <Label>
              {dictionary.documents?.files 
                ? "Upload Method" 
                : "Méthode de téléchargement"}
            </Label>
            <Select value={uploadMethod} onValueChange={(value: "browse" | "drag") => setUploadMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="browse">
                  {dictionary.documents?.files ? "Browse Files" : "Parcourir les fichiers"}
                </SelectItem>
                <SelectItem value="drag">
                  {dictionary.documents?.files ? "Drag & Drop" : "Glisser-déposer"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            {uploadMethod === "browse" ? (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {dictionary.documents?.files ? "Choose Files" : "Choisir des fichiers"}
                </Button>
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp"
                />
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  {dictionary.documents?.files 
                    ? "Drag files here or click to browse" 
                    : "Glissez les fichiers ici ou cliquez pour parcourir"}
                </p>
                <p className="text-sm text-gray-500">
                  {dictionary.documents?.files 
                    ? "Supports: PDF, DOC, XLS, Images" 
                    : "Formats supportés : PDF, DOC, XLS, Images"}
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp"
                />
              </div>
            )}
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>
                {dictionary.documents?.files 
                  ? `Selected Files (${selectedFiles.length})` 
                  : `Fichiers sélectionnés (${selectedFiles.length})`}
              </Label>
              <div className="max-h-40 overflow-y-auto space-y-2 p-2 border rounded-lg">
                {selectedFiles.map((filePreview, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    {filePreview.preview ? (
                      <img 
                        src={filePreview.preview} 
                        alt={filePreview.file.name}
                        className="h-8 w-8 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(filePreview.type)
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {filePreview.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(filePreview.file.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {dictionary.actions?.cancel || "Cancel"}
            </Button>
            <Button type="submit" disabled={isLoading || selectedFiles.length === 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dictionary.actions?.upload || "Upload"} ({selectedFiles.length})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
