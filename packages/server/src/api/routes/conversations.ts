import { Router } from 'express';
import { DatabaseService } from '../../database/database-service';

export function conversationRoutes(dbService: DatabaseService) {
  const router = Router();

  // List conversations
  router.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string;

      let conversations;
      if (search) {
        conversations = await dbService.searchConversations(search);
      } else {
        conversations = await dbService.listConversations(limit, offset);
      }

      res.json(conversations);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to list conversations' 
      });
    }
  });

  // Get conversation by ID
  router.get('/:id', async (req, res) => {
    try {
      const conversation = await dbService.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to get conversation' 
      });
    }
  });

  // Create new conversation
  router.post('/', async (req, res) => {
    try {
      const { title, model, metadata = {} } = req.body;
      
      if (!title || !model) {
        return res.status(400).json({ error: 'Title and model are required' });
      }

      const conversation = await dbService.createConversation({
        title,
        model,
        metadata
      });

      res.status(201).json(conversation);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to create conversation' 
      });
    }
  });

  // Update conversation
  router.put('/:id', async (req, res) => {
    try {
      const { title, model, metadata } = req.body;
      
      await dbService.updateConversation(req.params.id, {
        title,
        model,
        metadata
      });

      const updated = await dbService.getConversation(req.params.id);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to update conversation' 
      });
    }
  });

  // Delete conversation
  router.delete('/:id', async (req, res) => {
    try {
      await dbService.deleteConversation(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to delete conversation' 
      });
    }
  });

  return router;
}
