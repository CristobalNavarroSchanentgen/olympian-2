import { ModelCapability } from '../../../../models/connection';

export interface ModelMetadataAdapter {
  extractMetadata(modelInfo: any): ModelMetadata;
  enrichCapabilities(capability: ModelCapability, metadata: ModelMetadata): ModelCapability;
  categorizeModel(metadata: ModelMetadata): ModelCategory;
  generateModelSummary(capability: ModelCapability): ModelSummary;
}

export interface ModelMetadata {
  family: string;
  size: string;
  architecture: string;
  trainingData: string;
  languages: string[];
  specializations: string[];
  limitations: string[];
  recommendedUse: string[];
}

export interface ModelCategory {
  primary: 'chat' | 'code' | 'vision' | 'embedding' | 'specialized';
  secondary: string[];
  complexity: 'simple' | 'medium' | 'complex';
  performance: 'fast' | 'balanced' | 'accurate';
}

export interface ModelSummary {
  title: string;
  description: string;
  strengths: string[];
  limitations: string[];
  bestFor: string[];
  notRecommendedFor: string[];
}

// Standalone helper functions for proper scoping
function detectFamily(name: string, details: any): string {
  if (name.includes('llama3')) return 'llama3';
  if (name.includes('codellama')) return 'codellama';
  if (name.includes('llama')) return 'llama';
  if (name.includes('mistral')) return 'mistral';
  if (name.includes('phi')) return 'phi';
  if (name.includes('gemma')) return 'gemma';
  if (name.includes('llava')) return 'llava';
  return details.family || 'unknown';
}

function detectSize(name: string, details: any): string {
  const sizes = ['7b', '13b', '30b', '70b', '8b', '3b'];
  for (const size of sizes) {
    if (name.includes(size)) return size;
  }
  return details.parameter_size || 'unknown';
}

function detectArchitecture(name: string, details: any): string {
  if (name.includes('transformer')) return 'transformer';
  if (name.includes('mamba')) return 'mamba';
  return details.architecture || 'transformer';
}

export function createModelMetadataAdapter(): ModelMetadataAdapter {
  return {
    extractMetadata(modelInfo) {
      const name = modelInfo.name?.toLowerCase() || '';
      const details = modelInfo.details || {};
      
      return {
        family: detectFamily(name, details),
        size: detectSize(name, details),
        architecture: detectArchitecture(name, details),
        trainingData: name.includes('instruct') ? 'instruction-tuned' : 'general',
        languages: ['english'],
        specializations: name.includes('vision') ? ['vision'] : [],
        limitations: [],
        recommendedUse: ['General text generation']
      };
    },

    enrichCapabilities(capability, metadata) {
      const enriched: ModelCapability = {
        ...capability,
        metadata: {
          ...capability.metadata,
          ...metadata
        }
      };
      
      if (metadata.specializations.includes('vision')) {
        enriched.supportsVision = true;
      }
      
      return enriched;
    },

    categorizeModel(metadata) {
      return {
        primary: 'chat' as const,
        secondary: [],
        complexity: 'medium' as const,
        performance: 'balanced' as const
      };
    },

    generateModelSummary(capability) {
      return {
        title: capability.modelName,
        description: 'AI language model',
        strengths: ['Text generation'],
        limitations: [],
        bestFor: ['General use'],
        notRecommendedFor: []
      };
    }
  };
}
