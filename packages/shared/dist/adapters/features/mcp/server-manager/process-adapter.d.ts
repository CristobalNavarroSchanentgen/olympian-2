import { ServerConfig } from '../../../models/mcp/server-config';
import { ProcessInfo } from '../../../utils/process-manager';
/**
 * Process adapter for MCP server management
 * Transforms process management utilities for server-manager feature
 *
 * AI-Native Rule: This adapter is owned exclusively by server-manager
 */
export interface ProcessAdapter {
    startServer(config: ServerConfig): Promise<ProcessInfo>;
    stopServer(serverId: string): Promise<void>;
    restartServer(serverId: string, config: ServerConfig): Promise<ProcessInfo>;
    getServerStatus(serverId: string): Promise<ProcessStatus>;
    listActiveServers(): Promise<ProcessInfo[]>;
    healthCheck(serverId: string): Promise<HealthResult>;
    killUnresponsiveServer(serverId: string): Promise<void>;
}
export interface ProcessStatus {
    serverId: string;
    pid?: number;
    status: 'running' | 'stopped' | 'crashed' | 'starting' | 'stopping';
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    lastResponse?: Date;
}
export interface HealthResult {
    healthy: boolean;
    responseTime?: number;
    error?: string;
    lastCheck: Date;
}
export declare function createProcessAdapter(): ProcessAdapter;
//# sourceMappingURL=process-adapter.d.ts.map