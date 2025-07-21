import { ToolDefinition } from '../../../models/mcp';
import { ExecutionResult } from '../../../models/mcp';
/**
 * MCP protocol adapter for tool execution
 * Transforms protocol handling utilities for tool-executor feature
 *
 * AI-Native Rule: This adapter is owned exclusively by tool-executor
 */
export interface McpProtocolAdapter {
    discoverTools(serverId: string): Promise<ToolDefinition[]>;
    getToolSchema(serverId: string, toolName: string): Promise<ToolSchema>;
    executeToolCall(serverId: string, toolName: string, parameters: any): Promise<ExecutionResult>;
    sendInitialize(serverId: string): Promise<void>;
    sendListTools(serverId: string): Promise<ToolDefinition[]>;
    sendCallTool(serverId: string, name: string, arguments: any): Promise<any>;
}
export interface ToolSchema {
    name: string;
    description: string;
    inputSchema: any;
    outputSchema?: any;
    examples?: ToolExample[];
}
export interface ToolExample {
    description: string;
    input: any;
    output: any;
}
export declare function createMcpProtocolAdapter(): McpProtocolAdapter;
//# sourceMappingURL=mcp-protocol-adapter.d.ts.map