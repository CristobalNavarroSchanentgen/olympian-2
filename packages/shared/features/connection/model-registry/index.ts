/**
 * Feature Implementation: Model Registry Manager
 */

import { ModelRegistryContract, ModelRegistryDependencies } from './contract';
import { ModelCapabilityDefinition, ModelCapability, CapabilitySet } from '../../../models/connection';

export class ModelRegistryManager implements ModelRegistryContract {
  constructor(private deps: ModelRegistryDependencies) {}

  async getModelCapability(modelName: string): Promise<ModelCapabilityDefinition | null> {
    const mode = await this.getConfigurationMode();
    if (mode !== 'registry') {
      return null;
    }
    
    const registry = this.deps.registryAdapter.loadRegistry();
    return registry.find(m => m.modelName === modelName) || null;
  }

  async getAllModels(): Promise<ModelCapabilityDefinition[]> {
    const mode = await this.getConfigurationMode();
    if (mode !== 'registry') {
      return [];
    }
    
    return this.deps.registryAdapter.loadRegistry();
  }

  async isModelRegistered(modelName: string): Promise<boolean> {
    const model = await this.getModelCapability(modelName);
    return model !== null;
  }

  async getModelsByCapability(capability: 'tools' | 'reasoning' | 'vision'): Promise<ModelCapabilityDefinition[]> {
    const allModels = await this.getAllModels();
    
    switch (capability) {
      case 'tools':
        return allModels.filter(m => m.hasTools);
      case 'reasoning':
        return allModels.filter(m => m.hasReasoning);
      case 'vision':
        return allModels.filter(m => m.hasVision);
      default:
        return [];
    }
  }

  async toModelCapability(definition: ModelCapabilityDefinition): Promise<ModelCapability> {
    const capabilities: string[] = [];
    const capabilitySet: CapabilitySet = {
      supportsChat: true, // All models support chat
      supportsVision: !!definition.hasVision,
      supportsStreaming: true, // Assume all support streaming
      supportsTools: !!definition.hasTools,
      supportsCode: !!definition.hasTools, // Tools usually mean code support
      contextLength: 4096 // Default context length
    };

    if (definition.hasVision) capabilities.push('vision');
    if (definition.hasTools) capabilities.push('tools', 'code');
    if (definition.hasReasoning) capabilities.push('reasoning');
    capabilities.push('chat', 'streaming');

    return {
      id: `registry-${definition.modelName}`,
      modelName: definition.modelName,
      capabilities,
      confidence: 1.0, // Registry is authoritative
      detectedAt: new Date(),
      metadata: {
        source: 'registry',
        hasTools: definition.hasTools,
        hasReasoning: definition.hasReasoning,
        hasVision: definition.hasVision,
        capabilitySet
      }
    };
  }

  async getConfigurationMode(): Promise<'auto-scan' | 'registry'> {
    return this.deps.config.mode;
  }

  async validateModelAccess(modelName: string): Promise<{
    allowed: boolean;
    reason?: string;
    suggestedAlternatives?: string[];
  }> {
    const mode = await this.getConfigurationMode();
    
    // In auto-scan mode, all models are allowed
    if (mode === 'auto-scan') {
      return { allowed: true };
    }
    
    // In registry mode, only registered models are allowed
    const isRegistered = await this.isModelRegistered(modelName);
    
    if (isRegistered) {
      return { allowed: true };
    }
    
    // Find similar models as alternatives
    const allModels = await this.getAllModels();
    const suggestedAlternatives = allModels
      .map(m => m.modelName)
      .slice(0, 3); // Suggest up to 3 alternatives
    
    return {
      allowed: false,
      reason: `Model '${modelName}' is not available in the configured model registry`,
      suggestedAlternatives
    };
  }
}

// Factory function
export function createModelRegistryManager(deps: ModelRegistryDependencies): ModelRegistryContract {
  return new ModelRegistryManager(deps);
}
