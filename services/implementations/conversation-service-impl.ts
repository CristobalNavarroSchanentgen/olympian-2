/**
 * Conversation Service Implementation
 * Database service wrapper for conversation operations
 */

import type { ConversationService } from '../conversation-service';
import type { Conversation, ConversationCreateRequest, ConversationUpdateRequest } from '../../features/chat/conversation-manager/contract';
import { ConversationRepository } from '../../packages/server/src/database/conversation-repository';

export class ConversationServiceImpl implements ConversationService {
  private repository: ConversationRepository;

  constructor() {
    this.repository = new ConversationRepository();
  }

  async getAll(): Promise<Conversation[]> {
    const summaries = await this.repository.list({ limit: 100 });
    // Convert summaries to full conversations - fetch each by ID
    const conversations: Conversation[] = [];
    for (const summary of summaries) {
      const conv = await this.repository.findById(summary.id);
      if (conv) conversations.push(conv);
    }
    return conversations;
  }

  async getById(id: string): Promise<Conversation | null> {
    return await this.repository.findById(id);
  }

  async create(request: ConversationCreateRequest): Promise<Conversation> {
    const now = new Date();
    const conversationData = {
      ...request,
      createdAt: now,
      updatedAt: now,
      messageCount: 0
    };
    return await this.repository.create(conversationData);
  }

  async update(id: string, updates: ConversationUpdateRequest): Promise<Conversation | null> {
    return await this.repository.update(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }

  async archive(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { 
      metadata: { archived: true } 
    });
    return result !== null;
  }

  async search(query: string): Promise<Conversation[]> {
    // Simple implementation - filter by title match
    const all = await this.getAll();
    return all.filter(conv => 
      conv.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  async updateTitle(id: string, title: string): Promise<Conversation | null> {
    return await this.repository.update(id, { title });
  }
}
