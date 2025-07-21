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
  
  app.use('/api', router);
  console.log('📡 Simple API routes configured');
}
