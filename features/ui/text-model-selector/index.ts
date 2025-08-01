/**
 * Text Model Selector Implementation
 * Manages text-generation model selection using registry
 */

import { ModelCapabilityDefinition } from ../../../packages/shared/models/connection;
import { TextModelSelectorContract, ValidationResult } from "./contract";

export class TextModelSelector implements TextModelSelectorContract {
  private modelRegistryService: any;
  private textModelFilterAdapter: any;
  private selectionPersistenceAdapter: any;
  private currentTextModel: string | null = null;

  constructor(
    modelRegistryService: any,
    textModelFilterAdapter: any,
    selectionPersistenceAdapter: any
  ) {
    this.modelRegistryService = modelRegistryService;
    this.textModelFilterAdapter = textModelFilterAdapter;
    this.selectionPersistenceAdapter = selectionPersistenceAdapter;
    this.initializeSelection();
  }

  private async initializeSelection(): Promise<void> {
    try {
      this.currentTextModel = await this.selectionPersistenceAdapter.getTextModelSelection();
    } catch (error) {
      console.warn(Failed to load text model selection:, error);
    }
  }

  async getAvailableTextModels(): Promise<ModelCapabilityDefinition[]> {
    try {
      const allModels = await this.modelRegistryService.getAllRegisteredModels();
      return this.textModelFilterAdapter.filterTextModels(allModels);
    } catch (error) {
      console.error(Failed to get available text models:, error);
      return [];
    }
  }

  async getCurrentTextModel(): Promise<string | null> {
    return this.currentTextModel;
  }

  async setTextModel(modelName: string): Promise<void> {
    try {
      // Validate selection first
      const validation = await this.validateTextModelSelection(modelName);
      if (!validation.allowed) {
        throw new Error(validation.reason || Invalid model selection);
      }

      // Save selection
      await this.selectionPersistenceAdapter.saveTextModelSelection(modelName);
      this.currentTextModel = modelName;

      // Emit event (to be implemented with event system)
      console.log(Text model selected:, modelName);
    } catch (error) {
      console.error(Failed to set text model:, error);
      throw error;
    }
  }

  async validateTextModelSelection(modelName: string): Promise<ValidationResult> {
    try {
      // Check if model exists in registry
      const modelCapability = await this.modelRegistryService.getModelCapability(modelName);
      if (!modelCapability) {
        return {
          allowed: false,
          reason: Model not found in registry
        };
      }

      // Check if model has text-generation capability
      if (!modelCapability.capabilities.includes(text-generation)) {
        return {
          allowed: false,
          reason: Model does not support text generation
        };
      }

      // Check if model is not vision-only
      if (modelCapability.hasVision === true && modelCapability.capabilities.length === 1) {
        return {
          allowed: false,
          reason: Model is vision-only, not suitable for text generation
        };
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        reason: Failed to validate model selection
      };
    }
  }

  async isModelAvailable(modelName: string): Promise<boolean> {
    try {
      // This will integrate with Ollama service to check actual availability
      // For now, just check registry presence
      const modelCapability = await this.modelRegistryService.getModelCapability(modelName);
      return modelCapability !== null;
    } catch (error) {
      console.error(Failed to check model availability:, error);
      return false;
    }
  }
}

// Factory function for easy instantiation
export function createTextModelSelector(
  modelRegistryService: any,
  textModelFilterAdapter: any,
  selectionPersistenceAdapter: any
): TextModelSelector {
  return new TextModelSelector(
    modelRegistryService,
    textModelFilterAdapter,
    selectionPersistenceAdapter
  );
}
