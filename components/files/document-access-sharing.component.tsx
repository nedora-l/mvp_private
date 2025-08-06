"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/use-i18n"
import { FileDto } from "@/lib/interfaces/apis/files"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  UserPlus, 
  Globe, 
  Lock, 
  Eye, 
  Edit3, 
  Shield,
  Building,
  Crown,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  Save
} from "lucide-react"
import { AppComponentDictionaryPropsWithId } from "@/lib/interfaces/common/dictionary-props-component"
import { filesApiClient } from "@/lib/services/client/files/files.client.service"

interface DocumentAccessSharingProps extends AppComponentDictionaryPropsWithId {
  currentFile: FileDto | null
}

export default function DocumentAccessSharing({ dictionary, locale, id, currentFile }: DocumentAccessSharingProps) {
  const { t } = useI18n(dictionary)
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareEmail, setShareEmail] = useState("")
  const [sharePermission, setSharePermission] = useState("view")
  const [globalAccess, setGlobalAccess] = useState((currentFile?.accessType || "private").toLowerCase()) // private, internal, public

  const getPermissionIcon = (permission: string) => {
    switch (permission.toLowerCase()) {
      case "full access":
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "edit":
        return <Edit3 className="h-4 w-4 text-blue-500" />
      case "view only":
      case "view":
        return <Eye className="h-4 w-4 text-green-500" />
      default:
        return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "revoked":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Revoked</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleShareWithUser = () => {
    if (!shareEmail) return
    
    const newUser = {
      id: `user-${Date.now()}`,
      name: shareEmail.split('@')[0],
      email: shareEmail,
      avatar: "/placeholder-user.jpg",
      role: sharePermission === "edit" ? "Editor" : "Viewer",
      permissions: sharePermission === "edit" ? "Edit" : "View Only",
      grantedBy: "Current User",
      grantedAt: new Date().toISOString(),
      department: "Unknown",
      status: "pending"
    }
    
    setShareEmail("")
    setSharePermission("view")
    setIsShareModalOpen(false)
  }

  const handleSaveAccessType = (accessType: string) => {
    filesApiClient.updateFileAccessType(currentFile?.id || "", accessType)
  }

  return (
    <div className="space-y-6">
      {/* Header with Share Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{t('documents.accessSharing.title') || 'Access & Sharing'}</h3>
          <p className="text-sm text-muted-foreground">
            {t('documents.accessSharing.description') || 'Manage who can access and edit this document'}
          </p>
        </div>
        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              {t('documents.accessSharing.shareDocument') || 'Share Document'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('documents.accessSharing.shareWith') || 'Share with people'}</DialogTitle>
              <DialogDescription>
                {t('documents.accessSharing.shareDescription') || 'Enter email addresses to share this document'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="user@company.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Permission Level</label>
                <Select value={sharePermission} onValueChange={setSharePermission}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Only
                      </div>
                    </SelectItem>
                    <SelectItem value="edit">
                      <div className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4" />
                        Can Edit
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleShareWithUser}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Global Access Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('documents.accessSharing.globalAccess') || 'Global Access'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={globalAccess} onValueChange={setGlobalAccess}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Private - Only people with access
                  </div>
                </SelectItem>
                <SelectItem value="internal">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Internal - Anyone in the organization
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Public - Anyone with the link
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {globalAccess === "private" && "Only people you've specifically shared this with can access it."}
              {globalAccess === "internal" && "Anyone in your organization can find and access this document."}
              {globalAccess === "public" && "Anyone on the internet with the link can access this document."}
            </div>
          </div>
          <div className="mt-4 text-end">
            <Button onClick={() => handleSaveAccessType(globalAccess)}>
              <Save className="h-4 w-4 mr-2" />
              {t('save') || 'Enregistrer'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Users  */}
      {/* Department Access 
 
      {/* Team Access */}
    </div>
  )
}



/**
 * <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('documents.accessSharing.individualUsers') || 'Individual Users'} ({accessUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {accessUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.department} • Granted by {user.grantedBy}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getPermissionIcon(user.permissions)}
                    <span className="text-sm font-medium">{user.permissions}</span>
                  </div>
                  {getStatusBadge(user.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUpdatePermission(user.id, "Edit")}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Grant Edit Access
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdatePermission(user.id, "View Only")}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Only Access
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleRevokeAccess(user.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke Access
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {t('documents.accessSharing.departmentAccess') || 'Department Access'} ({departmentAccess.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {departmentAccess.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {dept.userCount} members • Granted by {dept.grantedBy}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getPermissionIcon(dept.permissions)}
                    <span className="text-sm font-medium">{dept.permissions}</span>
                  </div>
                  {getStatusBadge(dept.status)}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

<Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('documents.accessSharing.teamAccess') || 'Team Access'} ({teamAccess.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamAccess.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{team.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {team.userCount} members • Granted by {team.grantedBy}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getPermissionIcon(team.permissions)}
                    <span className="text-sm font-medium">{team.permissions}</span>
                  </div>
                  {getStatusBadge(team.status)}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

 */