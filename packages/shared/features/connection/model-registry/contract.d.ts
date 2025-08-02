/**
 * Feature Contract: Model Registry Manager
 *
 * Manages predefined model capabilities registry for custom configuration mode
 */
import { ModelCapabilityDefinition } from '../../../models/connection';
import { ModelCapability } from '../../../models/connection';
export interface ModelRegistryContract {
    /**
     * Get capability definition for a specific model
     */
    getModelCapability(modelName: string): Promise<ModelCapabilityDefinition | null>;
    /**
     * Get all registered models
     */
    getAllModels(): Promise<ModelCapabilityDefinition[]>;
    /**
     * Check if a model is in the registry
     */
    isModelRegistered(modelName: string): Promise<boolean>;
    /**
     * Get models by capability
     */
    getModelsByCapability(capability: 'tools' | 'reasoning' | 'vision'): Promise<ModelCapabilityDefinition[]>;
    /**
     * Convert registry definition to full model capability
     */
    toModelCapability(definition: ModelCapabilityDefinition): Promise<ModelCapability>;
    /**
     * Get registry configuration mode
     */
    getConfigurationMode(): Promise<'auto-scan' | 'registry'>;
    /**
     * Validate if a model request is allowed based on registry
     */
    validateModelAccess(modelName: string): Promise<{
        allowed: boolean;
        reason?: string;
        suggestedAlternatives?: string[];
    }>;
}
export interface RegistryAdapter {
    loadRegistry(): ModelCapabilityDefinition[];
    getConfigurationMode(): 'auto-scan' | 'registry';
}
export interface ModelRegistryDependencies {
    registryAdapter: RegistryAdapter;
    config: {
        mode: 'auto-scan' | 'registry';
    };
}
