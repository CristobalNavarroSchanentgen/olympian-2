import { ModelCapability } from '../../../../models/connection';
/**
 * Capability scanner adapter for model detection
 * Transforms capability detection utilities for model-detector feature
 */
export interface CapabilityScannerAdapter {
    scanModelCapabilities(modelName: string, endpoint: string): Promise<ModelCapability>;
    batchScanCapabilities(models: string[], endpoint: string): Promise<ModelCapability[]>;
    testVisionCapability(modelName: string, endpoint: string): Promise<boolean>;
    detectOptimalSettings(capability: ModelCapability): OptimalSettings;
}
export interface OptimalSettings {
    contextWindow: number;
    temperature: number;
    maxTokens: number;
    stopSequences: string[];
    streaming: boolean;
}
export declare function createCapabilityScannerAdapter(): CapabilityScannerAdapter;
//# sourceMappingURL=capability-scanner-adapter.d.ts.map