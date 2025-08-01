/**
 * Vision Model Selector Contract
 * Provides interface for selecting and managing vision-capable models
 */
import { ModelCapability } from "@olympian/shared/models/connection";
export interface MessageInput {
    content: string;
    attachments?: {
        type: string;
        data: string;
    }[];
}
export interface ValidationResult {
    allowed: boolean;
    reason?: string;
    suggestedAlternatives?: string[];
}
export interface VisionModelSelectorContract {
    /**
     * Get available vision models from registry
     */
    getAvailableVisionModels(): Promise<ModelCapability[]>;
    /**
     * Get currently selected vision model
     */
    getCurrentVisionModel(): Promise<string | null>;
    /**
     * Set selected vision model
     */
    setVisionModel(modelName: string): Promise<void>;
    /**
     * Check if vision model is required for current input
     */
    isVisionModelRequired(input: MessageInput): Promise<boolean>;
    /**
     * Validate vision model selection
     */
    validateVisionModelSelection(modelName: string): Promise<ValidationResult>;
}
