/**
 * HTTP Adapter for Ollama Connector
 * Transforms between HTTP client utility and ollama-connector feature expectations
 */
import { OllamaStatus, ModelsResponse } from '../../../../features/connection/ollama-connector/contract';
export interface HttpClient {
    get<T>(url: string): Promise<{
        data: T;
        status: number;
    }>;
}
export declare class OllamaHttpAdapter {
    private httpClient;
    private baseUrl;
    constructor(httpClient: HttpClient, baseUrl?: string);
    getStatus(): Promise<OllamaStatus>;
    getModels(): Promise<ModelsResponse>;
}
