/**
 * Message Service Implementation
 * Database service wrapper for message operations
 */

import type { MessageService } from '../message-service';
import type { Message, MessageCreateRequest } from '../../features/chat/message-processor/contract';
import { MessageRepository } from '../../packages/server/src/database/message-repository';
import { ConversationRepository } from '../../packages/server/src/database/conversation-repository';

export class MessageServiceImpl implements MessageService {
  private messageRepository: MessageRepository;
  private conversationRepository: ConversationRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.conversationRepository = new ConversationRepository();
  }

  async getByConversation(conversationId: string): Promise<Message[]> {
    return await this.messageRepository.findByConversation(conversationId);
  }

  async getById(id: string): Promise<Message | null> {
    return await this.messageRepository.findById(id);
  }

  async create(request: MessageCreateRequest): Promise<Message> {
    const now = new Date();
    const messageData = {
      ...request,
      id: '', // Will be set by repository
      createdAt: now,
      updatedAt: now
    };

    const message = await this.messageRepository.create(messageData);
    
    // Update conversation message count
    const count = await this.messageRepository.countByConversation(request.conversationId);
    await this.conversationRepository.updateMessageCount(request.conversationId, count);
    
    return message;
  }

  async update(id: string, updates: Partial<Message>): Promise<Message | null> {
    // Remove fields that shouldn't be updated directly
    const { id: _id, createdAt, ...safeUpdates } = updates;
    return await this.messageRepository.update(id, safeUpdates);
  }

  async delete(id: string): Promise<boolean> {
    const message = await this.messageRepository.findById(id);
    if (!message) return false;
    
    const deleted = await this.messageRepository.delete(id);
    
    if (deleted) {
      // Update conversation message count
      const count = await this.messageRepository.countByConversation(message.conversationId);
      await this.conversationRepository.updateMessageCount(message.conversationId, count);
    }
    
    return deleted;
  }

  async getTokenCount(content: string, model?: string): Promise<number> {
    // Simple token estimation - roughly 4 characters per token
    // In a real implementation, this would use model-specific tokenization
    return Math.ceil(content.length / 4);
  }
}
