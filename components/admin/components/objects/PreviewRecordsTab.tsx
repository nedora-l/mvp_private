"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { MetaDataFieldDtoMin, MetaDataFieldTypeDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service";
import { Textarea } from "@/components/ui/textarea";
import { objectsApiClient } from "@/lib/services/client/admin/objects/objects.client.service";
import { OqlExecutionResult } from "@/lib/services/server/dynamicdb/dyn.db.oql.server.service";

interface PreviewRecordsTabProps {
  metaDataFields: MetaDataFieldDtoMin[];
  fieldTypes: MetaDataFieldTypeDto[];
  searchTerm: string;
  defaultOqlQuery?: string;
  onSearchTermChange: (value: string) => void;
  selectedFieldType?: string;
  onFieldTypeChange: (value: string) => void;
  onCreateField: () => void;
  onEditField: (field: MetaDataFieldDtoMin) => void;
  onDeleteField: (fieldId: string) => void;
  isLoading?: boolean;
}

export function PreviewRecordsTab({
  defaultOqlQuery,
  metaDataFields,
  fieldTypes,
  searchTerm,
  onSearchTermChange,
  selectedFieldType,
  onFieldTypeChange,
  onCreateField,
  onEditField,
  onDeleteField,
  isLoading = false,
}: PreviewRecordsTabProps) {

  const [activeTab, setActiveTab] = useState<'json' | 'datatable'>('json');
  const [oqlQuery, setOqlQuery] = useState(defaultOqlQuery || "SELECT * FROM objects");
  const [oqlQueryResult, setOqlQueryResult] = useState<OqlExecutionResult | null>(null);
  const executeOQLQuery = () => {
    // Placeholder for OQL query execution logic
    console.log("Executing OQL Query:", oqlQuery);
    objectsApiClient.executeOqlQuery({
      query: oqlQuery,
    }).then(response => {
      console.log("OQL Query Response:", response);
      setOqlQueryResult(response);
    });
  }

  return (
    <div className="space-y-4">
      {/* OQL Textarea */}
      <Textarea
        placeholder="Enter OQL query..."
        value={oqlQuery}
        rows={1}
        onChange={(e) => setOqlQuery(e.target.value)}
      />
      <div className="flex items-center justify-between mt-2">
         
        <Button onClick={executeOQLQuery} className="w-full sm:w-auto">
          Execute OQL Query
        </Button>
       
      </div>

      <div className="flex items-center justify-between mt-4">
         {/* Display the OqlExecutionResult in tabs : Json, Datatable*/}
        {oqlQueryResult && (
          <div className="mt-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('json')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'json'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  JSON View
                </button>
                <button
                  onClick={() => setActiveTab('datatable')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'datatable'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Data Table
                </button>
              </nav>
            </div>
            
            <div className="mt-4">
              {activeTab === 'json' && (
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                  {JSON.stringify(oqlQueryResult, null, 2)}
                </pre>
              )}
              
              {activeTab === 'datatable' && oqlQueryResult.records && (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(oqlQueryResult.records).length > 0 && 
                            Object.keys(Object.values(oqlQueryResult.records)[0]?.data || {}).map((key) => (
                              <TableHead key={key}>{key}</TableHead>
                            ))
                          }
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(oqlQueryResult.records).map(([recordId, record]) => (
                        <TableRow key={recordId}>
                          {Object.values(record.data || {}).map((value, cellIndex) => (
                            <TableCell key={cellIndex}>
                              {value !== null && value !== undefined ? String(value) : '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                      {Object.keys(oqlQueryResult.records).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={100} className="text-center">
                            No records found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
    </div>
  );
}
