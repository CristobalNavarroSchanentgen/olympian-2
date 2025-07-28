/**
 * MCP Server Configuration Models
 */

import type { HealthCheckConfig } from '../connection/health-status';

export interface McpServerConfig {
  command: string;
  args: string[];
  env: Record<string, string>;
  disabled: boolean;
  metadata: Record<string, unknown>;
}

export interface McpConfigFile {
  servers: Record<string, McpServerConfig>;
  version: string;
  metadata: Record<string, unknown>;
}

export interface ServerConfig extends McpServerConfig {
  name: string;
  id: string;
  workingDirectory?: string;
  environment?: Record<string, string>;
  timeout?: number;
  retries?: number;
  healthCheck?: HealthCheckConfig;
}

// Server status type
export interface McpServerStatus {
  serverId: string;
  name: string;
  status: 'running' | 'stopped' | 'failed' | 'starting';
  processId?: number;
  uptime: number;
  lastError?: string;
  capabilities: string[];
}
