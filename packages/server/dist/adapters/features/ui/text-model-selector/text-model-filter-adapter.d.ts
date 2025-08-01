/**
 * Text Model Filter Adapter
 * Filters models for text-generation capability
 */
import { ModelCapabilityDefinition } from '../../../../packages/shared/models/connection';
export interface ModelFilterAdapter {
    filterTextModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
}
export declare function createTextModelFilterAdapter(): ModelFilterAdapter;
export declare function getTextModelsWithMetadata(models: ModelCapabilityDefinition[]): {
    isRecommended: boolean;
    category: string;
    suitableFor: string[];
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
