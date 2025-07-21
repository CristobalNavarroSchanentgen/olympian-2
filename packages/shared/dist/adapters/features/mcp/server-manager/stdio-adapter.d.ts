import { ProtocolMessage, ProtocolResponse } from '../../../utils/protocol-handler';
/**
 * STDIO adapter for MCP server communication
 * Transforms stdio protocol handling for server-manager feature
 *
 * AI-Native Rule: This adapter is owned exclusively by server-manager
 */
export interface StdioAdapter {
    createConnection(serverId: string, process: any): StdioConnection;
    closeConnection(serverId: string): Promise<void>;
    sendMessage(serverId: string, message: ProtocolMessage): Promise<ProtocolResponse>;
    sendNotification(serverId: string, method: string, params?: any): Promise<void>;
    onMessage(serverId: string, handler: (message: ProtocolMessage) => void): void;
    onError(serverId: string, handler: (error: Error) => void): void;
    onClose(serverId: string, handler: () => void): void;
}
export interface StdioConnection {
    serverId: string;
    process: any;
    stdin: NodeJS.WritableStream;
    stdout: NodeJS.ReadableStream;
    stderr: NodeJS.ReadableStream;
    handler: any;
    isActive: boolean;
}
export declare function createStdioAdapter(): StdioAdapter;
//# sourceMappingURL=stdio-adapter.d.ts.map