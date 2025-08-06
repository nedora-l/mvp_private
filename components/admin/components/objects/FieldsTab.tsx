"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Eye, RefreshCcw } from "lucide-react";
import { MetaDataFieldDtoMin, MetaDataFieldTypeDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";

interface FieldsTabProps {
  metaDataFields: MetaDataFieldDtoMin[];
  fieldTypes: MetaDataFieldTypeDto[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedFieldType?: string;
  onFieldTypeChange: (value: string) => void;
  refreshFields: () => void;
  onCreateField: () => void;
  onEditField: (field: MetaDataFieldDtoMin) => void;
  onDeleteField: (fieldId: string) => void;
  isLoading?: boolean;
}

export function FieldsTab({
  metaDataFields,
  fieldTypes,
  searchTerm,
  onSearchTermChange,
  selectedFieldType,
  onFieldTypeChange,
  onCreateField,
  refreshFields,
  onEditField,
  onDeleteField,
  isLoading = false,
}: FieldsTabProps) {
  const filteredFields = metaDataFields.filter(field => {
    const matchesSearch = field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.apiName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedFieldType === "all" || !selectedFieldType || field.typeCode === selectedFieldType;
    return matchesSearch && matchesType;
  });

  const getFieldTypeLabel = (typeCode: string) => {
    const fieldType = fieldTypes.find(ft => ft.code === typeCode);
    return fieldType?.title || typeCode;
  };

  return (
    <div className="space-y-4">
      {/* Fields Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <Select value={selectedFieldType} onValueChange={onFieldTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {fieldTypes.map((type) => (
                <SelectItem key={type.id} value={type.code}>
                  {type.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Button variant="ghost" onClick={refreshFields}>
            <RefreshCcw className="h-4 w-4 mr-2" />
          </Button>
          <Button onClick={onCreateField}>
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>
      </div>

      {/* Fields Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Fields ({filteredFields.length})</h3>
            <div className="text-sm text-muted-foreground">
              {metaDataFields.length} total fields
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredFields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || selectedFieldType ? "No fields match your search criteria" : "No fields found"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Name</TableHead>
                  <TableHead>API Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-medium">{field.label}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {field.apiName}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getFieldTypeLabel(field.typeCode || "text")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={field.required ? "destructive" : "secondary"}>
                        {field.required ? "Required" : "Optional"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={field.isActive ? "default" : "secondary"}>
                        {field.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditField(field)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteField(field.id.toString())}
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
