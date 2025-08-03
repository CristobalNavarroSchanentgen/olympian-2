import { Router } from 'express';
import { TitleGenerationService } from '@olympian/shared/services/title-generation-service';

export function setupTitleGenerationRoutes(app: any, titleGenerationService: TitleGenerationService) {
  const router = Router();

  // POST /api/titles/generate - Generate title for conversation
  router.post('/generate', async (req, res) => {
    try {
      const { conversationId, firstMessage, model } = req.body;
      
      if (!conversationId || !firstMessage) {
        return res.status(400).json({ error: 'conversationId and firstMessage are required' });
      }

      const result = await titleGenerationService.generateTitle({
        conversationId,
        firstMessage,
        model
      });
      
      res.json(result);
    } catch (error) {
      console.error('Error generating title:', error);
      res.status(500).json({ error: 'Failed to generate title' });
    }
  });

  // POST /api/titles/auto-generate - Auto-generate title (simpler interface)  
  router.post('/auto-generate', async (req, res) => {
    try {
      const { conversationId, firstMessage } = req.body;
      
      if (!conversationId || !firstMessage) {
        return res.status(400).json({ error: 'conversationId and firstMessage are required' });
      }

      const title = await titleGenerationService.autoGenerateTitle(conversationId, firstMessage);
      
      res.json({ title });
    } catch (error) {
      console.error('Error auto-generating title:', error);
      res.status(500).json({ error: 'Failed to auto-generate title' });
    }
  });

  app.use('/api/titles', router);
}
