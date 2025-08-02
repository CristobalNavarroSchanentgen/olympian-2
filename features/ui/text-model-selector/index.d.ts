/**
 * Text Model Selector Implementation
 * Manages "text-generation" model selection using registry
 */
import { ModelCapability } from "@olympian/shared/models/connection";
import { TextModelSelectorContract, ValidationResult } from "./contract";
export declare class TextModelSelector implements TextModelSelectorContract {
    private modelRegistryService;
    private textModelFilterAdapter;
    private selectionPersistenceAdapter;
    private currentTextModel;
    constructor(modelRegistryService: any, textModelFilterAdapter: any, selectionPersistenceAdapter: any);
    private initializeSelection;
    getAvailableTextModels(): Promise<ModelCapability[]>;
    getCurrentTextModel(): Promise<string | null>;
    setTextModel(modelName: string): Promise<void>;
    validateTextModelSelection(modelName: string): Promise<ValidationResult>;
    isModelAvailable(modelName: string): Promise<boolean>;
}
export declare function createTextModelSelector(modelRegistryService: any, textModelFilterAdapter: any, selectionPersistenceAdapter: any): TextModelSelector;
