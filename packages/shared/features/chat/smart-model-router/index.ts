/**
 * Smart Model Router - Core Implementation
 */

import { SmartModelRouterContract, SmartModelRouterDependencies } from './contract';
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
    const analysis = await this.analyzeContent({
      content: params.content,
      images: params.images
    });

    const availableModels = await this.getAvailableModels();
    
    let candidates: ModelCapabilityDefinition[];
    let routingReason: 'vision-required' | 'user-preference' | 'capability-match' | 'default';
    let selectedModel: string;

    if (analysis.requiresVision) {
      candidates = availableModels.visionModels;
      routingReason = 'vision-required';
      selectedModel = this.selectBestModel(candidates, analysis.suggestedCapabilities);
    } else {
      candidates = availableModels.textModels;
      selectedModel = this.selectBestModel(candidates, analysis.suggestedCapabilities);
      routingReason = analysis.suggestedCapabilities.length > 0 ? 'capability-match' : 'default';
    }

    const modelCapabilities = candidates.find(m => m.name === selectedModel);
    if (!modelCapabilities) {
      throw new Error('Selected model not found in available models');
    }

    const fallbacks = await this.getFallbackModels({
      originalModel: selectedModel,
      requiredCapabilities: analysis.requiresVision ? ['vision'] : analysis.suggestedCapabilities,
      failureReason: 'unavailable'
    });

    this.deps.eventPublisher.publishModelRouted({
      selectedModel: selectedModel,
      conversationId: '',
      modelCapabilities: modelCapabilities.capabilities,
      routingReason: routingReason,
      timestamp: new Date().toISOString()
    });

    return {
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
    
    let candidates = availableModels.allModels.filter(model => {
      return params.requiredCapabilities.every(cap => {
        if (cap === 'vision') return model.hasVision;
        if (cap === 'tools') return model.capabilities.includes('tool-use');
        if (cap === 'reasoning') return model.capabilities.includes('reasoning');
        return false;
      });
    });

    if (candidates.length === 0) {
      candidates = params.contentType === 'multimodal' ? 
        availableModels.visionModels : availableModels.textModels;
    }

    const ranked = this.deps.modelSelectionAdapter.rankModelsByPreference(candidates, {
      speed: params.prioritizeSpeed ? 0.8 : 0.3,
      capability: 0.7,
      reliability: 0.9
    });

    return {
      model: ranked[0]?.name || 'llama3.2:3b',
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
      requiresVision,
      suggestedCapabilities: textAnalysis.suggestedCapabilities as ('tools' | 'reasoning')[],
      complexity: textAnalysis.complexity,
      contentType: requiresVision ? 'multimodal' as const : 'text' as const
    };
  }

  async detectVisionRequirement(images: string[]): Promise<boolean> {
    if (!images || images.length === 0) return false;
    const analysis = await this.deps.contentAnalysisAdapter.detectImageContent(images);
    return analysis.requiresProcessing;
  }

  async checkModelAvailability(modelName: string) {
    return this.deps.availabilityAdapter.checkModelHealth(modelName);
  }

  async getAvailableModels() {
    const allModels = await this.deps.modelRegistryService.getAllRegisteredModels();
    
    return {
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
    
    let candidates = availableModels.allModels.filter(model => {
      return params.requiredCapabilities.every(cap => {
        if (cap === 'vision') return model.hasVision;
        return model.capabilities.includes(cap);
      });
    });

    candidates = candidates.filter(m => m.name !== params.originalModel);
    
    const fallbacks = candidates
      .sort((a, b) => {
        const aSize = parseInt(a.name.split(':')[1]?.replace('b', '') || '0');
        const bSize = parseInt(b.name.split(':')[1]?.replace('b', '') || '0');
        return aSize - bSize;
      })
      .slice(0, 3)
      .map(m => m.name);

    return fallbacks.length > 0 ? fallbacks : ['llama3.2:3b'];
  }

  async handleRoutingFailure(params: {
    failedModel: string;
    originalRequest: {
      content: string;
      images?: string[];
    };
    error: Error;
  }) {
    const fallbacks = await this.getFallbackModels({
      originalModel: params.failedModel,
      requiredCapabilities: params.originalRequest.images ? ['vision'] : [],
      failureReason: 'error'
    });

    this.deps.eventPublisher.publishRoutingFailed({
      conversationId: '',
      requestedCapabilities: params.originalRequest.images ? ['vision'] : ['text-generation'],
      error: params.error.message,
      timestamp: new Date().toISOString()
    });

    return {
      fallbackModel: fallbacks[0] || 'llama3.2:3b',
      strategy: fallbacks.length > 0 ? 'capability-match' as const : 'simple-fallback' as const
    };
  }

  private selectBestModel(candidates: ModelCapabilityDefinition[], suggestedCapabilities: string[]): string {
    if (candidates.length === 0) return 'llama3.2:3b';
    
    const scored = candidates.map(model => {
      let score = 1;
      
      suggestedCapabilities.forEach(cap => {
        if (model.capabilities.includes(cap)) score += 2;
      });
      
      if (model.capabilities.includes('reasoning')) score += 1;
      
      return { model, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    return scored[0].model.name;
  }
}
