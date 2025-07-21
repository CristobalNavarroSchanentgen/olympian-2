/**
 * Feature Contract: MCP Server Manager
 * 
 * Manages lifecycle of MCP servers running as stdio child processes.
 */

import { ServerConfig } from '../../../models/mcp';
import { McpService } from '../../../services/mcp-service';
import { ServerStarted, ServerStopped, ServerError } from '../../../events';
import { ServerManagerConfig } from '../../../config/features/mcp/server-manager/schema';

export interface ServerManagerContract {
  // === SERVER LIFECYCLE ===
  
  /**
   * Start MCP server from configuration
   */
  startServer(serverName: string, config: ServerConfig): Promise<{
    serverId: string;
    processId: number;
    status: 'starting' | 'running' | 'failed';
    capabilities: string[];
  }>;
  
  /**
   * Stop running MCP server gracefully
   */
  stopServer(serverId: string, options?: {
    graceful?: boolean;
    timeout?: number;
  }): Promise<void>;
  
  /**
   * Restart MCP server with updated configuration
   */
  restartServer(serverId: string, newConfig?: ServerConfig): Promise<{
    serverId: string;
    processId: number;
    status: string;
  }>;
  
  /**
   * Get status of all managed servers
   */
  getServerStatus(): Promise<Array<{
    serverId: string;
    name: string;
    status: 'running' | 'stopped' | 'failed' | 'starting';
    processId?: number;
    uptime: number;
    lastError?: string;
  }>>;
  
  // === CONFIGURATION MANAGEMENT ===
  
  /**
   * Load server configurations from mcp.configon
   */
  loadConfiguration(configPath?: string): Promise<{
    serversLoaded: number;
    serversStarted: number;
    errors: Array<{ server: string; error: string }>;
  }>;
  
  /**
   * Reload configuration and restart affected servers
   */
  reloadConfiguration(): Promise<{
    serversRestarted: number;
    newServers: number;
    removedServers: number;
  }>;
  
  /**
   * Validate server configuration
   */
  validateConfiguration(config: ServerConfig): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>;
  
  // === PROCESS MONITORING ===
  
  /**
   * Monitor server health and performance
   */
  monitorServers(): Promise<Array<{
    serverId: string;
    healthStatus: 'healthy' | 'warning' | 'critical';
    memoryUsage: number;
    cpuUsage: number;
    responseTime: number;
    lastHeartbeat: Date;
  }>>;
  
  /**
   * Get server logs and diagnostics
   */
  getServerLogs(serverId: string, options?: {
    lines?: number;
    level?: 'debug' | 'info' | 'warn' | 'error';
    since?: Date;
  }): Promise<Array<{
    timestamp: Date;
    level: string;
    message: string;
    context?: Record<string, unknown>;
  }>>;
  
  // === ERROR HANDLING ===
  
  /**
   * Handle server failures and auto-recovery
   */
  handleServerFailure(serverId: string, error: Error): Promise<{
    action: 'restart' | 'stop' | 'ignore';
    retryCount: number;
    nextRetry?: Date;
  }>;
  
  /**
   * Clean up orphaned processes
   */
  cleanupOrphanedProcesses(): Promise<{
    processesFound: number;
    processesCleaned: number;
  }>;
  
  // === CONFIGURATION ===
  
  updateConfig(config: Partial<ServerManagerConfig>): Promise<void>;
  getConfig(): ServerManagerConfig;
}

// === ADAPTER INTERFACES ===

export interface ProcessAdapter {
  spawn(command: string, args: string[], options: {
    env?: Record<string, string>;
    cwd?: string;
    stdio: ['pipe', 'pipe', 'pipe'];
  }): Promise<{
    process: NodeJS.Process;
    stdin: NodeJS.WritableStream;
    stdout: NodeJS.ReadableStream;
    stderr: NodeJS.ReadableStream;
  }>;
  
  kill(processId: number, signal?: string): Promise<boolean>;
  isRunning(processId: number): Promise<boolean>;
  getProcessInfo(processId: number): Promise<{
    memory: number;
    cpu: number;
    uptime: number;
  }>;
}

export interface StdioAdapter {
  setupStdioChannel(serverId: string, process: NodeJS.Process): Promise<{
    send: (message: string) => Promise<void>;
    onMessage: (callback: (message: string) => void) => void;
    onError: (callback: (error: Error) => void) => void;
    close: () => Promise<void>;
  }>;
  
  sendMessage(serverId: string, message: string): Promise<void>;
  closeChannel(serverId: string): Promise<void>;
}

export interface ConfigAdapter {
  parseConfiguration(configPath: string): Promise<Record<string, ServerConfig>>;
  validateServerConfig(config: ServerConfig): { isValid: boolean; errors: string[] };
  injectEnvironmentVariables(config: ServerConfig): ServerConfig;
}

// === EVENT PUBLISHERS ===

export interface ServerEventPublisher {
  publishServerStarted(event: ServerStarted): void;
  publishServerStopped(event: ServerStopped): void;
  publishServerError(event: ServerError): void;
}

// === EXTERNAL DEPENDENCIES ===

export interface ServerManagerDependencies {
  mcpService: McpService;
  processAdapter: ProcessAdapter;
  stdioAdapter: StdioAdapter;
  configAdapter: ConfigAdapter;
  eventPublisher: ServerEventPublisher;
  config: ServerManagerConfig;
}
