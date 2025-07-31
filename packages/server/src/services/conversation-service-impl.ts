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

  async listConversations(filter?: ConversationFilter): Promise<ConversationSummary[]> {
    const conversations = Array.from(this.conversations.values());
    
    // Apply filtering if provided
    let filtered = conversations;
    if (filter?.model) {
      filtered = filtered.filter(c => c.model === filter.model);
    }
    if (filter?.dateRange) {
      const { start, end } = filter.dateRange;
      filtered = filtered.filter(c => {
        const date = c.createdAt;
        return (!start || date >= start) && (!end || date <= end);
      });
    }

    // Convert to summaries and sort by updatedAt descending
    return filtered
      .map(c => ({
        id: c.id,
        title: c.title,
        model: c.model,
        messageCount: c.messageCount,
        lastMessageAt: c.updatedAt,
        createdAt: c.createdAt
      }))
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }
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
