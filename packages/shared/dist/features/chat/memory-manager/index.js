"use strict";
/**
 * Feature Implementation: Chat Memory Manager
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryManager = void 0;
class MemoryManager {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    async optimizeContext(conversationId, tokenBudget) {
        const messages = await this.deps.messageService.getMessages(conversationId);
        const optimized = this.deps.contextAdapter.optimizeForBudget({
            messages,
            tokenBudget,
            preserveSystemMessage: true,
            preserveRecentMessages: this.deps.config.contextWindow.preserveRecentCount
        });
        const memoryContext = {
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
    async getContext(conversationId) {
        return await this.deps.memoryService.getContext(conversationId);
    }
    async createTokenBudget(conversationId, modelTokenLimit) {
        const budget = this.deps.tokenBudgetAdapter.createBudget({
            modelTokenLimit,
            systemPromptReserve: this.deps.config.tokenBudget.systemPromptReserve,
            responseReserve: this.deps.config.tokenBudget.responseReserve,
            safetyMargin: this.deps.config.tokenBudget.safetyMargin
        });
        await this.deps.memoryService.saveBudget(conversationId, budget);
        return budget;
    }
    async getTokenBudget(conversationId) {
        return await this.deps.memoryService.getBudget(conversationId);
    }
    async updateTokenBudget(conversationId, updates) {
        const current = await this.getTokenBudget(conversationId);
        const updated = { ...current, ...updates };
        await this.deps.memoryService.saveBudget(conversationId, updated);
        return updated;
    }
    async getMemoryStatistics(conversationId) {
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
    async cleanupOldMemory(conversationId) {
        const cutoffDate = new Date();
        cutoffDate.setHours(cutoffDate.getHours() - this.deps.config.cleanup.maxAgeHours);
        await this.deps.memoryService.cleanupOldContext(conversationId, cutoffDate);
    }
    async resetMemory(conversationId) {
        await this.deps.memoryService.clearContext(conversationId);
        await this.deps.memoryService.clearBudget(conversationId);
    }
    async configureMemory(conversationId, config) {
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
    async updateConfig(config) {
        Object.assign(this.deps.config, config);
    }
    getConfig() {
        return { ...this.deps.config };
    }
}
exports.MemoryManager = MemoryManager;
//# sourceMappingURL=index.js.map