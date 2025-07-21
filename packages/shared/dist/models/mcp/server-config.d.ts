/**
 * MCP Server Configuration Models
 */
export interface McpServerConfig {
    command: string;
    args: string[];
    env: Record<string, string>;
    disabled: boolean;
    metadata: Record<string, unknown>;
}
export interface McpConfigFile {
    servers: Record<string, McpServerConfig>;
    version: string;
    metadata: Record<string, unknown>;
}
export interface ServerConfig extends McpServerConfig {
    name: string;
    id: string;
}
//# sourceMappingURL=server-config.d.ts.map