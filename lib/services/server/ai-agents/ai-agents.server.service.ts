

  import { httpClient } from '@/lib/utils/http-client';
import {
    AiAgentDto,
    CreateAiAgentRequestDto,
    UpdateAiAgentRequestDto,
  } from './ai-agents.dto';
import { HateoasPagination, HateoasResponse } from '@/lib/interfaces/apis';
  
  // For server-side token management - not persisted between requests
  export const SERVER_API_BASE_URL = '/api/ai/agents';
  
  export class AiAgentsServerService {
    getHeaders(accessToken: string, isMultipart: boolean = false) {
      const headers: HeadersInit = {
        'x-requested-with': 'XMLHttpRequest',
        Authorization: `Bearer ${accessToken}`,
      };
      if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
      }
      return headers;
    }
  
    /**
     * Get all AI agents for the organization
     * GET /api/ai/agents
     * @param accessToken The access token for authorization
     * @param pagination Optional pagination parameters
     * @returns A paginated response of AI agents
     */
    async getAllAgents(
      accessToken: string,
      pagination?: HateoasPagination
    ): Promise<HateoasResponse<AiAgentDto>> {
      const url = SERVER_API_BASE_URL;
      const response = await httpClient.get<HateoasResponse<AiAgentDto>>(url, {
        headers: this.getHeaders(accessToken),
      });
      return response.data;
    }
  
    /**
     * Get a specific AI agent by ID
     * GET /api/ai/agents/{id}
     * @param accessToken The access token for authorization
     * @param id The ID of the AI agent
     * @returns The AI agent
     */
    async getAgentById(accessToken: string, id: number): Promise<AiAgentDto> {
      const url = `${SERVER_API_BASE_URL}/${id}`;
      const response = await httpClient.get<AiAgentDto>(url, {
        headers: this.getHeaders(accessToken),
      });
      return response.data;
    }
  
    /**
     * Get a specific AI agent by slug
     * GET /api/ai/agents/slug/{slug}
     * @param accessToken The access token for authorization
     * @param slug The slug of the AI agent
     * @returns The AI agent
     */
    async getAgentBySlug(accessToken: string, slug: string): Promise<AiAgentDto> {
      const url = `${SERVER_API_BASE_URL}/slug/${slug}`;
      const response = await httpClient.get<AiAgentDto>(url, {
        headers: this.getHeaders(accessToken),
      });
      return response.data;
    }
  
    /**
     * Create a new AI agent CreateAiAgentRequestDto
     * POST /api/ai/agents
     * @param accessToken The access token for authorization
     * @param agentData The data for the new agent
     * @returns The created AI agent
     */
    async createAgent(
      accessToken: string,
      agentData: CreateAiAgentRequestDto
    ): Promise<AiAgentDto> {
      const response = await httpClient.post<AiAgentDto>(SERVER_API_BASE_URL, 
        agentData, 
        {
          headers: this.getHeaders(accessToken),
        }
    );
      return response.data;
    }
  
    /**
     * Update an existing AI agent
     * PUT /api/ai/agents/{id}
     * @param accessToken The access token for authorization
     * @param id The ID of the agent to update
     * @param agentData The updated data for the agent
     * @returns The updated AI agent
     */
    async updateAgent(
      accessToken: string,
      id: number,
      agentData: UpdateAiAgentRequestDto
    ): Promise<AiAgentDto> {
      const url = `${SERVER_API_BASE_URL}/${id}`;
      const response = await httpClient.put<AiAgentDto>(url, agentData, {
        headers: this.getHeaders(accessToken),
      });
      return response.data;
    }
  
    /**
     * Delete an AI agent
     * DELETE /api/ai/agents/{id}
     * @param accessToken The access token for authorization
     * @param id The ID of the agent to delete
     */
    async deleteAgent(accessToken: string, id: number): Promise<void> {
      const url = `${SERVER_API_BASE_URL}/${id}`;
      await httpClient.delete(url, {
        headers: this.getHeaders(accessToken),
      });
    }
  
    /**
     * Get all AI agents globally (admin)
     * GET /api/ai/agents/global
     * @param accessToken The access token for authorization
     * @param pagination Optional pagination parameters
     * @returns A paginated response of AI agents
     */
    async getAllAgentsGlobally(
      accessToken: string,
      pagination?: HateoasPagination
    ): Promise<HateoasResponse<AiAgentDto>> {
      const url = `${SERVER_API_BASE_URL}/global`;
      const response = await httpClient.get(url, {
        headers: this.getHeaders(accessToken),
      });
      return response.data as HateoasResponse<AiAgentDto>;
    }
  }
  
  // Export a default instance
  export const aiAgentsServerService = new AiAgentsServerService();
