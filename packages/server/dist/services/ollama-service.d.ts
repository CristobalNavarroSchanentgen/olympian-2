interface OllamaModel {
    name: string;
    size: number;
    digest: string;
    modified_at: string;
}
interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    images?: string[];
}
interface ChatRequest {
    model: string;
    messages: ChatMessage[];
    stream?: boolean;
}
interface ChatResponse {
    model: string;
    created_at: string;
    message: {
        role: string;
        content: string;
        tool_calls?: any[];
    };
    done: boolean;
}
export declare class OllamaService {
    private client;
    private connected;
    private baseUrl;
    constructor();
    private testConnection;
    isConnected(): boolean;
    getModels(): Promise<OllamaModel[]>;
    streamChat(request: ChatRequest): AsyncGenerator<ChatResponse>;
    chat(request: ChatRequest): Promise<ChatResponse>;
    getBaseUrl(): string;
    getModelInfo(modelName: string): Promise<any>;
    pullModel(modelName: string): Promise<boolean>;
    checkModel(modelName: string): Promise<boolean>;
}
export {};
