"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryServiceImpl = void 0;
/**
 * Memory Service Implementation
 * Handles conversation memory and context management
 */
class MemoryServiceImpl {
    contextStore = new Map();
    configs = new Map();
    async getMemoryContext(conversationId) {
        return this.contextStore.get(conversationId) || null;
    }
    async updateMemoryContext(conversationId, context) {
        const existing = this.contextStore.get(conversationId);
        const updated = { ...existing, ...context };
        this.contextStore.set(conversationId, updated);
        return updated;
    }
    async cleanMemory(conversationId, reason) {
        const context = this.contextStore.get(conversationId);
        if (!context) {
            return { messagesRemoved: 0, tokensFreed: 0 };
        }
        // Mock cleanup logic
        const messagesRemoved = Math.floor(Math.random() * 5);
        const tokensFreed = messagesRemoved * 100;
        return { messagesRemoved, tokensFreed };
    }
    async getMemoryStats(conversationId) {
        const context = this.contextStore.get(conversationId);
        return {
            totalMessages: context?.totalMessages || 0,
            totalTokens: context?.totalTokens || 0,
            avgTokensPerMessage: context?.avgTokensPerMessage || 0,
            oldestMessageDate: context?.oldestMessageDate || new Date(),
            newestMessageDate: context?.newestMessageDate || new Date()
        };
    }
    async needsCleanup(conversationId) {
        const config = this.configs.get(conversationId);
        const stats = await this.getMemoryStats(conversationId);
        if (!config)
            return false;
        return stats.totalMessages > config.maxMessages || stats.totalTokens > config.maxTokens;
    }
    async getOptimalContextWindow(conversationId, maxTokens) {
        const context = this.contextStore.get(conversationId);
        return {
            messages: context?.messages || [],
            totalTokens: Math.min(context?.totalTokens || 0, maxTokens),
            truncated: (context?.totalTokens || 0) > maxTokens
        };
    }
    async setMemoryConfig(conversationId, config) {
        this.configs.set(conversationId, config);
        return true;
    }
    async getMemoryConfig(conversationId) {
        return this.configs.get(conversationId) || null;
    }
}
exports.MemoryServiceImpl = MemoryServiceImpl;
//# sourceMappingURL=memory-service-impl.js.map