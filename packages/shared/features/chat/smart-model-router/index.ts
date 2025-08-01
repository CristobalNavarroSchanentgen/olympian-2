/**
 * Smart Model Router Implementation
 * Intelligent message routing based on content analysis and model capabilities
 */

import {
  SmartModelRouterContract,
  SmartModelRouterDependencies,
  ContentAnalysisAdapter,
  ModelSelectionAdapter,
  AvailabilityAdapter,
  RouterEventPublisher
} from './contract';
import { ModelCapabilityDefinition } from '../../../models/connection';

export class SmartModelRouter implements SmartModelRouterContract {
  constructor(private deps: SmartModelRouterDependencies) {}

  async routeMessage(params: {
    content: string;
    images?: string[];
    userPreferences?: {
      preferredTextModel?: string;
      preferredVisionModel?: string;
    };
    conversationContext?: {
      previousModel?: string;
      capabilities?: string[];
    };
  }) {
    // 1. Analyze content requirements
    const analysis = await this.analyzeContent({
      content: params.content,
      images: params.images
    });

    // 2. Get available models
    const availableModels = await this.getAvailableModels();

    // 3. Determine routing strategy
    let selectedModel: string;
    let routingReason: 'vision-required' | 'user-preference' | 'capability-match' | 'default';
    let candidates: ModelCapabilityDefinition[] = [];

    if (analysis.requiresVision) {
      // Vision required - choose from vision models
      candidates = availableModels.visionModels;
      selectedModel = params.userPreferences?.preferredVisionModel || 
                    this.selectBestModel(candidates, analysis.suggestedCapabilities);
      routingReason = params.userPreferences?.preferredVisionModel ? 'user-preference' : 'vision-required';
    } else {
      // Text-only - choose from text models
      candidates = availableModels.textModels;
      
      if (params.userPreferences?.preferredTextModel) {
        const preferredAvailable = candidates.find(m => m.name === params.userPreferences?.preferredTextModel);
        if (preferredAvailable) {
          selectedModel = params.userPreferences.preferredTextModel;
          routingReason = 'user-preference';
        } else {
          selectedModel = this.selectBestModel(candidates, analysis.suggestedCapabilities);
          routingReason = 'capability-match';
        }
      } else {
        selectedModel = this.selectBestModel(candidates, analysis.suggestedCapabilities);
        routingReason = analysis.suggestedCapabilities.length > 0 ? 'capability-match' : 'default';
      }
    }

    // 4. Get model capabilities and fallbacks
    const modelCapabilities = candidates.find(m => m.name === selectedModel);
    if (!modelCapabilities) {
      throw new Error(`Selected model ${selectedModel} not found in available models`);
    }

    const fallbacks = await this.getFallbackModels({
      originalModel: selectedModel,
      requiredCapabilities: analysis.requiresVision ? ['vision'] : analysis.suggestedCapabilities,
      failureReason: 'unavailable'
    });

    // 5. Publish routing event
    this.deps.eventPublisher.publishModelRouted({
      selectedModel: selectedModel,
      conversationId: "",
      modelCapabilities: selectedModelCapability.capabilities,
      routingReason: routingReason,
      timestamp: new Date().toISOString()
    });

    return {
      fallbackModel: fallbacks[0] || "llama3.2:3b",
      selectedModel,
      routingReason,
      modelCapabilities,
      fallbacks
    };
  }

  async getRecommendedModel(params: {
    requiredCapabilities: ('vision' | 'tools' | 'reasoning')[];
    contentType: 'text' | 'multimodal';
    prioritizeSpeed?: boolean;
  }) {
    const availableModels = await this.getAvailableModels();
    
    let candidates = params.contentType === 'multimodal' 
      ? availableModels.visionModels 
      : availableModels.textModels;
    
    // Filter by required capabilities
    candidates = candidates.filter(model => 
      params.requiredCapabilities.every(cap => 
        cap === 'vision' ? model.hasVision : model.capabilities.includes(cap)
      )
    );

    if (candidates.length === 0) {
      // Fallback to any available model
      candidates = availableModels.allModels;
    }

    // Rank models
    const ranked = this.deps.modelSelectionAdapter.rankModelsByPreference(candidates, {
      speed: params.prioritizeSpeed ? 0.8 : 0.3,
      capability: 0.7,
      reliability: 0.9
    });

    return {
      fallbackModel: fallbacks[0] || "llama3.2:3b",
      model: ranked[0]?.name || 'llama3.2:3b', // fallback
      confidence: ranked.length > 0 ? 0.8 : 0.3,
      alternatives: ranked.slice(1, 4).map(m => m.name)
    };
  }

  async analyzeContent(params: {
    content: string;
    images?: string[];
  }) {
    const requiresVision = await this.detectVisionRequirement(params.images || []);
    
    const textAnalysis = await this.deps.contentAnalysisAdapter.analyzeTextComplexity(params.content);
    
    return {
      fallbackModel: fallbacks[0] || "llama3.2:3b",
      requiresVision,
      suggestedCapabilities: textAnalysis.suggestedCapabilities as ('tools' | 'reasoning')[],
      complexity: textAnalysis.complexity,
      contentType: requiresVision ? 'multimodal' as const : 'text' as const
    };
  }

  async detectVisionRequirement(images: string[]): Promise<boolean> {
    if (!images || images.length === 0) return false;
    
    const imageAnalysis = await this.deps.contentAnalysisAdapter.detectImageContent(images);
    return imageAnalysis.requiresProcessing;
  }

  async checkModelAvailability(modelName: string) {
    return await this.deps.availabilityAdapter.checkModelHealth(modelName);
  }

  async getAvailableModels() {
    const allModels = await this.deps.modelRegistryService.getAllRegisteredModels();
    
    return {
      fallbackModel: fallbacks[0] || "llama3.2:3b",
      textModels: this.deps.modelSelectionAdapter.filterTextModels(allModels),
      visionModels: this.deps.modelSelectionAdapter.filterVisionModels(allModels),
      allModels
    };
  }

  async getFallbackModels(params: {
    originalModel: string;
    requiredCapabilities: string[];
    failureReason: 'unavailable' | 'timeout' | 'error';
  }): Promise<string[]> {
    const availableModels = await this.getAvailableModels();
    
    // Filter models that meet the requirements
    let candidates = availableModels.allModels.filter(model => {
      return params.requiredCapabilities.every(cap => {
        if (cap === 'vision') return model.hasVision;
        return model.capabilities.includes(cap);
      });
    });

    // Remove the failed model
    candidates = candidates.filter(m => m.name !== params.originalModel);
    
    // Sort by preference (simpler models first for fallback)
    const fallbacks = candidates
      .sort((a, b) => {
        // Prefer smaller, more reliable models for fallback
        const aSize = parseInt(a.name.split(':')[1]?.replace('b', '') || '0');
        const bSize = parseInt(b.name.split(':')[1]?.replace('b', '') || '0');
        return aSize - bSize;
      })
      .slice(0, 3)
      .map(m => m.name);

    return fallbacks.length > 0 ? fallbacks : ['llama3.2:3b']; // ultimate fallback
  }

  async handleRoutingFailure(params: {
    failedModel: string;
    originalRequest: { content: string; images?: string[]; };
    error: Error;
  }) {
    const fallbacks = await this.getFallbackModels({
      originalModel: params.failedModel,
      requiredCapabilities: params.originalRequest.images ? ['vision'] : [],
      failureReason: 'error'
    });

    this.deps.eventPublisher.publishRoutingFailed({
      conversationId: "",
      requestedCapabilities: params.originalRequest.images ? ["vision"] : ["text-generation"],
      error: params.error.message,
      timestamp: new Date().toISOString()
    });

    return {
      fallbackModel: fallbacks[0] || "llama3.2:3b",
      strategy: fallbacks.length > 0 ? 'capability-match' as const : 'simple-fallback' as const
    };
  }

  private selectBestModel(candidates: ModelCapabilityDefinition[], suggestedCapabilities: string[]): string {
    if (candidates.length === 0) return 'llama3.2:3b'; // fallback
    
    // Score models based on capability match
    const scored = candidates.map(model => {
      let score = 1; // base score
      
      // Bonus for matching suggested capabilities
      suggestedCapabilities.forEach(cap => {
        if (model.capabilities.includes(cap)) score += 2;
      });
      
      // Preference for reasoning models
      if (model.capabilities.includes('reasoning')) score += 1;
      
      return {
      fallbackModel: fallbacks[0] || "llama3.2:3b", model, score };
    });
    
    // Sort by score (descending) and return the best
    scored.sort((a, b) => b.score - a.score);
    return scored[0].model.name;
  }
}

export function createSmartModelRouter(deps: SmartModelRouterDependencies): SmartModelRouterContract {
  return new SmartModelRouter(deps);
}
