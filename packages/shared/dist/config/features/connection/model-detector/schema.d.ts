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
export declare const modelDetectorDefaults: ModelDetectorConfig;
export declare function validateModelDetectorConfig(config: unknown): config is ModelDetectorConfig;
//# sourceMappingURL=schema.d.ts.map