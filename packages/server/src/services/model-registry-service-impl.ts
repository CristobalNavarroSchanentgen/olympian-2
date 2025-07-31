/**
 * Model Registry Service Implementation
 * In-memory storage for Phase 1 - will be enhanced with real model discovery
 */

import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';
import { ModelCapabilityDefinition } from '@olympian/shared/models/connection';

export class ModelRegistryServiceImpl implements ModelRegistryService {
  private models: Map<string, ModelCapabilityDefinition> = new Map();

  constructor() {
    // Initialize with some default models
    this.initializeDefaultModels();
  }

  private initializeDefaultModels() {
    const defaultModels: ModelCapabilityDefinition[] = [
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

  async getModelCapability(modelName: string): Promise<ModelCapabilityDefinition | null> {
    return this.models.get(modelName) || null;
  }

  async getAllRegisteredModels(): Promise<ModelCapabilityDefinition[]> {
    return Array.from(this.models.values());
  }

  async validateModelAccess(modelName: string): Promise<boolean> {
    return this.models.has(modelName);
  }

  async getAllCapabilities(): Promise<string[]> {
    const allCapabilities = new Set<string>();
    for (const model of this.models.values()) {
      model.capabilities.forEach(cap => allCapabilities.add(cap));
    }
    return Array.from(allCapabilities);
  }
}
