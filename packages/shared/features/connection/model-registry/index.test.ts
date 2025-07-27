/**
 * Model Registry Manager Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModelRegistryManager } from './index';
import { createRegistryLoaderAdapter } from '../../../adapters/features/connection/model-registry/registry-loader-adapter';

describe('ModelRegistryManager', () => {
  let manager: ModelRegistryManager;

  beforeEach(() => {
    const registryAdapter = createRegistryLoaderAdapter('registry');
    manager = new ModelRegistryManager({
      registryAdapter,
      config: { mode: 'registry' }
    });
  });

  describe('getModelCapability', () => {
    it('should return capability for registered model', async () => {
      const capability = await manager.getModelCapability('llama3.2-vision:11b');
      expect(capability).toBeDefined();
      expect(capability?.hasVision).toBe(true);
      expect(capability?.hasTools).toBe(false);
    });

    it('should return null for unregistered model', async () => {
      const capability = await manager.getModelCapability('unknown-model');
      expect(capability).toBeNull();
    });
  });

  describe('getAllModels', () => {
    it('should return all registered models', async () => {
      const models = await manager.getAllModels();
      expect(models).toHaveLength(8);
      expect(models.map(m => m.modelName)).toContain('deepseek-r1:14b');
    });
  });

  describe('getModelsByCapability', () => {
    it('should filter models with vision capability', async () => {
      const visionModels = await manager.getModelsByCapability('vision');
      expect(visionModels).toHaveLength(2);
      expect(visionModels.every(m => m.hasVision)).toBe(true);
    });

    it('should filter models with tools capability', async () => {
      const toolModels = await manager.getModelsByCapability('tools');
      expect(toolModels).toHaveLength(3);
      expect(toolModels.every(m => m.hasTools)).toBe(true);
    });

    it('should filter models with reasoning capability', async () => {
      const reasoningModels = await manager.getModelsByCapability('reasoning');
      expect(reasoningModels).toHaveLength(2);
      expect(reasoningModels.every(m => m.hasReasoning)).toBe(true);
    });
  });

  describe('validateModelAccess', () => {
    it('should allow registered models', async () => {
      const validation = await manager.validateModelAccess('phi4:14b');
      expect(validation.allowed).toBe(true);
      expect(validation.reason).toBeUndefined();
    });

    it('should deny unregistered models with suggestions', async () => {
      const validation = await manager.validateModelAccess('gpt-4');
      expect(validation.allowed).toBe(false);
      expect(validation.reason).toContain('not available');
      expect(validation.suggestedAlternatives).toBeDefined();
      expect(validation.suggestedAlternatives!.length).toBeGreaterThan(0);
    });
  });

  describe('toModelCapability', () => {
    it('should convert registry definition to full capability', async () => {
      const def = {
        modelName: 'deepseek-r1:14b',
        hasTools: true,
        hasReasoning: true,
        hasVision: false
      };
      
      const capability = await manager.toModelCapability(def);
      expect(capability.modelName).toBe('deepseek-r1:14b');
      expect(capability.capabilities).toContain('tools');
      expect(capability.capabilities).toContain('reasoning');
      expect(capability.capabilities).not.toContain('vision');
      expect(capability.confidence).toBe(1.0);
    });
  });
});
