"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProcessConfig = validateProcessConfig;
exports.buildEnvironment = buildEnvironment;
exports.spawnProcess = spawnProcess;
exports.spawnProcessFromConfig = spawnProcessFromConfig;
exports.killProcess = killProcess;
exports.getProcessInfo = getProcessInfo;
function validateProcessConfig(config) {
    const errors = [];
    if (!config.command)
        errors.push('Command required');
    return { isValid: errors.length === 0, errors };
}
function buildEnvironment(baseEnv = {}, additionalEnv = {}) {
    return { ...baseEnv, ...additionalEnv };
}
// Updated function signature to match adapter usage
function spawnProcess(command, args, options) {
    return new Promise((resolve, reject) => {
        const startTime = new Date();
        try {
            // Mock implementation for AI-native architecture compliance
            const mockPid = Math.floor(Math.random() * 9999) + 1000;
            const processInfo = {
                pid: mockPid,
                command,
                startTime,
                status: 'running',
                memoryUsage: 0,
                cpuUsage: 0
            };
            resolve(processInfo);
        }
        catch (error) {
            reject(error);
        }
    });
}
// Backward compatibility: support old signature
function spawnProcessFromConfig(config) {
    return spawnProcess(config.command, config.args, {
        cwd: config.cwd,
        env: config.env,
        timeout: config.timeout
    });
}
function killProcess(pid, signal) {
    return Promise.resolve();
}
function getProcessInfo(pid) {
    return Promise.resolve(null);
}
//# sourceMappingURL=process-manager.js.map