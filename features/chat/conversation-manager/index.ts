/**
 * Conversation Manager Feature
 * Manages conversation lifecycle and title updates
 */

import type { 
  ConversationManagerContract,
  Conversation,
  ConversationCreateRequest,
  ConversationUpdateRequest
} from './contract';

export class ConversationManager implements ConversationManagerContract {
  private conversationService: any;
  private eventEmitter: any;

  constructor(
    conversationService: any,
    eventEmitter: any
  ) {
    this.conversationService = conversationService;
    this.eventEmitter = eventEmitter;
  }

  async getConversations(): Promise<Conversation[]> {
    return this.conversationService.getAll();
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return this.conversationService.getById(id);
  }

  async createConversation(request: ConversationCreateRequest): Promise<Conversation> {
    const conversation = await this.conversationService.create(request);
    
    this.eventEmitter.emit('conversation-created', { conversation });
    return conversation;
  }

  async updateConversation(id: string, updates: ConversationUpdateRequest): Promise<Conversation | null> {
    const updated = await this.conversationService.update(id, updates);
    
    if (updated) {
      this.eventEmitter.emit('conversation-updated', { conversation: updated });
    }
    
    return updated;
  }

  async deleteConversation(id: string): Promise<boolean> {
    const deleted = await this.conversationService.delete(id);
    
    if (deleted) {
      this.eventEmitter.emit('conversation-deleted', { conversationId: id });
    }
    
    return deleted;
  }

  async archiveConversation(id: string): Promise<boolean> {
    const archived = await this.conversationService.archive(id);
    
    if (archived) {
      this.eventEmitter.emit('conversation-archived', { conversationId: id });
    }
    
    return archived;
  }

  async searchConversations(query: string): Promise<Conversation[]> {
    return this.conversationService.search(query);
  }

  /**
   * Update conversation title (used by title generation)
   */
  async updateTitle(conversationId: string, title: string): Promise<Conversation | null> {
    return this.updateConversation(conversationId, { title });
  }
}

export * from './contract';
