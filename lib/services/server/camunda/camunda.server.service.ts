import { httpClient } from "@/lib/utils/http-client";

// Base HATEOAS interfaces
export interface HateoasResponse<T> {
  _embedded: T;
  _links: {
    self: { href: string };
    first?: { href: string };
    prev?: { href: string };
    next?: { href: string };
    last?: { href: string };
  };
  page?: HateoasPagination;
}

export interface HateoasPagination {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

// Camunda Task DTOs
export interface TaskResponseDto {
  id: string;
  name: string;
  assignee?: string;
  owner?: string;
  description?: string;
  created: string;
  due?: string;
  followUp?: string;
  delegationState?: string;
  priority: number;
  processDefinitionId: string;
  processInstanceId: string;
  executionId: string;
  caseDefinitionId?: string;
  caseInstanceId?: string;
  caseExecutionId?: string;
  taskDefinitionKey: string;
  suspended: boolean;
  formKey?: string;
  tenantId?: string;
}

export interface CompleteTaskRequestDto {
  variables?: Record<string, VariableValue>;
  withVariablesInReturn?: boolean;
}

export interface VariableValue {
  value: any;
  type: string;
  valueInfo?: Record<string, any>;
}

export interface TaskVariableDto {
  name: string;
  value: any;
  type: string;
  valueInfo?: Record<string, any>;
}

// Camunda Process Instance DTOs
export interface ProcessInstanceResponseDto {
  id: string;
  definitionId: string;
  businessKey?: string;
  caseInstanceId?: string;
  ended: boolean;
  suspended: boolean;
  tenantId?: string;
  links: Array<{
    method: string;
    href: string;
    rel: string;
  }>;
}

export interface StartProcessInstanceRequestDto {
  variables?: Record<string, VariableValue>;
  businessKey?: string;
  caseInstanceId?: string;
  skipCustomListeners?: boolean;
  skipIoMappings?: boolean;
  withVariablesInReturn?: boolean;
}

export interface ProcessInstanceVariableDto {
  name: string;
  value: any;
  type: string;
  valueInfo?: Record<string, any>;
}

// Camunda Process Definition DTOs with extended workflow information

export interface WorkflowStepDto {
  id: number;
  name: string;
  type: string;
  duration: string;
  status: string;
}

export interface RecentExecutionDto {
  id: number;
  user: string;
  timestamp: string;
  duration: string;
  status: string;
  error?: string;
}

export interface ProcessFullDefinitionDto extends ProcessDefinitionResponseDto {
  // Extended workflow fields
  status: string;
  trigger: string;
  lastRun?: string;
  successRate: number;
  executions: number;
  createdBy: string;
  createdAt: string;
  steps: WorkflowStepDto[];
  recentExecutions: RecentExecutionDto[];
}

export interface ProcessDefinitionResponseDto {
  id: string;
  key: string;
  category?: string;
  description?: string;
  name: string;
  version: number;
  resource: string;
  deploymentId: string;
  diagram?: string;
  suspended: boolean;
  tenantId?: string;
  versionTag?: string;
  historyTimeToLive?: number;
  startableInTasklist: boolean;
  status?: string;
  trigger?: string;
  lastRun?: string;
  successRate?: number;
  createdBy?: string;
  createdAt?: string;
  steps?: WorkflowStepDto[];
  recentExecutions?: RecentExecutionDto[];
  executions?: number;
}

export enum WorkflowCategory {
  APPROVAL = "Approval",
  NOTIFICATION = "Notification",
  DATA_PROCESSING = "Data Processing",
  INTEGRATION = "Integration",
  DOCUMENT_MANAGEMENT = "Document Management",
  HR_PROCESSES = "HR Processes",
  FINANCIAL = "Financial",
  CUSTOMER_SERVICE = "Customer Service",
  ORDER_MANAGEMENT = "Order Management",
  COMPLIANCE = "Compliance",
  SECURITY = "Security",
  OTHER = "Other"
}

export enum TriggerType {
  API_CALL = "API Call",
  SCHEDULED = "Scheduled",
  FILE_UPLOAD = "File Upload",
  DATABASE_CHANGE = "Database Change",
  USER_ACTION = "User Action",
  EVENT = "Event",
  WEBHOOK = "Webhook",
  EMAIL = "Email",
  MESSAGE_QUEUE = "Message Queue",
  TIMER = "Timer",
  MANUAL = "Manual",
  OTHER = "Other",
  SCHEDULE = "SCHEDULE",
  APPROVAL = "APPROVAL"
}

export interface CreateProcessDefinitionRequestDto {
  processKey: string;
  name?: string;
  description?: string;
  category?: string;
  triggerType?: string;
  bpmnXml: string;
  version?: string;
  isActive?: boolean;
  deployImmediately?: boolean;
}

export interface CreateProcessDefinitionRequestDtoOld {
  deploymentName: string;
  deploymentSource?: string;
  tenantId?: string;
  deployChangedOnly?: boolean;
}

export interface DeploymentResponseDto {
  links: Array<{
    method: string;
    href: string;
    rel: string;
  }>;
  id: string;
  name: string;
  source?: string;
  deploymentTime: string;
  tenantId?: string;
  deployedProcessDefinitions?: Record<string, ProcessDefinitionResponseDto>;
  deployedCaseDefinitions?: Record<string, any>;
  deployedDecisionDefinitions?: Record<string, any>;
  deployedDecisionRequirementsDefinitions?: Record<string, any>;
}

// Task-related response wrappers
export interface TasksEmbedded {
  tasks: TaskResponseDto[];
}

export interface TasksResponse extends HateoasResponse<TasksEmbedded> {}

// Process Instance-related response wrappers
export interface ProcessInstancesEmbedded {
  processInstances: ProcessInstanceResponseDto[];
}

export interface ProcessInstancesResponse extends HateoasResponse<ProcessInstancesEmbedded> {}

// Process Definition-related response wrappers
export interface ProcessDefinitionsEmbedded {
  processDefinitionResponseDtoList: ProcessDefinitionResponseDto[];
}

export interface ProcessDefinitionsResponse extends HateoasResponse<ProcessDefinitionsEmbedded> {}

/**
 * Camunda Server Service
 * Provides methods to interact with Camunda BPM Engine APIs
 */
export class CamundaServerService {
  private readonly baseUrl = '/api/camunda/process-definitions';

  private async getAuthHeaders(token: string): Promise<Record<string, string>> {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // ==================== TASK CONTROLLER METHODS ====================
  /**
   * Get unclaimed tasks with pagination
   */
  async getUnclaimedTasks(token: string,page: number = 0, size: number = 20): Promise<TasksResponse> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.get<TasksResponse>(
      `${this.baseUrl}/tasks/unclaimed?page=${page}&size=${size}`,
      { headers }
    );
    return response.data;
  }
  /**
   * Get claimed tasks for current user with pagination
   */
  async getClaimedTasks(token: string,page: number = 0, size: number = 20): Promise<TasksResponse> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.get<TasksResponse>(
      `${this.baseUrl}/tasks/claimed?page=${page}&size=${size}`,
      { headers }
    );
    return response.data;
  }
  /**
   * Get tasks assigned to a specific user with pagination
   */
  async getAssignedTasks(token: string, assignee: string, page: number = 0, size: number = 20): Promise<TasksResponse> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.get<TasksResponse>(
      `${this.baseUrl}/tasks/assigned/${encodeURIComponent(assignee)}?page=${page}&size=${size}`,
      { headers }
    );
    return response.data;
  }
  /**
   * Claim a task for the current user
   */
  async claimTask(token: string, taskId: string): Promise<void> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.post<void>(
      `${this.baseUrl}/tasks/${taskId}/claim`,
      {},
      { headers }
    );
    return response.data;
  }
  /**
   * Complete a task with variables
   */
  async completeTask(token: string, taskId: string, request: CompleteTaskRequestDto): Promise<Record<string, VariableValue> | void> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.post<Record<string, VariableValue> | void>(
      `${this.baseUrl}/tasks/${taskId}/complete`,
      request,
      { headers }
    );
    return response.data;
  }
  /**
   * Get variables for a specific task
   */
  async getTaskVariables(token: string, taskId: string): Promise<Record<string, TaskVariableDto>> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.get<Record<string, TaskVariableDto>>(
      `${this.baseUrl}/tasks/${taskId}/variables`,
      { headers }
    );
    return response.data;
  }

  // ==================== PROCESS INSTANCE CONTROLLER METHODS ====================
  /**
   * Start a new process instance
   */
  async startProcessInstance(token: string, processDefinitionKey: string, request: StartProcessInstanceRequestDto): Promise<ProcessInstanceResponseDto> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.post<ProcessInstanceResponseDto>(
      `${this.baseUrl}/process-instances/${encodeURIComponent(processDefinitionKey)}/start`,
      request,
      { headers }
    );
    return response.data;
  }
  /**
   * Get active process instances with pagination
   */
  async getActiveProcessInstances(token: string, page: number = 0, size: number = 20): Promise<ProcessInstancesResponse> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.get<ProcessInstancesResponse>(
      `${this.baseUrl}/process-instances/active?page=${page}&size=${size}`,
      { headers }
    );
    return response.data;
  }

  /**
   * Get all process instances with pagination
   */
  async getAllProcessInstances(token: string, page: number = 0, size: number = 20): Promise<ProcessInstancesResponse> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.get<ProcessInstancesResponse>(
      `${this.baseUrl}/process-instances?page=${page}&size=${size}`,
      { headers }
    );
    return response.data;
  }
  /**
   * Get variables for a specific process instance
   */
  async getProcessInstanceVariables(token: string, processInstanceId: string): Promise<Record<string, ProcessInstanceVariableDto>> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.get<Record<string, ProcessInstanceVariableDto>>(
      `${this.baseUrl}/process-instances/${processInstanceId}/variables`,
      { headers }
    );
    return response.data;
  }
  /**
   * Suspend a process instance
   */
  async suspendProcessInstance(token: string, processInstanceId: string): Promise<void> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.put<void>(
      `${this.baseUrl}/process-instances/${processInstanceId}/suspend`,
      {},
      { headers }
    );
    return response.data;
  }
  /**
   * Activate a process instance
   */
  async activateProcessInstance(token: string, processInstanceId: string): Promise<void> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.put<void>(
      `${this.baseUrl}/process-instances/${processInstanceId}/activate`,
      {},
      { headers }
    );
    return response.data;
  }

  /**
   * Cancel a process instance
   */
  async cancelProcessInstance(token: string, processInstanceId: string): Promise<void> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.delete<void>(
      `${this.baseUrl}/process-instances/${processInstanceId}`,
      { headers }
    );
    return response.data;
  }

  // ==================== PROCESS DEFINITION CONTROLLER METHODS ====================
  /**
   * Create a new process definition
   */
  async createProcessDefinition(token: string, request: CreateProcessDefinitionRequestDto, bpmnFile?: File): Promise<DeploymentResponseDto> {
    const headers = await this.getAuthHeaders(token);
    //delete headers['Content-Type']; // Let browser set multipart boundary

    if(bpmnFile !== undefined && bpmnFile instanceof File) {
      // Ensure bpmnFile is a valid File object then paste it's content in request.bpmnXml
      request.bpmnXml = await bpmnFile.text();
    } 

    const response = await httpClient.post<DeploymentResponseDto>(
      `${this.baseUrl}`,
      request,
      { headers }
    );
    return response.data;
  }
  /**
   * Search process definitions with pagination
   */
  async searchProcessDefinitions(
    token: string,
    searchTerm: string = '',
    page: number = 0,
    size: number = 20
  ): Promise<ProcessDefinitionsResponse> {
    const headers = await this.getAuthHeaders(token);
    const params = new URLSearchParams({
      search: searchTerm,
      page: page.toString(),
      size: size.toString()
    });

    const response = await httpClient.get<ProcessDefinitionsResponse>(
      `${this.baseUrl}/search?${params.toString()}`,
      { headers }
    );
    return response.data;
  }
  /**
   * Deploy a process definition from multipart file
   */
  async deployProcessDefinition(token: string, bpmnFile: File, deploymentName?: string): Promise<DeploymentResponseDto> {
    const headers = await this.getAuthHeaders(token);
    delete headers['Content-Type']; // Let browser set multipart boundary

    const formData = new FormData();
    if (deploymentName) {
      formData.append('deployment-name', deploymentName);
    }
    formData.append('file', bpmnFile);

    const response = await httpClient.post<DeploymentResponseDto>(
      `${this.baseUrl}/deploy`,
      formData,
      { headers }
    );
    return response.data;
  }
  /**
   * Get all process definitions with pagination
   */
  async getAllProcessDefinitions(token: string, page: number = 0, size: number = 20): Promise<ProcessDefinitionsResponse> {
    const headers = await this.getAuthHeaders(token);
    const response = await httpClient.get<ProcessDefinitionsResponse>(
      `${this.baseUrl}/all?page=${page}&size=${size}`,
      { headers }
    );
    return response.data;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Helper method to create variable value objects
   */
  createVariable(value: any, type: string = 'String', valueInfo?: Record<string, any>): VariableValue {
    return {
      value,
      type,
      valueInfo
    };
  }

  /**
   * Helper method to create variables map
   */
  createVariables(variables: Record<string, any>): Record<string, VariableValue> {
    const result: Record<string, VariableValue> = {};
    
    for (const [key, value] of Object.entries(variables)) {
      let type = 'String';
      
      if (typeof value === 'number') {
        type = Number.isInteger(value) ? 'Integer' : 'Double';
      } else if (typeof value === 'boolean') {
        type = 'Boolean';
      } else if (value instanceof Date) {
        type = 'Date';
      } else if (typeof value === 'object' && value !== null) {
        type = 'Json';
      }
      
      result[key] = this.createVariable(value, type);
    }
    
    return result;
  }

  /**
   * Helper method to parse HATEOAS navigation links
   */
  getNavigationInfo(response: HateoasResponse<any>) {
    return {
      hasNext: !!response._links.next,
      hasPrev: !!response._links.prev,
      currentPage: response.page?.number || 0,
      totalPages: response.page?.totalPages || 0,
      totalElements: response.page?.totalElements || 0,
      pageSize: response.page?.size || 0
    };
  }
}

// Export a singleton instance
export const camundaServerService = new CamundaServerService();
