/**
 * Model Registry - Predefined model capabilities
 */

export interface ModelCapabilityDefinition {
  modelName: string;
  hasTools: boolean;
  hasReasoning: boolean;
  hasVision: boolean;
}

export interface ModelRegistry {
  models: ModelCapabilityDefinition[];
  configurationMode: 'auto-scan' | 'registry';
}

// Hardcoded model registry for custom configuration
export const PREDEFINED_MODEL_REGISTRY: ModelCapabilityDefinition[] = [
  { modelName: 'llama3.2-vision:11b', hasTools: false, hasReasoning: false, hasVision: true },
  { modelName: 'granite3.2-vision:2b', hasTools: false, hasReasoning: false, hasVision: true },
  { modelName: 'phi4:14b', hasTools: false, hasReasoning: false, hasVision: false },
  { modelName: 'llama3.2:3b', hasTools: false, hasReasoning: false, hasVision: false },
  { modelName: 'phi4-mini:3.8b', hasTools: true, hasReasoning: false, hasVision: false },
  { modelName: 'deepseek-r1:14b', hasTools: true, hasReasoning: true, hasVision: false },
  { modelName: 'qwen3:4b', hasTools: true, hasReasoning: true, hasVision: false },
  { modelName: 'gemma3:4b', hasTools: false, hasReasoning: false, hasVision: false }
];

export function getModelFromRegistry(modelName: string): ModelCapabilityDefinition | undefined {
  return PREDEFINED_MODEL_REGISTRY.find(m => m.modelName === modelName);
}

export function getAllRegisteredModels(): ModelCapabilityDefinition[] {
  return [...PREDEFINED_MODEL_REGISTRY];
}
