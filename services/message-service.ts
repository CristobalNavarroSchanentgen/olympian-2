/**
 * Message Service Interface
 */

import type { Message, MessageCreateRequest } from '../features/chat/message-processor/contract';

export interface MessageService {
  /**
   * Get all messages for a conversation
   */
  getByConversation(conversationId: string): Promise<Message[]>;
  
  /**
   * Get message by ID
   */
  getById(id: string): Promise<Message | null>;
  
  /**
   * Create a new message
   */
  create(request: MessageCreateRequest): Promise<Message>;
  
  /**
   * Update a message
   */
  update(id: string, updates: Partial<Message>): Promise<Message | null>;
  
  /**
   * Delete a message
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Get token count for content
   */
  getTokenCount(content: string, model?: string): Promise<number>;
}
