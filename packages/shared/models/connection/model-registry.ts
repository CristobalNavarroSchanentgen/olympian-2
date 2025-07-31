/**
 * Model Registry - Predefined model capabilities
 */

export interface ModelCapabilityDefinition {
  modelName: string;
  provider: string;
  capabilities: string[];
  contextLength: number;   maxTokens: number;
  streaming: boolean;
  metadata?: Record<string, unknown>;
  // Legacy compatibility
  hasTools?: boolean;
  hasReasoning?: boolean;
  hasVision?: boolean;
}

export interface ModelRegistry {
  models: ModelCapabilityDefinition[];
  configurationMode: 'auto-scan' | 'registry';
}

// Hardcoded model registry for custom configuration
export const PREDEFINED_MODEL_REGISTRY: ModelCapabilityDefinition[] = [
  { 
    modelName: 'llama3.2-vision:11b', 
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

export function getModelFromRegistry(modelName: string): ModelCapabilityDefinition | undefined {
  return PREDEFINED_MODEL_REGISTRY.find(m => m.modelName === modelName);
}

export function getAllRegisteredModels(): ModelCapabilityDefinition[] {
  return [...PREDEFINED_MODEL_REGISTRY];
}
