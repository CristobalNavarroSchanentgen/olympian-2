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
export declare const ollamaConnectorDefaults: OllamaConnectorConfig;
export declare function validateOllamaConnectorConfig(config: unknown): config is OllamaConnectorConfig;
//# sourceMappingURL=schema.d.ts.map