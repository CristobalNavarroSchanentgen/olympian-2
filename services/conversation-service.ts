/**
 * Conversation Service Interface
 */

import type { Conversation, ConversationCreateRequest, ConversationUpdateRequest } from '../features/chat/conversation-manager/contract';

export interface ConversationService {
  /**
   * Get all conversations
   */
  getAll(): Promise<Conversation[]>;
  
  /**
   * Get conversation by ID
   */
  getById(id: string): Promise<Conversation | null>;
  
  /**
   * Create a new conversation
   */
  create(request: ConversationCreateRequest): Promise<Conversation>;
  
  /**
   * Update an existing conversation
   */
  update(id: string, updates: ConversationUpdateRequest): Promise<Conversation | null>;
  
  /**
   * Delete a conversation
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Archive a conversation
   */
  archive(id: string): Promise<boolean>;
  
  /**
   * Search conversations
   */
  search(query: string): Promise<Conversation[]>;
  
  /**
   * Update conversation title
   */
  updateTitle(id: string, title: string): Promise<Conversation | null>;
}
