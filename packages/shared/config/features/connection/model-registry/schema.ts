/**
 * Model Registry Configuration Schema
 */

export interface ModelRegistryConfig {
  /**
   * Configuration mode
   * - 'auto-scan': Automatically detect model capabilities
   * - 'registry': Use predefined registry only
   */
  mode: 'auto-scan' | 'registry';
  
  /**
   * Strict mode - when true, only allows models in registry
   */
  strictMode?: boolean;
  
  /**
   * Cache duration for capability lookups (ms)
   */
  cacheDuration?: number;
  
  /**
   * Allow override of registry capabilities
   */
  allowOverrides?: boolean;
}

export const defaultModelRegistryConfig: ModelRegistryConfig = {
  mode: 'auto-scan',
  strictMode: false,
  cacheDuration: 3600000, // 1 hour
  allowOverrides: false
};
