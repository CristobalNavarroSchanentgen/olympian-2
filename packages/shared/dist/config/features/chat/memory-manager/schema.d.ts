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
export declare const memoryManagerDefaults: MemoryManagerConfig;
export declare function validateMemoryManagerConfig(config: unknown): config is MemoryManagerConfig;
//# sourceMappingURL=schema.d.ts.map