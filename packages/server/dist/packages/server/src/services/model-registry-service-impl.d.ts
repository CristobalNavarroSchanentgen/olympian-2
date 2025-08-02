/**
 * Model Registry Service Implementation
 * Fetches models from Ollama and provides model capabilities
 */
import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';
import { ModelCapabilityDefinition } from '@olympian/shared/models/connection';
import { OllamaService } from './ollama-service';
export declare class ModelRegistryServiceImpl implements ModelRegistryService {
    private models;
    private registryMode;
    private ollamaService?;
    private lastFetch;
    private fetchInterval;
    constructor(ollamaService?: OllamaService);
    private initializeDefaultModels;
    private refreshModelsFromOllama;
    private createModelDefinitionFromOllama;
    private detectVisionCapabilities;
    private detectCodeCapabilities;
    private generateDisplayName;
    private estimateContextLength;
    private extractModelFamily;
    private extractModelSize;
    getModelCapability(modelName: string): Promise<ModelCapabilityDefinition | null>;
    getAllRegisteredModels(): Promise<ModelCapabilityDefinition[]>;
    getAllModels(): Promise<ModelCapabilityDefinition[]>;
    validateModelAccess(modelName: string): Promise<{
        allowed: boolean;
        reason?: string;
        suggestedAlternatives?: string[];
    }>;
    isRegistryMode(): Promise<boolean>;
    private shouldRefreshModels;
    forceRefresh(): Promise<void>;
}
