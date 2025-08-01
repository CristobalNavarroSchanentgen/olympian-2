/**
 * Model Registry Service Interface
 */

import { ModelCapabilityDefinition } from '../models/connection';

export interface ModelRegistryService {
  /**
   * Get model capability from registry
   */
  getModelCapability(modelName: string): Promise<ModelCapabilityDefinition | null>;
  
  /**
   * Get all registered models
   */
  getAllRegisteredModels(): Promise<ModelCapabilityDefinition[]>;
  
  /**
   * Validate if model access is allowed
   */
  validateModelAccess(modelName: string): Promise<{
    allowed: boolean;
    reason?: string;
    suggestedAlternatives?: string[];
  }>;
  
  /**
  /**
   * Get all available models
   */
  getAllModels(): Promise<ModelCapabilityDefinition[]>;

  /**   * Check if using registry mode
   */
  isRegistryMode(): Promise<boolean>;
}
