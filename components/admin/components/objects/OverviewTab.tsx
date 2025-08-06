"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MetaDataRecordDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";

interface OverviewTabProps {
  metaDataRecord: MetaDataRecordDto | null;
}

export function OverviewTab({ metaDataRecord }: OverviewTabProps) {
  if (!metaDataRecord) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Object Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">API Name:</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {metaDataRecord.apiName}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Type:</span>
              <Badge variant={metaDataRecord.isCustom ? "secondary" : "default"}>
                {metaDataRecord.isCustom ? "Custom" : "Standard"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={metaDataRecord.isActive ? "default" : "destructive"}>
                {metaDataRecord.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Created Date:</span>
              <span className="text-sm text-muted-foreground">
                {metaDataRecord.createdAt ? new Date(metaDataRecord.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Last Modified:</span>
              <span className="text-sm text-muted-foreground">
                {metaDataRecord.updatedAt ? new Date(metaDataRecord.updatedAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <p>• Create new field</p>
            <p>• Add relationship</p>
            <p>• Export object schema</p>
            <p>• View record data</p>
            <p>• Manage permissions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
