export interface OllamaService {
    isConnected(): boolean;
    streamChat(request: any): AsyncIterable<any>;
}
export declare class OllamaServiceImpl implements OllamaService {
    isConnected(): boolean;
    streamChat(request: any): AsyncIterable<any>;
}
