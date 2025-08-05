/**
 * Registry Loader Adapter
 * Transforms registry loading utilities for model-registry feature
 */
import { PREDEFINED_MODEL_REGISTRY } from '../../../../models/connection';
// Helper functions extracted from business logic
function loadModelRegistry() {
    return [...PREDEFINED_MODEL_REGISTRY];
}
function getEnvironmentConfigMode() {
    return process.env.AUTO_SCAN_MODELS === 'false' ? 'registry' : 'auto-scan';
}
export function createRegistryLoaderAdapter(mode) {
    const configMode = mode || getEnvironmentConfigMode();
    return {
        loadRegistry() {
            return loadModelRegistry();
        },
        getConfigurationMode() {
            return configMode;
        }
    };
}
//# sourceMappingURL=registry-loader-adapter.js.map