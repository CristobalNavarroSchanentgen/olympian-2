/**
 * Text Model Selector Contract
 * Provides interface for selecting and managing text-generation models
 */

import { ModelCapabilityDefinition } from ../../../packages/shared/models/connection;

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  suggestedAlternatives?: string[];
}

export interface TextModelSelectorContract {
  /**
   * Get available text-generation models from registry
   */
  getAvailableTextModels(): Promise<ModelCapabilityDefinition[]>;
  
  /**
   * Get currently selected text model
   */
  getCurrentTextModel(): Promise<string | null>;
  
  /**
   * Set selected text model
   */
  setTextModel(modelName: string): Promise<void>;
  
  /**
   * Validate text model selection
   */
  validateTextModelSelection(modelName: string): Promise<ValidationResult>;
  
  /**
   * Check if model is available in Ollama
   */
  isModelAvailable(modelName: string): Promise<boolean>;
}
