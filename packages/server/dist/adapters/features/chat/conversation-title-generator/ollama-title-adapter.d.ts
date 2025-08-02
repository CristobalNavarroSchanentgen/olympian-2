/**
 * Ollama Title Adapter
 * Transforms title generation requests for Ollama API
 */
export interface OllamaCompletionRequest {
    model: string;
    prompt: string;
    maxTokens: number;
    temperature: number;
}
export interface OllamaCompletionResponse {
    content: string;
    tokens: number;
}
export declare class OllamaTitleAdapter {
    private httpClient;
    private baseUrl;
    constructor(httpClient: any, baseUrl?: string);
    generateCompletion(request: OllamaCompletionRequest): Promise<OllamaCompletionResponse>;
    isModelAvailable(modelName: string): Promise<boolean>;
}
