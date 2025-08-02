"use strict";
/**
 * Conversation Service Implementation
 * Database-backed storage using MongoDB
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationServiceImpl = void 0;
const conversation_repository_1 = require("../database/conversation-repository");
class ConversationServiceImpl {
    repository;
    constructor() {
        this.repository = new conversation_repository_1.ConversationRepository();
    }
    async createConversation(title, model, metadata) {
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
    async getConversation(id) {
        return await this.repository.findById(id);
    }
    async updateConversation(id, updates) {
        const updated = await this.repository.update(id, updates);
        if (!updated) {
            throw new Error(`Conversation ${id} not found`);
        }
        return updated;
    }
    async deleteConversation(id) {
        const exists = await this.repository.exists(id);
        if (!exists) {
            throw new Error(`Conversation ${id} not found`);
        }
        return await this.repository.delete(id);
    }
    async listConversations(filter, limit, offset) {
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
    async searchConversations(query, limit) {
        // Get all conversations and filter by title match
        const all = await this.repository.list({ limit: 100 });
        const filtered = all.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));
        return limit ? filtered.slice(0, limit) : filtered;
    }
    async getConversationCount(filter) {
        const summaries = await this.listConversations(filter);
        return summaries.length;
    }
    async conversationExists(id) {
        return await this.repository.exists(id);
    }
}
exports.ConversationServiceImpl = ConversationServiceImpl;
//# sourceMappingURL=conversation-service-impl.js.map