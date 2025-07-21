/**
 * Configuration Parser Utility
 * Pure functions for parsing and validating configuration files
 * Follows AI-Native architecture - utility functions only
 */
import type { McpServerConfig, McpConfigFile } from '../models/mcp/server-config';
/**
 * Parse error details
 */
export interface ParseError {
    field: string;
    message: string;
    value?: unknown;
}
/**
 * Parse result with validation
 */
export interface ParseResult<T> {
    success: boolean;
    data?: T;
    errors: ParseError[];
    warnings: string[];
}
/**
 * Parse MCP configuration file
 */
export declare function parseMcpConfig(rawConfig: unknown): ParseResult<McpConfigFile>;
/**
 * Parse individual server configuration
 */
export declare function parseServerConfig(name: string, config: unknown): ParseResult<McpServerConfig>;
/**
 * Validate configuration schema
 */
export declare function validateConfig(config: McpConfigFile): ParseResult<McpConfigFile>;
/**
 * Convert configuration to JSON string
 */
export declare function stringifyConfig(config: McpConfigFile, pretty?: boolean): string;
/**
 * Merge multiple configuration files
 */
export declare function mergeConfigs(configs: McpConfigFile[]): McpConfigFile;
//# sourceMappingURL=config-parser.d.ts.map