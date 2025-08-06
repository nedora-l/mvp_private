"use client";

import { Button } from "@/components/ui/button";
import { MetaDataRecordDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { Database, Settings, ArrowLeft, RefreshCcw } from "lucide-react";

interface ObjectDetailsHeaderProps {
  metaDataRecord: MetaDataRecordDto | null;
  onBack: () => void;
  onEdit: () => void; // Add a prop for handling edit action
  onRefresh: () => void;
}

export function ObjectDetailsHeader({
  metaDataRecord,
  onBack,
  onEdit,
  onRefresh,
}: ObjectDetailsHeaderProps) {
  if (!metaDataRecord) {
    return null; // Or some loading/error state
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-8 w-8" />
            {metaDataRecord?.label}
          </h1>
          <p className="text-muted-foreground">{metaDataRecord?.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Settings className="h-4 w-4 mr-2" />
          Edit Object
        </Button>
        <Button size="sm" variant="outline" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
        </Button>
      </div>
    </div>
  );
}
