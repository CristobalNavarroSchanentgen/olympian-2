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
export declare const toolExecutorDefaults: ToolExecutorConfig;
export declare function validateToolExecutorConfig(config: unknown): config is ToolExecutorConfig;
//# sourceMappingURL=schema.d.ts.map