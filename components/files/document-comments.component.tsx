"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/use-i18n"
import { FileDto, FileCommentDto, CreateFileCommentRequestDto, UpdateFileCommentRequestDto } from "@/lib/interfaces/apis/files"
import { filesApiClient } from "@/lib/services/client/files/files.client.service"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Send, 
  Reply, 
  MoreVertical, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AppComponentDictionaryPropsWithId } from "@/lib/interfaces/common/dictionary-props-component"

interface DocumentCommentsProps extends Omit<AppComponentDictionaryPropsWithId, 'id'> {
  documentId: string
  currentFile: FileDto | null
}

// Extend FileCommentDto with UI-specific properties
interface CommentWithUIState extends FileCommentDto {
  isExpanded?: boolean
  replies?: CommentWithUIState[]
}

export default function DocumentComments({ 
  dictionary, 
  locale, 
  documentId, 
  currentFile 
}: DocumentCommentsProps) {
  const { t } = useI18n(dictionary)
  const [comments, setComments] = useState<CommentWithUIState[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Load comments when component mounts or documentId changes
  useEffect(() => {
    loadComments()
  }, [documentId])

  const loadComments = async () => {
    if (!documentId) return
    
    setIsLoadingComments(true)
    setError(null)
    
    try {
      const response = await filesApiClient.getFileCommentsWithRepliesOptimized(documentId, {
        page: 0,
        size: 50,
        sortBy: 'createdAt',
        sortDir: 'desc'
      })
      
      if (response.data) {
        const commentsWithUIState: CommentWithUIState[] = response.data.map(comment => ({
          ...comment,
          isExpanded: true,
          replies: comment.replies?.map(reply => ({
            ...reply,
            isExpanded: true
          })) || []
        }))
        
        setComments(commentsWithUIState)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
      setError('Failed to load comments')
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !documentId) return

    setIsLoading(true)
    setError(null)

    try {
      const commentData: CreateFileCommentRequestDto = {
        fileId: documentId,
        content: newComment.trim()
      }

      const response = await filesApiClient.createFileComment(documentId, commentData)
      
      if (response.data) {
        // Add the new comment to the top of the list
        const newCommentWithUIState: CommentWithUIState = {
          ...response.data,
          isExpanded: true,
          replies: []
        }
        
        setComments(prev => [newCommentWithUIState, ...prev])
        setNewComment("")
      }
    } catch (error) {
      console.error('Error creating comment:', error)
      setError('Failed to create comment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddReply = async (commentId: string) => {
    if (!replyContent.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const replyData: CreateFileCommentRequestDto = {
        fileId: documentId,
        content: replyContent.trim()
      }

      const response = await filesApiClient.replyToComment(commentId, replyData)
      
      if (response.data) {
        // Add the new reply to the comment
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                replies: [...(comment.replies || []), { ...response.data, isExpanded: true } as CommentWithUIState], 
                isExpanded: true 
              }
            : comment
        ))
        
        setReplyContent("")
        setReplyingTo(null)
      }
    } catch (error) {
      console.error('Error creating reply:', error)
      setError('Failed to create reply')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId)
    if (comment) {
      setEditingComment(commentId)
      setEditContent(comment.content)
    }
  }

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const updateData: UpdateFileCommentRequestDto = {
        content: editContent.trim()
      }

      const response = await filesApiClient.updateComment(commentId, updateData)
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, ...response.data }
          : comment
      ))
      
      setEditingComment(null)
      setEditContent("")
    } catch (error) {
      console.error('Error updating comment:', error)
      setError('Failed to update comment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleExpand = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, isExpanded: !comment.isExpanded }
        : comment
    ))
  }

  const handleDeleteComment = async (commentId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await filesApiClient.deleteComment(commentId)
      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
      setError('Failed to delete comment')
    } finally {
      setIsLoading(false)
    }
  }

  const sortedComments = [...comments].sort((a, b) => {
    // Sort by creation date, newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
 

  const getAuthorInitials = (username:string ) => {
    return  username[0]?.toUpperCase() || 'U'
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t('documents.commentsLabel') || 'Comments'}
          <Badge variant="secondary">{comments.length}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Add new comment */}
        <div className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('documents.comments.addPlaceholder') || 'Add a comment...'}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Comments list */}
        <ScrollArea className="flex-1">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          {isLoadingComments ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50 animate-pulse" />
              <p>Loading comments...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedComments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{t('documents.comments.empty') || 'No comments yet'}</p>
                  <p className="text-sm">{t('documents.comments.emptyHint') || 'Be the first to share your thoughts!'}</p>
                </div>
              ) : (
                sortedComments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.createdByAvatar || ''} alt={comment.createdByName} />
                            <AvatarFallback>
                              {getAuthorInitials(comment.createdByUsername || "U")}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {comment.createdByName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.createdAt)}
                                </span>
                                {comment.updatedAt !== comment.createdAt && (
                                  <span className="text-xs text-muted-foreground italic">
                                    edited
                                  </span>
                                )}
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditComment(comment.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            
                            {editingComment === comment.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="min-h-[60px] resize-none"
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleSaveEdit(comment.id)}
                                    disabled={!editContent.trim() || isLoading}
                                  >
                                    Save
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setEditingComment(null)
                                      setEditContent("")
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                  {comment.content}
                                </p>
                                
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setReplyingTo(comment.id)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    <Reply className="h-3 w-3 mr-1" />
                                    Reply
                                  </Button>
                                  
                                  {comment.replies && comment.replies.length > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleToggleExpand(comment.id)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      {comment.isExpanded ? (
                                        <ChevronDown className="h-3 w-3 mr-1" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3 mr-1" />
                                      )}
                                      {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                    </Button>
                                  )}
                                </div>
                              </>
                            )}
                            
                            {/* Reply input */}
                            {replyingTo === comment.id && (
                              <div className="space-y-2 mt-3">
                                <Textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder={t('documents.comments.replyPlaceholder') || 'Write a reply...'}
                                  className="min-h-[60px] resize-none"
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleAddReply(comment.id)}
                                    disabled={!replyContent.trim() || isLoading}
                                  >
                                    <Send className="h-3 w-3 mr-1" />
                                    Reply
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      setReplyingTo(null)
                                      setReplyContent("")
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Replies */}
                    {comment.isExpanded && comment.replies && comment.replies.length > 0 && (
                      <div className="ml-8 space-y-2">
                        {comment.replies.map((reply) => (
                          <Card key={reply.id} className="bg-muted/30">
                            <CardContent className="p-3">
                              <div className="flex items-start space-x-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={reply.createdByAvatar || ''} alt={reply.createdByName} />
                                  <AvatarFallback className="text-xs">
                                    {getAuthorInitials(reply.createdByUsername || "U")}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{  reply.createdByName }</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                    {reply.updatedAt !== reply.createdAt && (
                                      <span className="text-xs text-muted-foreground italic">
                                        edited
                                      </span>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-foreground whitespace-pre-wrap">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
