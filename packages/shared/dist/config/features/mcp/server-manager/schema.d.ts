/**
 * Configuration Schema: MCP Server Manager
 *
 * Validates configuration for MCP server lifecycle management.
 */
export interface ServerManagerConfig {
    readonly processes: {
        readonly maxServers: number;
        readonly startupTimeout: number;
        readonly shutdownTimeout: number;
        readonly restartDelay: number;
    };
    readonly stdio: {
        readonly bufferSize: number;
        readonly flushInterval: number;
        readonly messageTimeout: number;
        readonly heartbeatInterval: number;
    };
    readonly monitoring: {
        readonly healthCheckInterval: number;
        readonly maxFailures: number;
        readonly memoryThreshold: number;
        readonly cpuThreshold: number;
    };
    readonly lifecycle: {
        readonly autoRestart: boolean;
        readonly gracefulShutdown: boolean;
        readonly cleanupOrphans: boolean;
        readonly logRetention: number;
    };
}
export declare const serverManagerDefaults: ServerManagerConfig;
export declare function validateServerManagerConfig(config: unknown): config is ServerManagerConfig;
//# sourceMappingURL=schema.d.ts.map