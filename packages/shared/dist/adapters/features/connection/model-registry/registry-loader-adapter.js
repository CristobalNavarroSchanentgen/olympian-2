"use strict";
/**
 * Registry Loader Adapter
 * Transforms registry loading utilities for model-registry feature
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegistryLoaderAdapter = createRegistryLoaderAdapter;
const connection_1 = require("../../../../models/connection");
// Helper functions extracted from business logic
function loadModelRegistry() {
    return [...connection_1.PREDEFINED_MODEL_REGISTRY];
}
function getEnvironmentConfigMode() {
    return process.env.AUTO_SCAN_MODELS === 'false' ? 'registry' : 'auto-scan';
}
function createRegistryLoaderAdapter(mode) {
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