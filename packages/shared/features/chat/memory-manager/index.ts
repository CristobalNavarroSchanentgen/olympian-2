/**
 * Feature Implementation: Chat Memory Manager
 */

import { MemoryManagerContract, MemoryManagerDependencies } from "./contract";
import { MemoryContext } from "../../../models/chat/memory-context";
import { Message } from "../../../models/chat/message";

export class MemoryManager implements MemoryManagerContract {
  constructor(private deps: MemoryManagerDependencies) {}

  async optimizeContext(conversationId: string, tokenBudget: number): Promise<MemoryContext> {
    const messages = await this.deps.messageService.getMessages(conversationId);
    
    const optimized = this.deps.contextAdapter.optimizeForBudget({
      messages,
      tokenBudget,
      preserveSystemMessage: true,
      preserveRecentMessages: this.deps.config.contextWindow.preserveRecentCount
    });

    const memoryContext: MemoryContext = {
      conversationId,
      includedMessages: optimized.messages,
      totalTokens: optimized.totalTokens,
      droppedMessages: optimized.droppedMessages,
      compressionRatio: optimized.compressionRatio,
      lastOptimizedAt: new Date()
    };

    // Cache the optimized context
    await this.deps.memoryService.saveContext(memoryContext);
    
    return memoryContext;
  }

  async getContext(conversationId: string): Promise<MemoryContext | null> {
    return await this.deps.memoryService.getContext(conversationId);
  }

  async createTokenBudget(conversationId: string, modelTokenLimit: number): Promise<any> {
    const budget = this.deps.tokenBudgetAdapter.createBudget({
      modelTokenLimit,
      systemPromptReserve: this.deps.config.tokenBudget.systemPromptReserve,
      responseReserve: this.deps.config.tokenBudget.responseReserve,
      safetyMargin: this.deps.config.tokenBudget.safetyMargin
    });

    await this.deps.memoryService.saveBudget(conversationId, budget);
    return budget;
  }

  async getTokenBudget(conversationId: string): Promise<any> {
    return await this.deps.memoryService.getBudget(conversationId);
  }

  async updateTokenBudget(conversationId: string, updates: any): Promise<any> {
    const current = await this.getTokenBudget(conversationId);
    const updated = { ...current, ...updates };
    
    await this.deps.memoryService.saveBudget(conversationId, updated);
    return updated;
  }

  async getMemoryStatistics(conversationId: string): Promise<any> {
    const context = await this.getContext(conversationId);
    const budget = await this.getTokenBudget(conversationId);
    const messageCount = await this.deps.messageService.getMessageCount(conversationId);

    return {
      totalMessages: messageCount,
      includedMessages: context?.includedMessages.length || 0,
      droppedMessages: context?.droppedMessages || 0,
      totalTokens: context?.totalTokens || 0,
      availableTokens: budget?.availableForContext || 0,
      utilizationPercentage: context && budget ? 
        (context.totalTokens / budget.availableForContext) * 100 : 0,
      lastOptimizedAt: context?.lastOptimizedAt
    };
  }

  async cleanupOldMemory(conversationId: string): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - this.deps.config.cleanup.maxAgeHours);
    
    await this.deps.memoryService.cleanupOldContext(conversationId, cutoffDate);
  }

  async resetMemory(conversationId: string): Promise<void> {
    await this.deps.memoryService.clearContext(conversationId);
    await this.deps.memoryService.clearBudget(conversationId);
  }

  async configureMemory(conversationId: string, config: any): Promise<void> {
    const budget = await this.getTokenBudget(conversationId);
    if (budget) {
      await this.updateTokenBudget(conversationId, {
        modelTokenLimit: config.tokenLimit,
        availableForContext: config.contextTokens
      });
    }

    // Re-optimize context with new settings
    if (config.contextTokens) {
      await this.optimizeContext(conversationId, config.contextTokens);
    }
  }

  async updateConfig(config: any): Promise<void> {
    Object.assign(this.deps.config, config);
  }

  getConfig(): any {
    return { ...this.deps.config };
  }
}
