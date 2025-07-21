import { EventEmitter } from 'events';
import { McpServerConfig, ToolDefinition, ExecutionResult } from '@olympian/shared';
export declare class MCPManager extends EventEmitter {
    private processes;
    private messageId;
    private pendingRequests;
    initialize(): Promise<void>;
    startServer(name: string, config: McpServerConfig): Promise<void>;
    stopServer(name: string): Promise<void>;
    restartServer(name: string): Promise<void>;
    discoverTools(serverName: string): Promise<ToolDefinition[]>;
    executeTool(serverName: string, toolName: string, arguments_: any): Promise<ExecutionResult>;
    getAllTools(): ToolDefinition[];
    getServerStatus(): Array<{
        name: string;
        status: string;
        toolCount: number;
    }>;
    private sendMCPRequest;
    private handleMCPMessage;
    private getNextMessageId;
}
