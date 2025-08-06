"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, ArrowRight } from "lucide-react";

interface RelationshipDefinition {
  id: string;
  name: string;
  type: "lookup" | "master-detail" | "many-to-many";
  childObject: string;
  parentObject: string;
  fieldName: string;
  description?: string;
  cascadeDelete: boolean;
  isActive: boolean;
  createdDate: string;
}

interface RelationshipsTabProps {
  relationships: RelationshipDefinition[];
  onCreateRelationship: () => void;
  onEditRelationship: (relationship: RelationshipDefinition) => void;
  onDeleteRelationship: (relationshipId: string) => void;
  isLoading?: boolean;
}

const relationshipTypes = [
  { 
    value: "lookup", 
    label: "Lookup", 
    description: "Loosely coupled relationship",
    color: "bg-blue-100 text-blue-700"
  },
  { 
    value: "master-detail", 
    label: "Master-Detail", 
    description: "Tightly coupled parent-child relationship",
    color: "bg-purple-100 text-purple-700"
  },
  { 
    value: "many-to-many", 
    label: "Many-to-Many", 
    description: "Junction object relationship",
    color: "bg-orange-100 text-orange-700"
  }
];

export function RelationshipsTab({
  relationships,
  onCreateRelationship,
  onEditRelationship,
  onDeleteRelationship,
  isLoading = false,
}: RelationshipsTabProps) {
  const getRelationshipTypeColor = (type: string) => {
    const relType = relationshipTypes.find(rt => rt.value === type);
    return relType?.color || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-4">
      {/* Relationships Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Relationships</h3>
        <Button onClick={onCreateRelationship}>
          <Plus className="h-4 w-4 mr-2" />
          Add Relationship
        </Button>
      </div>

      {/* Relationships Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Object Relationships ({relationships.length})</h3>
            <div className="text-sm text-muted-foreground">
              Configure how this object relates to others
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : relationships.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No relationships defined yet</p>
              <Button variant="outline" onClick={onCreateRelationship}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Relationship
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Relationship Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Related Objects</TableHead>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relationships.map((relationship) => (
                  <TableRow key={relationship.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{relationship.name}</div>
                        {relationship.description && (
                          <div className="text-sm text-muted-foreground">
                            {relationship.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRelationshipTypeColor(relationship.type)}>
                        {relationshipTypes.find(rt => rt.value === relationship.type)?.label || relationship.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="bg-muted px-2 py-1 rounded">
                          {relationship.parentObject}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="bg-muted px-2 py-1 rounded">
                          {relationship.childObject}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {relationship.fieldName}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={relationship.isActive ? "default" : "secondary"}>
                          {relationship.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {relationship.cascadeDelete && (
                          <Badge variant="outline" className="text-xs">
                            Cascade Delete
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditRelationship(relationship)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteRelationship(relationship.id)}
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
    </div>
  );
}
