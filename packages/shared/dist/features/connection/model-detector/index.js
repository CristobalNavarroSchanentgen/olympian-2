/**
 * Feature Implementation: Model Detector
 */
export class ModelDetector {
    deps;
    detectionCache = new Map();
    modelRegistry;
    constructor(deps) {
        this.deps = deps;
    }
    setModelRegistry(registry) {
        this.modelRegistry = registry;
    }
    async detectCapabilities(modelName) {
        // Check if we're in registry mode and have a registry
        if (this.modelRegistry) {
            const isRegistryMode = await this.modelRegistry.isRegistryMode();
            if (isRegistryMode) {
                // In registry mode, only use predefined capabilities
                const registryCapability = await this.modelRegistry.getModelCapability(modelName);
                if (registryCapability) {
                    // Convert registry definition to ModelCapability
                    const capability = {
                        id: `registry-${modelName}`,
                        modelName: modelName,
                        capabilities: this.getCapabilityList(registryCapability),
                        confidence: 1.0,
                        detectedAt: new Date(),
                        metadata: {
                            source: 'registry',
                            hasTools: registryCapability.hasTools,
                            hasReasoning: registryCapability.hasReasoning,
                            hasVision: registryCapability.hasVision
                        }
                    };
                    this.detectionCache.set(modelName, capability);
                    return capability;
                }
                else {
                    throw new Error(`Model '${modelName}' not found in registry`);
                }
            }
        }
        // Fallback to auto-detection
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
    getCapabilityList(registryDef) {
        const capabilities = ['chat', 'streaming'];
        if (registryDef.hasVision)
            capabilities.push('vision');
        if (registryDef.hasTools)
            capabilities.push('tools', 'code');
        if (registryDef.hasReasoning)
            capabilities.push('reasoning');
        return capabilities;
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
//# sourceMappingURL=index.js.map