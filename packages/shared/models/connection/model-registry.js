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
    { modelName: 'llama3.2-vision:11b', hasTools: false, hasReasoning: false, hasVision: true },
    { modelName: 'granite3.2-vision:2b', hasTools: false, hasReasoning: false, hasVision: true },
    { modelName: 'phi4:14b', hasTools: false, hasReasoning: false, hasVision: false },
    { modelName: 'llama3.2:3b', hasTools: false, hasReasoning: false, hasVision: false },
    { modelName: 'phi4-mini:3.8b', hasTools: true, hasReasoning: false, hasVision: false },
    { modelName: 'deepseek-r1:14b', hasTools: true, hasReasoning: true, hasVision: false },
    { modelName: 'qwen3:4b', hasTools: true, hasReasoning: true, hasVision: false },
    { modelName: 'gemma3:4b', hasTools: false, hasReasoning: false, hasVision: false }
];
function getModelFromRegistry(modelName) {
    return exports.PREDEFINED_MODEL_REGISTRY.find(m => m.modelName === modelName);
}
function getAllRegisteredModels() {
    return [...exports.PREDEFINED_MODEL_REGISTRY];
}
//# sourceMappingURL=model-registry.js.map