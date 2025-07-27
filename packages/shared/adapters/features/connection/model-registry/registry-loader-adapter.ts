/**
 * Registry Loader Adapter
 * Loads the predefined model registry
 */

import { RegistryAdapter } from '../../../../features/connection/model-registry/contract';
import { ModelCapabilityDefinition, PREDEFINED_MODEL_REGISTRY } from '../../../../models/connection';

export class RegistryLoaderAdapter implements RegistryAdapter {
  private configMode: 'auto-scan' | 'registry';

  constructor(configMode: 'auto-scan' | 'registry' = 'auto-scan') {
    this.configMode = configMode;
  }

  loadRegistry(): ModelCapabilityDefinition[] {
    return [...PREDEFINED_MODEL_REGISTRY];
  }

  getConfigurationMode(): 'auto-scan' | 'registry' {
    return this.configMode;
  }

  setConfigurationMode(mode: 'auto-scan' | 'registry'): void {
    this.configMode = mode;
  }
}

// Factory function
export function createRegistryLoaderAdapter(mode?: 'auto-scan' | 'registry'): RegistryAdapter {
  // Check environment variable for configuration mode
  const envMode = process.env.AUTO_SCAN_MODELS === 'false' ? 'registry' : 'auto-scan';
  return new RegistryLoaderAdapter(mode || envMode);
}
