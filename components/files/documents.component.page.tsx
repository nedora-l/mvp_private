"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n/use-i18n"
import { Dictionary } from "@/locales/dictionary"
import { FileDto, FileFolderDto, UpdateFileFolderRequestDto } from "@/lib/interfaces/apis/files"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Trash2, Share2, Download, X, FolderPlus, Upload, RefreshCcw, FileText, Move,  PlusIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {AddFolderModal,AddFileModal} from "./modals"
import RenameFolderModal from "./modals/rename-folder-modal"
import MoveFolderModal from "./modals/move-folder-modal"
import DeleteFolderModal from "./modals/delete-folder-modal"
import ShareFolderModal from "./modals/share-folder-modal"
import DownloadFolderModal from "./modals/download-folder-modal"

import DocumentsFileFolderComponent from "./common/file.folder.item"
import { Skeleton } from "@/components/ui/skeleton"
import { filesApiClient } from "@/lib/services/client/files/files.client.service"
import DocumentsFilesListDataTableComponent from "./common/files.list.datatable"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type AppComponentDictionaryProps = {
  dictionary: Dictionary;
  locale: string;
}

export default function DocumentsComponentPage( { dictionary, locale }: AppComponentDictionaryProps ) {
  const { t } = useI18n(dictionary);

  const [rootFolders, setRootFolders] = useState<FileFolderDto[]>([]);
  const [recentFiles, setRecentFiles] = useState<FileDto[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingFolders, setIsLoadingFolders] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const [currentFoldersCount, setCurrentFoldersCount] = useState<number>(5);

  //filesViewMode
  const [filesViewMode, setFilesViewMode] = useState<'grid' | 'table'>('grid');
  const [pageSize, setPageSize] = useState<number>(50);
  const [page, setPage] = useState<number>(1);

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState<boolean>(false);
  const [currentParentFolderId, setCurrentParentFolderId] = useState<string | undefined>(undefined);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [currentFolder, setCurrentFolder] = useState<FileFolderDto | null>(null);

  const handleSelectFolder = (folderId?: string | undefined) => {
    console.log('handleSelectFolder', folderId);
    if (!folderId) return; // Early return if folderId is undefined or empty
    
    setSelectedFolders((prevSelected) => {
      if (prevSelected.includes(folderId)) {
        return prevSelected.filter((id) => id !== folderId);
      } else {
        return [...prevSelected, folderId];
      }
    });
  };

  const handleOpenRenameModal = (folder: FileFolderDto) => {
    setCurrentFolder(folder);
    setIsRenameModalOpen(true);
  };

  const handleOpenMoveModal = (folder: FileFolderDto) => {
    setCurrentFolder(folder);
    setIsMoveModalOpen(true);
  };

  const handleOpenDeleteModal = (folder: FileFolderDto) => {
    setCurrentFolder(folder);
    setIsDeleteModalOpen(true);
  };

  const handleOpenShareModal = (folder: FileFolderDto) => {
    setCurrentFolder(folder);
    setIsShareModalOpen(true);
  };

  const handleOpenDownloadModal = (folder: FileFolderDto) => {
    setCurrentFolder(folder);
    setIsDownloadModalOpen(true);
  };

  
  const handleOpenDetails = (file: FileDto) => {
    console.log('Opening details for file:', file);
    // Navigate to file details page
    window.location.href = `/app/documents/${file.id}`;
  };

  const handleRenameFolder = (folder: FileFolderDto, newName: string) => {
    console.log('Renaming folder', folder, 'to', newName);
    // API call to rename folder
    //UpdateFileFolderRequestDto
    const updateFolderRequest = {
      id: folder.id,
      title: newName
    } as UpdateFileFolderRequestDto;
    if(folder.id !== undefined && folder.id !== null){
      filesApiClient.updateFileFolder(folder.id , updateFolderRequest)
      .then(() => {
        console.log('Folder renamed successfully');
      })
      .catch((error) => {
        console.error('Error renaming folder:', error);
      })
      .finally(() => {
        setCurrentFolder(null);
      });
    }
    setIsRenameModalOpen(false);
    
    refreshRootFolders();
  };

  const handleMoveFolder = (folder: FileFolderDto, destination: string) => {
    console.log('Moving folder', folder, 'to', destination);
    // API call to move folder
    setIsMoveModalOpen(false);
    refreshRootFolders();
  };

  const handleDeleteFolder = (folder: FileFolderDto) => {
    console.log('Deleting folder', folder);
    // API call to delete folder
    if(folder.id !== undefined && folder.id !== null){
      filesApiClient.deleteFileFolder(folder.id)
      .then(() => {
        console.log('Folder deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting folder:', error);
      })
      .finally(() => {
        setCurrentFolder(null);
      });
    }
    setIsDeleteModalOpen(false);
    refreshRootFolders();
  };

  const handleShareFolder = (folder: FileFolderDto, email: string) => {
    console.log('Sharing folder', folder, 'with', email);
    // API call to share folder
    setIsShareModalOpen(false);
  };

  const handleDownloadFolder = (folder: FileFolderDto) => {
    console.log('Downloading folder', folder);
    // Logic to download folder
    setIsDownloadModalOpen(false);
  };

  const clearSelection = () => {
    setSelectedFolders([]);
  };

  const refreshAll = () => {
    console.log('refreshAll');
    refreshRootFolders();
    getRecentFiles();
  }

  const handleFileUploaded = (files: any) => {
    console.log('Files uploaded:', files);
    // Refresh the data after successful upload
    refreshAll();
  }

  const handleFolderCreated = (folder: any) => {
    console.log('Folder created:', folder);
    // Refresh the data after successful folder creation
    refreshRootFolders();
  }

  const openUploadModal = (parentFolderId?: string) => {
    setCurrentParentFolderId(parentFolderId);
    setIsUploadModalOpen(true);
  }

  const openFolderModal = (parentFolderId?: string) => {
    setCurrentParentFolderId(parentFolderId);
    setIsFolderModalOpen(true);
  }

  const refreshRootFolders = () => {
    console.log('refreshRootFolders');
    setIsLoadingFolders(true);
    setError(null);
    filesApiClient.getRootFolders({ page : page, size: pageSize })
      .then((response) => {
        console.log('Folders fetched:', response);
        if(response.data)
        {
          console.log('data fetched:', response.data);
          setRootFolders(response.data || []);
          setCurrentFoldersCount((response.data || []).length);
        }
        setIsLoadingFolders(false);

      })
      .catch((error) => {
        console.error('Error fetching folders:', error);

        setError('Failed to fetch folders');
      })
      .finally(() => {
        setIsLoadingFolders(false);
      });
  };

  const refreshFiles = () => {
    console.log('refreshFiles');
    setIsLoading(true);
    setError(null);
    filesApiClient.getRecentFiles({ page : page, size: pageSize })
      .then((response) => {
        console.log('Recent files fetched:', response);
        if(response.data){
          console.log('data fetched:', response.data);
          setRecentFiles(response.data || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching folders:', error);
        setError('Failed to fetch folders');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  const getRecentFiles = () => {
    console.log('getRecentFiles');
     refreshFiles();
  };
  
  useEffect(() => {
    if(rootFolders.length > 0) {
      console.log('Chat sessions:', rootFolders);
    }
    else {
      console.log('No root folders available');
      refreshRootFolders();
    }
  }, [rootFolders,pageSize,page]);

  useEffect(() => {
    if(recentFiles.length > 0) {
      console.log('recentFiles:', recentFiles);
    }
    else {
      console.log('No  recentFiles available');
      getRecentFiles();
    }
  }, [recentFiles]);

  return (
    <div className="space-y-6 p-4 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('documents.title')}</h1>
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="flex items-center gap-2" aria-label="Refresh" onClick={refreshAll}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <div>
              <DropdownMenu  >
                  <DropdownMenuTrigger asChild>
                      <Button  size="sm"   className="flex items-center space-x-2">
                          <PlusIcon className="h-5 w-5" />
                          <span>New</span>
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem  onClick={() => openFolderModal()}>
                          <FolderPlus className="mr-3 h-5 w-5" />
                          <span>{t("documents.newFolder") || "New Folder"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openUploadModal()}>
                          <Upload className="mr-3 h-5 w-5" />
                          <span>{t("documents.newFile") || "Upload"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openUploadModal()}>
                          <Upload className="mr-3 h-5 w-5" />
                          <span>Folder Upload</span>
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          </div>
          
        </div>
      </div>


      {/* Files and Folders filters (Google Drive like filters) */}


      {/* Selection bar for multiple folders */}
      {selectedFolders.length > 0 && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 p-2 rounded-full shadow-lg bg-background border">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={clearSelection} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                    <span className="font-semibold text-sm pr-2 border-r">{selectedFolders.length} selected</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('documents.actions.share')}
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {t('documents.actions.download')}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('documents.actions.delete')}
                    </Button>
                </div>
            </div>
        </div>
      )}

        <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder={t("documents.search.placeholder") || "Search documents..."} className="pl-8" />
        </div>
        <Button variant="outline" className="flex items-center gap-2" aria-label={t("documents.filters") || "Filters"}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      
      <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold mb-4"> {t("documents.folders") || "Folders"} </h2>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" className="flex items-center gap-2" aria-label="Refresh" onClick={refreshRootFolders}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoadingFolders && (
              [...Array(currentFoldersCount || 4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)
            )}
            { !isLoadingFolders && rootFolders.map((folder) => (
                <div className="mb-2">
                  <DocumentsFileFolderComponent
                  key={folder.id}
                  dictionary={dictionary}
                  locale={locale}
                  folder={folder}
                  isSelected={selectedFolders.includes(folder.id || '')}
                  onSelect={handleSelectFolder}
                  onEditFolder={handleOpenRenameModal}
                  onDeleteFolder={handleOpenDeleteModal}
                  onShareFolder={handleOpenShareModal}
                  onDownloadFolder={handleOpenDownloadModal}
                />
                </div>
              ))}
          </div>
      </div>

      
      <div className="mb-8">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4"> {t("documents.files") || "Files"} </h2>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" className="flex items-center gap-2" aria-label="Refresh" onClick={getRecentFiles}>
                  <RefreshCcw className="h-4 w-4" />
                </Button>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant={filesViewMode === 'grid' ? 'default' : 'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => setFilesViewMode('grid')}
                    aria-label="Grid View"
                  >
                    <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                      <div className="bg-current w-1 h-1 rounded-[1px]"></div>
                      <div className="bg-current w-1 h-1 rounded-[1px]"></div>
                      <div className="bg-current w-1 h-1 rounded-[1px]"></div>
                      <div className="bg-current w-1 h-1 rounded-[1px]"></div>
                    </div>
                  </Button>
                  <Button
                    size="sm"
                    variant={filesViewMode === 'table' ? 'default' : 'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => setFilesViewMode('table')}
                    aria-label="Table View"
                  >
                    <div className="flex flex-col gap-0.5 w-3 h-3">
                      <div className="bg-current w-full h-0.5 rounded-[1px]"></div>
                      <div className="bg-current w-full h-0.5 rounded-[1px]"></div>
                      <div className="bg-current w-full h-0.5 rounded-[1px]"></div>
                    </div>
                  </Button>
                </div>
              </div>
          </div>

          <div className="w-full">
              { filesViewMode === 'grid' && !isLoading && (
                <div className="mb-8">
                  <DocumentsFilesListDataTableComponent 
                      handleOpenDetails={handleOpenDetails}
                      isLoading={isLoading}
                      dictionary={dictionary}
                      locale={locale}
                      files={recentFiles}
                    /> 
                </div>
              )}
              { filesViewMode === 'table' && !isLoading && (
                <div className="mb-8">
                  <DocumentsFilesListDataTableComponent
                      handleOpenDetails={handleOpenDetails}
                      isLoading={isLoading}
                      dictionary={dictionary}
                      locale={locale}
                      title={t("documents.recentFiles") || "Recent Files"}
                      files={recentFiles}
                    /> 
                </div>
              )}
          </div>
      </div>
 
      {/* Modals */}
      <AddFileModal
        dictionary={dictionary}
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        parentFolderId={currentParentFolderId}
        onFileUploaded={handleFileUploaded}
      />
      
      <AddFolderModal
        dictionary={dictionary}
        isOpen={isFolderModalOpen}
        onOpenChange={setIsFolderModalOpen}
        parentFolderId={currentParentFolderId}
        onFolderCreated={handleFolderCreated}
        folders={rootFolders}
      />


      {
        isRenameModalOpen && currentFolder !== null && (
          <RenameFolderModal
            isOpen={isRenameModalOpen}
            onClose={() => setIsRenameModalOpen(false)}
            onRename={handleRenameFolder}
            folder={currentFolder}
            dictionary={dictionary}
          />
        )
      }
      

      <MoveFolderModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        onMove={handleMoveFolder}
        folder={currentFolder}
        dictionary={dictionary}
      />

      <DeleteFolderModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteFolder}
        folder={currentFolder}
        dictionary={dictionary}
      />

      <ShareFolderModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={handleShareFolder}
        folder={currentFolder}
        dictionary={dictionary}
      />

      <DownloadFolderModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownloadFolder}
        folder={currentFolder}
        dictionary={dictionary}
      />
    </div>
  )
}
