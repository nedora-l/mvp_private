"use client"

import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n/use-i18n"
import { FileDto} from "@/lib/interfaces/apis/files"
import { Button } from "@/components/ui/button"
import {  RefreshCcw,  PlusIcon } from "lucide-react"


import { filesApiClient } from "@/lib/services/client/files/files.client.service"
import { AppComponentDictionaryPropsWithId } from "@/lib/interfaces/common/dictionary-props-component"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import DocumentComments from "./document-comments.component"
import DocumentChat from "./document-chat.component"
import DocumentAccessSharing from "./document-access-sharing.component"
import DocumentImportantNotes from "./document-important-notes.component"
import { useSession } from "next-auth/react"
 import { useAuth } from "../contexts/auth-context"
 import Link from "next/link"


export default function DocumentDetailsComponentPage( { dictionary, locale, id }: AppComponentDictionaryPropsWithId ) {
  const { t } = useI18n(dictionary);
  const { data: session, status } = useSession();
  const { logout, currentLoggedUser } = useAuth();
  const currentUser = session?.user || currentLoggedUser ;

  const [recentFiles, setRecentFiles] = useState<FileDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<FileDto | null>(null);

  //filesViewMode
  const [pageSize, setPageSize] = useState<number>(50);
  const [page, setPage] = useState<number>(1);

  // Tab state
  const [tab, setTab] = useState<string>("overview");

  const refreshAll = () => {
    console.log('refreshAll');
    getRecentFiles();
  }

  const handleFileUploaded = (files: any) => {
    console.log('Files uploaded:', files);
    // Refresh the data after successful upload
    refreshAll();
  }
  
  const refreshFile = () => {
    console.log('refreshFile', id);
    setIsLoading(true);
    setError(null);
    filesApiClient.getFileById(id)
      .then((response) => {
        console.log('File fetched:', response);
        if(response.data){
          console.log('data fetched:', response.data);
          setCurrentFile(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching file:', error);
        setError('Failed to fetch file');
      })
      .finally(() => {
        setIsLoading(false);
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

          for (const file of response.data) {
            console.log('File ID:', file.id, 'File Name:', file.filePath);
            if (file.id === id) {
              console.log('Setting current file:', file);
              setCurrentFile(file);
            }
          }
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
        <div>
          {/* File Overview: name, type, size, preview, actions */}
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-lg">{currentFile?.originalFilename || t('documents.noFileSelected')}</div>
            <div className="text-sm text-muted-foreground">{currentFile?.filePath}</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="flex items-center gap-2" aria-label="Refresh" onClick={refreshFile}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t('documents.overview') || 'Overview'}</TabsTrigger>
          {/**
          <TabsTrigger value="versions">{t('documents.versions') || 'Versions'}</TabsTrigger>
          <TabsTrigger value="derivatives">{t('documents.derivatives') || 'Derivatives'}</TabsTrigger>
          */}
          <TabsTrigger value="comments">{t('documents.commentsLabel') || 'Comments'}</TabsTrigger>

          {currentUser?.id === currentFile?.createdById && (
            <TabsTrigger value="chat">{t('documents.chatLabel') || 'Chat'}</TabsTrigger>
          )}
          
          {currentUser?.id === currentFile?.createdById && (
            <TabsTrigger value="access">{t('documents.accessSharing.title') || 'Access & Sharing'}</TabsTrigger>
          )}
          
          {currentUser?.id === currentFile?.createdById && (
            <TabsTrigger value="notes">{t('documents.notes.title') || 'Important Notes'}</TabsTrigger>
          )}

        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardContent className="p-4">
              {/* File Overview: name, type, size, preview, actions */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 mt-2">
                  {/* Add file type, size, owner, upload date, etc. */}
                  <span>{t('documents.type')}: {currentFile?.typeTitle}</span>
                  <span>{t('documents.size')}: {currentFile?.fileSize}</span>
                  <span>{t('documents.owner')}: {currentFile?.createdByUsername}</span>
                  <span>{t('documents.uploaded')}: {currentFile?.createdAt}</span>
                </div>
                {/* Preview (image/pdf/text) if possible */}
                <div className="mt-4">
                  {/* TODO: File preview component */}
                  <div className="bg-muted rounded p-4 text-center text-muted-foreground">

                    {currentFile?.id && (<iframe
                      src={`/api/v1/files/${currentFile.id}/download` }
                      className="w-full h-96 "
                      title={currentFile?.originalFilename || 'File Preview'} 
                    >
                      {t('documents.previewUnavailable') || 'Preview not available'}
                    </iframe>)}
                    
                    {!currentFile?.downloadUrl && (
                      <div className="text-muted-foreground">
                        {t('documents.noPreviewAvailable') || 'No preview available'}
                      </div>
                    )}

                  </div>
                </div>
                {/* Quick actions: download, share, delete, etc. */}
                {currentUser && currentFile && currentUser?.id === currentFile?.createdById && (
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => setTab('access')} size="sm" variant="outline">{t('documents.share') || 'Share'}</Button>
                    <Link href={`/api/v1/files/${currentFile?.id}/download`} download  target="_blank" className="flex items-center">
                      <Button size="sm" >{t('documents.download') || 'Download'}</Button>
                    </Link>
                    <Button size="sm" variant="destructive">{t('documents.delete') || 'Delete'}</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments">
          <DocumentComments 
            dictionary={dictionary} 
            locale={locale} 
            documentId={id} 
            currentFile={currentFile}
          />
        </TabsContent>

        {currentUser?.id === currentFile?.createdById && (
          <TabsContent value="chat">
            <DocumentChat 
              dictionary={dictionary} 
              locale={locale} 
                documentId={id} 
                currentFile={currentFile}
              />
          </TabsContent>
        )}
          
        {currentUser?.id === currentFile?.createdById && (
          <TabsContent value="access">
            <DocumentAccessSharing 
              dictionary={dictionary} 
              locale={locale} 
              id={id} 
              currentFile={currentFile}
            />
          </TabsContent>
        )}
        
        {currentUser?.id === currentFile?.createdById && (
          <TabsContent value="notes">
            <DocumentImportantNotes 
              dictionary={dictionary} 
              locale={locale} 
              id={id} 
              currentFile={currentFile}
            />
          </TabsContent>
        )}
        
        
        
      </Tabs>
    </div>
  )
}



/**{currentFile?.downloadUrl && (<iframe
                      src={currentFile?.downloadUrl || '#'}
                      className="w-full h-96 "
                      title={currentFile?.originalFilename || 'File Preview'} 
                    >
                      {t('documents.previewUnavailable') || 'Preview not available'}
                    </iframe>)} */