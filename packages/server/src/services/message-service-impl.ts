/**
 * Message Service Implementation  
 * In-memory storage for Phase 1 - will be replaced with database integration
 */

import { MessageService } from '@olympian/shared/services/message-service';
import { Message, MessageDraft } from '@olympian/shared/models/chat/message';

export class MessageServiceImpl implements MessageService {
  private messages: Map<string, Message> = new Map();
  private conversationMessages: Map<string, string[]> = new Map();
  private nextId = 1;

  async createMessage(
    conversationId: string,
    draft: MessageDraft,
    role: 'user' | 'assistant' | 'system'
  ): Promise<Message> {
    const id = `msg_${this.nextId++}`;
    const now = new Date();
    
    const message: Message = {
      id,
      conversationId,
      role,
      content: draft.content,
      createdAt: now,
      updatedAt: now,
      metadata: draft.metadata || {}
    };
    
    this.messages.set(id, message);
    
    // Track message in conversation
    if (!this.conversationMessages.has(conversationId)) {
      this.conversationMessages.set(conversationId, []);
    }
    this.conversationMessages.get(conversationId)!.push(id);
    
    return message;
  }

  async getMessage(id: string): Promise<Message | null> {
    return this.messages.get(id) || null;
  }

  async updateMessage(
    id: string,
    updates: Partial<Pick<Message, 'content' | 'metadata'>>
  ): Promise<Message> {
    const message = this.messages.get(id);
    if (!message) {
      throw new Error(`Message ${id} not found`);
    }

    const updated: Message = {
      ...message,
      ...updates,
      updatedAt: new Date()
    };

    this.messages.set(id, updated);
    return updated;
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    const messageIds = this.conversationMessages.get(conversationId) || [];
    const messages = messageIds
      .map(id => this.messages.get(id))
      .filter((msg): msg is Message => msg !== undefined);
    
    // Sort by creation time
    return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async deleteMessage(id: string): Promise<void> {
    const message = this.messages.get(id);
    if (!message) {
      throw new Error(`Message ${id} not found`);
    }

    // Remove from conversation tracking
    const conversationId = message.conversationId;
    const messageIds = this.conversationMessages.get(conversationId) || [];
    const updatedIds = messageIds.filter(msgId => msgId !== id);
    this.conversationMessages.set(conversationId, updatedIds);

    // Remove the message
    this.messages.delete(id);
  }
}
