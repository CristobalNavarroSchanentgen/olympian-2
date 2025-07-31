import { Router } from 'express';
import { ModelRegistryService } from '@olympian/shared/services/model-registry-service';

export function setupSimpleRoutes(app: any, modelRegistryService: ModelRegistryService) {
  const router = Router();
  
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
  });
  
  router.get('/status', async (req, res) => {
    try {
      const status = {
        server: 'olympian-backend',
        version: '1.0.0',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        memory: process.memoryUsage(),
        timestamp: new Date()
      };
      res.json(status);
    } catch (error) {
      console.error('Error getting server status:', error);
      res.status(500).json({ error: 'Failed to get server status' });
    }
  });

  router.get('/models', async (req, res) => {
    try {
      const info = {
        models: await modelRegistryService.getAllRegisteredModels(),
        registryMode: await modelRegistryService.isRegistryMode(),
        timestamp: new Date()
      };
      res.json(info);
    } catch (error) {
      console.error('Error getting models info:', error);
      res.status(500).json({ error: 'Failed to get models info' });
    }
  });

  app.use('/api', router);
}
