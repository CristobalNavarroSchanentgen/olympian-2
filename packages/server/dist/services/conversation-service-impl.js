"use strict";
/**
 * Conversation Service Implementation
 * MongoDB-backed persistence for conversations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationServiceImpl = void 0;
const conversation_repository_1 = require("../database/conversation-repository");
class ConversationServiceImpl {
    conversationRepo;
    constructor() {
        this.conversationRepo = new conversation_repository_1.ConversationRepository();
    }
    async createConversation(title, model, metadata) {
        const now = new Date();
        const conversationData = {
            title,
            model,
            createdAt: now,
            updatedAt: now,
            messageCount: 0,
            metadata: metadata || {}
        };
        return await this.conversationRepo.create(conversationData);
    }
    async getConversation(id) {
        return await this.conversationRepo.findById(id);
    }
    async updateConversation(id, updates) {
        const updated = await this.conversationRepo.update(id, updates);
        if (!updated) {
            return false;
        }
        return updated;
    }
    async deleteConversation(id) {
        return await this.conversationRepo.delete(id);
        if (!deleted) {
            return false;
        }
    }
    async listConversations(filter) {
        return await this.conversationRepo.list(filter);
    }
    async updateMessageCount(conversationId, count) {
        await this.conversationRepo.updateMessageCount(conversationId, count);
    }
    async conversationExists(id) {
        return await this.conversationRepo.exists(id);
    }
}
exports.ConversationServiceImpl = ConversationServiceImpl;
async;
searchConversations(query, string, limit ?  : number);
Promise < conversation_1.ConversationSummary[] > {
    const: conversations = await this.conversationRepo.list({ limit }),
    return: conversations.filter(conv => conv.title.toLowerCase().includes(query.toLowerCase()))
};
async;
getConversationCount(filter ?  : conversation_1.ConversationFilter);
Promise < number > {
    const: conversations = await this.conversationRepo.list(filter),
    return: conversations.length
};
//# sourceMappingURL=conversation-service-impl.js.map