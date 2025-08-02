/**
 * MCP Tool Executor Contract
 * Handles tool discovery and execution via MCP protocol
 */

export interface MCPTool {
  name: string;
  description: string;
  server: string;
  inputSchema: any;
  outputSchema?: any;
}

export interface ToolExecutionRequest {
  serverName: string;
  toolName: string;
  arguments: any;
  timeout?: number;
}

export interface ToolExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  executionTime: number;
  timestamp: Date;
}

export interface MCPToolExecutorContract {
  /**
   * Get all available tools from all servers
   */
  getTools(): Promise<MCPTool[]>;
  
  /**
   * Get tools from a specific server
   */
  getToolsFromServer(serverName: string): Promise<MCPTool[]>;
  
  /**
   * Get specific tool information
   */
  getTool(serverName: string, toolName: string): Promise<MCPTool | null>;
  
  /**
   * Execute a tool with given arguments
   */
  executeTool(request: ToolExecutionRequest): Promise<ToolExecutionResult>;
  
  /**
   * Validate tool arguments against schema
   */
  validateArguments(serverName: string, toolName: string, args: any): Promise<boolean>;
  
  /**
   * Refresh tool list from all servers
   */
  refreshTools(): Promise<void>;
}
