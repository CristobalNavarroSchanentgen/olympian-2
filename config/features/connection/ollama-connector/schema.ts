/**
 * Configuration Schema: Ollama Connector
 * 
 * Validates configuration for Ollama instance connection management.
 */

export interface OllamaConnectorConfig {
  readonly connection: {
    readonly baseUrl: string;
    readonly timeout: number;
    readonly retryAttempts: number;
    readonly retryDelay: number;
  };
  
  readonly health: {
    readonly checkInterval: number;
    readonly checkTimeout: number;
    readonly failureThreshold: number;
    readonly recoveryThreshold: number;
  };
  
  readonly requests: {
    readonly maxConcurrent: number;
    readonly queueTimeout: number;
    readonly keepAlive: boolean;
    readonly compressionEnabled: boolean;
  };
  
  readonly models: {
    readonly autoDiscovery: boolean;
    readonly discoveryInterval: number;
    readonly cacheModels: boolean;
    readonly preloadModels: string[];
  };
}

export const ollamaConnectorDefaults: OllamaConnectorConfig = {
  connection: {
    baseUrl: 'http://localhost:11434',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 2000,
  },
  
  health: {
    checkInterval: 30000,
    checkTimeout: 5000,
    failureThreshold: 3,
    recoveryThreshold: 2,
  },
  
  requests: {
    maxConcurrent: 5,
    queueTimeout: 60000,
    keepAlive: true,
    compressionEnabled: true,
  },
  
  models: {
    autoDiscovery: true,
    discoveryInterval: 300000,
    cacheModels: true,
    preloadModels: [],
  },
};

export function validateOllamaConnectorConfig(
  config: unknown
): config is OllamaConnectorConfig {
  if (!config || typeof config !== 'object') return false;
  
  const c = config as Record<string, unknown>;
  
  return (
    typeof c.connection === 'object' &&
    typeof c.health === 'object' &&
    typeof c.requests === 'object' &&
    typeof c.models === 'object'
  );
}
