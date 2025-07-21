/**
 * Feature Implementation: Chat Conversation Manager
 */ 

import { 
  ConversationManagerContract, 
  ConversationManagerDependencies
} from "./contract";
import { Conversation } from "../../../models/chat/conversation";

export class ConversationManager implements ConversationManagerContract {
  constructor(private deps: ConversationManagerDependencies) {}

  async createConversation(params: any): Promise<Conversation> {
    const conversation = await this.deps.databaseAdapter.create({
      title: params.title || "New Conversation",
      model: params.model || this.deps.config.defaultModel,
      metadata: params.metadata || {}
    });
    
    this.deps.websocketAdapter.emitConversationCreated(conversation);
    return conversation;
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    return await this.deps.databaseAdapter.findById(conversationId);
  }

  async updateConversation(conversationId: string, updates: any): Promise<Conversation> {
    const updated = await this.deps.databaseAdapter.update(conversationId, updates);
    this.deps.websocketAdapter.emitConversationUpdated(updated);
    return updated;
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await this.deps.databaseAdapter.delete(conversationId);
    this.deps.websocketAdapter.emitConversationDeleted(conversationId);
  }

  async listConversations(params: any): Promise<any> {
    const result = await this.deps.databaseAdapter.list(params);
    return {
      conversations: result.conversations,
      total: result.total,
      hasMore: params.offset + params.limit < result.total
    };
  }

  async searchConversations(query: string): Promise<Conversation[]> {
    return await this.deps.databaseAdapter.search(query, 50);
  }

  async archiveOldConversations(olderThanDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    return await this.deps.databaseAdapter.archiveOld(cutoffDate);
  }

  async generateTitle(conversationId: string): Promise<string> {
    return await this.deps.conversationService.generateTitle(conversationId);
  }

  async duplicateConversation(conversationId: string, newTitle?: string): Promise<Conversation> {
    const original = await this.getConversation(conversationId);
    if (!original) throw new Error("Conversation not found");
    
    return await this.createConversation({
      title: newTitle || original.title + " (Copy)",
      model: original.model,
      metadata: { ...original.metadata }
    });
  }

  subscribeToConversation(conversationId: string, callback: any): void {
    this.deps.websocketAdapter.subscribeToConversation(conversationId, callback);
  }

  unsubscribeFromConversation(conversationId: string): void {
    this.deps.websocketAdapter.unsubscribeFromConversation(conversationId);
  }

  async updateConfig(config: any): Promise<void> {
    Object.assign(this.deps.config, config);
  }

  getConfig(): any {
    return { ...this.deps.config };
  }
}
