/**
 * Configuration Schema: MCP Tool Executor
 * 
 * Validates configuration for MCP tool execution and management.
 */

export interface ToolExecutorConfig {
  readonly execution: {
    readonly maxConcurrentTools: number;
    readonly executionTimeout: number;
    readonly retryAttempts: number;
    readonly retryDelay: number;
  };
  
  readonly protocol: {
    readonly messageBufferSize: number;
    readonly responseTimeout: number;
    readonly maxMessageSize: number;
    readonly compressionEnabled: boolean;
  };
  
  readonly security: {
    readonly allowedTools: string[] | 'all';
    readonly blockedTools: string[];
    readonly requireConfirmation: boolean;
    readonly sandboxEnabled: boolean;
  };
  
  readonly caching: {
    readonly enableResultCache: boolean;
    readonly cacheTimeout: number;
    readonly maxCacheSize: number;
    readonly cachePersistent: boolean;
  };
}

export const toolExecutorDefaults: ToolExecutorConfig = {
  execution: {
    maxConcurrentTools: 5,
    executionTimeout: 60000,
    retryAttempts: 2,
    retryDelay: 1000,
  },
  
  protocol: {
    messageBufferSize: 1024 * 1024,
    responseTimeout: 30000,
    maxMessageSize: 10 * 1024 * 1024,
    compressionEnabled: false,
  },
  
  security: {
    allowedTools: 'all',
    blockedTools: [],
    requireConfirmation: false,
    sandboxEnabled: true,
  },
  
  caching: {
    enableResultCache: true,
    cacheTimeout: 300000, // 5 minutes
    maxCacheSize: 100,
    cachePersistent: false,
  },
};

export function validateToolExecutorConfig(
  config: unknown
): config is ToolExecutorConfig {
  if (!config || typeof config !== 'object') return false;
  
  const c = config as Record<string, unknown>;
  
  return (
    typeof c.execution === 'object' &&
    typeof c.protocol === 'object' &&
    typeof c.security === 'object' &&
    typeof c.caching === 'object'
  );
}
