"use strict";
/**
 * Model Registry - Predefined model capabilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREDEFINED_MODEL_REGISTRY = void 0;
exports.getModelFromRegistry = getModelFromRegistry;
exports.getAllRegisteredModels = getAllRegisteredModels;
// Hardcoded model registry for custom configuration
exports.PREDEFINED_MODEL_REGISTRY = [
    {
        modelName: 'llama3.2-vision:11b',
        name: 'llama3.2-vision:11b',
        provider: 'ollama',
        capabilities: ['vision', 'text-generation'],
        contextLength: 8192,
        maxTokens: 4096,
        streaming: true,
        hasTools: false,
        hasReasoning: false,
        hasVision: true
    },
    {
        modelName: 'granite3.2-vision:2b',
        name: 'granite3.2-vision:2b',
        provider: 'ollama',
        capabilities: ['vision', 'text-generation'],
        contextLength: 4096,
        maxTokens: 2048,
        streaming: true,
        hasTools: false,
        hasReasoning: false,
        hasVision: true
    },
    {
        modelName: 'phi4:14b',
        name: 'phi4:14b',
        provider: 'ollama',
        capabilities: ['text-generation'],
        contextLength: 16384,
        maxTokens: 8192,
        streaming: true,
        hasTools: false,
        hasReasoning: false,
        hasVision: false
    },
    {
        modelName: 'llama3.2:3b',
        name: 'llama3.2:3b',
        provider: 'ollama',
        capabilities: ['text-generation'],
        contextLength: 8192,
        maxTokens: 4096,
        streaming: true,
        hasTools: false,
        hasReasoning: false,
        hasVision: false
    },
    {
        modelName: 'phi4-mini:3.8b',
        name: 'phi4-mini:3.8b',
        provider: 'ollama',
        capabilities: ['text-generation', 'tool-use'],
        contextLength: 8192,
        maxTokens: 4096,
        streaming: true,
        hasTools: true,
        hasReasoning: false,
        hasVision: false
    },
    {
        modelName: 'deepseek-r1:14b',
        name: 'deepseek-r1:14b',
        provider: 'ollama',
        capabilities: ['text-generation', 'tool-use', 'reasoning'],
        contextLength: 16384,
        maxTokens: 8192,
        streaming: true,
        hasTools: true,
        hasReasoning: true,
        hasVision: false
    },
    {
        modelName: 'qwen3:4b',
        name: 'qwen3:4b',
        provider: 'ollama',
        capabilities: ['text-generation', 'tool-use', 'reasoning'],
        contextLength: 8192,
        maxTokens: 4096,
        streaming: true,
        hasTools: true,
        hasReasoning: true,
        hasVision: false
    },
    {
        modelName: 'gemma3:4b',
        name: 'gemma3:4b',
        provider: 'ollama',
        capabilities: ['text-generation'],
        contextLength: 8192,
        maxTokens: 4096,
        streaming: true,
        hasTools: false,
        hasReasoning: false,
        hasVision: false
    }
];
function getModelFromRegistry(modelName) {
    return exports.PREDEFINED_MODEL_REGISTRY.find(m => m.modelName === modelName);
}
function getAllRegisteredModels() {
    return [...exports.PREDEFINED_MODEL_REGISTRY];
}
//# sourceMappingURL=model-registry.js.map