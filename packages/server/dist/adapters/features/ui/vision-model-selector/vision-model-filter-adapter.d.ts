/**
 * Vision Model Filter Adapter
 * Filters models for vision capability
 */
import { ModelCapabilityDefinition } from '../../../../packages/shared/models/connection';
export interface VisionModelFilterAdapter {
    filterVisionModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
}
export declare function createVisionModelFilterAdapter(): VisionModelFilterAdapter;
export declare function getVisionModelsWithMetadata(models: ModelCapabilityDefinition[]): {
    canProcessImages: boolean;
    canProcessText: boolean;
    isMultimodal: boolean;
    recommendedFor: string[];
    modelSize: string;
    modelName: string;
    name: string;
    provider: string;
    capabilities: string[];
    contextLength: number;
    maxTokens: number;
    streaming: boolean;
    metadata?: Record<string, unknown>;
    hasTools?: boolean;
    hasReasoning?: boolean;
    hasVision?: boolean;
}[];
