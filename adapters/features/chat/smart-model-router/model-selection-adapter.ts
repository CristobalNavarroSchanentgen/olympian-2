/**
 * Model Selection Adapter
 * Filters and ranks models based on capabilities and preferences
 */

import { ModelCapabilityDefinition } from '../../../../../packages/shared/models/connection';

export interface ModelSelectionAdapter {
  filterTextModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
  filterVisionModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
  rankModelsByPreference(models: ModelCapabilityDefinition[], criteria: {
    speed?: number;
    capability?: number;
    reliability?: number;
  }): ModelCapabilityDefinition[];
}

export function createModelSelectionAdapter(): ModelSelectionAdapter {
  return {
    filterTextModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[] {
      return models.filter(model => 
        // Must have text-generation capability
        model.capabilities.includes('text-generation') && 
        // Should not be vision-only
        !(model.hasVision === true && !model.capabilities.includes('text-generation'))
      );
    },

    filterVisionModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[] {
      return models.filter(model => model.hasVision === true);
    },

    rankModelsByPreference(models: ModelCapabilityDefinition[], criteria: {
      speed?: number;
      capability?: number;
      reliability?: number;
    }): ModelCapabilityDefinition[] {
      const { speed = 0.3, capability = 0.5, reliability = 0.2 } = criteria;
      
      return models
        .map(model => {
          let score = 0;
          
          // Speed score (smaller models = faster)
          const modelSize = this.extractModelSize(model.name);
          const speedScore = modelSize > 0 ? Math.max(0, 1 - (modelSize / 20)) : 0.5;
          score += speed * speedScore;
          
          // Capability score
          let capabilityScore = 0.5; // base score
          if (model.capabilities.includes('reasoning')) capabilityScore += 0.3;
          if (model.capabilities.includes('tools')) capabilityScore += 0.2;
          if (model.hasVision) capabilityScore += 0.1;
          score += capability * Math.min(capabilityScore, 1);
          
          // Reliability score (based on model maturity)
          let reliabilityScore = 0.7; // default
          if (model.name.includes('llama')) reliabilityScore = 0.9;
          if (model.name.includes('phi')) reliabilityScore = 0.8;
          if (model.name.includes('gemma')) reliabilityScore = 0.8;
          score += reliability * reliabilityScore;
          
          return { model, score };
        })
        .sort((a, b) => b.score - a.score)
        .map(item => item.model);
    }
  };

  function extractModelSize(modelName: string): number {
    const match = modelName.match(/(\d+(?:\.\d+)?)b/i);
    return match ? parseFloat(match[1]) : 0;
  }
}
