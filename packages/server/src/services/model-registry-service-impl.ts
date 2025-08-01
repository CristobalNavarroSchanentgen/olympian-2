/**
 * Model Registry Service Implementation
 * In-memory storage for Phase 1 - will be enhanced with real model discovery
 */

import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';
import { ModelCapabilityDefinition } from '@olympian/shared/models/connection';

export class ModelRegistryServiceImpl implements ModelRegistryService {
  private models: Map<string, ModelCapabilityDefinition> = new Map();
  private registryMode: boolean = true;

  constructor() {
    // Initialize with some default models
    this.initializeDefaultModels();
  }

  private initializeDefaultModels() {
    const defaultModels: ModelCapabilityDefinition[] = [
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

  async getModelCapability(modelName: string): Promise<ModelCapabilityDefinition | null> {
    return this.models.get(modelName) || null;
  }

  async getAllRegisteredModels(): Promise<ModelCapabilityDefinition[]> {
    return Array.from(this.models.values());
  }

  async getAllModels(): Promise<ModelCapabilityDefinition[]> {
    return this.getAllRegisteredModels();
  }

  async validateModelAccess(modelName: string): Promise<{
    allowed: boolean;
    reason?: string;
    suggestedAlternatives?: string[];
  }> {
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

  async isRegistryMode(): Promise<boolean> {
    return this.registryMode;
  }
}
