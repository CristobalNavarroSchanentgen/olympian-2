/**
 * Feature Implementation: Model Registry Manager
 */
import { ModelRegistryContract, ModelRegistryDependencies } from './contract';
import { ModelCapabilityDefinition, ModelCapability } from '../../../models/connection';
export declare class ModelRegistryManager implements ModelRegistryContract {
    private deps;
    constructor(deps: ModelRegistryDependencies);
    getModelCapability(modelName: string): Promise<ModelCapabilityDefinition | null>;
    getAllModels(): Promise<ModelCapabilityDefinition[]>;
    isModelRegistered(modelName: string): Promise<boolean>;
    getModelsByCapability(capability: 'tools' | 'reasoning' | 'vision'): Promise<ModelCapabilityDefinition[]>;
    toModelCapability(definition: ModelCapabilityDefinition): Promise<ModelCapability>;
    getConfigurationMode(): Promise<'auto-scan' | 'registry'>;
    validateModelAccess(modelName: string): Promise<{
        allowed: boolean;
        reason?: string;
        suggestedAlternatives?: string[];
    }>;
}
export declare function createModelRegistryManager(deps: ModelRegistryDependencies): ModelRegistryContract;
//# sourceMappingURL=index.d.ts.map