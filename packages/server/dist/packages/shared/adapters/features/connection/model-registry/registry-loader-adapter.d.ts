/**
 * Registry Loader Adapter
 * Transforms registry loading utilities for model-registry feature
 */
import { RegistryAdapter } from '../../../../features/connection/model-registry/contract';
export declare function createRegistryLoaderAdapter(mode?: 'auto-scan' | 'registry'): RegistryAdapter;
