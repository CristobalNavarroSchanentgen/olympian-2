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
//# sourceMappingURL=protocol-handler.d.ts.map