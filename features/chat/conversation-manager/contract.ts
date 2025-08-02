/**
 * Conversation Manager Contract
 * Manages conversation lifecycle and metadata
 */

export interface Conversation {
  id: string;
  title: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
  messageCount?: number;
}

export interface ConversationCreateRequest {
  title: string;
  model: string;
  metadata?: any;
}

export interface ConversationUpdateRequest {
  title?: string;
  model?: string;
  metadata?: any;
}

export interface ConversationManagerContract {
  /**
   * Get all conversations for the user
   */
  getConversations(): Promise<Conversation[]>;
  
  /**
   * Get a specific conversation by ID
   */
  getConversation(id: string): Promise<Conversation | null>;
  
  /**
   * Create a new conversation
   */
  createConversation(request: ConversationCreateRequest): Promise<Conversation>;
  
  /**
   * Update an existing conversation
   */
  updateConversation(id: string, updates: ConversationUpdateRequest): Promise<Conversation | null>;
  
  /**
   * Delete a conversation and all its messages
   */
  deleteConversation(id: string): Promise<boolean>;
  
  /**
   * Archive a conversation
   */
  archiveConversation(id: string): Promise<boolean>;
  
  /**
   * Search conversations by title or content
   */
  searchConversations(query: string): Promise<Conversation[]>;
}
