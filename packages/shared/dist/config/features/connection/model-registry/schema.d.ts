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
export declare const defaultModelRegistryConfig: ModelRegistryConfig;
//# sourceMappingURL=schema.d.ts.map