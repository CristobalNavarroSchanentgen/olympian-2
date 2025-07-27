"use strict";
/**
 * Registry Loader Adapter
 * Loads the predefined model registry
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistryLoaderAdapter = void 0;
exports.createRegistryLoaderAdapter = createRegistryLoaderAdapter;
const connection_1 = require("../../../../models/connection");
class RegistryLoaderAdapter {
    configMode;
    constructor(configMode = 'auto-scan') {
        this.configMode = configMode;
    }
    loadRegistry() {
        return [...connection_1.PREDEFINED_MODEL_REGISTRY];
    }
    getConfigurationMode() {
        return this.configMode;
    }
    setConfigurationMode(mode) {
        this.configMode = mode;
    }
}
exports.RegistryLoaderAdapter = RegistryLoaderAdapter;
// Factory function
function createRegistryLoaderAdapter(mode) {
    // Check environment variable for configuration mode
    const envMode = process.env.AUTO_SCAN_MODELS === 'false' ? 'registry' : 'auto-scan';
    return new RegistryLoaderAdapter(mode || envMode);
}
//# sourceMappingURL=registry-loader-adapter.js.map