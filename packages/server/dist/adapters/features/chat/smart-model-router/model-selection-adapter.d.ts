/**
 * Model Selection Adapter - Server Implementation
 */
import { ModelSelectionAdapter } from '../../../../packages/shared/features/chat/smart-model-router/contract';
import { ModelCapabilityDefinition } from '../../../../packages/shared/models/connection';
export declare class ModelSelectionAdapterImpl implements ModelSelectionAdapter {
    filterTextModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
    filterVisionModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
    rankModelsByPreference(models: ModelCapabilityDefinition[], criteria: {
        speed?: number;
        capability?: number;
        reliability?: number;
    }): ModelCapabilityDefinition[];
    extractModelSize(modelName: string): number;
}
