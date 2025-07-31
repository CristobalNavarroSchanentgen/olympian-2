/**
 * Conversation Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */

import { ConversationService } from '@olympian/shared/services/conversation-service';
import { Conversation, ConversationSummary, ConversationFilter } from '@olympian/shared/models/chat/conversation';

export class ConversationServiceImpl implements ConversationService {
  private conversations: Map<string, Conversation> = new Map();
  private nextId = 1;

  async createConversation(
    title: string,
    model: string,
    metadata?: Record<string, unknown>
  ): Promise<Conversation> {
    const id = `conv_${this.nextId++}`;
    const now = new Date();
    
    const conversation: Conversation = {
      id,
      title,
      model,
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      metadata: metadata || {}
    };
    
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return this.conversations.get(id) || null;
  }

  async updateConversation(
    id: string,
    updates: Partial<Pick<Conversation, 'title' | 'model' | 'metadata'>>
  ): Promise<Conversation> {
    const conversation = this.conversations.get(id);
    if (!conversation) {
      throw new Error(`Conversation ${id} not found`);
    }

    const updated: Conversation = {
      ...conversation,
      ...updates,
      updatedAt: new Date()
    };

    this.conversations.set(id, updated);
    return updated;
  }

  async deleteConversation(id: string): Promise<boolean> {
    if (!this.conversations.has(id)) {
      throw new Error(`Conversation ${id} not found`);
    }
    return this.conversations.delete(id);
  }

  async listConversations(filter?: ConversationFilter, limit?: number, offset?: number): Promise<ConversationSummary[]> {
    const conversations = Array.from(this.conversations.values());
    
    // Apply filtering if provided
    let filtered = conversations;
    if (filter?.model) {
      filtered = filtered.filter(c => c.model === filter.model);
    }
    if (filter?.createdAfter) {
      filtered = filtered.filter(c => c.createdAt >= filter.createdAfter!);
    }
    if (filter?.createdBefore) {
      filtered = filtered.filter(c => c.createdAt <= filter.createdBefore!);
    }
    
    // Convert to summaries and sort by updatedAt descending
    const summaries = filtered
      .map(c => ({
        id: c.id,
        title: c.title,
        messageCount: c.messageCount,
        lastActivity: c.updatedAt,
        preview: c.title.length > 50 ? c.title.substring(0, 50) + "..." : undefined
      }))
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
    
    // Apply pagination
    if (offset !== undefined) {
      const sliced = summaries.slice(offset);
      return limit !== undefined ? sliced.slice(0, limit) : sliced;
    }
    return limit !== undefined ? summaries.slice(0, limit) : summaries;
  }

  // Additional required methods
  
  async searchConversations(
    query: string,
    limit?: number
  ): Promise<ConversationSummary[]> {
    const all = await this.listConversations();
    const filtered = all.filter(c => 
      c.title.toLowerCase().includes(query.toLowerCase())
    );
    return limit ? filtered.slice(0, limit) : filtered;
  }

  async getConversationCount(filter?: ConversationFilter): Promise<number> {
    const conversations = await this.listConversations(filter);
    return conversations.length;
  }

  async conversationExists(id: string): Promise<boolean> {
    return this.conversations.has(id);
  }
}
