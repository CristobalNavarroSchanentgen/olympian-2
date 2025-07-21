"use strict";
/**
 * Configuration Schema: MCP Server Manager
 *
 * Validates configuration for MCP server lifecycle management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverManagerDefaults = void 0;
exports.validateServerManagerConfig = validateServerManagerConfig;
exports.serverManagerDefaults = {
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
function validateServerManagerConfig(config) {
    if (!config || typeof config !== 'object')
        return false;
    const c = config;
    return (typeof c.processes === 'object' &&
        typeof c.stdio === 'object' &&
        typeof c.monitoring === 'object' &&
        typeof c.lifecycle === 'object');
}
//# sourceMappingURL=schema.js.map