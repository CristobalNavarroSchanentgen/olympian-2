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
export declare const artifactManagerDefaults: ArtifactManagerConfig;
export declare function validateArtifactManagerConfig(config: unknown): config is ArtifactManagerConfig;
//# sourceMappingURL=schema.d.ts.map