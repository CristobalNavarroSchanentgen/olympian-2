/**
 * Configuration Schema: Model Detector
 *
 * Validates configuration for model capability detection.
 */
export const modelDetectorDefaults = {
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
export function validateModelDetectorConfig(config) {
    if (!config || typeof config !== 'object')
        return false;
    const c = config;
    return (typeof c.detection === 'object' &&
        typeof c.capabilities === 'object' &&
        typeof c.scanning === 'object' &&
        typeof c.overrides === 'object');
}
//# sourceMappingURL=schema.js.map