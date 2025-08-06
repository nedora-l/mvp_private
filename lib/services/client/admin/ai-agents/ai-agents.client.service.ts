import { AIAgent, AIAgentSearchFilter, CreateAIAgentDto, UpdateAIAgentDto, AIAgentStatus, AIAgentType } from '@/lib/interfaces/apis/ai-agents/common';
import { ApiResponse } from '@/lib/interfaces/apis/common';
import { getStoredToken } from '@/lib/services/auth/token-storage';
import apiClient from '../../api-client';
const AI_AGENTS_BASE_PATH = '/admin/ai-agents';

// Use real API, not mock
export const getAIAgentsClientApi = async (params?: AIAgentSearchFilter & { type?: AIAgentType | 'all'; status?: AIAgentStatus | 'all' }): Promise<ApiResponse<AIAgent[]>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<AIAgent[]>>(AI_AGENTS_BASE_PATH, {
    method: 'GET',
    params,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

export const getAIAgentByIdClientApi = async (id: string): Promise<ApiResponse<AIAgent>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<AIAgent>>(`${AI_AGENTS_BASE_PATH}/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

export const createAIAgentClientApi = async (data: CreateAIAgentDto): Promise<ApiResponse<AIAgent>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<AIAgent>>(AI_AGENTS_BASE_PATH, {
    method: 'POST',
    body: data,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

export const updateAIAgentClientApi = async (data: UpdateAIAgentDto): Promise<ApiResponse<AIAgent>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<AIAgent>>(`${AI_AGENTS_BASE_PATH}/${data.id}`, {
    method: 'PUT',
    body: data,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

export const deleteAIAgentClientApi = async (id: string): Promise<ApiResponse<void>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<void>>(`${AI_AGENTS_BASE_PATH}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};

export const toggleAIAgentStatusClientApi = async (id: string, status: 'active' | 'inactive'): Promise<ApiResponse<AIAgent>> => {
  const token = getStoredToken();
  return apiClient<ApiResponse<AIAgent>>(`${AI_AGENTS_BASE_PATH}/${id}/status`, {
    method: 'PATCH',
    body: { status },
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};
