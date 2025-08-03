/**
 * MCP service contract
 */

import { McpServerConfig, McpServerStatus } from '../models/mcp/server-config';
import { ToolDefinition } from '../models/mcp/tool-definition';
import { ExecutionResult } from '../models/mcp/execution-result';

export interface McpService {
  /**
   * Start MCP server
   */
  startServer(serverName: string): Promise<boolean>;

  /**
   * Stop MCP server
   */
  stopServer(serverName: string): Promise<boolean>;

  /**
   * Restart MCP server
   */
  restartServer(serverName: string): Promise<boolean>;

  /**
   * Get server status
   */
  getServerStatus(serverName: string): Promise<McpServerStatus | null>;

  /**
   * Get all server statuses
   */
  getAllServerStatuses(): Promise<Record<string, McpServerStatus>>;

  /**
   * Get available tools from all servers
   */
  getAvailableTools(): Promise<ToolDefinition[]>;

  /**
   * Get tools from specific server
   */
  getServerTools(serverName: string): Promise<ToolDefinition[]>;

  /**
   * Execute tool
   */
  executeTool(
    toolName: string,
    arguments_: Record<string, unknown>,
    timeout?: number
  ): Promise<ExecutionResult>;

  /**
   * Check if server is healthy
   */
  isServerHealthy(serverName: string): Promise<boolean>;

  /**
   * Get server configuration
   */
  getServerConfig(serverName: string): Promise<McpServerConfig | null>;

  /**
   * Update server configuration
   */
  updateServerConfig(
    serverName: string,
    config: Partial<McpServerConfig>
  ): Promise<boolean>;
}
