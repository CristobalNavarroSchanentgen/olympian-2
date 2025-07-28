/**
 * Model Capability Models
 */
export type CapabilitySet = {
    supportsChat: boolean;
    supportsVision: boolean;
    supportsStreaming: boolean;
    supportsTools: boolean;
    supportsCode: boolean;
    contextLength: number;
};
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
export interface ModelCapability {
    id: string;
    modelName: string;
    capabilities: string[];
    confidence: number;
    detectedAt: Date;
    metadata: Record<string, unknown>;
    contextWindow?: number;
    supportsVision?: boolean;
    supportsStreaming?: boolean;
    maxTokens?: number;
    isCustom?: boolean;
}
export interface DetectionResult {
    modelName: string;
    capabilities: CapabilitySet;
    metadata: ModelMetadata;
    confidence: number;
    testResults: {
        method: string;
        success: boolean;
        confidence: number;
        duration: number;
        error?: string;
    }[];
}
//# sourceMappingURL=model-capability.d.ts.map