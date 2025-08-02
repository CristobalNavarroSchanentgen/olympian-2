/**
 * MCP Server Manager Contract
 * Manages MCP server lifecycle and connections
 */

export interface MCPServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  autoStart?: boolean;
}

export interface MCPServerStatus {
  name: string;
  status: 'running' | 'stopped' | 'error' | 'starting' | 'stopping';
  pid?: number;
  uptime?: number;
  lastError?: string;
  capabilities?: string[];
}

export interface MCPServerManagerContract {
  /**
   * Get all configured MCP servers
   */
  getServers(): Promise<MCPServerStatus[]>;
  
  /**
   * Get specific server status
   */
  getServer(name: string): Promise<MCPServerStatus | null>;
  
  /**
   * Start an MCP server
   */
  startServer(name: string): Promise<boolean>;
  
  /**
   * Stop an MCP server
   */
  stopServer(name: string): Promise<boolean>;
  
  /**
   * Restart an MCP server
   */
  restartServer(name: string): Promise<boolean>;
  
  /**
   * Add a new server configuration
   */
  addServer(config: MCPServerConfig): Promise<boolean>;
  
  /**
   * Remove a server configuration
   */
  removeServer(name: string): Promise<boolean>;
  
  /**
   * Test server connection
   */
  testConnection(name: string): Promise<boolean>;
}
