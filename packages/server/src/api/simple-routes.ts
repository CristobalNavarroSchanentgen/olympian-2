import { Router } from 'express';
import { getFormattedModelList, getModelsByCapabilityGroup, isRegistryModeEnabled } from '@olympian/shared/utils/model-registry-helper';
import { createModelRegistryManager } from '@olympian/shared/features/connection/model-registry';
import { createRegistryLoaderAdapter } from '@olympian/shared/adapters/features/connection/model-registry/registry-loader-adapter';

export function setupRoutes(app: any) {
  const router = Router();
  
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
  });
  
  router.get('/status', (req, res) => {
    res.json({ 
      database: true,
      mcp: {},
      ollama: true,
      timestamp: new Date()
    });
  });
  
  // Model registry routes
  router.get('/models', async (req, res) => {
    try {
      const isRegistryMode = isRegistryModeEnabled();
      
      if (isRegistryMode) {
        const models = getFormattedModelList();
        const grouped = getModelsByCapabilityGroup();
        
        res.json({
          mode: 'registry',
          models,
          grouped,
          total: models.length
        });
      } else {
        res.json({
          mode: 'auto-scan',
          message: 'Use /api/ollama/models endpoint for dynamic model detection',
          models: []
        });
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  });
  
  router.get('/models/validate/:modelName', async (req, res) => {
    try {
      const { modelName } = req.params;
      const registryAdapter = createRegistryLoaderAdapter();
      const config = { mode: isRegistryModeEnabled() ? 'registry' : 'auto-scan' as const };
      const registry = createModelRegistryManager({ registryAdapter, config });
      
      const validation = await registry.validateModelAccess(modelName);
      
      res.json(validation);
    } catch (error) {
      console.error('Error validating model:', error);
      res.status(500).json({ error: 'Failed to validate model' });
    }
  });
  
  router.get('/models/capabilities/:modelName', async (req, res) => {
    try {
      const { modelName } = req.params;
      const registryAdapter = createRegistryLoaderAdapter();
      const config = { mode: isRegistryModeEnabled() ? 'registry' : 'auto-scan' as const };
      const registry = createModelRegistryManager({ registryAdapter, config });
      
      const capability = await registry.getModelCapability(modelName);
      
      if (capability) {
        const fullCapability = await registry.toModelCapability(capability);
        res.json(fullCapability);
      } else {
        res.status(404).json({ error: 'Model not found in registry' });
      }
    } catch (error) {
      console.error('Error fetching model capabilities:', error);
      res.status(500).json({ error: 'Failed to fetch model capabilities' });
    }
  });
  
  app.use('/api', router);
  console.log('📡 Simple API routes configured');
  console.log('📋 Model registry mode:', isRegistryModeEnabled() ? 'enabled' : 'disabled');
}
