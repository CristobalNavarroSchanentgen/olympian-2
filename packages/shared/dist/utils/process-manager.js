"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProcessConfig = validateProcessConfig;
exports.buildEnvironment = buildEnvironment;
function validateProcessConfig(config) {
    const errors = [];
    if (!config.command)
        errors.push('Command required');
    return { isValid: errors.length === 0, errors };
}
function buildEnvironment(baseEnv = {}, additionalEnv = {}) {
    return { ...baseEnv, ...additionalEnv };
}
//# sourceMappingURL=process-manager.js.map