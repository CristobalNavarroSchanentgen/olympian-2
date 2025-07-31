import { Router } from 'express';
import { ModelRegistryServiceImpl } from '../services/model-registry-service-impl';

export function setupRoutes(app: any, modelRegistryService: ModelRegistryServiceImpl) {
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
  
  router.get('/models', async (req, res) => {
    res.json({
      models: await modelRegistryService.getAllRegisteredModels(),
    });
  });
  
  router.get('/models/capabilities', async (req, res) => {
    res.json({
      capabilities: await modelRegistryService.getAllCapabilities(),
    });
  });
  
  app.use('/api', router);
}
