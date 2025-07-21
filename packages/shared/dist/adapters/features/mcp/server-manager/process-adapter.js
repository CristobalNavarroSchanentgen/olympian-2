"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProcessAdapter = createProcessAdapter;
const process_manager_1 = require("../../../utils/process-manager");
const activeProcesses = new Map();
function createProcessAdapter() {
    return {
        async startServer(config) {
            try {
                // Build command arguments from config
                const args = this.buildCommandArgs(config);
                // Spawn the process
                const processInfo = await (0, process_manager_1.spawnProcess)(config.command, args, {
                    cwd: config.workingDirectory,
                    env: {
                        ...process.env,
                        ...config.environment
                    },
                    stdio: ['pipe', 'pipe', 'pipe']
                });
                // Store process info
                activeProcesses.set(config.name, processInfo);
                return processInfo;
            }
            catch (error) {
                throw new Error(`Failed to start server ${config.name}: ${error.message}`);
            }
        },
        async stopServer(serverId) {
            const processInfo = activeProcesses.get(serverId);
            if (!processInfo) {
                throw new Error(`Server ${serverId} not found in active processes`);
            }
            try {
                await (0, process_manager_1.killProcess)(processInfo.pid, 'SIGTERM');
                // Wait for graceful shutdown
                await new Promise(resolve => setTimeout(resolve, 2000));
                // Force kill if still running
                try {
                    await (0, process_manager_1.killProcess)(processInfo.pid, 'SIGKILL');
                }
                catch {
                    // Process already dead, ignore
                }
                activeProcesses.delete(serverId);
            }
            catch (error) {
                throw new Error(`Failed to stop server ${serverId}: ${error.message}`);
            }
        },
        async restartServer(serverId, config) {
            // Stop existing server if running
            if (activeProcesses.has(serverId)) {
                await this.stopServer(serverId);
            }
            // Wait a moment before restarting
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Start server with new config
            return await this.startServer(config);
        },
        async getServerStatus(serverId) {
            const processInfo = activeProcesses.get(serverId);
            if (!processInfo) {
                return {
                    serverId,
                    status: 'stopped',
                    uptime: 0,
                    memoryUsage: 0,
                    cpuUsage: 0
                };
            }
            try {
                const currentInfo = await (0, process_manager_1.getProcessInfo)(processInfo.pid);
                const uptime = Date.now() - processInfo.startTime.getTime();
                return {
                    serverId,
                    pid: processInfo.pid,
                    status: currentInfo.status,
                    uptime,
                    memoryUsage: currentInfo.memoryUsage || 0,
                    cpuUsage: currentInfo.cpuUsage || 0,
                    lastResponse: processInfo.lastResponse
                };
            }
            catch (error) {
                // Process not found, mark as crashed
                activeProcesses.delete(serverId);
                return {
                    serverId,
                    status: 'crashed',
                    uptime: 0,
                    memoryUsage: 0,
                    cpuUsage: 0
                };
            }
        },
        async listActiveServers() {
            const activeServers = [];
            for (const [serverId, processInfo] of activeProcesses.entries()) {
                try {
                    const currentInfo = await (0, process_manager_1.getProcessInfo)(processInfo.pid);
                    if (currentInfo.status === 'running') {
                        activeServers.push(processInfo);
                    }
                    else {
                        // Clean up dead processes
                        activeProcesses.delete(serverId);
                    }
                }
                catch {
                    // Process dead, clean up
                    activeProcesses.delete(serverId);
                }
            }
            return activeServers;
        },
        async healthCheck(serverId) {
            const processInfo = activeProcesses.get(serverId);
            if (!processInfo) {
                return {
                    healthy: false,
                    error: 'Process not found',
                    lastCheck: new Date()
                };
            }
            try {
                const startTime = Date.now();
                const currentInfo = await (0, process_manager_1.getProcessInfo)(processInfo.pid);
                const responseTime = Date.now() - startTime;
                if (currentInfo.status === 'running') {
                    // Update last response time
                    processInfo.lastResponse = new Date();
                    return {
                        healthy: true,
                        responseTime,
                        lastCheck: new Date()
                    };
                }
                else {
                    return {
                        healthy: false,
                        error: `Process status: ${currentInfo.status}`,
                        lastCheck: new Date()
                    };
                }
            }
            catch (error) {
                return {
                    healthy: false,
                    error: error.message,
                    lastCheck: new Date()
                };
            }
        },
        async killUnresponsiveServer(serverId) {
            const processInfo = activeProcesses.get(serverId);
            if (!processInfo) {
                return; // Already gone
            }
            try {
                await (0, process_manager_1.killProcess)(processInfo.pid, 'SIGKILL');
                activeProcesses.delete(serverId);
            }
            catch (error) {
                // Process might already be dead
                activeProcesses.delete(serverId);
            }
        },
        // Helper method to build command arguments
        buildCommandArgs(config) {
            const args = [...(config.args || [])];
            // Add environment-specific arguments
            if (config.command === 'npx') {
                args.unshift('-y'); // Auto-confirm package installation
            }
            if (config.command === 'uvx' || config.command === 'uv') {
                // UV-specific arguments can be added here
            }
            return args;
        }
    };
}
//# sourceMappingURL=process-adapter.js.map