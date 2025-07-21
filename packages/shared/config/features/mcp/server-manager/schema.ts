/**
 * Configuration Schema: MCP Server Manager
 * 
 * Validates configuration for MCP server lifecycle management.
 */

export interface ServerManagerConfig {
  readonly processes: {
    readonly maxServers: number;
    readonly startupTimeout: number;
    readonly shutdownTimeout: number;
    readonly restartDelay: number;
  };
  
  readonly stdio: {
    readonly bufferSize: number;
    readonly flushInterval: number;
    readonly messageTimeout: number;
    readonly heartbeatInterval: number;
  };
  
  readonly monitoring: {
    readonly healthCheckInterval: number;
    readonly maxFailures: number;
    readonly memoryThreshold: number;
    readonly cpuThreshold: number;
  };
  
  readonly lifecycle: {
    readonly autoRestart: boolean;
    readonly gracefulShutdown: boolean;
    readonly cleanupOrphans: boolean;
    readonly logRetention: number;
  };
}

export const serverManagerDefaults: ServerManagerConfig = {
  processes: {
    maxServers: 10,
    startupTimeout: 30000,
    shutdownTimeout: 10000,
    restartDelay: 5000,
  },
  
  stdio: {
    bufferSize: 64 * 1024,
    flushInterval: 100,
    messageTimeout: 30000,
    heartbeatInterval: 60000,
  },
  
  monitoring: {
    healthCheckInterval: 30000,
    maxFailures: 3,
    memoryThreshold: 512 * 1024 * 1024,
    cpuThreshold: 80,
  },
  
  lifecycle: {
    autoRestart: true,
    gracefulShutdown: true,
    cleanupOrphans: true,
    logRetention: 86400000, // 24 hours
  },
};

export function validateServerManagerConfig(
  config: unknown
): config is ServerManagerConfig {
  if (!config || typeof config !== 'object') return false;
  
  const c = config as Record<string, unknown>;
  
  return (
    typeof c.processes === 'object' &&
    typeof c.stdio === 'object' &&
    typeof c.monitoring === 'object' &&
    typeof c.lifecycle === 'object'
  );
}
