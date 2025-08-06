"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MetaDataRecordDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { Database, FileText, Link, Calendar } from "lucide-react";

interface ObjectQuickStatsProps {
  metaDataRecord: MetaDataRecordDto | null;
  fieldsCount: number;
  relationshipsCount: number;
}

export function ObjectQuickStats({
  metaDataRecord,
  fieldsCount,
  relationshipsCount,
}: ObjectQuickStatsProps) {
  if (!metaDataRecord) {
    return null; // Or some loading/error state
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-muted-foreground" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Record Count
              </p>
              <p className="text-2xl font-semibold">
                {metaDataRecord.recordsCount?.toLocaleString() || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Fields
              </p>
              <p className="text-2xl font-semibold">{fieldsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Link className="h-8 w-8 text-muted-foreground" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Relationships
              </p>
              <p className="text-2xl font-semibold">{relationshipsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-muted-foreground" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Last Modified
              </p>
              <p className="text-2xl font-semibold">
                {metaDataRecord.updatedAt ? new Date(metaDataRecord.updatedAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
