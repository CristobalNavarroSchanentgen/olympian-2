/**
 * Conversation Service Implementation
 * Database-backed storage using MongoDB
 */

import { ConversationService } from '@olympian/shared/services/conversation-service';
import { Conversation, ConversationSummary, ConversationFilter } from '@olympian/shared/models/chat/conversation';
import { ConversationRepository } from '../database/conversation-repository';

export class ConversationServiceImpl implements ConversationService {
  private repository: ConversationRepository;

  constructor() {
    this.repository = new ConversationRepository();
  }

  async createConversation(
    title: string,
    model: string,
    metadata?: Record<string, unknown>
  ): Promise<Conversation> {
    const now = new Date();
    const conversationData = {
      title,
      model,
      metadata: metadata || {},
      createdAt: now,
      updatedAt: now,
      messageCount: 0
    };
    return await this.repository.create(conversationData);
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return await this.repository.findById(id);
  }

  async updateConversation(
    id: string,
    updates: Partial<Pick<Conversation, 'title' | 'model' | 'metadata'>>
  ): Promise<Conversation> {
    const updated = await this.repository.update(id, updates);
    if (!updated) {
      throw new Error(`Conversation ${id} not found`);
    }
    return updated;
  }

  async deleteConversation(id: string): Promise<boolean> {
    const exists = await this.repository.exists(id);
    if (!exists) {
      throw new Error(`Conversation ${id} not found`);
    }
    return await this.repository.delete(id);
  }

  async listConversations(filter?: ConversationFilter, limit?: number, offset?: number): Promise<ConversationSummary[]> {
    const repoFilter = {
      model: filter?.model,
      createdAfter: filter?.createdAfter,
      limit: limit || 50
    };
    
    const summaries = await this.repository.list(repoFilter);
    
    // Apply offset if provided (simple slice for now)
    if (offset !== undefined) {
      return summaries.slice(offset);
    }
    
    return summaries;
  }

  async searchConversations(
    query: string,
    limit?: number
  ): Promise<ConversationSummary[]> {
    // Get all conversations and filter by title match
    const all = await this.repository.list({ limit: 100 });
    const filtered = all.filter(c => 
      c.title.toLowerCase().includes(query.toLowerCase())
    );
    return limit ? filtered.slice(0, limit) : filtered;
  }

  async getConversationCount(filter?: ConversationFilter): Promise<number> {
    const summaries = await this.listConversations(filter);
    return summaries.length;
  }

  async conversationExists(id: string): Promise<boolean> {
    return await this.repository.exists(id);
  }
}
