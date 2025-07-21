import { ModelCapability } from '../../../models/connection/model-capability';
/**
 * Model metadata adapter for model detection
 * Transforms model metadata for model-detector feature
 */
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
export declare function createModelMetadataAdapter(): ModelMetadataAdapter;
//# sourceMappingURL=model-metadata-adapter.d.ts.map