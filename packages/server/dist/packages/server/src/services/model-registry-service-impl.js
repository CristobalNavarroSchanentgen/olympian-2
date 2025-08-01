"use strict";
/**
 * Model Registry Service Implementation
 * In-memory storage for Phase 1 - will be enhanced with real model discovery
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelRegistryServiceImpl = void 0;
class ModelRegistryServiceImpl {
    models = new Map();
    registryMode = true;
    constructor() {
        // Initialize with some default models
        this.initializeDefaultModels();
    }
    initializeDefaultModels() {
        const defaultModels = [
            {
                modelName: 'llama3.2',
                name: 'llama3.2',
                provider: 'ollama',
                capabilities: ['text-generation', 'conversation'],
                contextLength: 8192,
                maxTokens: 4096,
                streaming: true,
                metadata: { family: 'llama' }
            },
            {
                modelName: 'codellama',
                name: 'codellama',
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
    async getAllModels() {
        return this.getAllRegisteredModels();
    }
    async validateModelAccess(modelName) {
        const hasModel = this.models.has(modelName);
        if (hasModel) {
            return { allowed: true };
        }
        // Find similar models as alternatives
        const suggestedAlternatives = Array.from(this.models.keys())
            .filter(name => name.toLowerCase().includes(modelName.toLowerCase()) ||
            modelName.toLowerCase().includes(name.toLowerCase()))
            .slice(0, 3);
        return {
            allowed: false,
            reason: `Model '${modelName}' not found in registry`,
            suggestedAlternatives: suggestedAlternatives.length > 0 ? suggestedAlternatives : ['llama3.2', 'codellama']
        };
    }
    async isRegistryMode() {
        return this.registryMode;
    }
}
exports.ModelRegistryServiceImpl = ModelRegistryServiceImpl;
//# sourceMappingURL=model-registry-service-impl.js.map