/**
 * Registry Loader Adapter
 * Transforms registry loading utilities for model-registry feature
 */

import { RegistryAdapter } from '../../../../features/connection/model-registry/contract';
import { ModelCapabilityDefinition, PREDEFINED_MODEL_REGISTRY } from '../../../../models/connection';

// Helper functions extracted from business logic
function loadModelRegistry(): ModelCapabilityDefinition[] {
  return [...PREDEFINED_MODEL_REGISTRY];
}

function getEnvironmentConfigMode(): 'auto-scan' | 'registry' {
  return process.env.AUTO_SCAN_MODELS === 'false' ? 'registry' : 'auto-scan';
}

export function createRegistryLoaderAdapter(mode?: 'auto-scan' | 'registry'): RegistryAdapter {
  const configMode = mode || getEnvironmentConfigMode();

  return {
    loadRegistry(): ModelCapabilityDefinition[] {
      return loadModelRegistry();
    },

    getConfigurationMode(): 'auto-scan' | 'registry' {
      return configMode;
    }
  };
}
