"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Shield, Database, AlertTriangle } from "lucide-react";
import { MetaDataRecordDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";

interface SettingsTabProps {
  metaDataRecord: MetaDataRecordDto | null;
  onUpdateSettings?: (settings: Partial<MetaDataRecordDto>) => void;
}

export function SettingsTab({ metaDataRecord, onUpdateSettings }: SettingsTabProps) {
  if (!metaDataRecord) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Object Settings</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure object behavior and properties
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h4 className="text-md font-medium flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>General</span>
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Object Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable this object
                  </p>
                </div>
                <Switch 
                  id="active" 
                  checked={metaDataRecord.isActive} 
                  onCheckedChange={(checked) => 
                    onUpdateSettings?.({ isActive: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="searchable">Searchable</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow records to be found in global search
                  </p>
                </div>
                <Switch 
                  id="searchable" 
                  checked={metaDataRecord.isSearchable || false} 
                  onCheckedChange={(checked) => 
                    onUpdateSettings?.({ isSearchable: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={metaDataRecord.description || ""}
                  onChange={(e) => 
                    onUpdateSettings?.({ description: e.target.value })
                  }
                  placeholder="Describe the purpose of this object..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Settings */}
          <div className="space-y-4">
            <h4 className="text-md font-medium flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security & Permissions</span>
            </h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-read">Public Read Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow public read access to records
                  </p>
                </div>
                <Switch id="public-read" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="audit-trail">Audit Trail</Label>
                  <p className="text-sm text-muted-foreground">
                    Track field changes and access history
                  </p>
                </div>
                <Switch id="audit-trail" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h4 className="text-md font-medium flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Advanced</span>
            </h4>
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Object Type</Label>
                  <Badge variant={metaDataRecord.isCustom ? "secondary" : "default"}>
                    {metaDataRecord.isCustom ? "Custom" : "Standard"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Label>API Name</Label>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {metaDataRecord.apiName}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Created Date</Label>
                  <span className="text-sm text-muted-foreground">
                    {metaDataRecord.createdAt ? new Date(metaDataRecord.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Last Modified</Label>
                  <span className="text-sm text-muted-foreground">
                    {metaDataRecord.updatedAt ? new Date(metaDataRecord.updatedAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-destructive">Danger Zone</h4>
            <div className="border border-destructive/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Object</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete this object and all its data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Object
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
