/**
 * Ollama Title Adapter
 * Transforms title generation requests into Ollama API calls
 */
export interface OllamaTitleRequest {
    prompt: string;
    model: string;
    maxTokens: number;
    temperature: number;
}
export interface OllamaTitleResponse {
    response: string;
    tokensUsed?: number;
    model: string;
}
export declare const ollamaTitleAdapter: {
    generateTitle(request: OllamaTitleRequest): Promise<OllamaTitleResponse>;
};
