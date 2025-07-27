import { Router } from 'express';

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
  
  // Model registry routes - temporarily disabled
  router.get('/models', async (req, res) => {
    res.json({
      mode: 'temporary',
      models: [],
      message: 'Model registry temporarily disabled'
    });
  });
  
  router.get('/models/capabilities', async (req, res) => {
    res.json({
      capabilities: [],
      message: 'Model registry temporarily disabled'
    });
  });

  app.use('/api', router);
}

export const simpleRoutes = setupRoutes;
