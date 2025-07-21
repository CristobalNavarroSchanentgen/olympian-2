/**
 * Feature Implementation: Model Detector
 */
import { ModelDetectorContract, ModelDetectorDependencies } from "./contract";
import { ModelCapability } from "../../../models/connection/model-capability";
export declare class ModelDetector implements ModelDetectorContract {
    private deps;
    private detectionCache;
    constructor(deps: ModelDetectorDependencies);
    detectCapabilities(modelName: string): Promise<ModelCapability>;
    batchDetect(modelNames: string[]): Promise<ModelCapability[]>;
    testVisionCapability(modelName: string): Promise<boolean>;
    getCapability(modelName: string): Promise<ModelCapability | null>;
    refreshCapability(modelName: string): Promise<ModelCapability>;
    setCustomCapability(modelName: string, capability: ModelCapability): Promise<void>;
    listDetectedModels(): Promise<ModelCapability[]>;
    clearCache(): Promise<void>;
    updateConfig(config: any): Promise<void>;
    getConfig(): any;
}
//# sourceMappingURL=index.d.ts.map