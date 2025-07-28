import { ServerConfig } from '../../../../models/mcp';
import { ConfigParseResult } from '../../../../utils/config-parser';
/**
 * Config adapter for MCP server configuration
 * Transforms configuration utilities for server-manager feature
 *
 * AI-Native Rule: This adapter is owned exclusively by server-manager
 */
export interface ConfigAdapter {
    parseServerConfig(configPath: string): Promise<ConfigParseResult>;
    parseInlineConfig(configData: any): ConfigParseResult;
    validateServerConfig(config: ServerConfig): ValidationResult;
    validateAllConfigs(configs: ServerConfig[]): ValidationResult[];
    transformToRuntimeConfig(config: ServerConfig): RuntimeConfig;
    injectEnvironmentVariables(config: ServerConfig, env: Record<string, string>): ServerConfig;
    detectServerType(config: ServerConfig): string;
    mergeConfigs(base: ServerConfig, override: Partial<ServerConfig>): ServerConfig;
    normalizeConfig(config: any): ServerConfig;
}
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    config?: ServerConfig;
}
export interface RuntimeConfig {
    name: string;
    command: string;
    args: string[];
    environment: Record<string, string>;
    workingDirectory?: string;
    timeout: number;
    retryDelay: number;
    endpoints: string[];
    retries: number;
    healthCheck: HealthCheckConfig;
}
export interface HealthCheckConfig {
    timeout: number;
    retries: number;
    retryDelay: number;
    endpoints: string[];
}
export declare function createConfigAdapter(): ConfigAdapter;
//# sourceMappingURL=config-adapter.d.ts.map