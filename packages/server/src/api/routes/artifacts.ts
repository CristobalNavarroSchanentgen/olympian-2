import { Router } from 'express';
import { DatabaseService } from '../../database/database-service';

export function artifactRoutes(dbService: DatabaseService) {
  const router = Router();

  // Get artifacts for a conversation
  router.get('/conversation/:conversationId', async (req, res) => {
    try {
      const artifacts = await dbService.getArtifacts(req.params.conversationId);
      res.json(artifacts);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to get artifacts' 
      });
    }
  });

  // Create new artifact
  router.post('/', async (req, res) => {
    try {
      const { conversationId, messageId, type, content, metadata = {} } = req.body;
      
      if (!conversationId || !type || !content) {
        return res.status(400).json({ 
          error: 'conversationId, type, and content are required' 
        });
      }

      const artifact = await dbService.createArtifact({
        conversationId,
        messageId,
        type,
        content,
        metadata
      });

      res.status(201).json(artifact);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to create artifact' 
      });
    }
  });

  // Update artifact
  router.put('/:id', async (req, res) => {
    try {
      const { content, metadata } = req.body;
      
      await dbService.updateArtifact(req.params.id, {
        content,
        metadata
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to update artifact' 
      });
    }
  });

  return router;
}
