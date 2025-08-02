/**
 * Message Service Implementation  
 * Database-backed storage using MongoDB
 */

import { MessageService } from '@olympian/shared/services/message-service';
import { Message, MessageDraft } from '@olympian/shared/models/chat/message';
import { MessageRepository } from '../database/message-repository';
import { ConversationRepository } from '../database/conversation-repository';

export class MessageServiceImpl implements MessageService {
  private messageRepository: MessageRepository;
  private conversationRepository: ConversationRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.conversationRepository = new ConversationRepository();
  }

  async createMessage(
    conversationId: string,
    draft: MessageDraft,
    role: 'user' | 'assistant' | 'system'
  ): Promise<Message> {
    const now = new Date();
    const messageData = {
      conversationId,
      role,
      content: draft.content,
      images: draft.images,
      metadata: draft.metadata || {},
      createdAt: now,
      updatedAt: now
    };

    const message = await this.messageRepository.create(messageData);
    
    // Update conversation message count
    const count = await this.messageRepository.countByConversation(conversationId);
    await this.conversationRepository.updateMessageCount(conversationId, count);
    
    return message;
  }

  async getMessage(id: string): Promise<Message | null> {
    return await this.messageRepository.findById(id);
  }

  async updateMessage(
    id: string,
    updates: Partial<Pick<Message, 'content' | 'metadata'>>
  ): Promise<Message> {
    const updated = await this.messageRepository.update(id, updates);
    if (!updated) {
      throw new Error(`Message ${id} not found`);
    }
    return updated;
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return await this.messageRepository.findByConversation(conversationId);
  }

  async deleteMessage(id: string): Promise<boolean> {
    const message = await this.messageRepository.findById(id);
    if (!message) {
      throw new Error(`Message ${id} not found`);
    }

    const deleted = await this.messageRepository.delete(id);
    
    if (deleted) {
      // Update conversation message count
      const count = await this.messageRepository.countByConversation(message.conversationId);
      await this.conversationRepository.updateMessageCount(message.conversationId, count);
    }
    
    return deleted;
  }

  async getMessageCount(conversationId?: string): Promise<number> {
    if (conversationId) {
      return await this.messageRepository.countByConversation(conversationId);
    }
    // Count all messages
    const allMessages = await this.messageRepository.list({ limit: 999999 });
    return allMessages.length;
  }

  async searchMessages(query: string, conversationId?: string): Promise<Message[]> {
    // Simple search - get all messages and filter by content
    const filter = conversationId ? { conversationId, limit: 1000 } : { limit: 1000 };
    const messages = await this.messageRepository.list(filter);
    
    return messages.filter(m => 
      m.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getLatestMessage(conversationId: string): Promise<Message | null> {
    const messages = await this.messageRepository.getLatestInConversation(conversationId, 1);
    return messages[0] || null;
  }

  async deleteMessages(messageIds: string[]): Promise<number> {
    let deletedCount = 0;
    const conversationsToUpdate = new Set<string>();
    
    for (const id of messageIds) {
      const message = await this.messageRepository.findById(id);
      if (message) {
        conversationsToUpdate.add(message.conversationId);
        const deleted = await this.messageRepository.delete(id);
        if (deleted) deletedCount++;
      }
    }
    
    // Update conversation message counts
    for (const conversationId of conversationsToUpdate) {
      const count = await this.messageRepository.countByConversation(conversationId);
      await this.conversationRepository.updateMessageCount(conversationId, count);
    }
    
    return deletedCount;
  }
}
