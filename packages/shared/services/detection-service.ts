/**
 * Model capability detection service interface
 */

import { ModelCapability, DetectionResult } from '../models/connection/model-capability';

export interface DetectionService {
  /**
   * Detect capabilities for a model
   */
  detectCapabilities(
    connectionId: string,
    modelName: string,
    method?: 'auto' | 'manual'
  ): Promise<DetectionResult>;

  /**
   * Detect capabilities for all models
   */
  detectAllCapabilities(
    connectionId: string,
    method?: 'auto' | 'manual'
  ): Promise<DetectionResult[]>;

  /**
   * Get cached capabilities
   */
  getCachedCapabilities(modelName: string): Promise<ModelCapability | null>;

  /**
   * Save capability detection result
   */
  saveCapabilities(
    modelName: string,
    capabilities: ModelCapability
  ): Promise<boolean>;

  /**
   * Override model capabilities
   */
  overrideCapabilities(
    modelName: string,
    overrides: Partial<ModelCapability>
  ): Promise<boolean>;

  /**
   * Clear capability cache
   */
  clearCapabilityCache(modelName?: string): Promise<boolean>;

  /**
   * Test specific capability
   */
  testCapability(
    connectionId: string,
    modelName: string,
    capability: 'vision' | 'streaming' | 'tools' | 'chat'
  ): Promise<boolean>;

  /**
   * Get detection methods
   */
  getDetectionMethods(): Promise<string[]>;

  /**
   * Validate capability configuration
   */
  validateCapabilities(capabilities: Partial<ModelCapability>): Promise<{
    valid: boolean;
    errors: string[];
  }>;
}
