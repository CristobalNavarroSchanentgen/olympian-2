/**
 * Protocol Handler Utility
 */
export interface McpMessage {
    id: string;
    method: string;
    params: Record<string, unknown>;
}
export interface McpResponse {
    id: string;
    result?: unknown;
    error?: {
        code: number;
        message: string;
    };
}
export declare function parseMessage(data: string): McpMessage | null;
export declare function formatMessage(message: McpMessage): string;
export declare function createRequest(method: string, params: Record<string, unknown>): McpMessage;
export interface ProtocolMessage {
    id: string;
    method: string;
    params?: Record<string, unknown>;
    timestamp: Date;
}
export interface ProtocolResponse {
    id: string;
    result?: unknown;
    error?: string;
    timestamp: Date;
}
export interface ProtocolHandler {
    sendMessage(message: ProtocolMessage): Promise<void>;
    handleResponse(response: ProtocolResponse): void;
    onMessage(callback: (message: ProtocolMessage) => void): void;
}
export declare function createProtocolHandler(): ProtocolHandler;
//# sourceMappingURL=protocol-handler.d.ts.map