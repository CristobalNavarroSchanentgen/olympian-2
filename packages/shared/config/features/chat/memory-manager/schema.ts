/**
 * Configuration Schema: Chat Memory Manager
 * 
 * Validates configuration for context and memory management.
 */

export interface MemoryManagerConfig {
  readonly context: {
    readonly defaultTokenBudget: number;
    readonly maxTokenBudget: number;
    readonly includeSystemPrompt: boolean;
    readonly contextPreservationRatio: number;
  };
  
  readonly cleanup: {
    readonly autoCleanupEnabled: boolean;
    readonly cleanupThreshold: number;
    readonly messagesRetained: number;
    readonly cleanupInterval: number;
  };
  
  readonly optimization: {
    readonly compressionEnabled: boolean;
    readonly summaryTokenLimit: number;
    readonly priorityScoring: boolean;
    readonly semanticGrouping: boolean;
  };
  
  readonly storage: {
    readonly persistContext: boolean;
    readonly contextCacheTimeout: number;
    readonly maxCachedContexts: number;
  };
}

export const memoryManagerDefaults: MemoryManagerConfig = {
  context: {
    defaultTokenBudget: 4000,
    maxTokenBudget: 8000,
    includeSystemPrompt: true,
    contextPreservationRatio: 0.8,
  },
  
  cleanup: {
    autoCleanupEnabled: true,
    cleanupThreshold: 6000,
    messagesRetained: 20,
    cleanupInterval: 60000,
  },
  
  optimization: {
    compressionEnabled: false,
    summaryTokenLimit: 500,
    priorityScoring: true,
    semanticGrouping: false,
  },
  
  storage: {
    persistContext: true,
    contextCacheTimeout: 300000,
    maxCachedContexts: 50,
  },
};

export function validateMemoryManagerConfig(
  config: unknown
): config is MemoryManagerConfig {
  if (!config || typeof config !== 'object') return false;
  
  const c = config as Record<string, unknown>;
  
  return (
    typeof c.context === 'object' &&
    typeof c.cleanup === 'object' &&
    typeof c.optimization === 'object' &&
    typeof c.storage === 'object'
  );
}
