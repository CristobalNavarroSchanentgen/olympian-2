/**
 * MCP Service Implementation (Stub for Phase 1)
 * Will be replaced with real MCP integration in Phase 3
 */
import { McpService } from '@olympian/shared/services/mcp-service';
import { McpServerStatus } from '@olympian/shared/models/mcp/server-config';
import { ToolDefinition } from '@olympian/shared/models/mcp/tool-definition';
import { ExecutionResult } from '@olympian/shared/models/mcp/execution-result';
export declare class McpServiceImpl implements McpService {
    private servers;
    startServer(serverName: string): Promise<boolean>;
    stopServer(serverName: string): Promise<boolean>;
    listServers(): Promise<McpServerStatus[]>;
    listTools(): Promise<ToolDefinition[]>;
    executeTool(toolName: string, args: Record<string, unknown>): Promise<ExecutionResult>;
}
