/**
 * Model Registry Helper Utilities
 */
export interface ModelInfo {
    name: string;
    displayName: string;
    capabilities: string[];
    description: string;
}
/**
 * Get formatted model information for UI display
 */
export declare function getFormattedModelList(): ModelInfo[];
/**
 * Check if registry mode is enabled
 */
export declare function isRegistryModeEnabled(): boolean;
/**
 * Get models grouped by capability
 */
export declare function getModelsByCapabilityGroup(): Record<string, ModelInfo[]>;
//# sourceMappingURL=model-registry-helper.d.ts.map