/**
 * Vision Model Selector Implementation
 * Manages vision-capable model selection using registry
 */
import { ModelCapability } from "@olympian/shared/models/connection";
import { VisionModelSelectorContract, MessageInput, ValidationResult } from "./contract";
export declare class VisionModelSelector implements VisionModelSelectorContract {
    private modelRegistryService;
    private visionModelFilterAdapter;
    private selectionPersistenceAdapter;
    private imageDetectionAdapter;
    private currentVisionModel;
    constructor(modelRegistryService: any, visionModelFilterAdapter: any, selectionPersistenceAdapter: any, imageDetectionAdapter: any);
    private initializeSelection;
    getAvailableVisionModels(): Promise<ModelCapability[]>;
    getCurrentVisionModel(): Promise<string | null>;
    setVisionModel(modelName: string): Promise<void>;
    isVisionModelRequired(input: MessageInput): Promise<boolean>;
    validateVisionModelSelection(modelName: string): Promise<ValidationResult>;
}
export declare function createVisionModelSelector(modelRegistryService: any, visionModelFilterAdapter: any, selectionPersistenceAdapter: any, imageDetectionAdapter: any): VisionModelSelector;
