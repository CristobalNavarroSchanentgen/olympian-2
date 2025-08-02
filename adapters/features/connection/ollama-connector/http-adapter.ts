/**
 * HTTP Adapter for Ollama Connector
 * Transforms between HTTP client utility and ollama-connector feature expectations
 */

import { OllamaStatus, ModelsResponse } from '../../../../features/connection/ollama-connector/contract';

export interface HttpClient {
  get<T>(url: string): Promise<{ data: T; status: number }>;
}

export class OllamaHttpAdapter {
  constructor(private httpClient: HttpClient, private baseUrl: string = '/api/ollama') {}

  async getStatus(): Promise<OllamaStatus> {
    const response = await this.httpClient.get<OllamaStatus>(`${this.baseUrl}/status`);
    return response.data;
  }

  async getModels(): Promise<ModelsResponse> {
    const response = await this.httpClient.get<ModelsResponse>(`${this.baseUrl}/models`);
    return response.data;
  }
}
