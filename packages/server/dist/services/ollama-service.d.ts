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
    private connectionAttempts;
    private lastSuccessfulConnection?;
    private reconnectInterval?;
    private modelRegistry?;
    constructor();
    private shouldLogVerbose;
    private logConnectionDetails;
    private recordConnectionAttempt;
    private testConnection;
    private setupReconnectMonitoring;
    isConnected(): boolean;
    getConnectionStats(): {
        connected: boolean;
        baseUrl: string;
        lastSuccessfulConnection: Date | undefined;
        totalAttempts: number;
        recentAttempts: number;
        recentSuccesses: number;
        recentFailures: number;
        averageResponseTime: number | null;
    };
    getModels(): Promise<OllamaModel[]>;
    streamChat(request: ChatRequest): AsyncGenerator<ChatResponse>;
    chat(request: ChatRequest): Promise<ChatResponse>;
    getBaseUrl(): string;
    getModelInfo(modelName: string): Promise<any>;
    pullModel(modelName: string): Promise<boolean>;
    checkModel(modelName: string): Promise<boolean>;
    destroy(): void;
}
export {};
