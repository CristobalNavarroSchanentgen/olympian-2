import { Router } from 'express';
import { MessageService } from '@olympian/shared/services/message-service';

export function setupMessageRoutes(app: any, messageService: MessageService) {
  const router = Router();

  // GET /api/messages?conversationId=xxx - Get messages for a conversation
  router.get('/', async (req, res) => {
    try {
      const { conversationId } = req.query;
      
      if (!conversationId || typeof conversationId !== 'string') {
        return res.status(400).json({ error: 'conversationId query parameter is required' });
      }

      const messages = await messageService.getConversationMessages(conversationId);
      res.json({ messages });
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ error: 'Failed to get messages' });
    }
  });

  // POST /api/messages - Create new message
  router.post('/', async (req, res) => {
    try {
      const { conversationId, content, role, metadata } = req.body;
      
      if (!conversationId || !content || !role) {
        return res.status(400).json({ 
          error: 'conversationId, content, and role are required' 
        });
      }

      if (!['user', 'assistant', 'system'].includes(role)) {
        return res.status(400).json({ 
          error: 'role must be user, assistant, or system' 
        });
      }

      const draft = { content, role, metadata };
      const message = await messageService.createMessage(conversationId, draft, role);
      
      res.status(201).json({ message });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Failed to create message' });
    }
  });

  // GET /api/messages/:id - Get specific message
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const message = await messageService.getMessage(id);
      
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      res.json({ message });
    } catch (error) {
      console.error('Error getting message:', error);
      res.status(500).json({ error: 'Failed to get message' });
    }
  });

  // PUT /api/messages/:id - Update message
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { content, metadata } = req.body;
      
      const updates = { content, metadata };
      const message = await messageService.updateMessage(id, updates);
      
      res.json({ message });
    } catch (error) {
      console.error('Error updating message:', error);
      res.status(500).json({ error: 'Failed to update message' });
    }
  });

  app.use('/api/messages', router);
}
