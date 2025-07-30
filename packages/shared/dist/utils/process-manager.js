export function validateProcessConfig(config) {
    const errors = [];
    if (!config.command)
        errors.push('Command required');
    return { isValid: errors.length === 0, errors };
}
export function buildEnvironment(baseEnv = {}, additionalEnv = {}) {
    return { ...baseEnv, ...additionalEnv };
}
// Updated function signature to match adapter usage
export function spawnProcess(command, args, options) {
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
export function spawnProcessFromConfig(config) {
    return spawnProcess(config.command, config.args, {
        cwd: config.cwd,
        env: config.env,
        timeout: config.timeout
    });
}
export function killProcess(pid, signal) {
    return Promise.resolve();
}
export function getProcessInfo(pid) {
    return Promise.resolve(null);
}
//# sourceMappingURL=process-manager.js.map