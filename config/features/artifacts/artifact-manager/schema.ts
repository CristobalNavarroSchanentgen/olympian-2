/**
 * Configuration Schema: Artifact Manager
 * 
 * Validates configuration for artifact creation and management.
 */

export interface ArtifactManagerConfig {
  readonly creation: {
    readonly maxArtifactsPerMessage: number;
    readonly maxContentSize: number;
    readonly allowedTypes: string[];
    readonly validateContent: boolean;
  };
  
  readonly versioning: {
    readonly enableVersioning: boolean;
    readonly maxVersions: number;
    readonly autoVersion: boolean;
    readonly compressOldVersions: boolean;
  };
  
  readonly validation: {
    readonly strictTypeChecking: boolean;
    readonly contentSizeLimit: number;
    readonly duplicateDetection: boolean;
    readonly qualityChecks: boolean;
  };
  
  readonly storage: {
    readonly persistArtifacts: boolean;
    readonly compressionEnabled: boolean;
    readonly cacheDuration: number;
    readonly cleanupInterval: number;
  };
}

export const artifactManagerDefaults: ArtifactManagerConfig = {
  creation: {
    maxArtifactsPerMessage: 5,
    maxContentSize: 1024 * 1024, // 1MB
    allowedTypes: ['code', 'html', 'react', 'svg', 'mermaid', 'json', 'csv'],
    validateContent: true,
  },
  
  versioning: {
    enableVersioning: true,
    maxVersions: 10,
    autoVersion: true,
    compressOldVersions: true,
  },
  
  validation: {
    strictTypeChecking: true,
    contentSizeLimit: 500000, // 500KB per artifact
    duplicateDetection: true,
    qualityChecks: true,
  },
  
  storage: {
    persistArtifacts: true,
    compressionEnabled: true,
    cacheDuration: 3600000, // 1 hour
    cleanupInterval: 86400000, // 24 hours
  },
};

export function validateArtifactManagerConfig(
  config: unknown
): config is ArtifactManagerConfig {
  if (!config || typeof config !== 'object') return false;
  
  const c = config as Record<string, unknown>;
  
  return (
    typeof c.creation === 'object' &&
    typeof c.versioning === 'object' &&
    typeof c.validation === 'object' &&
    typeof c.storage === 'object'
  );
}
