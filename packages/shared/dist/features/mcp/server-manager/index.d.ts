/**
 * Feature Implementation: MCP Server Manager
 */
import { ServerManagerContract, ServerManagerDependencies } from "./contract";
import { McpServerConfig } from "../../../models/mcp/server-config";
export declare class ServerManager implements ServerManagerContract {
    private deps;
    private runningServers;
    constructor(deps: ServerManagerDependencies);
    startServer(serverName: string): Promise<void>;
    stopServer(serverName: string): Promise<void>;
    restartServer(serverName: string): Promise<void>;
    getServerStatus(serverName: string): Promise<any>;
    listServers(): Promise<any[]>;
    configureServer(serverName: string, config: McpServerConfig): Promise<void>;
    removeServer(serverName: string): Promise<void>;
    getServerLogs(serverName: string, lines?: number): Promise<string[]>;
    getServerHealth(serverName: string): Promise<any>;
    startAllServers(): Promise<void>;
    stopAllServers(): Promise<void>;
    updateConfig(config: any): Promise<void>;
    getConfig(): any;
}
//# sourceMappingURL=index.d.ts.map