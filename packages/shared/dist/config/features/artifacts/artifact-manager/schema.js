/**
 * Configuration Schema: Artifact Manager
 *
 * Validates configuration for artifact creation and management.
 */
export const artifactManagerDefaults = {
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
export function validateArtifactManagerConfig(config) {
    if (!config || typeof config !== 'object')
        return false;
    const c = config;
    return (typeof c.creation === 'object' &&
        typeof c.versioning === 'object' &&
        typeof c.validation === 'object' &&
        typeof c.storage === 'object');
}
//# sourceMappingURL=schema.js.map