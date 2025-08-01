/**
 * Vision Model Filter Adapter
 * Filters models for vision capability
 */

import { ModelCapabilityDefinition } from '../../../../packages/shared/models/connection';

export interface VisionModelFilterAdapter {
  filterVisionModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
}

export function createVisionModelFilterAdapter(): VisionModelFilterAdapter {
  return {
    filterVisionModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[] {
      return models.filter(model => model.hasVision === true);
    }
  };
}

// Helper function to get vision models with additional metadata
export function getVisionModelsWithMetadata(models: ModelCapabilityDefinition[]) {
  const visionModels = createVisionModelFilterAdapter().filterVisionModels(models);
  
  return visionModels.map(model => ({
    ...model,
    canProcessImages: true,
    canProcessText: model.capabilities.includes('text-generation'),
    isMultimodal: model.capabilities.includes('text-generation'),
    recommendedFor: [
      'Image analysis',
      'Visual Q&A',
      ...(model.capabilities.includes('text-generation') ? ['Mixed text/image conversations'] : [])
    ],
    modelSize: model.modelName.includes(':11b') ? 'Large' : 
               model.modelName.includes(':2b') ? 'Compact' : 'Medium'
  }));
}
