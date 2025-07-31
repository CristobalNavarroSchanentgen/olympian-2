/**
 * Model Registry Service Implementation
 * In-memory storage for Phase 1 - will be enhanced with real model discovery
 */
import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';
import { ModelCapabilityDefinition } from '@olympian/shared/models/connection';
export declare class ModelRegistryServiceImpl implements ModelRegistryService {
    private models;
    private registryMode;
    constructor();
    private initializeDefaultModels;
    getModelCapability(modelName: string): Promise<ModelCapabilityDefinition | null>;
    getAllRegisteredModels(): Promise<ModelCapabilityDefinition[]>;
    validateModelAccess(modelName: string): Promise<{
        allowed: boolean;
        reason?: string;
        suggestedAlternatives?: string[];
    }>;
    isRegistryMode(): Promise<boolean>;
}
