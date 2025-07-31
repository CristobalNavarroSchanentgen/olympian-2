"use strict";
/**
 * Model Registry Service Implementation
 * In-memory storage for Phase 1 - will be enhanced with real model discovery
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRegistryServiceImpl = void 0;
class ModelRegistryServiceImpl {
    models = new Map();
    constructor() {
        // Initialize with some default models
        this.initializeDefaultModels();
    }
    initializeDefaultModels() {
        const defaultModels = [
            {
                modelName: 'llama3.2',
                provider: 'ollama',
                capabilities: ['text-generation', 'conversation'],
                contextLength: 8192,
                maxTokens: 4096,
                streaming: true,
                metadata: { family: 'llama' }
            },
            {
                modelName: 'codellama',
                provider: 'ollama',
                capabilities: ['code-generation', 'text-generation'],
                contextLength: 16384,
                maxTokens: 4096,
                streaming: true,
                metadata: { family: 'llama', specialized: 'code' }
            }
        ];
        defaultModels.forEach(model => {
            this.models.set(model.modelName, model);
        });
    }
    async getModelCapability(modelName) {
        return this.models.get(modelName) || null;
    }
    async getAllRegisteredModels() {
        return Array.from(this.models.values());
    }
    async validateModelAccess(modelName) {
        return this.models.has(modelName);
    }
    async getAllCapabilities() {
        const allCapabilities = new Set();
        for (const model of this.models.values()) {
            model.capabilities.forEach(cap => allCapabilities.add(cap));
        }
        return Array.from(allCapabilities);
    }
}
exports.ModelRegistryServiceImpl = ModelRegistryServiceImpl;
//# sourceMappingURL=model-registry-service-impl.js.map