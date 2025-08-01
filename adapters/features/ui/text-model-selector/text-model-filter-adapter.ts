/**
 * Text Model Filter Adapter
 * Filters models for text-generation capability
 */

import { ModelCapabilityDefinition } from '../../../../packages/shared/models/connection';

export interface ModelFilterAdapter {
  filterTextModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
}

function isVisionOnlyModel(model: ModelCapabilityDefinition): boolean {
  // A model is vision-only if it has vision but no text-generation capability
  return model.hasVision === true && !model.capabilities.includes('text-generation');
}

export function createTextModelFilterAdapter(): ModelFilterAdapter {
  return {
    filterTextModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[] {
      return models.filter(model => 
        // Must have text-generation capability
        model.capabilities.includes('text-generation') && 
        // Must not be vision-only
        !isVisionOnlyModel(model)
      );
    }
  };
}

// Helper function to get text-specific models with additional metadata
export function getTextModelsWithMetadata(models: ModelCapabilityDefinition[]) {
  const textModels = createTextModelFilterAdapter().filterTextModels(models);
  
  return textModels.map(model => ({
    ...model,
    isRecommended: model.capabilities.includes('reasoning') || model.capabilities.includes('tool-use'),
    category: model.capabilities.includes('reasoning') ? 'Advanced' : 'Standard',
    suitableFor: [
      'General conversation',
      ...(model.capabilities.includes('tool-use') ? ['Function calling'] : []),
      ...(model.capabilities.includes('reasoning') ? ['Complex reasoning'] : [])
    ]
  }));
}
