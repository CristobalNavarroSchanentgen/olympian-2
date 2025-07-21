"use strict";
/**
 * Configuration Schema: MCP Tool Executor
 *
 * Validates configuration for MCP tool execution and management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolExecutorDefaults = void 0;
exports.validateToolExecutorConfig = validateToolExecutorConfig;
exports.toolExecutorDefaults = {
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
function validateToolExecutorConfig(config) {
    if (!config || typeof config !== 'object')
        return false;
    const c = config;
    return (typeof c.execution === 'object' &&
        typeof c.protocol === 'object' &&
        typeof c.security === 'object' &&
        typeof c.caching === 'object');
}
//# sourceMappingURL=schema.js.map