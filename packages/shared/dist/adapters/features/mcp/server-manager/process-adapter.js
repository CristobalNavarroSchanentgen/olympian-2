"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProcessAdapter = createProcessAdapter;
const process_manager_1 = require("../../../../utils/process-manager");
const activeProcesses = new Map();
function buildCommandArgs(config) {
    const args = [...(config.args || [])];
    if (config.command === 'npx') {
        args.unshift('-y');
    }
    return args;
}
function createProcessAdapter() {
    const adapter = {
        async startServer(config) {
            try {
                const args = buildCommandArgs(config);
                const processInfo = await (0, process_manager_1.spawnProcess)(config.command, args, {
                    cwd: config.workingDirectory,
                    env: Object.fromEntries(Object.entries({ ...process.env, ...config.environment }).filter(([_, v]) => v !== undefined)),
                    timeout: config.timeout
                });
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
                await new Promise(resolve => setTimeout(resolve, 2000));
                try {
                    await (0, process_manager_1.killProcess)(processInfo.pid, 'SIGKILL');
                }
                catch {
                    // Process already dead
                }
                activeProcesses.delete(serverId);
            }
            catch (error) {
                throw new Error(`Failed to stop server ${serverId}: ${error.message}`);
            }
        },
        async restartServer(serverId, config) {
            if (activeProcesses.has(serverId)) {
                await adapter.stopServer(serverId);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            return await adapter.startServer(config);
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
                if (currentInfo !== null) {
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
                else {
                    activeProcesses.delete(serverId);
                    return {
                        serverId,
                        status: 'crashed',
                        uptime: 0,
                        memoryUsage: 0,
                        cpuUsage: 0
                    };
                }
            }
            catch (error) {
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
            for (const [serverId, processInfo] of Array.from(activeProcesses.entries())) {
                try {
                    const currentInfo = await (0, process_manager_1.getProcessInfo)(processInfo.pid);
                    if (currentInfo !== null && currentInfo.status === 'running') {
                        activeServers.push(processInfo);
                    }
                    else {
                        activeProcesses.delete(serverId);
                    }
                }
                catch {
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
                if (currentInfo !== null && currentInfo.status === 'running') {
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
                        error: `Process status: ${currentInfo?.status || 'not found'}`,
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
                return;
            }
            try {
                await (0, process_manager_1.killProcess)(processInfo.pid, 'SIGKILL');
                activeProcesses.delete(serverId);
            }
            catch (error) {
                activeProcesses.delete(serverId);
            }
        }
    };
    return adapter;
}
//# sourceMappingURL=process-adapter.js.map