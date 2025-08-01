/**
 * Vision Model Selector Implementation
 * Manages vision-capable model selection using registry
 */

import { ModelCapabilityDefinition } from ../../../packages/shared/models/connection;
import { VisionModelSelectorContract, MessageInput, ValidationResult } from ./contract;

export class VisionModelSelector implements VisionModelSelectorContract {
  private modelRegistryService: any;
  private visionModelFilterAdapter: any;
  private selectionPersistenceAdapter: any;
  private imageDetectionAdapter: any;
  private currentVisionModel: string | null = null;

  constructor(
    modelRegistryService: any,
    visionModelFilterAdapter: any,
    selectionPersistenceAdapter: any,
    imageDetectionAdapter: any
  ) {
    this.modelRegistryService = modelRegistryService;
    this.visionModelFilterAdapter = visionModelFilterAdapter;
    this.selectionPersistenceAdapter = selectionPersistenceAdapter;
    this.imageDetectionAdapter = imageDetectionAdapter;
    this.initializeSelection();
  }

  private async initializeSelection(): Promise<void> {
    try {
      this.currentVisionModel = await this.selectionPersistenceAdapter.getVisionModelSelection();
    } catch (error) {
      console.warn(Failed to load vision model selection:, error);
    }
  }

  async getAvailableVisionModels(): Promise<ModelCapabilityDefinition[]> {
    try {
      const allModels = await this.modelRegistryService.getAllRegisteredModels();
      return this.visionModelFilterAdapter.filterVisionModels(allModels);
    } catch (error) {
      console.error(Failed to get available vision models:, error);
      return [];
    }
  }

  async getCurrentVisionModel(): Promise<string | null> {
    return this.currentVisionModel;
  }

  async setVisionModel(modelName: string): Promise<void> {
    try {
      // Validate selection first
      const validation = await this.validateVisionModelSelection(modelName);
      if (!validation.allowed) {
        throw new Error(validation.reason || Invalid vision model selection);
      }

      // Save selection
      await this.selectionPersistenceAdapter.saveVisionModelSelection(modelName);
      this.currentVisionModel = modelName;

      // Emit event (to be implemented with event system)
      console.log(Vision model selected:, modelName);
    } catch (error) {
      console.error(Failed to set vision model:, error);
      throw error;
    }
  }

  async isVisionModelRequired(input: MessageInput): Promise<boolean> {
    try {
      return this.imageDetectionAdapter.detectImages(input);
    } catch (error) {
      console.error(Failed to detect images in input:, error);
      return false;
    }
  }

  async validateVisionModelSelection(modelName: string): Promise<ValidationResult> {
    try {
      // Check if model exists in registry
      const modelCapability = await this.modelRegistryService.getModelCapability(modelName);
      if (!modelCapability) {
        return {
          allowed: false,
          reason: Model not found in registry
        };
      }

      // Check if model has vision capability
      if (!modelCapability.hasVision) {
        return {
          allowed: false,
          reason: Model does not support vision processing
        };
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        reason: Failed to validate vision model selection
      };
    }
  }
}

// Factory function for easy instantiation
export function createVisionModelSelector(
  modelRegistryService: any,
  visionModelFilterAdapter: any,
  selectionPersistenceAdapter: any,
  imageDetectionAdapter: any
): VisionModelSelector {
  return new VisionModelSelector(
    modelRegistryService,
    visionModelFilterAdapter,
    selectionPersistenceAdapter,
    imageDetectionAdapter
  );
}
