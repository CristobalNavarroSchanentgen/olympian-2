"use strict";
/**
 * Configuration Schema: Ollama Connector
 *
 * Validates configuration for Ollama instance connection management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaConnectorDefaults = void 0;
exports.validateOllamaConnectorConfig = validateOllamaConnectorConfig;
exports.ollamaConnectorDefaults = {
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
function validateOllamaConnectorConfig(config) {
    if (!config || typeof config !== 'object')
        return false;
    const c = config;
    return (typeof c.connection === 'object' &&
        typeof c.health === 'object' &&
        typeof c.requests === 'object' &&
        typeof c.models === 'object');
}
//# sourceMappingURL=schema.js.map