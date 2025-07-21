/**
 * Configuration Schema: Model Detector
 * 
 * Validates configuration for model capability detection.
 */

export interface ModelDetectorConfig {
  readonly detection: {
    readonly scanMethod: 'automatic' | 'manual' | 'hybrid';
    readonly testTimeout: number;
    readonly concurrentTests: number;
    readonly cacheResults: boolean;
  };
  
  readonly capabilities: {
    readonly visionMethods: number;
    readonly testImageSize: number;
    readonly minSuccessRate: number;
    readonly fallbackToDefaults: boolean;
  };
  
  readonly scanning: {
    readonly scanInterval: number;
    readonly autoScanNewModels: boolean;
    readonly skipKnownModels: boolean;
    readonly saveResults: boolean;
  };
  
  readonly overrides: {
    readonly allowManualOverride: boolean;
    readonly validateOverrides: boolean;
    readonly overrideFile: string;
    readonly backupOverrides: boolean;
  };
}

export const modelDetectorDefaults: ModelDetectorConfig = {
  detection: {
    scanMethod: 'automatic',
    testTimeout: 30000,
    concurrentTests: 3,
    cacheResults: true,
  },
  
  capabilities: {
    visionMethods: 8,
    testImageSize: 1024,
    minSuccessRate: 0.6,
    fallbackToDefaults: true,
  },
  
  scanning: {
    scanInterval: 3600000, // 1 hour
    autoScanNewModels: true,
    skipKnownModels: true,
    saveResults: true,
  },
  
  overrides: {
    allowManualOverride: true,
    validateOverrides: true,
    overrideFile: 'model-capabilitieson',
    backupOverrides: true,
  },
};

export function validateModelDetectorConfig(
  config: unknown
): config is ModelDetectorConfig {
  if (!config || typeof config !== 'object') return false;
  
  const c = config as Record<string, unknown>;
  
  return (
    typeof c.detection === 'object' &&
    typeof c.capabilities === 'object' &&
    typeof c.scanning === 'object' &&
    typeof c.overrides === 'object'
  );
}
