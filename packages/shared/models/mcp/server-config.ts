/**
 * MCP server configuration model - pure types only
 */

export interface McpServerConfig {
  readonly name: string;
  readonly command: string;
  readonly args: string[];
  readonly env?: Record<string, string>;
  readonly cwd?: string;
  readonly runner: McpRunner;
  readonly enabled: boolean;
}

export type McpRunner = 'npx' | 'uv' | 'uvx' | 'node' | 'python';

export interface McpConfigFile {
  readonly version: string;
  readonly servers: Record<string, McpServerConfig>;
  readonly globalEnv?: Record<string, string>;
}

export interface McpServerStatus {
  readonly name: string;
  readonly status: ProcessStatus;
  readonly pid?: number;
  readonly startTime?: Date;
  readonly restartCount: number;
  readonly lastError?: string;
}

export type ProcessStatus = 'stopped' | 'starting' | 'running' | 'error' | 'crashed';

export interface McpServerHealth {
  readonly name: string;
  readonly healthy: boolean;
  readonly latency?: number;
  readonly lastPing?: Date;
  readonly toolCount: number;
}
