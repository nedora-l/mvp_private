import { httpClient } from "@/lib/utils/http-client";
import { ApiAppResponse, HateoasContentResponse } from "..";

// ========================
// TYPE DEFINITIONS
// ========================

export interface MetaDataTriggerDto {
  id?: number;
  eventName: string;
  variableMappingJson?: string;
  isActive?: boolean;
  metaDataRecordId?: string;
}


export interface MetaDataTypeDto {
  id?: number;
  code: string;
  title: string;
  description?: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MetaDataFieldTypeDto {
  id: number;
  code: string;
  title: string;
  description?: string;
  category?: MetaDataFieldCategoryDto;
  returnType?: MetaDataReturnType;
  isActive?: boolean;
  isSystemLocked?: boolean;
}

export interface MetaDataFieldCategoryDto {
  id: number;
  code: string;
  title: string;
  description?: string;
  isActive?: boolean;
}

export interface MetaDataReturnType {
  id: number;
  code: string;
  title: string;
  description?: string;
}

export interface MetaDataRecordDto {
  id: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  type?: MetaDataTypeDto;
  typeApiName?: string;
  typeTitle?: string;
  defaultField?: MetaDataFieldDto;
  apiName: string;
  label: string;
  labelInPlural?: string;
  description?: string;
  helpText?: string;
  isActive: boolean;
  isSearchable: boolean;
  isPublic: boolean;
  isCustom?: boolean;
  recordsCount?: number;
  recordTypesCount?: number;
  fieldsCount?: number;
  relationshipsCount?: number;
  content?: string;
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface MetaDataFieldDto {
  id: string;
  createdAt: string;
  updatedAt?: string;
  type?: MetaDataFieldTypeDto;
  record?: MetaDataRecordDto;
  apiName: string;
  label: string;
  description?: string;
  helpText?: string;
  isActive: boolean;
  isStrict: boolean;
  required: boolean;
  isUnique: boolean;
  isCaseSensitive: boolean;
  isSystemLocked: boolean;
  isSearchable: boolean;
  defaultValue?: string;
  choices?: string; // JSON string
  decimals: number;
  textLength: number;
  relatedRecord?: MetaDataRecordDto;
  _links?: {
    self: { href: string };
    [key: string]: { href: string };
  };
}

export interface MetaDataFieldDtoMin {
  id: string;
  createdAt: string;
  updatedAt?: string;
  typeId?: number;
  typeCode?: string;
  recordId?: string;
  apiName: string;
  label: string;
  description?: string;
  helpText?: string;
  isActive: boolean;
  isStrict: boolean;
  required: boolean;
  isUnique: boolean;
  isCaseSensitive: boolean;
  isSystemLocked: boolean;
  isSearchable: boolean;
  defaultValue?: string;
  choices?: string;
  decimals: number;
  textLength: number;
  relatedRecordId?: string;
  relationshipType?: 'lookup' | 'master-detail' | 'principal-details' | 'parent-details';
  cascadeDelete?: boolean;
  relatedFieldApiName?: string;
}

export interface MetaDataRecordTypeDto {
  id: string;
  recordId: string;
  code: string;
  title: string;
  description?: string;
  isDefault: boolean;
  isSystem: boolean;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ========================
// REQUEST INTERFACES
// ========================

export interface MetaDataRecordRequestDto {
  typeId?: number;
  typeApiName?: string;
  apiName: string;
  label: string;
  labelInPlural?: string;
  description?: string;
  helpText?: string;
  isActive?: boolean;
  isSearchable?: boolean;
  isPublic?: boolean;
  defaultFieldApiName?: string;
}

export interface MetaDataFieldRequestDto {
  // Type Information
  typeCode: string; // Code of the selected field type (e.g., "TEXT", "NUMBER", "BOOLEAN", "PICKLIST")
  typeId: number;   // ID of the selected field type

  // Association
  recordId: string; // ID of the parent MetaDataRecord (the object this field belongs to)
  relatedRecordId?: string; // ID of the related record for lookup/relationship fields

  // Basic Definition
  apiName: string;      // Unique programmatic name (e.g., "customer_email_address")
  label: string;        // User-friendly display name (e.g., "Customer Email Address")
  description?: string; // Detailed explanation of the field's purpose
  helpText?: string;    // Short hint or guidance for users

  // Behavior & State
  isActive?: boolean;      // Is the field currently in use? // Changed from active:boolean to active?:boolean
  isSearchable?: boolean;  // Is the field indexed for searching? // Changed from searchable:boolean to searchable?:boolean
  defaultValue?: string; // Default value for the field when a new record is created

  // Type-Specific Parameters
  textLength?: number;  // Maximum length for text-based fields
  decimals?: number;    // Number of decimal places for numeric fields (e.g., for currency or precision)
  choices?: string;     // JSON string representing an array of options for PICKLIST or MULTISELECT types.
                        // Example: '[{"label": "Option 1", "value": "opt1"}, {"label": "Option 2", "value": "opt2"}]'

  // Relationship-Specific Parameters
  relationshipType?: 'lookup' | 'master-detail' | 'principal-details' | 'parent-details'; // Type of relationship
  cascadeDelete?: boolean; // Whether to cascade delete related records (for master-detail relationships)
  relatedFieldApiName?: string; // The field name on the related object to display

  // Validation & Constraints
  isUnique?: boolean;        // Does this field require a unique value across all records of this object type? // Changed from unique?:boolean to isUnique?:boolean
  isStrict?: boolean;        // Enforce strict data type adherence or other type-specific rules // Changed from strict?:boolean to isStrict?:boolean
  isCaseSensitive?: boolean; // For text fields, determines if comparisons are case-sensitive // Changed from caseSensitive?:boolean to isCaseSensitive?:boolean
  required?: boolean;      // Must this field have a value? // Changed from required?:boolean to isRequired?:boolean
  isSystemLocked?: boolean;  // Is this a system-defined field that cannot be modified or deleted by users? // Changed from systemLocked?:boolean to isSystemLocked?:boolean
}

export interface MetaDataRecordTypeRequestDto {
  recordId: string;
  code: string;
  title: string;
  description?: string;
  isDefault?: boolean;
  isSystem?: boolean;
  isPublic?: boolean;
}

// ========================
// QUERY PARAMETERS
// ========================

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface RecordFieldsParams extends PaginationParams {
  recordId?: string;
}


/**
 * Dynamic DB Metadata Server Service
 * Provides methods to interact with DynDbApiAppsController APIs
 */
export class DynamicDBMetaDataServerService {
  private readonly baseUrl = '/api/dbz/v1/api';

  // API URL constants
  public static readonly ENDPOINTS = {
    METADATA_RECORDS: '/metadata/records',
    METADATA_FIELDS: '/metadata/record/fields',
    METADATA_FIELD_CATEGORIES: '/metadata/fields/categories',
    METADATA_FIELD_TYPES: '/metadata/fields/types',
    METADATA_TYPES: '/metadata/types',
    METADATA_RETURN_TYPES: '/metadata/return/types',
    METADATA_RECORD_TYPES: '/metadata/record-types'
  } as const;

  private async getAuthHeaders(token: string): Promise<Record<string, string>> {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private buildQueryParams(params: PaginationParams & Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  }

  // ========================
  // METADATA RECORDS
  // ========================

  /**
   * Get paginated list of metadata records
   */
  async getMetaDataRecords(
    token: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<MetaDataRecordDto>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc'
    });
    
    const response = await httpClient.get<ApiAppResponse<HateoasContentResponse<MetaDataRecordDto>>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORDS}?${queryParams}`,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Get metadata record details by ID
   */
  async getMetaDataRecordDetails(
    token: string, 
    id: string
  ): Promise<MetaDataRecordDto> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.get<ApiAppResponse<MetaDataRecordDto>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORDS}/${id}`,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Create a new metadata record
   */
  async createMetaDataRecord(
    token: string, 
    requestDto: MetaDataRecordRequestDto
  ): Promise<MetaDataRecordDto> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.post<ApiAppResponse<MetaDataRecordDto>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORDS}`,
      requestDto,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Update an existing metadata record
   */
  async updateMetaDataRecord(
    token: string, 
    id: string, 
    requestDto: MetaDataRecordRequestDto
  ): Promise<MetaDataRecordDto> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.put<ApiAppResponse<MetaDataRecordDto>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORDS}/${id}`,
      requestDto,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Delete a metadata record
   */
  async deleteMetaDataRecord(token: string, id: string): Promise<string> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.delete<ApiAppResponse<string>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORDS}/${id}`,
      { headers }
    );
    return response.data.data;
  }

  // ========================
  // METADATA FIELDS
  // ========================

  /**
   * Get fields for a specific metadata record
   */
  async getMetaDataRecordFields(
    token: string, 
    recordId: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<MetaDataFieldDtoMin>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc'
    });
    
    const response = await httpClient.get<ApiAppResponse<HateoasContentResponse<MetaDataFieldDtoMin>>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORDS}/${recordId}/fields?${queryParams}`,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Get triggers for a specific metadata record
   */
  async getMetaDataRecordTriggers(
    token: string, 
    recordId: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<MetaDataTriggerDto>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc'
    });
    
    const response = await httpClient.get<ApiAppResponse<HateoasContentResponse<MetaDataTriggerDto>>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORDS}/${recordId}/triggers?${queryParams}`,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Get triggers for a specific metadata record
   */
  async createMetaDataRecordTriggers(
    token: string, 
    record: MetaDataTriggerDto 
  ): Promise<HateoasContentResponse<MetaDataTriggerDto>> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.post<ApiAppResponse<HateoasContentResponse<MetaDataTriggerDto>>>(
      `${this.baseUrl}/api/workflow/event-triggers`,
      record,
      { headers }
    );
    return response.data.data;
  } 

  /**
   * Get all metadata fields with optional filtering by record ID
   */
  async getMetaDataFields(
    token: string, 
    params: RecordFieldsParams = {}
  ): Promise<HateoasContentResponse<MetaDataFieldDto>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc',
      recordId: params.recordId
    });
    
    const response = await httpClient.get<ApiAppResponse<HateoasContentResponse<MetaDataFieldDto>>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_FIELDS}?${queryParams}`,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Create a new metadata field
   */
  async createMetaDataField(
    token: string, 
    requestDto: MetaDataFieldRequestDto
  ): Promise<MetaDataFieldDto> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.post<ApiAppResponse<MetaDataFieldDto>>(
      `${this.baseUrl}/metadata/fields`,
      requestDto,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Update an existing metadata field
   */
  async updateMetaDataField(
    token: string, 
    id: string, 
    requestDto: MetaDataFieldRequestDto
  ): Promise<MetaDataFieldDto> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.put<ApiAppResponse<MetaDataFieldDto>>(
      `${this.baseUrl}/metadata/fields/${id}`,
      requestDto,
      { headers }
    );
    return response.data.data;
  }

  // ========================
  // METADATA RECORD TYPES
  // ========================

  /**
   * Get metadata record types for a specific record
   */
  async getMetaDataRecordTypes(
    token: string, 
    recordId: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<MetaDataRecordTypeDto>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc'
    });
    
    const response = await httpClient.get<ApiAppResponse<HateoasContentResponse<MetaDataRecordTypeDto>>>(
      `${this.baseUrl}/metadata/record/${recordId}/types?${queryParams}`,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Get a specific metadata record type
   */
  async getMetaDataRecordType(
    token: string, 
    id: string
  ): Promise<MetaDataRecordTypeDto> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.get<ApiAppResponse<MetaDataRecordTypeDto>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORD_TYPES}/${id}`,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Create a new metadata record type
   */
  async createMetaDataRecordType(
    token: string, 
    requestDto: MetaDataRecordTypeRequestDto
  ): Promise<MetaDataRecordTypeDto> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.post<ApiAppResponse<MetaDataRecordTypeDto>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORD_TYPES}`,
      requestDto,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Update an existing metadata record type
   */
  async updateMetaDataRecordType(
    token: string, 
    id: string, 
    requestDto: MetaDataRecordTypeRequestDto
  ): Promise<MetaDataRecordTypeDto> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.put<ApiAppResponse<MetaDataRecordTypeDto>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORD_TYPES}/${id}`,
      requestDto,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Delete a metadata record type
   */
  async deleteMetaDataRecordType(token: string, id: string): Promise<void> {
    const headers = await this.getAuthHeaders(token);
    await httpClient.delete<ApiAppResponse<any>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RECORD_TYPES}/${id}`,
      { headers }
    );
  }

  // ========================
  // METADATA REFERENCE DATA
  // ========================

  /**
   * Get metadata field categories
   */
  async getMetaDataFieldCategories(
    token: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<MetaDataFieldCategoryDto>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc'
    });
    
    const response = await httpClient.get<ApiAppResponse<HateoasContentResponse<MetaDataFieldCategoryDto>>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_FIELD_CATEGORIES}?${queryParams}`,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Get metadata field types
   */
  async getMetaDataFieldTypes(
    token: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<MetaDataFieldTypeDto>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc'
    });
    
    const response = await httpClient.get<ApiAppResponse<HateoasContentResponse<MetaDataFieldTypeDto>>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_FIELD_TYPES}?${queryParams}`,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Get metadata types
   */
  async getMetaDataTypes(
    token: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<MetaDataTypeDto>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc'
    });
    
    const response = await httpClient.get<ApiAppResponse<HateoasContentResponse<MetaDataTypeDto>>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_TYPES}?${queryParams}`,
      { headers }
    );
    return response.data.data;
  }

  /**
   * Get metadata return types
   */
  async getMetaDataReturnTypes(
    token: string, 
    params: PaginationParams = {}
  ): Promise<HateoasContentResponse<MetaDataReturnType>> {
    const headers = await this.getAuthHeaders(token);
    const queryParams = this.buildQueryParams({
      page: params.page ?? 0,
      size: params.size ?? 10,
      sortBy: params.sortBy ?? 'id',
      sortDirection: params.sortDirection ?? 'desc'
    });
    
    const response = await httpClient.get<ApiAppResponse<HateoasContentResponse<MetaDataReturnType>>>(
      `${this.baseUrl}${DynamicDBMetaDataServerService.ENDPOINTS.METADATA_RETURN_TYPES}?${queryParams}`,
      { headers }
    );
    return response.data.data;
  }

  // ========================
  // ADVANCED FEATURES
  // ========================

  /**
   * Bulk create metadata records
   */
  async createMultipleMetaDataRecords(
    token: string, 
    records: MetaDataRecordRequestDto[]
  ): Promise<MetaDataRecordDto[]> {
    const results: MetaDataRecordDto[] = [];
    
    for (const record of records) {
      try {
        const created = await this.createMetaDataRecord(token, record);
        results.push(created);
      } catch (error) {
        console.error(`Failed to create record ${record.apiName}:`, error);
        throw error;
      }
    }
    
    return results;
  }

  /**
   * Clone a metadata record with all its fields
   */
  async cloneMetaDataRecord(
    token: string, 
    sourceRecordId: string, 
    newApiName: string,
    newLabel: string
  ): Promise<MetaDataRecordDto> {
    try {
      // Get source record details
      const sourceRecord = await this.getMetaDataRecordDetails(token, sourceRecordId);
      
      // Get source record fields
      const sourceFields = await this.getMetaDataRecordFields(token, sourceRecordId, { size: 100 });
      
      // Create new record
      const newRecordRequest: MetaDataRecordRequestDto = {
        apiName: newApiName,
        label: newLabel,
        labelInPlural: sourceRecord.labelInPlural,
        description: sourceRecord.description,
        helpText: sourceRecord.helpText,
        isActive: sourceRecord.isActive,
        isSearchable: sourceRecord.isSearchable,
        isPublic: sourceRecord.isPublic
      };
      
      const newRecord = await this.createMetaDataRecord(token, newRecordRequest);
      
      // Clone fields
      for (const field of sourceFields.content) {        
        const fieldRequest: MetaDataFieldRequestDto = {
          typeCode: field.typeCode || '',
          typeId: field.typeId!,
          recordId: newRecord.id,
          apiName: field.apiName,
          label: field.label,
          description: field.description,
          helpText: field.helpText,
          defaultValue: field.defaultValue,
          choices: field.choices,
          relatedRecordId: field.relatedRecordId,
          relationshipType: field.relationshipType,
          cascadeDelete: field.cascadeDelete,
          relatedFieldApiName: field.relatedFieldApiName,
          isActive: field.isActive,
          isStrict: field.isStrict,
          required: field.required,
          isUnique: field.isUnique,
          isCaseSensitive: field.isCaseSensitive,
          isSystemLocked: field.isSystemLocked,
          isSearchable: field.isSearchable,
          decimals: field.decimals,
          textLength: field.textLength
        };
        
        await this.createMetaDataField(token, fieldRequest);
      }
      
      return newRecord;
    } catch (error) {
      console.error('Error cloning metadata record:', error);
      throw error;
    }
  }

  /**
   * Get record schema for validation
   */
  async getRecordSchema(token: string, recordId: string): Promise<{
    record: MetaDataRecordDto;
    fields: MetaDataFieldDtoMin[];
    schema: Record<string, any>;
  }> {
    try {
      const [record, fieldsResponse] = await Promise.all([
        this.getMetaDataRecordDetails(token, recordId),
        this.getMetaDataRecordFields(token, recordId, { size: 100 })
      ]);

      const schema: Record<string, any> = {};
      
      fieldsResponse.content.forEach(field => {
        schema[field.apiName] = {
          type: field.typeCode,
          required: field.required,
          unique: field.isUnique,
          caseSensitive: field.isCaseSensitive,
          defaultValue: field.defaultValue,
          choices: field.choices ? JSON.parse(field.choices) : null,
          decimals: field.decimals,
          maxLength: field.textLength,
          label: field.label,
          description: field.description,
          helpText: field.helpText
        };
      });

      return {
        record,
        fields: fieldsResponse.content,
        schema
      };
    } catch (error) {
      console.error('Error getting record schema:', error);
      throw error;
    }
  }

  /**
   * Validate data against record schema
   */
  async validateData(
    token: string, 
    recordId: string, 
    data: Record<string, any>
  ): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const { schema } = await this.getRecordSchema(token, recordId);
      
      const errors: string[] = [];
      const warnings: string[] = [];

      // Check required fields
      Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
        if (fieldSchema.required && (data[fieldName] === undefined || data[fieldName] === null)) {
          errors.push(`Field '${fieldName}' is required`);
        }
      });

      // Validate field types and constraints
      Object.entries(data).forEach(([fieldName, value]) => {
        const fieldSchema = schema[fieldName];
        
        if (!fieldSchema) {
          warnings.push(`Field '${fieldName}' is not defined in schema`);
          return;
        }

        // Type-specific validations would go here
        if (fieldSchema.maxLength && typeof value === 'string' && value.length > fieldSchema.maxLength) {
          errors.push(`Field '${fieldName}' exceeds maximum length of ${fieldSchema.maxLength}`);
        }

        if (fieldSchema.choices && !fieldSchema.choices.includes(value)) {
          errors.push(`Field '${fieldName}' must be one of: ${fieldSchema.choices.join(', ')}`);
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      console.error('Error validating data:', error);
      throw error;
    }
  }

  /**
   * Export record definition as JSON
   */
  async exportRecordDefinition(token: string, recordId: string): Promise<{
    record: MetaDataRecordDto;
    fields: MetaDataFieldDtoMin[];
    recordTypes: MetaDataRecordTypeDto[];
    exportedAt: string;
  }> {
    try {
      const [record, fieldsResponse, recordTypesResponse] = await Promise.all([
        this.getMetaDataRecordDetails(token, recordId),
        this.getMetaDataRecordFields(token, recordId, { size: 100 }),
        this.getMetaDataRecordTypes(token, recordId, { size: 100 })
      ]);

      return {
        record,
        fields: fieldsResponse.content,
        recordTypes: recordTypesResponse.content,
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting record definition:', error);
      throw error;
    }
  }

  /**
   * Get field statistics
   */
  async getFieldStatistics(token: string, recordId?: string): Promise<{
    totalFields: number;
    fieldsByType: Record<string, number>;
    requiredFields: number;
    uniqueFields: number;
    searchableFields: number;
    systemLockedFields: number;
  }> {
    try {
      const fieldsResponse = recordId 
        ? await this.getMetaDataRecordFields(token, recordId, { size: 1000 })
        : await this.getMetaDataFields(token, { size: 1000 });

      const fields = fieldsResponse.content;
      const stats = {
        totalFields: fields.length,
        fieldsByType: {} as Record<string, number>,
        requiredFields: 0,
        uniqueFields: 0,
        searchableFields: 0,
        systemLockedFields: 0
      };

      fields.forEach(field => {
        // Count by type
        let type = 'unknown'  ; 
        if(('type' in field && field.type?.code) && field.type?.code.length > 0) {
          type = field.type.code ;
        }
        else if ('typeCode' in field && field.typeCode && field.typeCode.length > 0) {
          type = field.typeCode;
        }

        stats.fieldsByType[type] = (stats.fieldsByType[type] || 0) + 1;

        // Count boolean properties
        if (field.required) stats.requiredFields++;
        if (field.isUnique) stats.uniqueFields++;
        if (field.isSearchable) stats.searchableFields++;
        if (field.isSystemLocked) stats.systemLockedFields++;
      });

      return stats;
    } catch (error) {
      console.error('Error getting field statistics:', error);
      throw error;
    }
  }

  /**
   * Health check for the service
   */
  async healthCheck(token: string): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    checks: {
      recordsAccess: boolean;
      fieldsAccess: boolean;
      typesAccess: boolean;
    };
  }> {
    const timestamp = new Date().toISOString();
    const checks = {
      recordsAccess: false,
      fieldsAccess: false,
      typesAccess: false
    };

    try {
      // Test records endpoint
      await this.getMetaDataRecords(token, { page: 0, size: 1 });
      checks.recordsAccess = true;
    } catch (error) {
      console.warn('Records access failed:', error);
    }

    try {
      // Test fields endpoint
      await this.getMetaDataFields(token, { page: 0, size: 1 });
      checks.fieldsAccess = true;
    } catch (error) {
      console.warn('Fields access failed:', error);
    }

    try {
      // Test types endpoint
      await this.getMetaDataTypes(token, { page: 0, size: 1 });
      checks.typesAccess = true;
    } catch (error) {
      console.warn('Types access failed:', error);
    }

    const allHealthy = Object.values(checks).every(check => check === true);

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp,
      checks
    };
  }

  // ========================
  // ERROR HANDLING & HELPERS
  // ========================

  /**
   * Retry wrapper for API calls
   */
  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError;
  }

  /**
   * Batch processor for large operations
   */
  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10,
    delayBetweenBatches: number = 100
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(item => processor(item))
      );
      
      results.push(...batchResults);
      
      // Add delay between batches to avoid overwhelming the server
      if (i + batchSize < items.length && delayBetweenBatches > 0) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    
    return results;
  }
}

// ========================
// SPECIALIZED METHODS
// ========================

export interface FieldValidationResult {
  fieldName: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface RecordComparisonResult {
  record1: MetaDataRecordDto;
  record2: MetaDataRecordDto;
  differences: {
    fields: {
      added: MetaDataFieldDtoMin[];
      removed: MetaDataFieldDtoMin[];
      modified: Array<{
        field1: MetaDataFieldDtoMin;
        field2: MetaDataFieldDtoMin;
        changes: string[];
      }>;
    };
    properties: Array<{
      property: string;
      value1: any;
      value2: any;
    }>;
  };
}

/**
 * Extension of the main service with specialized utility methods
 */
export class DynamicDBMetaDataAdvancedService extends DynamicDBMetaDataServerService {
  
  /**
   * Compare two metadata records and their fields
   */
  async compareRecords(
    token: string,
    record1Id: string,
    record2Id: string
  ): Promise<RecordComparisonResult> {
    try {
      const [record1, record2, fields1, fields2] = await Promise.all([
        this.getMetaDataRecordDetails(token, record1Id),
        this.getMetaDataRecordDetails(token, record2Id),
        this.getMetaDataRecordFields(token, record1Id, { size: 1000 }),
        this.getMetaDataRecordFields(token, record2Id, { size: 1000 })
      ]);

      const fields1Map = new Map(fields1.content.map(f => [f.apiName, f]));
      const fields2Map = new Map(fields2.content.map(f => [f.apiName, f]));

      const added = fields2.content.filter(f => !fields1Map.has(f.apiName));
      const removed = fields1.content.filter(f => !fields2Map.has(f.apiName));
      const modified: any[] = [];

      // Find modified fields
      fields1.content.forEach(field1 => {
        const field2 = fields2Map.get(field1.apiName);
        if (field2) {
          const changes: string[] = [];
          
          if (field1.label !== field2.label) changes.push('label');
          if (field1.typeCode !== field2.typeCode) changes.push('type');
          if (field1.required !== field2.required) changes.push('required');
          if (field1.isUnique !== field2.isUnique) changes.push('unique');
          if (field1.defaultValue !== field2.defaultValue) changes.push('defaultValue');
          
          if (changes.length > 0) {
            modified.push({ field1, field2, changes });
          }
        }
      });

      // Compare record properties
      const propertyDifferences: Array<{property: string; value1: any; value2: any}> = [];
      const compareProps = ['label', 'description', 'isActive', 'isSearchable', 'isPublic'];
      
      compareProps.forEach(prop => {
        if ((record1 as any)[prop] !== (record2 as any)[prop]) {
          propertyDifferences.push({
            property: prop,
            value1: (record1 as any)[prop],
            value2: (record2 as any)[prop]
          });
        }
      });

      return {
        record1,
        record2,
        differences: {
          fields: { added, removed, modified },
          properties: propertyDifferences
        }
      };
    } catch (error) {
      console.error('Error comparing records:', error);
      throw error;
    }
  }

  /**
   * Validate field configurations
   */
  async validateFieldConfigurations(
    token: string,
    recordId: string
  ): Promise<FieldValidationResult[]> {
    try {
      const fields = await this.getMetaDataRecordFields(token, recordId, { size: 1000 });
      const results: FieldValidationResult[] = [];

      for (const field of fields.content) {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validate required field constraints
        if (field.required && field.defaultValue) {
          warnings.push('Required field has default value - this may be redundant');
        }

        // Validate unique field constraints
        if (field.isUnique && !field.required) {
          warnings.push('Unique field is not required - consider making it required');
        }

        // Validate choices field
        if (field.choices) {
          try {
            JSON.parse(field.choices);
          } catch {
            errors.push('Invalid JSON format in choices field');
          }
        }

        // Validate text length
        if (field.textLength < 0) {
          errors.push('Text length cannot be negative');
        }

        // Validate decimals
        if (field.decimals < 0) {
          errors.push('Decimals cannot be negative');
        }

        results.push({
          fieldName: field.apiName,
          isValid: errors.length === 0,
          errors,
          warnings
        });
      }

      return results;
    } catch (error) {
      console.error('Error validating field configurations:', error);
      throw error;
    }
  }

  /**
   * Generate field dependencies graph
   */
  async getFieldDependencies(
    token: string,
    recordId: string
  ): Promise<{
    fields: MetaDataFieldDtoMin[];
    dependencies: Array<{
      field: string;
      dependsOn: string[];
      dependents: string[];
    }>;
  }> {
    try {
      const fields = await this.getMetaDataRecordFields(token, recordId, { size: 1000 });
      const dependencies: Array<{field: string; dependsOn: string[]; dependents: string[]}> = [];

      for (const field of fields.content) {
        const dependsOn: string[] = [];
        const dependents: string[] = [];

        // Check for related record dependencies
        if (field.relatedRecordId) {
          const relatedFields = await this.getMetaDataRecordFields(token, field.relatedRecordId, { size: 100 });
          dependsOn.push(...relatedFields.content.map(f => f.apiName));
        }

        // Find fields that depend on this field
        for (const otherField of fields.content) {
          if (otherField.relatedRecordId === recordId && otherField.apiName !== field.apiName) {
            dependents.push(otherField.apiName);
          }
        }

        dependencies.push({
          field: field.apiName,
          dependsOn,
          dependents
        });
      }

      return {
        fields: fields.content,
        dependencies
      };
    } catch (error) {
      console.error('Error getting field dependencies:', error);
      throw error;
    }
  }

  /**
   * Optimize record performance by analyzing field usage
   */
  async analyzeRecordPerformance(
    token: string,
    recordId: string
  ): Promise<{
    record: MetaDataRecordDto;
    analysis: {
      totalFields: number;
      indexableFields: number;
      searchableFields: number;
      requiredFields: number;
      recommendations: string[];
    };
  }> {
    try {
      const [record, fields] = await Promise.all([
        this.getMetaDataRecordDetails(token, recordId),
        this.getMetaDataRecordFields(token, recordId, { size: 1000 })
      ]);

      const analysis = {
        totalFields: fields.content.length,
        indexableFields: fields.content.filter(f => f.isUnique).length,
        searchableFields: fields.content.filter(f => f.isSearchable).length,
        requiredFields: fields.content.filter(f => f.required).length,
        recommendations: [] as string[]
      };

      // Generate recommendations
      if (analysis.searchableFields > 20) {
        analysis.recommendations.push('Consider reducing searchable fields for better performance');
      }

      if (analysis.indexableFields < 1) {
        analysis.recommendations.push('Add at least one unique field for better query performance');
      }

      if (analysis.totalFields > 50) {
        analysis.recommendations.push('Consider breaking this record into smaller related records');
      }

      const textFields = fields.content.filter(f => f.textLength > 1000);
      if (textFields.length > 5) {
        analysis.recommendations.push('Multiple large text fields detected - consider external storage');
      }

      return { record, analysis };
    } catch (error) {
      console.error('Error analyzing record performance:', error);
      throw error;
    }
  }
}

// Export singleton instances
export const dynDBMetaDataServerService = new DynamicDBMetaDataServerService();
export const dynDBMetaDataAdvancedService = new DynamicDBMetaDataAdvancedService();
