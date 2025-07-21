"use strict";
/**
 * Feature Implementation: MCP Server Manager
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerManager = void 0;
class ServerManager {
    deps;
    runningServers = new Map();
    constructor(deps) {
        this.deps = deps;
    }
    async startServer(serverName) {
        const config = await this.deps.mcpService.getServerConfig(serverName);
        if (!config) {
            throw new Error(`Server config not found: ${serverName}`);
        }
        if (this.runningServers.has(serverName)) {
            throw new Error(`Server already running: ${serverName}`);
        }
        const process = await this.deps.processAdapter.startProcess({
            command: config.command,
            args: config.args,
            env: config.env,
            stdio: "pipe"
        });
        this.runningServers.set(serverName, process);
        // Setup stdio communication
        await this.deps.stdioAdapter.setupCommunication(serverName, process);
        this.deps.eventPublisher.publishServerStarted({
            serverName,
            pid: process.pid,
            timestamp: new Date()
        });
    }
    async stopServer(serverName) {
        const process = this.runningServers.get(serverName);
        if (!process) {
            throw new Error(`Server not running: ${serverName}`);
        }
        await this.deps.processAdapter.stopProcess(process);
        this.runningServers.delete(serverName);
        await this.deps.stdioAdapter.closeCommunication(serverName);
        this.deps.eventPublisher.publishServerStopped({
            serverName,
            timestamp: new Date()
        });
    }
    async restartServer(serverName) {
        if (this.runningServers.has(serverName)) {
            await this.stopServer(serverName);
        }
        await this.startServer(serverName);
    }
    async getServerStatus(serverName) {
        const process = this.runningServers.get(serverName);
        const isRunning = !!process;
        return {
            name: serverName,
            status: isRunning ? "running" : "stopped",
            pid: process?.pid,
            uptime: process ? Date.now() - process.startTime : 0,
            memoryUsage: process ? await this.deps.processAdapter.getMemoryUsage(process.pid) : 0,
            health: isRunning ? await this.deps.healthMonitor.checkServerHealth(serverName) : "stopped"
        };
    }
    async listServers() {
        const configs = await this.deps.mcpService.getAllServerConfigs();
        return Promise.all(configs.map(async (config) => ({
            ...config,
            status: await this.getServerStatus(config.name)
        })));
    }
    async configureServer(serverName, config) {
        await this.deps.mcpService.updateServerConfig(serverName, config);
        // Restart if running
        if (this.runningServers.has(serverName)) {
            await this.restartServer(serverName);
        }
    }
    async removeServer(serverName) {
        if (this.runningServers.has(serverName)) {
            await this.stopServer(serverName);
        }
        await this.deps.mcpService.removeServerConfig(serverName);
    }
    async getServerLogs(serverName, lines) {
        return await this.deps.processAdapter.getLogs(serverName, lines || 100);
    }
    async getServerHealth(serverName) {
        const status = await this.getServerStatus(serverName);
        if (status.status !== "running") {
            return { status: "stopped", healthy: false };
        }
        return await this.deps.healthMonitor.checkServerHealth(serverName);
    }
    async startAllServers() {
        const configs = await this.deps.mcpService.getAllServerConfigs();
        for (const config of configs) {
            if (config.autoStart) {
                try {
                    await this.startServer(config.name);
                }
                catch (error) {
                    console.error(`Failed to start server ${config.name}:`, error);
                }
            }
        }
    }
    async stopAllServers() {
        const serverNames = Array.from(this.runningServers.keys());
        for (const serverName of serverNames) {
            try {
                await this.stopServer(serverName);
            }
            catch (error) {
                console.error(`Failed to stop server ${serverName}:`, error);
            }
        }
    }
    async updateConfig(config) {
        Object.assign(this.deps.config, config);
    }
    getConfig() {
        return { ...this.deps.config };
    }
}
exports.ServerManager = ServerManager;
//# sourceMappingURL=index.js.map