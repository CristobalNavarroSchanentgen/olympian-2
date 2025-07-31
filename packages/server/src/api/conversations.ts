import { Router } from 'express';
import { ConversationService } from '@olympian/shared/services/conversation-service';

export function setupConversationRoutes(app: any, conversationService: ConversationService) {
  const router = Router();

  // GET /api/conversations - List conversations with optional filtering
  router.get('/', async (req, res) => {
    try {
      const conversations = await conversationService.listConversations();
      res.json({ conversations });
    } catch (error) {
      console.error('Error listing conversations:', error);
      res.status(500).json({ error: 'Failed to list conversations' });
    }
  });

  // POST /api/conversations - Create new conversation
  router.post('/', async (req, res) => {
    try {
      const { title, model, metadata } = req.body;
      if (!title || !model) {
        return res.status(400).json({ error: 'Title and model are required' });
      }

      const conversation = await conversationService.createConversation(title, model, metadata);
      res.status(201).json({ conversation });
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  });

  // GET /api/conversations/:id - Get specific conversation
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const conversation = await conversationService.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      res.json({ conversation });
    } catch (error) {
      console.error('Error getting conversation:', error);
      res.status(500).json({ error: 'Failed to get conversation' });
    }
  });

  // PUT /api/conversations/:id - Update conversation
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, model, metadata } = req.body;
      
      const updates = { title, model, metadata };
      const conversation = await conversationService.updateConversation(id, updates);
      
      res.json({ conversation });
    } catch (error) {
      console.error('Error updating conversation:', error);
      res.status(500).json({ error: 'Failed to update conversation' });
    }
  });

  // DELETE /api/conversations/:id - Delete conversation
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await conversationService.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  });

  app.use('/api/conversations', router);
}
