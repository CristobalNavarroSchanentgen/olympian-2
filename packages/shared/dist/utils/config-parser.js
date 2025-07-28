"use strict";
/**
 * Configuration Parser Utility
 * Pure functions for parsing and validating configuration files
 * Follows AI-Native architecture - utility functions only
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfig = void 0;
exports.parseMcpConfig = parseMcpConfig;
exports.parseServerConfig = parseServerConfig;
exports.validateConfig = validateConfig;
exports.stringifyConfig = stringifyConfig;
exports.mergeConfigs = mergeConfigs;
/**
 * Parse MCP configuration file
 */
function parseMcpConfig(rawConfig) {
    const errors = [];
    const warnings = [];
    if (!rawConfig || typeof rawConfig !== 'object') {
        return {
            success: false,
            errors: [{ field: 'root', message: 'Configuration must be an object' }],
            warnings: []
        };
    }
    const config = rawConfig;
    // Validate servers field
    if (!config.servers || typeof config.servers !== 'object') {
        errors.push({ field: 'servers', message: 'servers field is required and must be an object' });
    }
    if (errors.length > 0) {
        return { success: false, errors, warnings };
    }
    const servers = config.servers;
    for (const [name, serverConfig] of Object.entries(servers)) {
        const serverResult = parseServerConfig(name, serverConfig);
        if (!serverResult.success) {
            errors.push(...serverResult.errors);
        }
        else if (serverResult.data) {
            servers[name] = serverResult.data;
        }
        warnings.push(...serverResult.warnings);
    }
    if (errors.length > 0) {
        return { success: false, errors, warnings };
    }
    return {
        success: true,
        data: {
            servers: servers,
            version: config.version || '1.0.0',
            metadata: config.metadata || {}
        },
        errors: [],
        warnings
    };
}
/**
 * Parse individual server configuration
 */
function parseServerConfig(name, config) {
    const errors = [];
    const warnings = [];
    if (!config || typeof config !== 'object') {
        return {
            success: false,
            errors: [{ field: name, message: 'Server configuration must be an object' }],
            warnings: []
        };
    }
    const serverConfig = config;
    // Validate required fields
    if (!serverConfig.command) {
        errors.push({ field: `${name}.command`, message: 'command field is required' });
    }
    if (typeof serverConfig.command !== 'string') {
        errors.push({ field: `${name}.command`, message: 'command must be a string' });
    }
    // Validate optional fields
    if (serverConfig.args && !Array.isArray(serverConfig.args)) {
        errors.push({ field: `${name}.args`, message: 'args must be an array' });
    }
    if (serverConfig.env && typeof serverConfig.env !== 'object') {
        errors.push({ field: `${name}.env`, message: 'env must be an object' });
    }
    if (errors.length > 0) {
        return { success: false, errors, warnings };
    }
    return {
        success: true,
        data: {
            command: serverConfig.command,
            args: serverConfig.args || [],
            env: serverConfig.env || {},
            disabled: serverConfig.disabled || false,
            metadata: serverConfig.metadata || {}
        },
        errors: [],
        warnings
    };
}
/**
 * Validate configuration schema
 */
function validateConfig(config) {
    const errors = [];
    const warnings = [];
    // Check for empty servers
    if (Object.keys(config.servers).length === 0) {
        warnings.push('No MCP servers configured');
    }
    // Check for disabled servers
    const disabledCount = Object.values(config.servers).filter(s => s.disabled).length;
    if (disabledCount > 0) {
        warnings.push(`${disabledCount} servers are disabled`);
    }
    // Check for missing environment variables
    for (const [name, server] of Object.entries(config.servers)) {
        for (const [envKey, envValue] of Object.entries(server.env)) {
            if (envValue.startsWith('$') && !process.env[envValue.slice(1)]) {
                warnings.push(`Environment variable ${envValue} not found for server ${name}`);
            }
        }
    }
    return {
        success: errors.length === 0,
        data: config,
        errors,
        warnings
    };
}
/**
 * Convert configuration to JSON string
 */
function stringifyConfig(config, pretty = true) {
    return JSON.stringify(config, null, pretty ? 2 : 0);
}
/**
 * Merge multiple configuration files
 */
function mergeConfigs(configs) {
    const merged = {
        servers: {},
        version: '1.0.0',
        metadata: {}
    };
    for (const config of configs) {
        Object.assign(merged.servers, config.servers);
        Object.assign(merged.metadata, config.metadata);
        // Use the latest version
        if (config.version && config.version > merged.version) {
            merged.version = config.version;
        }
    }
    return merged;
}
// Compatibility aliases for existing adapters
exports.parseConfig = parseMcpConfig;
//# sourceMappingURL=config-parser.js.map