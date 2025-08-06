"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { MetaDataRecordDto, MetaDataTriggerDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { objectsApiClient } from "@/lib/services/client/admin/objects/objects.client.service";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";


interface TriggersTabProps {
  metaDataRecord: MetaDataRecordDto;
}

interface TriggerFormData {
  eventName: string;
  variableMappingJson: string;
  isActive: boolean;
}

const TRIGGER_EVENT_TYPES = [
  { value: "before_insert", label: "Before Insert" },
  { value: "after_insert", label: "After Insert" },
  { value: "before_update", label: "Before Update" },
  { value: "after_update", label: "After Update" },
  { value: "before_delete", label: "Before Delete" },
  { value: "after_delete", label: "After Delete" },
  { value: "before_upsert", label: "Before Upsert" },
  { value: "after_upsert", label: "After Upsert" },
];

export function RecordTriggersTab({
  metaDataRecord,
}: TriggersTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [metaDataTriggers, setMetaDataTriggers] = useState<MetaDataTriggerDto[]>([]);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [triggerFormData, setTriggerFormData] = useState<TriggerFormData>({
    eventName: "",
    variableMappingJson: "",
    isActive: true,
  });


  // Refresh functions
  const refreshTriggers = useCallback(() => {
    setIsLoading(true);
    objectsApiClient.getRecordTriggers(metaDataRecord.id)
      .then((data) => {
        setMetaDataTriggers(data.data?.content || []);
        toast({
          title: "Success",
          description: "Record triggers have been refreshed.",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to refresh triggers.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [metaDataRecord.id]);

  // Reset form data
  const resetTriggerForm = useCallback(() => {
    setTriggerFormData({
      eventName: "",
      variableMappingJson: "",
      isActive: true,
    });
  }, []);

  // Handle form submission
  const handleCreateTrigger = useCallback(async () => {
    if (!triggerFormData.eventName.trim()) {
      toast({
        title: "Validation Error",
        description: "Event name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const triggerData: MetaDataTriggerDto = {
        eventName: triggerFormData.eventName,
        variableMappingJson: triggerFormData.variableMappingJson || "{}",
        isActive: triggerFormData.isActive,
        metaDataRecordId: metaDataRecord.id,
      };

      await objectsApiClient.createRecordTriggers(metaDataRecord.id, triggerData);
      
      toast({
        title: "Success",
        description: "Trigger created successfully.",
      });
      
      setShowTriggerModal(false);
      resetTriggerForm();
      refreshTriggers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create trigger.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [triggerFormData, metaDataRecord.id, refreshTriggers, resetTriggerForm]);  useEffect(() => {
    if (metaDataRecord?.id) {
      refreshTriggers();
    }
  }, [metaDataRecord?.id, refreshTriggers]);

  const onCreateTrigger = () => {
    resetTriggerForm();
    setShowTriggerModal(true);
  };


  return (
    <div className="space-y-4">
      {/* Triggers Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Triggers</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshTriggers}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={onCreateTrigger}>
            <Plus className="h-4 w-4 mr-2" />
            Add Trigger
          </Button>
        </div>
      </div>

      {/* Relationships Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Object Triggers ({metaDataTriggers.length})</h3>
            <div className="text-sm text-muted-foreground">
              Configure how this object triggers actions
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : metaDataTriggers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No triggers defined yet</p>
              <Button variant="outline" onClick={onCreateTrigger}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Trigger
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Workflows Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metaDataTriggers.map((metaDataTrigger) => (
                  <TableRow key={metaDataTrigger.id}>
                    <TableCell className="font-medium">
                      {metaDataTrigger.eventName}
                    </TableCell>
                    <TableCell>
                      {/* Placeholder for Workflow Name */}
                      N/A
                    </TableCell>
                    <TableCell>
                      <Badge variant={metaDataTrigger.isActive ? "default" : "secondary"}>
                        {metaDataTrigger.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log("View Trigger", metaDataTrigger.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log("Delete Trigger", metaDataTrigger.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Trigger Creation Modal */}
      <Dialog open={showTriggerModal} onOpenChange={setShowTriggerModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Trigger</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Type</Label>
              <Select
                value={triggerFormData.eventName}
                onValueChange={(value) =>
                  setTriggerFormData(prev => ({ ...prev, eventName: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger event type" />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGER_EVENT_TYPES.map((event) => (
                    <SelectItem key={event.value} value={event.value}>
                      {event.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variableMappingJson">Variable Mapping (JSON)</Label>
              <Textarea
                id="variableMappingJson"
                placeholder='{"variable1": "value1", "variable2": "value2"}'
                value={triggerFormData.variableMappingJson}
                onChange={(e) =>
                  setTriggerFormData(prev => ({ ...prev, variableMappingJson: e.target.value }))
                }
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Optional: JSON object containing variable mappings for the trigger
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={triggerFormData.isActive}
                onCheckedChange={(checked) =>
                  setTriggerFormData(prev => ({ ...prev, isActive: checked }))
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowTriggerModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTrigger} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Trigger"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
