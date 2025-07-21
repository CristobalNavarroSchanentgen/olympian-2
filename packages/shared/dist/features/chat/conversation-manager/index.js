"use strict";
/**
 * Feature Implementation: Chat Conversation Manager
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationManager = void 0;
class ConversationManager {
    deps;
    constructor(deps) {
        this.deps = deps;
    }
    async createConversation(params) {
        const conversation = await this.deps.databaseAdapter.create({
            title: params.title || "New Conversation",
            model: params.model || this.deps.config.defaultModel,
            metadata: params.metadata || {}
        });
        this.deps.websocketAdapter.emitConversationCreated(conversation);
        return conversation;
    }
    async getConversation(conversationId) {
        return await this.deps.databaseAdapter.findById(conversationId);
    }
    async updateConversation(conversationId, updates) {
        const updated = await this.deps.databaseAdapter.update(conversationId, updates);
        this.deps.websocketAdapter.emitConversationUpdated(updated);
        return updated;
    }
    async deleteConversation(conversationId) {
        await this.deps.databaseAdapter.delete(conversationId);
        this.deps.websocketAdapter.emitConversationDeleted(conversationId);
    }
    async listConversations(params) {
        const result = await this.deps.databaseAdapter.list(params);
        return {
            conversations: result.conversations,
            total: result.total,
            hasMore: params.offset + params.limit < result.total
        };
    }
    async searchConversations(query) {
        return await this.deps.databaseAdapter.search(query, 50);
    }
    async archiveOldConversations(olderThanDays) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
        return await this.deps.databaseAdapter.archiveOld(cutoffDate);
    }
    async generateTitle(conversationId) {
        return await this.deps.conversationService.generateTitle(conversationId);
    }
    async duplicateConversation(conversationId, newTitle) {
        const original = await this.getConversation(conversationId);
        if (!original)
            throw new Error("Conversation not found");
        return await this.createConversation({
            title: newTitle || original.title + " (Copy)",
            model: original.model,
            metadata: { ...original.metadata }
        });
    }
    subscribeToConversation(conversationId, callback) {
        this.deps.websocketAdapter.subscribeToConversation(conversationId, callback);
    }
    unsubscribeFromConversation(conversationId) {
        this.deps.websocketAdapter.unsubscribeFromConversation(conversationId);
    }
    async updateConfig(config) {
        Object.assign(this.deps.config, config);
    }
    getConfig() {
        return { ...this.deps.config };
    }
}
exports.ConversationManager = ConversationManager;
//# sourceMappingURL=index.js.map