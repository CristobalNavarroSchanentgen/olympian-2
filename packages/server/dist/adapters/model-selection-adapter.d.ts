/**
 * Model Selection Adapter - Server Implementation
 */
import { ModelSelectionAdapter } from '@olympian/shared/features/chat/smart-model-router/contract';
import { ModelCapabilityDefinition } from '@olympian/shared/models/connection';
export declare class ModelSelectionAdapterImpl implements ModelSelectionAdapter {
    filterTextModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
    filterVisionModels(models: ModelCapabilityDefinition[]): ModelCapabilityDefinition[];
    rankModelsByPreference(models: ModelCapabilityDefinition[], criteria: {
        speed?: number;
        capability?: number;
        reliability?: number;
    }): ModelCapabilityDefinition[];
    extractModelSize(modelName: string): number;
    getCurrentSelection(): Promise<any>;
    updateSelection(selection: any): Promise<void>;
    validateSelection(selection: any): Promise<boolean>;
}
