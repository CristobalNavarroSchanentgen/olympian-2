/**
 * Registry Loader Adapter
 * Loads the predefined model registry
 */
import { RegistryAdapter } from '../../../../features/connection/model-registry/contract';
import { ModelCapabilityDefinition } from '../../../../models/connection';
export declare class RegistryLoaderAdapter implements RegistryAdapter {
    private configMode;
    constructor(configMode?: 'auto-scan' | 'registry');
    loadRegistry(): ModelCapabilityDefinition[];
    getConfigurationMode(): 'auto-scan' | 'registry';
    setConfigurationMode(mode: 'auto-scan' | 'registry'): void;
}
export declare function createRegistryLoaderAdapter(mode?: 'auto-scan' | 'registry'): RegistryAdapter;
//# sourceMappingURL=registry-loader-adapter.d.ts.map