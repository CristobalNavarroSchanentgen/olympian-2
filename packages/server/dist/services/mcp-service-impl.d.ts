/**
 * MCP Service Implementation (Stub for Phase 1)
 * Will be replaced with real MCP integration in Phase 3
 */
import { McpService } from '@olympian/shared/services/mcp-service';
import { McpServerConfig, McpServerStatus } from '@olympian/shared/models/mcp/server-config';
import { ToolDefinition } from '@olympian/shared/models/mcp/tool-definition';
import { ExecutionResult } from '@olympian/shared/models/mcp/execution-result';
export declare class McpServiceImpl implements McpService {
    private servers;
    private serverConfigs;
    private serverTools;
    private nextExecutionId;
    startServer(serverName: string): Promise<boolean>;
    stopServer(serverName: string): Promise<boolean>;
    restartServer(serverName: string): Promise<boolean>;
    getServerStatus(serverName: string): Promise<McpServerStatus | null>;
    getAllServerStatuses(): Promise<Record<string, McpServerStatus>>;
    getAvailableTools(): Promise<ToolDefinition[]>;
    getServerTools(serverName: string): Promise<ToolDefinition[]>;
    executeTool(toolName: string, arguments_: Record<string, unknown>, timeout?: number): Promise<ExecutionResult>;
    isServerHealthy(serverName: string): Promise<boolean>;
    getServerConfig(serverName: string): Promise<McpServerConfig | null>;
    updateServerConfig(serverName: string, config: Partial<McpServerConfig>): Promise<boolean>;
}
