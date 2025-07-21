import { Message } from '../../../models/chat/message';
/**
 * Ollama adapter for message processing
 * Transforms HTTP communication with Ollama for message-processor feature
 *
 * AI-Native Rule: This adapter is owned exclusively by message-processor
 */
export interface OllamaAdapter {
    processMessage(model: string, messages: Message[], options?: ProcessingOptions): Promise<string>;
    streamMessage(model: string, messages: Message[], onToken: (token: string) => void): Promise<void>;
    listModels(): Promise<ModelInfo[]>;
    getModelInfo(name: string): Promise<ModelInfo>;
    checkHealth(): Promise<boolean>;
    getVersion(): Promise<string>;
}
export interface ProcessingOptions {
    temperature?: number;
    maxTokens?: number;
    stop?: string[];
    stream?: boolean;
}
export interface ModelInfo {
    name: string;
    size: number;
    digest: string;
    capabilities: string[];
}
export declare function createOllamaAdapter(baseUrl: string): OllamaAdapter;
//# sourceMappingURL=ollama-adapter.d.ts.map