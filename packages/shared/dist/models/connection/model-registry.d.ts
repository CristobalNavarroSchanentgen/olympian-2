/**
 * Model Registry - Predefined model capabilities
 */
export interface ModelCapabilityDefinition {
    modelName: string;
    name: string;
    displayName?: string;
    provider: string;
    capabilities: string[];
    contextLength: number;
    maxTokens: number;
    streaming: boolean;
    metadata?: Record<string, unknown>;
    hasTools?: boolean;
    hasReasoning?: boolean;
    hasVision?: boolean;
}
export interface ModelRegistry {
    models: ModelCapabilityDefinition[];
    configurationMode: 'auto-scan' | 'registry';
}
export declare const PREDEFINED_MODEL_REGISTRY: ModelCapabilityDefinition[];
export declare function getModelFromRegistry(modelName: string): ModelCapabilityDefinition | undefined;
export declare function getAllRegisteredModels(): ModelCapabilityDefinition[];
//# sourceMappingURL=model-registry.d.ts.map