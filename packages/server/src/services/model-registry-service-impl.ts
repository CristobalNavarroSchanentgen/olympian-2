/**
 * Model Registry Service Implementation
 * Fetches models from Ollama and provides model capabilities
 */

import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';
import { ModelCapabilityDefinition } from '@olympian/shared/models/connection';
import { OllamaService } from './ollama-service';

export class ModelRegistryServiceImpl implements ModelRegistryService {
  private initializationPromise: Promise<void> | null = null;  private models: Map<string, ModelCapabilityDefinition> = new Map();
  private registryMode: boolean = true;
  private ollamaService?: OllamaService;
  private lastFetch: Date | null = null;
  private fetchInterval = 30000; // 30 seconds

  constructor(ollamaService?: OllamaService) {
    this.ollamaService = ollamaService;
    this.initializeDefaultModels();
    
    // Auto-refresh models periodically if Ollama service is available
    if (this.ollamaService) {
      this.refreshModelsFromOllama();
      setInterval(() => this.refreshModelsFromOllama(), this.fetchInterval);
    }
  }

  private initializeDefaultModels() {
    // Fallback models if Ollama is not available
    const defaultModels: ModelCapabilityDefinition[] = [
      {
        modelName: 'llama3.2:3b',
        name: 'llama3.2:3b',
        displayName: 'Llama 3.2 (3B)',
        provider: 'ollama',
        capabilities: ['text-generation', 'conversation'],
        contextLength: 8192,
        maxTokens: 4096,
        streaming: true,
        metadata: { family: 'llama', size: '3b' }
      },
      {
        modelName: 'llama3.2:1b',
        name: 'llama3.2:1b', 
        displayName: 'Llama 3.2 (1B)',
        provider: 'ollama',
        capabilities: ['text-generation', 'conversation'],
        contextLength: 8192,
        maxTokens: 4096,
        streaming: true,
        metadata: { family: 'llama', size: '1b' }
      }
    ];

    defaultModels.forEach(model => {
      this.models.set(model.modelName, model);
    });
  }

  private async refreshModelsFromOllama(): Promise<void> {
    if (!this.ollamaService?.isConnected()) {
      console.log('? Ollama not connected, using default models');
      return;
    }

    try {
      console.log('? Refreshing models from Ollama...');
      const ollamaModels = await this.ollamaService.getModels();
      
      // Clear current models and rebuild from Ollama
      this.models.clear();
      
      for (const ollamaModel of ollamaModels) {
        const modelDef = this.createModelDefinitionFromOllama(ollamaModel);
        this.models.set(modelDef.modelName, modelDef);
      }
      
      this.lastFetch = new Date();
      console.log(`? Loaded ${this.models.size} models from Ollama`);
      
      // Log available models for debugging
      const modelNames = Array.from(this.models.keys());
      console.log('? Available models:', modelNames);
      
    } catch (error) {
      console.error('? Failed to refresh models from Ollama:', error);
      this.initializeDefaultModels(); // Fallback to defaults
    }
  }

  private createModelDefinitionFromOllama(ollamaModel: any): ModelCapabilityDefinition {
    const modelName = ollamaModel.name;
    const isVisionModel = this.detectVisionCapabilities(modelName);
    const isCodeModel = this.detectCodeCapabilities(modelName);
    
    const capabilities: string[] = ['text-generation', 'conversation'];
    if (isVisionModel) capabilities.push('vision');
    if (isCodeModel) capabilities.push('code-generation');
    
    return {
      modelName,
      name: modelName,
      displayName: this.generateDisplayName(modelName),
      provider: 'ollama',
      capabilities,
      contextLength: this.estimateContextLength(modelName),
      maxTokens: 4096,
      streaming: true,
      metadata: {
        family: this.extractModelFamily(modelName),
        size: this.extractModelSize(modelName),
        ollamaDigest: ollamaModel.digest,
        modified: ollamaModel.modified_at,
        sizeBytes: ollamaModel.size
      }
    };
  }

  private detectVisionCapabilities(modelName: string): boolean {
    const visionIndicators = ['vision', 'llava', 'moondream', 'minicpm'];
    return visionIndicators.some(indicator => 
      modelName.toLowerCase().includes(indicator)
    );
  }

  private detectCodeCapabilities(modelName: string): boolean {
    const codeIndicators = ['code', 'codellama', 'deepseek', 'coder'];
    return codeIndicators.some(indicator => 
      modelName.toLowerCase().includes(indicator)
    );
  }

  private generateDisplayName(modelName: string): string {
    // Convert 'llama3.2:3b' to 'Llama 3.2 (3B)'
    const parts = modelName.split(':');
    const baseName = parts[0];
    const tag = parts[1];
    
    let displayName = baseName
      .replace(/([a-z])([0-9])/g, '$1 $2')
      .replace(/^[a-z]/, c => c.toUpperCase())
      .replace(/llama/i, 'Llama');
    
    if (tag && tag !== 'latest') {
      displayName += ` (${tag.toUpperCase()})`;
    }
    
    return displayName;
  }

  private estimateContextLength(modelName: string): number {
    // Estimate context length based on model name
    if (modelName.includes('32b') || modelName.includes('70b')) return 32768;
    if (modelName.includes('13b') || modelName.includes('14b')) return 16384;
    if (modelName.includes('7b') || modelName.includes('8b')) return 8192;
    return 4096; // Default for smaller models
  }

  private extractModelFamily(modelName: string): string {
    const familyMap: Record<string, string> = {
      'llama': 'llama',
      'codellama': 'llama',
      'qwen': 'qwen',
      'gemma': 'gemma',
      'phi': 'phi',
      'deepseek': 'deepseek',
      'granite': 'granite'
    };
    
    for (const [key, family] of Object.entries(familyMap)) {
      if (modelName.toLowerCase().includes(key)) {
        return family;
      }
    }
    
    return 'unknown';
  }

  private extractModelSize(modelName: string): string {
    const sizeMatch = modelName.match(/(\d+\.?\d*)([bg])/i);
    return sizeMatch ? sizeMatch[0] : 'unknown';
  }

  async getModelCapability(modelName: string): Promise<ModelCapabilityDefinition | null> {
    // Refresh models if stale
    if (this.shouldRefreshModels()) {
      await this.refreshModelsFromOllama();
    }
    
    return this.models.get(modelName) || null;
  }

  async getAllRegisteredModels(): Promise<ModelCapabilityDefinition[]> {
    // Wait for initial load if still pending
    if (this.initializationPromise) {
      await this.initializationPromise;
      this.initializationPromise = null;
    }
    // Refresh models if stale
    if (this.shouldRefreshModels()) {
      await this.refreshModelsFromOllama();
    }
    
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
    // Refresh models if stale
    if (this.shouldRefreshModels()) {
      await this.refreshModelsFromOllama();
    }
    
    const hasModel = this.models.has(modelName);
    
    if (hasModel) {
      return { allowed: true };
    }
    
    // Find similar models as alternatives
    const allModelNames = Array.from(this.models.keys());
    const suggestedAlternatives = allModelNames
      .filter(name => {
        const nameBase = name.split(':')[0];
        const requestedBase = modelName.split(':')[0];
        return nameBase.toLowerCase().includes(requestedBase.toLowerCase()) || 
               requestedBase.toLowerCase().includes(nameBase.toLowerCase());
      })
      .slice(0, 3);
    
    return {
      allowed: false,
      reason: `Model '${modelName}' not found. Available models: ${allModelNames.slice(0, 3).join(', ')}`,
      suggestedAlternatives: suggestedAlternatives.length > 0 ? suggestedAlternatives : allModelNames.slice(0, 3)
    };
  }

  async isRegistryMode(): Promise<boolean> {
    return this.registryMode;
  }

  private shouldRefreshModels(): boolean {
    if (!this.lastFetch) return true;
    const timeSinceLastFetch = Date.now() - this.lastFetch.getTime();
    return timeSinceLastFetch > this.fetchInterval;
  }

  // Manual refresh method for external calls
  async forceRefresh(): Promise<void> {
    await this.refreshModelsFromOllama();
  }
}