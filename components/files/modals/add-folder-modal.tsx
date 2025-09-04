"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { FolderPlus, Loader2 } from "lucide-react"
import { Dictionary } from "@/locales/dictionary"
import { CreateFileFolderRequestDto, FileFolderDto } from "@/lib/interfaces/apis/files"
import { filesApiClient } from "@/lib/services/client/files/files.client.service"
import { getStoredToken } from "@/lib/services/auth/token-storage"
import { toast } from "sonner"

export interface AddFolderModalProps {
  dictionary: Dictionary
  isOpen: boolean;
  folders?: FileFolderDto[];
  onOpenChange: (open: boolean) => void
  parentFolderId?: string
  onFolderCreated?: (folder: any) => void
}

export function AddFolderModal({ 
  dictionary,
  folders,
  isOpen, 
  onOpenChange,
  parentFolderId,
  onFolderCreated
}: AddFolderModalProps) {
  const [formData, setFormData] = useState<CreateFileFolderRequestDto>({
    parentFolderId: parentFolderId || undefined,
    title: "",
    description: "",
    path: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof CreateFileFolderRequestDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: dictionary.documents?.folders ? "Folder name is required" : "Le nom du dossier est requis",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const token = getStoredToken()
      if (!token) {
        throw new Error("No authentication token found")
      }

      const newFolder = await filesApiClient.createNewFolder(token, formData)
      
      toast({
        title: dictionary.actions?.create || "Created",
        description: `${dictionary.documents?.folder || "Folder"} "${formData.title}" ${dictionary.actions?.create || "created successfully"}`,
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        parentFolderId: parentFolderId || undefined,
        path: ""
      })

      // Notify parent component
      if (onFolderCreated) {
        onFolderCreated(newFolder)
      }

      // Close modal
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating folder:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create folder",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form
    setFormData({
      title: "",
      description: "",
      parentFolderId: parentFolderId || undefined,
      path: ""
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            {dictionary.documents?.newFolder || "New Folder"}
          </DialogTitle>
          <DialogDescription>
            {dictionary.documents?.folders  ||  "Créer un nouveau dossier pour organiser vos documents"}
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
              value={formData.parentFolderId || ""}
              onChange={(e) => handleInputChange("parentFolderId", e.target.value)}
              disabled={isLoading}
            >
              <option value="">
                {dictionary.documents?.folders ? "Select parent folder (optional)" : "Sélectionner le dossier parent (optionnel)"}
              </option>
              {folders?.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder-title">
              {dictionary.documents?.datatable?.name || "Name"} *
            </Label>
            <Input
              id="folder-title"
              placeholder={dictionary.documents?.folder || "Folder name"}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder-description">
              {dictionary.documents?.folders 
                ? "Description (optional)" 
                : "Description (optionnel)"}
            </Label>
            <Textarea
              id="folder-description"
              placeholder={dictionary.documents?.folders 
                ? "Enter folder description..." 
                : "Entrez la description du dossier..."}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder-path">
              {dictionary.documents?.folders 
                ? "Path (optional)" 
                : "Chemin (optionnel)"}
            </Label>
            <Input
              id="folder-path"
              placeholder={dictionary.documents?.folders 
                ? "Enter folder path..." 
                : "Entrez le chemin du dossier..."}
              value={formData.path}
              onChange={(e) => handleInputChange("path", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {dictionary.actions?.cancel || "Cancel"}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {dictionary.actions?.create || "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
