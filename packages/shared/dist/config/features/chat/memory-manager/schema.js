"use strict";
/**
 * Configuration Schema: Chat Memory Manager
 *
 * Validates configuration for context and memory management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryManagerDefaults = void 0;
exports.validateMemoryManagerConfig = validateMemoryManagerConfig;
exports.memoryManagerDefaults = {
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
function validateMemoryManagerConfig(config) {
    if (!config || typeof config !== 'object')
        return false;
    const c = config;
    return (typeof c.context === 'object' &&
        typeof c.cleanup === 'object' &&
        typeof c.optimization === 'object' &&
        typeof c.storage === 'object');
}
//# sourceMappingURL=schema.js.map