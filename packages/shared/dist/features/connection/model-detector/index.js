"use strict";
/**
 * Feature Implementation: Model Detector
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelDetector = void 0;
class ModelDetector {
    deps;
    detectionCache = new Map();
    constructor(deps) {
        this.deps = deps;
    }
    async detectCapabilities(modelName) {
        if (this.detectionCache.has(modelName)) {
            return this.detectionCache.get(modelName);
        }
        const capability = await this.deps.capabilityScanner.scanModel(modelName, {
            testMethods: this.deps.config.detection.methods,
            timeout: this.deps.config.detection.timeout
        });
        this.detectionCache.set(modelName, capability);
        this.deps.eventPublisher.publishCapabilityDetected({
            modelName,
            capabilities: capability.capabilities,
            detectionMethod: capability.detectionMethod,
            timestamp: new Date()
        });
        return capability;
    }
    async batchDetect(modelNames) {
        const results = await Promise.allSettled(modelNames.map(name => this.detectCapabilities(name)));
        return results
            .filter(result => result.status === "fulfilled")
            .map(result => result.value);
    }
    async testVisionCapability(modelName) {
        return await this.deps.capabilityScanner.testVision(modelName);
    }
    async getCapability(modelName) {
        return this.detectionCache.get(modelName) || null;
    }
    async refreshCapability(modelName) {
        this.detectionCache.delete(modelName);
        return await this.detectCapabilities(modelName);
    }
    async setCustomCapability(modelName, capability) {
        this.detectionCache.set(modelName, capability);
        await this.deps.detectionService.saveCustomCapability(modelName, capability);
    }
    async listDetectedModels() {
        return Array.from(this.detectionCache.values());
    }
    async clearCache() {
        this.detectionCache.clear();
    }
    async updateConfig(config) {
        Object.assign(this.deps.config, config);
    }
    getConfig() {
        return { ...this.deps.config };
    }
}
exports.ModelDetector = ModelDetector;
//# sourceMappingURL=index.js.map