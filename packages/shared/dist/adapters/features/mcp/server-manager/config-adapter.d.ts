import { ServerConfig, McpConfigFile } from "../../../../models/mcp";
import { ParseResult } from "../../../../utils/config-parser";
/**
 * Config adapter for MCP server configuration
 * Transforms configuration utilities for server-manager feature
 *
 * AI-Native Rule: This adapter is owned exclusively by server-manager
 */
export interface ConfigAdapter {
    parseServerConfig(configPath: string): Promise<ParseResult<McpConfigFile>>;
    parseInlineConfig(configData: any): ParseResult<McpConfigFile>;
    validateServerConfig(config: ServerConfig): ValidationResult;
    validateAllConfigs(configs: ServerConfig[]): ValidationResult[];
    transformToRuntimeConfig(config: ServerConfig): RuntimeConfig;
    injectEnvironmentVariables(config: ServerConfig, env: Record<string, string>): ServerConfig;
    detectServerType(config: ServerConfig): string;
    mergeConfigs(base: ServerConfig, override: Partial<ServerConfig>): ServerConfig;
    normalizeConfig(config: any): ServerConfig;
    extractServerConfigs(configData: any): ServerConfig[];
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